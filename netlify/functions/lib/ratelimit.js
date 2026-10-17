// Simple in-memory rate limiter
// For production, consider using a Redis-backed solution

const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

/**
 * Get client identifier from request
 */
function getClientId(headers) {
  // Use forwarded IP if available (Netlify provides this)
  return headers['x-forwarded-for'] || 
         headers['x-real-ip'] || 
         'unknown';
}

/**
 * Check if client is rate limited
 */
function isRateLimited(headers) {
  const clientId = getClientId(headers);
  const now = Date.now();
  
  const clientAttempts = attempts.get(clientId) || [];
  
  // Remove old attempts outside the window
  const recentAttempts = clientAttempts.filter(
    timestamp => now - timestamp < WINDOW_MS
  );
  
  if (recentAttempts.length >= MAX_ATTEMPTS) {
    return {
      limited: true,
      retryAfter: Math.ceil((recentAttempts[0] + WINDOW_MS - now) / 1000)
    };
  }
  
  return { limited: false };
}

/**
 * Record a failed attempt
 */
function recordAttempt(headers) {
  const clientId = getClientId(headers);
  const now = Date.now();
  
  const clientAttempts = attempts.get(clientId) || [];
  clientAttempts.push(now);
  
  // Keep only recent attempts
  const recentAttempts = clientAttempts.filter(
    timestamp => now - timestamp < WINDOW_MS
  );
  
  attempts.set(clientId, recentAttempts);
  
  // Cleanup old entries periodically
  if (Math.random() < 0.01) { // 1% chance
    cleanup();
  }
}

/**
 * Clear attempts for a client (on successful auth)
 */
function clearAttempts(headers) {
  const clientId = getClientId(headers);
  attempts.delete(clientId);
}

/**
 * Cleanup old entries
 */
function cleanup() {
  const now = Date.now();
  for (const [clientId, clientAttempts] of attempts.entries()) {
    const recentAttempts = clientAttempts.filter(
      timestamp => now - timestamp < WINDOW_MS
    );
    if (recentAttempts.length === 0) {
      attempts.delete(clientId);
    } else {
      attempts.set(clientId, recentAttempts);
    }
  }
}

module.exports = {
  isRateLimited,
  recordAttempt,
  clearAttempts
};
