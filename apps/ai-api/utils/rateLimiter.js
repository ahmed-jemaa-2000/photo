/**
 * rateLimiter.js - In-memory rate limiting for generation requests
 *
 * Prevents abuse with:
 * - Per-hour limits
 * - Per-day limits
 * - Cooldown between requests (anti-spam)
 * - Usage tracking
 */

class RateLimiter {
  constructor() {
    // In-memory store: userId -> { generations: [timestamps], lastGeneration }
    this.store = new Map();

    // Load limits from environment or use defaults
    this.limits = {
      perHour: parseInt(process.env.RATE_LIMIT_PER_HOUR) || 10,
      perDay: parseInt(process.env.RATE_LIMIT_PER_DAY) || 50,
      cooldownSeconds: parseInt(process.env.RATE_LIMIT_COOLDOWN) || 30
    };

    // Periodic cleanup to prevent memory leaks
    setInterval(() => this.cleanup(), 3600000); // Every hour
  }

  /**
   * Check if user can generate now
   * @param {Number} userId - Telegram user ID
   * @returns {Object} { allowed: boolean, reason?: string, retryAfter?: number }
   */
  canGenerate(userId) {
    const now = Date.now();
    const userData = this.store.get(userId) || { generations: [], lastGeneration: 0 };

    // 1. Cooldown check (prevent rapid-fire spam)
    const timeSinceLastGen = (now - userData.lastGeneration) / 1000;
    if (timeSinceLastGen < this.limits.cooldownSeconds) {
      return {
        allowed: false,
        reason: 'cooldown',
        retryAfter: Math.ceil(this.limits.cooldownSeconds - timeSinceLastGen)
      };
    }

    // 2. Hourly limit check
    const recentHour = userData.generations.filter(ts => ts > now - 3600000);
    if (recentHour.length >= this.limits.perHour) {
      const oldestInHour = Math.min(...recentHour);
      const retryAfter = Math.ceil((oldestInHour + 3600000 - now) / 1000 / 60); // Minutes
      return {
        allowed: false,
        reason: 'hourly_limit',
        retryAfter,
        current: recentHour.length,
        limit: this.limits.perHour
      };
    }

    // 3. Daily limit check
    const recentDay = userData.generations.filter(ts => ts > now - 86400000);
    if (recentDay.length >= this.limits.perDay) {
      return {
        allowed: false,
        reason: 'daily_limit',
        retryAfter: 'tomorrow',
        current: recentDay.length,
        limit: this.limits.perDay
      };
    }

    return { allowed: true };
  }

  /**
   * Record a generation (call after successful deduction of credit)
   * @param {Number} userId - Telegram user ID
   */
  recordGeneration(userId) {
    const now = Date.now();
    const userData = this.store.get(userId) || { generations: [] };

    userData.generations.push(now);
    userData.lastGeneration = now;

    // Keep only last 24 hours of data
    userData.generations = userData.generations.filter(ts => ts > now - 86400000);

    this.store.set(userId, userData);
  }

  /**
   * Get current usage for a user
   * @param {Number} userId - Telegram user ID
   * @returns {Object} Usage stats
   */
  getUsage(userId) {
    const now = Date.now();
    const userData = this.store.get(userId) || { generations: [] };

    const hourly = userData.generations.filter(ts => ts > now - 3600000).length;
    const daily = userData.generations.filter(ts => ts > now - 86400000).length;

    return {
      hourly: { used: hourly, limit: this.limits.perHour, remaining: this.limits.perHour - hourly },
      daily: { used: daily, limit: this.limits.perDay, remaining: this.limits.perDay - daily },
      lastGeneration: userData.lastGeneration ? new Date(userData.lastGeneration) : null
    };
  }

  /**
   * Reset limits for a user (admin function)
   * @param {Number} userId - Telegram user ID
   */
  resetUser(userId) {
    this.store.delete(userId);
  }

  /**
   * Get all users with active limits (admin function)
   * @returns {Array} User IDs with usage stats
   */
  getAllUsers() {
    const now = Date.now();
    const users = [];

    for (const [userId, userData] of this.store.entries()) {
      const hourly = userData.generations.filter(ts => ts > now - 3600000).length;
      const daily = userData.generations.filter(ts => ts > now - 86400000).length;

      if (hourly > 0 || daily > 0) {
        users.push({
          userId,
          hourly,
          daily,
          lastGeneration: new Date(userData.lastGeneration)
        });
      }
    }

    return users.sort((a, b) => b.daily - a.daily);
  }

  /**
   * Cleanup old data (remove users with no recent activity)
   */
  cleanup() {
    const now = Date.now();
    let cleaned = 0;

    for (const [userId, userData] of this.store.entries()) {
      const recentDay = userData.generations.filter(ts => ts > now - 86400000);

      if (recentDay.length === 0) {
        this.store.delete(userId);
        cleaned++;
      } else {
        // Update to remove old timestamps
        userData.generations = recentDay;
        this.store.set(userId, userData);
      }
    }

    if (cleaned > 0) {
      const logger = require('./logger');
      logger.info('Rate limiter cleanup completed', { usersRemoved: cleaned, activeUsers: this.store.size });
    }
  }

  /**
   * Get statistics about rate limiter state
   */
  getStats() {
    const now = Date.now();
    let totalHourly = 0;
    let totalDaily = 0;
    let activeUsers = 0;

    for (const userData of this.store.values()) {
      const hourly = userData.generations.filter(ts => ts > now - 3600000).length;
      const daily = userData.generations.filter(ts => ts > now - 86400000).length;

      if (daily > 0) activeUsers++;
      totalHourly += hourly;
      totalDaily += daily;
    }

    return {
      activeUsers,
      totalGenerationsLastHour: totalHourly,
      totalGenerationsLastDay: totalDaily,
      limits: this.limits
    };
  }
}

// Create singleton instance
const rateLimiter = new RateLimiter();

module.exports = rateLimiter;
