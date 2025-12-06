/**
 * logger.js - Production-grade structured logging with Winston
 *
 * Provides consistent logging across the application with:
 * - Request ID tracking for tracing
 * - User ID tracking for debugging
 * - Separate error and combined log files
 * - Console output for development
 * - Structured metadata support
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format for consistent log structure
const customFormat = winston.format.printf(({ timestamp, level, message, requestId, userId, ...meta }) => {
  const reqId = requestId || 'N/A';
  const user = userId || 'N/A';

  let log = `${timestamp} [${level.toUpperCase()}] [Req:${reqId}] [User:${user}]: ${message}`;

  // Add metadata if present
  const metaKeys = Object.keys(meta);
  if (metaKeys.length > 0 && meta[Symbol.for('level')] === undefined) {
    log += ` | ${JSON.stringify(meta)}`;
  }

  return log;
});

// Create the logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    customFormat
  ),
  transports: [
    // Error logs (only errors)
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Combined logs (all levels)
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 10,
    }),
    // Console output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        customFormat
      ),
    }),
  ],
});

/**
 * Creates a child logger with context (requestId, userId) bound
 * This allows cleaner logging without repeating context in every call
 *
 * Usage:
 *   const log = logger.withContext({ requestId, userId });
 *   log.info('Generation started', { category: 'clothes' });
 */
logger.withContext = function(context) {
  return {
    info: (message, meta = {}) => logger.info(message, { ...context, ...meta }),
    warn: (message, meta = {}) => logger.warn(message, { ...context, ...meta }),
    error: (message, meta = {}) => logger.error(message, { ...context, ...meta }),
    debug: (message, meta = {}) => logger.debug(message, { ...context, ...meta }),
  };
};

// Log startup
logger.info('Logger initialized', { logsDir, logLevel: process.env.LOG_LEVEL || 'info' });

module.exports = logger;
