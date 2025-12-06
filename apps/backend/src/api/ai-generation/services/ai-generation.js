'use strict';

/**
 * ai-generation service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::ai-generation.ai-generation');
