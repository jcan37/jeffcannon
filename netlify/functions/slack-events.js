const crypto = require('crypto');

/**
 * Netlify Function: Slack Events API HTTP receiver
 * Replaces Socket Mode with HTTP-based event handling
 */

const JEFF_USER_ID = 'U017FGQA6TS';
const STAN_BOT_ID = 'U02F07901JB';

/**
 * Verify Slack signature
 * @param {string} signingSecret - SLACK_SIGNING_SECRET env var
 * @param {string} requestBody - Raw request body
 * @param {string} timestamp - X-Slack-Request-Timestamp header
 * @param {string} signature - X-Slack-Signature header
 * @returns {boolean} - True if signature is valid
 */
function verifySlackSignature(signingSecret, requestBody, timestamp, signature) {
  // Reject old requests (replay attack prevention)
  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - parseInt(timestamp, 10)) > 60 * 5) {
    return false;
  }

  // Compute expected signature
  const sigBasestring = `v0:${timestamp}:${requestBody}`;
  const expectedSignature = 'v0=' + crypto
    .createHmac('sha256', signingSecret)
    .update(sigBasestring, 'utf8')
    .digest('hex');

  // Constant-time comparison
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'utf8'),
      Buffer.from(signature, 'utf8')
    );
  } catch {
    return false;
  }
}

/**
 * Filter and transform events for forwarding
 * @param {object} event - Slack event object
 * @returns {object|null} - Transformed payload or null if should be filtered
 */
function filterAndTransformEvent(event) {
  const eventType = event.type;
  const user = event.user;

  // DMs: channel_type im, no subtype, no bot_id, non-empty text
  if (eventType === 'message' && event.channel_type === 'im') {
    if (event.subtype || event.bot_id || !event.text) {
      return null;
    }
    return {
      kind: 'dm',
      user: user,
      channel: event.channel,
      ts: event.ts,
      text: event.text,
      fromJeff: user === JEFF_USER_ID
    };
  }

  // Mentions: app_mention, skip if bot_id or user is STAN bot
  if (eventType === 'app_mention') {
    if (event.bot_id || user === STAN_BOT_ID) {
      return null;
    }
    return {
      kind: 'mention',
      user: user,
      channel: event.channel,
      ts: event.ts,
      thread_ts: event.thread_ts || null,
      text: event.text,
      fromJeff: user === JEFF_USER_ID
    };
  }

  return null;
}

/**
 * Forward event to Grok Bot webhook (async, non-blocking)
 * @param {object} payload - Transformed event payload
 * @param {string} webhookUrl - GROK_STAN_WEBHOOK_URL env var
 * @param {string} webhookKey - GROK_STAN_WEBHOOK_KEY env var
 */
async function forwardToGrokBot(payload, webhookUrl, webhookKey) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${webhookKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error('Grok webhook failed:', response.status, await response.text());
    }
  } catch (error) {
    console.error('Error forwarding to Grok:', error);
  }
}

/**
 * Main handler
 */
exports.handler = async (event) => {
  const signingSecret = process.env.SLACK_SIGNING_SECRET;
  const webhookUrl = process.env.GROK_STAN_WEBHOOK_URL;
  const webhookKey = process.env.GROK_STAN_WEBHOOK_KEY;

  // Validate required env vars
  if (!signingSecret || !webhookUrl || !webhookKey) {
    console.error('Missing required environment variables');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error' })
    };
  }

  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const requestBody = event.body;
  const timestamp = event.headers['x-slack-request-timestamp'];
  const signature = event.headers['x-slack-signature'];

  // Verify Slack signature
  if (!timestamp || !signature) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing Slack signature headers' })
    };
  }

  if (!verifySlackSignature(signingSecret, requestBody, timestamp, signature)) {
    console.error('Invalid Slack signature');
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid signature' })
    };
  }

  // Parse request body
  let body;
  try {
    body = JSON.parse(requestBody);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' })
    };
  }

  // Handle URL verification challenge
  if (body.type === 'url_verification') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/plain' },
      body: body.challenge
    };
  }

  // Handle event callbacks
  if (body.type === 'event_callback' && body.event) {
    const slackEvent = body.event;
    const transformedPayload = filterAndTransformEvent(slackEvent);

    // Return 200 immediately (before forwarding)
    const response = {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };

    // Forward to Grok Bot asynchronously (non-blocking)
    if (transformedPayload) {
      // Fire and forget - don't await
      forwardToGrokBot(transformedPayload, webhookUrl, webhookKey).catch(err => {
        console.error('Async forward failed:', err);
      });
    }

    return response;
  }

  // Unknown event type
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true })
  };
};
