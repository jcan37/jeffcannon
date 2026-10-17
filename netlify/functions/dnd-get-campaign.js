const { isAuthenticated, getAuthLevel } = require('./lib/auth');
const { loadCampaign, loadSessions, removeDmOnlySections } = require('./lib/content');

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
    const campaignSlug = event.queryStringParameters?.slug;
    
    if (!campaignSlug) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Campaign slug is required' })
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
    
    // Load sessions
    let sessions = loadSessions(campaignSlug);
    
    // Remove DM-only content unless authenticated as DM
    if (!showDmContent) {
      sessions = sessions.map(session => ({
        ...session,
        body: removeDmOnlySections(session.body)
      }));
    }
    
    // Return campaign with sessions list (without full body content)
    const sessionsList = sessions.map(s => ({
      date: s.date,
      title: s.title
    }));
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        campaign,
        sessions: sessionsList
      })
    };
    
  } catch (error) {
    console.error('Get campaign error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
