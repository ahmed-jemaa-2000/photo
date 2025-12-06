'use strict';

/**
 * Custom routes for user-credit
 */

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/user-credits/me',
            handler: 'user-credit.me',
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/user-credits/deduct',
            handler: 'user-credit.deduct',
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/user-credits/add',
            handler: 'user-credit.addCredits',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
