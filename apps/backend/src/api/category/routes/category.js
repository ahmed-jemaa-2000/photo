'use strict';

/**
 * category router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::category.category', {
  config: {
    find: {
      policies: ['global::shop-scope'],
    },
    findOne: {
      policies: ['global::shop-scope'],
    },
    create: {
      policies: ['global::shop-scope'],
    },
    update: {
      policies: ['global::shop-scope'],
    },
    delete: {
      policies: ['global::shop-scope'],
    },
  },
});
