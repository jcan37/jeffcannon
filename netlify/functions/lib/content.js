const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// esbuild bundles each function into its own folder, so __dirname can't be
// trusted. content/dnd ships via `included_files` in netlify.toml and keeps its
// repo-relative path under the Lambda task root (and under the repo root locally).
const CONTENT_DIR = [
  process.env.LAMBDA_TASK_ROOT,
  process.cwd(),
  path.resolve(__dirname, '../../..'),
]
  .filter(Boolean)
  .map(root => path.join(root, 'content/dnd'))
  .find(dir => fs.existsSync(dir)) || path.join(process.cwd(), 'content/dnd');

/**
 * Load all campaigns metadata
 */
function loadCampaigns() {
  try {
    const campaigns = [];
    const entries = fs.readdirSync(CONTENT_DIR);
    
    for (const entry of entries) {
      const campaignPath = path.join(CONTENT_DIR, entry);
      const stat = fs.statSync(campaignPath);
      
      if (stat.isDirectory()) {
        const metadataPath = path.join(campaignPath, 'campaign.json');
        if (fs.existsSync(metadataPath)) {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
          campaigns.push({
            slug: entry,
            ...metadata
          });
        }
      }
    }
    
    return campaigns;
  } catch (error) {
    console.error('Error loading campaigns:', error);
    return [];
  }
}

/**
 * Load a single campaign's metadata
 */
function loadCampaign(campaignSlug) {
  try {
    const metadataPath = path.join(CONTENT_DIR, campaignSlug, 'campaign.json');
    if (!fs.existsSync(metadataPath)) {
      return null;
    }
    
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    return {
      slug: campaignSlug,
      ...metadata
    };
  } catch (error) {
    console.error(`Error loading campaign ${campaignSlug}:`, error);
    return null;
  }
}

/**
 * Load all sessions for a campaign
 */
function loadSessions(campaignSlug) {
  try {
    const campaignPath = path.join(CONTENT_DIR, campaignSlug);
    const files = fs.readdirSync(campaignPath);
    
    const sessions = [];
    
    for (const file of files) {
      // Only dated session notes: not logs, summary.md or other docs
      if (/^\d{4}-\d{2}-\d{2}\.md$/.test(file)) {
        const filePath = path.join(campaignPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const session = parseSession(content, file);
        if (session) {
          sessions.push(session);
        }
      }
    }
    
    // Sort by date descending
    sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return sessions;
  } catch (error) {
    console.error(`Error loading sessions for ${campaignSlug}:`, error);
    return [];
  }
}

/**
 * Load a single session
 */
function loadSession(campaignSlug, sessionDate) {
  try {
    const sessionPath = path.join(CONTENT_DIR, campaignSlug, `${sessionDate}.md`);
    if (!fs.existsSync(sessionPath)) {
      return null;
    }
    
    const content = fs.readFileSync(sessionPath, 'utf8');
    return parseSession(content, `${sessionDate}.md`);
  } catch (error) {
    console.error(`Error loading session ${campaignSlug}/${sessionDate}:`, error);
    return null;
  }
}

/**
 * Parse a session markdown file
 */
function parseSession(content, filename) {
  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) {
    return null;
  }
  
  const [, frontmatterText, body] = frontmatterMatch;
  
  // Parse frontmatter
  const frontmatter = {};
  frontmatterText.split('\n').forEach(line => {
    const match = line.match(/^(\w+):\s*"?([^"]+)"?$/);
    if (match) {
      frontmatter[match[1]] = match[2].replace(/^"|"$/g, '');
    }
  });
  
  return {
    date: frontmatter.date,
    title: frontmatter.title,
    body: body.trim(),
    filename
  };
}

/**
 * Load session log if it exists
 */
function loadSessionLog(campaignSlug, sessionDate) {
  try {
    const logPath = path.join(CONTENT_DIR, campaignSlug, `${sessionDate}.log.md`);
    if (!fs.existsSync(logPath)) {
      return null;
    }
    
    const content = fs.readFileSync(logPath, 'utf8');
    return content;
  } catch (error) {
    console.error(`Error loading log for ${campaignSlug}/${sessionDate}:`, error);
    return null;
  }
}

/**
 * Load a campaign's running "story so far" summary, without its frontmatter.
 * It's written from player-facing recaps, so it is safe for every reader.
 */
function loadSummary(campaignSlug) {
  try {
    const summaryPath = path.join(CONTENT_DIR, campaignSlug, 'summary.md');
    if (!fs.existsSync(summaryPath)) {
      return null;
    }
    const content = fs.readFileSync(summaryPath, 'utf8');
    return content.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
  } catch (error) {
    console.error(`Error loading summary for ${campaignSlug}:`, error);
    return null;
  }
}

/**
 * Remove DM-only sections from content
 */
function removeDmOnlySections(body) {
  // Remove ## DM Only sections (case insensitive)
  return body.replace(/## DM [Oo]nly[\s\S]*?(?=##|$)/gi, '').trim();
}

/**
 * Extract text content for search (removes DM-only sections)
 */
function extractSearchableText(session) {
  const cleanBody = removeDmOnlySections(session.body);
  return `${session.title} ${cleanBody}`.toLowerCase();
}

/**
 * Load glossary for a campaign
 */
function loadGlossary(campaignSlug) {
  try {
    const glossaryPath = path.join(CONTENT_DIR, campaignSlug, 'glossary.yml');
    if (!fs.existsSync(glossaryPath)) {
      return null;
    }
    
    const glossaryYaml = fs.readFileSync(glossaryPath, 'utf8');
    return yaml.load(glossaryYaml);
  } catch (error) {
    console.error(`Error loading glossary for ${campaignSlug}:`, error);
    return null;
  }
}

/**
 * Format glossary for LLM context
 */
function formatGlossaryForLLM(glossary) {
  if (!glossary) return '';
  
  const sections = [];
  
  if (glossary.pcs && glossary.pcs.length > 0) {
    sections.push('## Player Characters');
    glossary.pcs.forEach(pc => {
      let line = `- ${pc.name}`;
      if (pc.player) line += ` (player: ${pc.player})`;
      if (pc.description) line += ` - ${pc.description}`;
      if (pc.notes) line += `. ${pc.notes}`;
      if (pc.aliases && pc.aliases.length > 0) {
        line += ` [Also known as: ${pc.aliases.join(', ')}]`;
      }
      sections.push(line);
    });
  }
  
  if (glossary.npcs && glossary.npcs.length > 0) {
    sections.push('\n## NPCs');
    glossary.npcs.forEach(npc => {
      let line = `- ${npc.name}`;
      if (npc.description) line += ` - ${npc.description}`;
      if (npc.aliases && npc.aliases.length > 0) {
        line += ` [Also known as: ${npc.aliases.join(', ')}]`;
      }
      sections.push(line);
    });
  }
  
  if (glossary.places && glossary.places.length > 0) {
    sections.push('\n## Places');
    glossary.places.forEach(place => {
      let line = `- ${place.name}`;
      if (place.description) line += ` - ${place.description}`;
      if (place.aliases && place.aliases.length > 0) {
        line += ` [Also known as: ${place.aliases.join(', ')}]`;
      }
      sections.push(line);
    });
  }
  
  if (glossary.items && glossary.items.length > 0) {
    sections.push('\n## Items');
    glossary.items.forEach(item => {
      let line = `- ${item.name}`;
      if (item.description) line += ` - ${item.description}`;
      if (item.aliases && item.aliases.length > 0) {
        line += ` [Also known as: ${item.aliases.join(', ')}]`;
      }
      sections.push(line);
    });
  }
  
  return sections.join('\n');
}

module.exports = {
  loadSummary,
  loadCampaigns,
  loadCampaign,
  loadSessions,
  loadSession,
  loadSessionLog,
  loadGlossary,
  formatGlossaryForLLM,
  removeDmOnlySections,
  extractSearchableText
};
