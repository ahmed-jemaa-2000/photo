'use strict';

/**
 * user-credit service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::user-credit.user-credit');
