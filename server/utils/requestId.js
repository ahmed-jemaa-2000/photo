/**
 * requestId.js - Unique request ID generation for tracing
 *
 * Generates unique IDs for tracking requests through the system:
 * Format: {action}-{userId}-{timestamp}-{uuid}
 * Example: generate-123456789-1704067200000-a1b2c3d4
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Generates a unique request ID for tracing
 * @param {Number|String} userId - Telegram user ID
 * @param {String} action - Action type (e.g., 'generate', 'video', 'upload')
 * @returns {String} Unique request ID
 */
function generateRequestId(userId, action = 'request') {
  const timestamp = Date.now();
  const uuid = uuidv4().slice(0, 8); // Use first 8 chars for brevity
  return `${action}-${userId}-${timestamp}-${uuid}`;
}

/**
 * Parses a request ID back into its components
 * @param {String} requestId - The request ID to parse
 * @returns {Object} Parsed components
 */
function parseRequestId(requestId) {
  const parts = requestId.split('-');
  if (parts.length < 4) {
    return { action: 'unknown', userId: null, timestamp: null, uuid: null };
  }

  return {
    action: parts[0],
    userId: parts[1],
    timestamp: parseInt(parts[2]),
    uuid: parts[3],
    date: new Date(parseInt(parts[2]))
  };
}

/**
 * Generates a short request ID for display (last 8 chars)
 * @param {String} requestId - Full request ID
 * @returns {String} Short version
 */
function shortRequestId(requestId) {
  if (!requestId) return 'N/A';
  return requestId.slice(-8);
}

module.exports = {
  generateRequestId,
  parseRequestId,
  shortRequestId
};
