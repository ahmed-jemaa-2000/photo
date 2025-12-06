'use strict';

/**
 * Custom routes for credit-transaction
 */

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/credit-transactions/me',
            handler: 'credit-transaction.myTransactions',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
