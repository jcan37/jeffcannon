const { isAuthenticated, getAuthLevel } = require('./lib/auth');
const { loadCampaign, loadSessions, loadSessionLog, loadSummary, removeDmOnlySections, loadGlossary, formatGlossaryForLLM } = require('./lib/content');

// Node 16 (used for local dev with Gatsby 2) has no global fetch
const fetch = global.fetch || require('node-fetch');

// What Ask sends, smallest to largest: the glossary and the campaign summary
// always; every recap up to MAX_RECAPS; the full log only for the LOG_SESSIONS
// sessions that best match the question. Logs are ~5k tokens each, so they
// are what decides whether an answer fits Netlify's 10-second limit.
const MAX_RECAPS = 12;
const LOG_SESSIONS = 2;

const STOP_WORDS = new Set(`
  the and for are but not you all any can had her was one our out has him his how its may new now old see two way who did get let put say she too use what when where which while with will would could should about after again also been before being between both during each from have here into just more most only other over same some such than that their them then there these they this those through under until very were your yours what's who's happened happen tell does know remember say said
`.trim().split(/\s+/));

const INSTRUCTIONS = `You answer questions about a D&D campaign for the people at the table. Use ONLY the campaign summary, glossary, session recaps and detailed logs provided.

- Lead with the answer and keep it short: a few sentences, or up to 5 bullets for a list. No headings. Go longer only when the question asks for detail.
- Use canonical names from the glossary, never aliases.
- Cite the session date(s) you relied on, like (2026-10-13).
- The summary is for orientation; when sources disagree, trust the detailed logs over recaps and recaps over the summary.
- Where a source is marked "(uncertain)", say it's unclear.
- If the notes don't answer the question, say so. Never invent details.`;

const RECENT_PATTERN = /\b(last|latest|recent|previous|yesterday)\s+(session|time|game|week|night)\b|\bwhere did we leave off\b/i;

/**
 * Lowercased words worth searching on: no punctuation, short words or stop words.
 */
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u00c0-\u024f'\s-]/g, ' ')
    .split(/[\s-]+/)
    .map(word => word.replace(/^'+|'+$/g, '').replace(/'s$/, ''))
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

/**
 * Add every name a glossary entry goes by when the question uses any of them,
 * so "Holly" also finds "Halia Thornton" and the other way round.
 */
function expandWithGlossary(question, glossary) {
  if (!glossary) return [];
  const asked = ` ${question.toLowerCase()} `;
  const entries = ['pcs', 'npcs', 'places', 'items']
    .flatMap(group => glossary[group] || []);
  return entries
    .map(entry => [entry.name, ...(entry.aliases || [])].filter(Boolean))
    .filter(names => names.some(name => asked.includes(name.toLowerCase())))
    .flatMap(names => names.flatMap(tokenize));
}

/**
 * Rank sessions for a question. Each session is scored on its title, recap
 * and log together: words that appear in fewer sessions count for more, and
 * repeats count with diminishing returns. "Last session" style questions put
 * the newest session first. Sessions arrive newest first.
 */
function rankSessions(sessions, documents, question, glossary) {
  if (RECENT_PATTERN.test(question)) {
    return sessions;
  }

  const queryTerms = [...new Set([...tokenize(question), ...expandWithGlossary(question, glossary)])];
  if (queryTerms.length === 0) {
    return sessions;
  }

  const counts = documents.map(text => {
    const tally = new Map();
    tokenize(text).forEach(word => tally.set(word, (tally.get(word) || 0) + 1));
    return tally;
  });

  const scored = sessions.map((session, i) => {
    const score = queryTerms.reduce((total, term) => {
      const count = counts[i].get(term) || 0;
      if (!count) return total;
      const sessionsWithTerm = counts.filter(tally => tally.has(term)).length;
      const rarity = Math.log(1 + sessions.length / sessionsWithTerm);
      return total + rarity * (1 + Math.log(count));
    }, 0);
    return { session, score, order: i };
  });

  // Best match first; ties (and no matches at all) fall back to newest first.
  scored.sort((a, b) => b.score - a.score || a.order - b.order);
  return scored.map(({ session }) => session);
}

/**
 * Call OpenAI API
 */
async function callOpenAI(question, background, context) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: INSTRUCTIONS
        },
        {
          role: 'user',
          content: `${background}\n\n${context}\n\nQuestion: ${question}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })
  });
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Call Anthropic API
 */
async function callAnthropic(question, background, context) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }
  
  const body = {
    model: 'claude-opus-5-5',
    // Thinking is always on for this model, kept short by low effort, and
    // counts toward max_tokens
    max_tokens: 16000,
    output_config: { effort: 'low' },
    fallbacks: 'default',
    // The instructions, glossary and summary only change between sessions,
    // so they're cached; the recaps, logs and question follow them.
    system: [
      { type: 'text', text: INSTRUCTIONS },
      { type: 'text', text: background, cache_control: { type: 'ephemeral' } }
    ],
    messages: [
      {
        role: 'user',
        content: `${context}\n\nQuestion: ${question}`
      }
    ]
  };

  const send = fast => {
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      // Re-runs a safety-declined request on Anthropic's recommended fallback
      // model; fast mode runs Opus up to ~2.5x faster at double the price
      'anthropic-beta': fast
        ? 'server-side-fallback-2026-07-01,fast-mode-2026-02-01'
        : 'server-side-fallback-2026-07-01'
    };
    // Required when the key isn't scoped to a single workspace
    if (process.env.ANTHROPIC_WORKSPACE_ID) {
      headers['anthropic-workspace-id'] = process.env.ANTHROPIC_WORKSPACE_ID;
    }
    return fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify(fast ? { ...body, speed: 'fast' } : body)
    });
  };

  // Fast mode keeps Opus inside Netlify's 10-second function limit (about
  // 2.5s an answer versus 7s). It's a research preview with its own rate
  // limit, so if it's busy or unavailable, answer at normal speed instead.
  let response = await send(true);
  if (response.status === 429 || response.status === 400 || response.status === 529) {
    console.warn(`Fast mode unavailable (${response.status}); retrying at normal speed`);
    response = await send(false);
  }

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  if (data.stop_reason === 'refusal') {
    throw new Error(`Anthropic declined the request (${data.stop_details && data.stop_details.category})`);
  }
  // Content can start with thinking blocks, so pick out the text
  return data.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('');
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  try {
    const { campaignSlug, question } = JSON.parse(event.body || '{}');
    
    if (!campaignSlug || !question) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Campaign slug and question are required' })
      };
    }
    
    // Check authentication
    if (!isAuthenticated(event.headers, campaignSlug)) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Authentication required' })
      };
    }
    
    // Get auth level to determine if DM content should be shown
    const authLevel = getAuthLevel(event.headers, campaignSlug);
    const showDmContent = authLevel === 'dm';
    
    // Load campaign
    const campaign = loadCampaign(campaignSlug);
    if (!campaign) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Campaign not found' })
      };
    }
    
    // Always included: the glossary and the running campaign summary.
    const glossary = loadGlossary(campaignSlug);
    const glossaryText = formatGlossaryForLLM(glossary);
    const summary = loadSummary(campaignSlug);
    const background = [
      summary && `Campaign summary (the story so far):\n\n${summary}`,
      glossaryText && `Glossary (use canonical names in your answers):\n${glossaryText}`,
    ].filter(Boolean).join('\n\n---\n\n') || 'No campaign summary or glossary yet.';

    // Sessions, newest first, without DM-only content unless authenticated as DM
    const clean = text => (showDmContent ? text : removeDmOnlySections(text));
    const sessions = loadSessions(campaignSlug).map(session => {
      const log = loadSessionLog(campaignSlug, session.date);
      return { ...session, body: clean(session.body), log: log && clean(log) };
    });

    if (sessions.length === 0) {
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answer: "There are no session notes for this campaign yet.",
          sources: []
        })
      };
    }

    // Every recap gives the model the whole arc; the full logs of the best
    // matches give it the detail.
    const ranked = rankSessions(
      sessions,
      sessions.map(s => [s.title, s.body, s.log].filter(Boolean).join('\n')),
      question,
      glossary
    );
    const detailed = ranked.filter(s => s.log).slice(0, LOG_SESSIONS);
    const recaps = sessions.slice(0, MAX_RECAPS);

    const context = [
      'Session recaps, newest first:',
      ...recaps.map(s => `### ${s.date}: ${s.title}\n\n${s.body}`),
      ...(detailed.length ? ['---', 'Detailed logs of the sessions that best match the question:'] : []),
      ...detailed.map(s => `### Log for ${s.date}: ${s.title}\n\n${s.log}`),
    ].join('\n\n');

    // Call LLM (try Anthropic first, fall back to OpenAI)
    let answer;
    try {
      if (process.env.ANTHROPIC_API_KEY) {
        answer = await callAnthropic(question, background, context);
      } else if (process.env.OPENAI_API_KEY) {
        answer = await callOpenAI(question, background, context);
      } else {
        return {
          statusCode: 503,
          headers,
          body: JSON.stringify({ 
            error: 'No LLM API key configured. Please set OPENAI_API_KEY or ANTHROPIC_API_KEY.' 
          })
        };
      }
    } catch (llmError) {
      console.error('LLM API error:', llmError);
      
      // Strip API keys from error message for security
      let errorDetail = llmError.message || String(llmError);
      errorDetail = errorDetail.replace(/sk-[a-zA-Z0-9_-]{20,}/g, '[API_KEY_REDACTED]');
      errorDetail = errorDetail.replace(/anthropic[_-]?api[_-]?key[:\s=]+[^\s,}]+/gi, 'anthropic_api_key: [REDACTED]');
      
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to generate answer. Please try again later.',
          detail: errorDetail
        })
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        answer,
        // The sessions the answer cites by date, else the logs it was given
        sources: (() => {
          const cited = sessions.filter(s => answer.includes(s.date));
          return (cited.length ? cited : detailed).map(s => ({
            date: s.date,
            title: s.title
          }));
        })()
      })
    };
    
  } catch (error) {
    console.error('Ask error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
