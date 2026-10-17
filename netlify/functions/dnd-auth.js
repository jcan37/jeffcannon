const { verifyPassword, createSessionToken, createSessionCookie, isAuthenticated } = require('./lib/auth');
const { isRateLimited, recordAttempt, clearAttempts } = require('./lib/ratelimit');
const { loadCampaign } = require('./lib/content');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
  };
  
  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }
  
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  try {
    const { campaignSlug, password, action } = JSON.parse(event.body || '{}');
    
    if (!campaignSlug) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Campaign slug is required' })
      };
    }
    
    // Check if campaign exists
    const campaign = loadCampaign(campaignSlug);
    if (!campaign) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Campaign not found' })
      };
    }
    
    // Handle check action (verify existing session)
    if (action === 'check') {
      const authenticated = isAuthenticated(event.headers, campaignSlug);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ authenticated })
      };
    }
    
    // Handle login action
    if (!password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Password is required' })
      };
    }
    
    // Check rate limit
    const rateLimitCheck = isRateLimited(event.headers);
    if (rateLimitCheck.limited) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ 
          error: 'Too many attempts. Please try again later.',
          retryAfter: rateLimitCheck.retryAfter
        })
      };
    }
    
    // Verify password
    const authLevel = verifyPassword(campaignSlug, password);
    if (!authLevel) {
      recordAttempt(event.headers);
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid password' })
      };
    }
    
    // Clear rate limit on successful auth
    clearAttempts(event.headers);
    
    // Create session token with auth level
    const token = createSessionToken(campaignSlug, authLevel);
    const cookieHeader = createSessionCookie(campaignSlug, token);
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Set-Cookie': cookieHeader
      },
      body: JSON.stringify({ 
        success: true,
        campaign: {
          slug: campaign.slug,
          name: campaign.name
        },
        authLevel
      })
    };
    
  } catch (error) {
    console.error('Auth error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
