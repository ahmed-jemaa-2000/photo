'use strict';

/**
 * user-credit controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-credit.user-credit', ({ strapi }) => ({
    // Get current user's credits
    async me(ctx) {
        const user = ctx.state.user;
        if (!user) {
            return ctx.unauthorized('You must be logged in');
        }

        let userCredit = await strapi.db.query('api::user-credit.user-credit').findOne({
            where: { user: user.id },
        });

        // Create credit record if not exists (new user gets 10 free credits)
        if (!userCredit) {
            userCredit = await strapi.db.query('api::user-credit.user-credit').create({
                data: {
                    user: user.id,
                    balance: 10,
                    totalPurchased: 10,
                    totalUsed: 0,
                },
            });
        }

        return {
            balance: userCredit.balance,
            totalPurchased: userCredit.totalPurchased,
            totalUsed: userCredit.totalUsed,
        };
    },

    // Deduct credits (called by AI API)
    async deduct(ctx) {
        const user = ctx.state.user;
        if (!user) {
            return ctx.unauthorized('You must be logged in');
        }

        const { amount, type, metadata } = ctx.request.body;

        if (!amount || amount <= 0) {
            return ctx.badRequest('Invalid amount');
        }

        const userCredit = await strapi.db.query('api::user-credit.user-credit').findOne({
            where: { user: user.id },
        });

        if (!userCredit) {
            return ctx.badRequest('No credit record found');
        }

        if (userCredit.balance < amount) {
            return ctx.badRequest('Insufficient credits', {
                required: amount,
                available: userCredit.balance,
            });
        }

        // Deduct credits
        const newBalance = userCredit.balance - amount;
        await strapi.db.query('api::user-credit.user-credit').update({
            where: { id: userCredit.id },
            data: {
                balance: newBalance,
                totalUsed: userCredit.totalUsed + amount,
            },
        });

        // Log transaction
        await strapi.db.query('api::credit-transaction.credit-transaction').create({
            data: {
                user: user.id,
                type: type || 'generation',
                amount: -amount,
                balanceAfter: newBalance,
                metadata: metadata || {},
            },
        });

        return {
            success: true,
            balance: newBalance,
            deducted: amount,
        };
    },

    // Admin: Add credits to user
    async addCredits(ctx) {
        // Security: Only allow admins to add credits
        const currentUser = ctx.state.user;
        if (!currentUser) {
            return ctx.unauthorized('You must be logged in');
        }

        // Check if user has admin role
        const userWithRole = await strapi.db.query('plugin::users-permissions.user').findOne({
            where: { id: currentUser.id },
            populate: ['role'],
        });

        const isAdmin = userWithRole?.role?.name === 'Admin' ||
            userWithRole?.role?.type === 'admin' ||
            userWithRole?.role?.name === 'Super Admin';

        if (!isAdmin) {
            return ctx.forbidden('Only admins can add credits');
        }

        const { userId, amount, reason } = ctx.request.body;

        if (!userId || !amount || amount <= 0) {
            return ctx.badRequest('userId and positive amount required');
        }

        let userCredit = await strapi.db.query('api::user-credit.user-credit').findOne({
            where: { user: userId },
        });

        if (!userCredit) {
            // Create if not exists
            userCredit = await strapi.db.query('api::user-credit.user-credit').create({
                data: {
                    user: userId,
                    balance: amount,
                    totalPurchased: amount,
                    totalUsed: 0,
                },
            });
        } else {
            // Update existing
            await strapi.db.query('api::user-credit.user-credit').update({
                where: { id: userCredit.id },
                data: {
                    balance: userCredit.balance + amount,
                    totalPurchased: userCredit.totalPurchased + amount,
                },
            });
            userCredit.balance += amount;
        }

        // Log transaction
        await strapi.db.query('api::credit-transaction.credit-transaction').create({
            data: {
                user: userId,
                type: 'admin_add',
                amount: amount,
                balanceAfter: userCredit.balance,
                metadata: { reason: reason || 'Admin credit addition' },
            },
        });

        return {
            success: true,
            userId,
            newBalance: userCredit.balance,
            added: amount,
        };
    },
}));
