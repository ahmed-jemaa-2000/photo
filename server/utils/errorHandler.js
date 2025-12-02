/**
 * errorHandler.js - Centralized error handling for generation failures
 *
 * Provides consistent error handling with:
 * - Automatic credit refunds
 * - Structured logging
 * - User-friendly error messages
 * - Error classification
 */

const logger = require('./logger');
const db = require('../db/database');

/**
 * Handles generation errors with logging, refund, and user notification
 * @param {Error} error - The error object
 * @param {Object} ctx - Telegram context
 * @param {Number} userId - User ID
 * @param {String} requestId - Request ID for tracing
 * @param {String} lang - Language code ('en' or 'tn')
 */
async function handleGenerationError(error, ctx, userId, requestId, lang = 'en') {
  // Log the error with full context
  logger.error('Generation failed', {
    requestId,
    userId,
    errorMessage: error.message,
    errorType: error.name,
    stack: error.stack
  });

  // Attempt credit refund
  try {
    await db.refundCredit(userId);
    logger.info('Credit refunded after error', { requestId, userId });
  } catch (refundError) {
    logger.error('Failed to refund credit', {
      requestId,
      userId,
      refundError: refundError.message
    });
  }

  // Classify error and get user message
  const errorType = classifyError(error);
  const userMessage = getErrorMessage(errorType, lang);

  // Send user-friendly message
  try {
    await ctx.reply(userMessage);
  } catch (replyError) {
    logger.error('Failed to send error message to user', {
      requestId,
      userId,
      replyError: replyError.message
    });
  }
}

/**
 * Classifies errors into categories for better handling
 * @param {Error} error - The error object
 * @returns {String} Error category
 */
function classifyError(error) {
  const message = error.message.toLowerCase();

  // Timeout errors
  if (message.includes('timeout') || message.includes('timed out')) {
    return 'timeout';
  }

  // API errors (rate limits, quota, key issues)
  if (
    message.includes('api') ||
    message.includes('429') ||
    message.includes('quota') ||
    message.includes('rate limit') ||
    message.includes('unauthorized') ||
    message.includes('forbidden')
  ) {
    return 'api_error';
  }

  // Network errors
  if (
    message.includes('network') ||
    message.includes('econnrefused') ||
    message.includes('enotfound') ||
    message.includes('etimedout')
  ) {
    return 'network_error';
  }

  // Invalid input errors
  if (
    message.includes('invalid') ||
    message.includes('malformed') ||
    message.includes('unsupported')
  ) {
    return 'invalid_input';
  }

  // File system errors
  if (message.includes('enoent') || message.includes('file')) {
    return 'file_error';
  }

  // Generic error
  return 'generic';
}

/**
 * Gets user-friendly error messages based on error type and language
 * @param {String} errorType - Error category
 * @param {String} lang - Language code
 * @returns {String} User-friendly message
 */
function getErrorMessage(errorType, lang = 'en') {
  const messages = {
    timeout: {
      en: '⏱️ Generation timed out. Your credit has been refunded. Please try again!',
      tn: '⏱️ Wa9t khlas. Crédits rja3lék. 3awéd jéréb!'
    },
    api_error: {
      en: '❌ API service error. Your credit has been refunded. Please try again in a few moments.',
      tn: '❌ Mochkla fil API. Crédits rja3lék. Estanna chwaya w 3awéd jéréb.'
    },
    network_error: {
      en: '🌐 Network connection error. Your credit has been refunded. Please try again.',
      tn: '🌐 Mochkla fil connexion. Crédits rja3lék. 3awéd jéréb.'
    },
    invalid_input: {
      en: '⚠️ Invalid image or settings. Your credit has been refunded. Please upload a different photo.',
      tn: '⚠️ Tsawira walla settings mch behin. Crédits rja3lék. 3awéd b tsawira o5ra.'
    },
    file_error: {
      en: '📁 File processing error. Your credit has been refunded. Please try uploading again.',
      tn: '📁 Mochkla fil fichier. Crédits rja3lék. 3awéd tsawér márra o5ra.'
    },
    generic: {
      en: '❌ Generation failed. Your credit has been refunded. Please try again.',
      tn: '❌ Fama mochkla. Crédits rja3lék. 3awéd jéréb.'
    }
  };

  return messages[errorType]?.[lang] || messages.generic[lang];
}

/**
 * Logs non-critical warnings (e.g., retries, degraded performance)
 * @param {String} message - Warning message
 * @param {Object} context - Context object with requestId, userId, etc.
 */
function logWarning(message, context = {}) {
  logger.warn(message, context);
}

/**
 * Creates an error report for admin debugging
 * @param {Error} error - The error object
 * @param {Object} context - Additional context
 * @returns {String} Formatted error report
 */
function createErrorReport(error, context = {}) {
  return `
**Error Report**
Time: ${new Date().toISOString()}
Type: ${error.name}
Message: ${error.message}
Request ID: ${context.requestId || 'N/A'}
User ID: ${context.userId || 'N/A'}

Stack Trace:
${error.stack}

Context:
${JSON.stringify(context, null, 2)}
  `.trim();
}

module.exports = {
  handleGenerationError,
  classifyError,
  getErrorMessage,
  logWarning,
  createErrorReport
};
