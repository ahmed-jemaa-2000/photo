'use strict';

/**
 * credit-transaction controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::credit-transaction.credit-transaction', ({ strapi }) => ({
    // Get current user's transaction history
    async myTransactions(ctx) {
        const user = ctx.state.user;
        if (!user) {
            return ctx.unauthorized('You must be logged in');
        }

        const { page = 1, pageSize = 20 } = ctx.query;

        const transactions = await strapi.db.query('api::credit-transaction.credit-transaction').findMany({
            where: { user: user.id },
            orderBy: { createdAt: 'desc' },
            limit: pageSize,
            offset: (page - 1) * pageSize,
        });

        const total = await strapi.db.query('api::credit-transaction.credit-transaction').count({
            where: { user: user.id },
        });

        return {
            data: transactions,
            meta: {
                pagination: {
                    page: parseInt(page),
                    pageSize: parseInt(pageSize),
                    total,
                    pageCount: Math.ceil(total / pageSize),
                },
            },
        };
    },
}));
