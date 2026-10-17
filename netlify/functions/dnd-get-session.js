const { isAuthenticated, getAuthLevel } = require('./lib/auth');
const { loadCampaign, loadSession, removeDmOnlySections } = require('./lib/content');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  try {
    const campaignSlug = event.queryStringParameters?.campaign;
    const sessionDate = event.queryStringParameters?.date;
    
    if (!campaignSlug || !sessionDate) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Campaign slug and session date are required' })
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
    
    // Load session
    let session = loadSession(campaignSlug, sessionDate);
    if (!session) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Session not found' })
      };
    }
    
    // Remove DM-only content unless authenticated as DM
    if (!showDmContent) {
      session = {
        ...session,
        body: removeDmOnlySections(session.body)
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        campaign: {
          slug: campaign.slug,
          name: campaign.name,
          role: campaign.role
        },
        session
      })
    };
    
  } catch (error) {
    console.error('Get session error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
