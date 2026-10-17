const crypto = require('crypto');

const SESSION_COOKIE_PREFIX = 'dnd_session_';
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Verify a campaign password against the environment variable
 * Returns 'player' for standard password, 'dm' for DM password, false for invalid
 */
function verifyPassword(campaignSlug, password) {
  const envVarBase = campaignSlug.toUpperCase().replace(/-/g, '_');
  
  // Check DM password first
  const dmPassword = process.env[`DND_DM_PASSWORD_${envVarBase}`];
  if (dmPassword && password === dmPassword) {
    return 'dm';
  }
  
  // Check player password
  const playerPassword = process.env[`DND_PASSWORD_${envVarBase}`];
  if (!playerPassword) {
    console.error(`Missing environment variable: DND_PASSWORD_${envVarBase}`);
    return false;
  }
  
  if (password === playerPassword) {
    return 'player';
  }
  
  return false;
}

/**
 * Create a signed session token for a campaign
 */
function createSessionToken(campaignSlug, authLevel) {
  const secret = process.env.DND_SESSION_SECRET;
  if (!secret) {
    throw new Error('DND_SESSION_SECRET environment variable is required');
  }
  
  const data = JSON.stringify({
    campaign: campaignSlug,
    level: authLevel, // 'player' or 'dm'
    exp: Date.now() + (SESSION_MAX_AGE * 1000)
  });
  
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(data);
  const signature = hmac.digest('hex');
  
  return `${Buffer.from(data).toString('base64')}.${signature}`;
}

/**
 * Verify and parse a session token
 */
function verifySessionToken(token, expectedCampaign) {
  if (!token) return null;
  
  const secret = process.env.DND_SESSION_SECRET;
  if (!secret) return null;
  
  try {
    const [dataBase64, signature] = token.split('.');
    const data = Buffer.from(dataBase64, 'base64').toString('utf8');
    
    // Verify signature
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(data);
    const expectedSignature = hmac.digest('hex');
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    const parsed = JSON.parse(data);
    
    // Check expiration
    if (Date.now() > parsed.exp) {
      return null;
    }
    
    // Check campaign matches
    if (expectedCampaign && parsed.campaign !== expectedCampaign) {
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Get session cookie name for a campaign
 */
function getSessionCookieName(campaignSlug) {
  return `${SESSION_COOKIE_PREFIX}${campaignSlug}`;
}

/**
 * Extract session token from request cookies
 */
function getSessionToken(headers, campaignSlug) {
  const cookieHeader = headers.cookie || '';
  const cookieName = getSessionCookieName(campaignSlug);
  const cookies = cookieHeader.split(';').map(c => c.trim());
  
  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === cookieName) {
      return decodeURIComponent(value);
    }
  }
  
  return null;
}

/**
 * Check if request is authenticated for a campaign
 * Returns null, 'player', or 'dm'
 */
function getAuthLevel(headers, campaignSlug) {
  const token = getSessionToken(headers, campaignSlug);
  const session = verifySessionToken(token, campaignSlug);
  return session ? session.level : null;
}

/**
 * Check if request is authenticated for a campaign (backward compat)
 */
function isAuthenticated(headers, campaignSlug) {
  return getAuthLevel(headers, campaignSlug) !== null;
}

/**
 * Create Set-Cookie header for session
 */
function createSessionCookie(campaignSlug, token) {
  const cookieName = getSessionCookieName(campaignSlug);
  return `${cookieName}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_MAX_AGE}`;
}

module.exports = {
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  isAuthenticated,
  getAuthLevel,
  createSessionCookie,
  getSessionToken,
  getSessionCookieName,
  SESSION_MAX_AGE
};
