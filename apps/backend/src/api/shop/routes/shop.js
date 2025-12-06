'use strict';

/**
 * shop router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::shop.shop', {
  config: {
    find: {
      // Public read access for storefronts (filtered by subdomain in controller)
      auth: false,
    },
    findOne: {
      // Public read access for storefronts
      auth: false,
    },
    create: {
      // Only platform admins can create shops
      policies: [],
    },
    update: {
      // Shop owners can update their own shop (enforced by shop-scope policy)
      policies: ['global::shop-scope'],
    },
    delete: {
      // Only platform admins can delete shops
      policies: [],
    },
  },
});
