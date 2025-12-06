'use strict';

/**
 * Custom routes for ai-generation
 * File name 01-custom ensures it loads before the core router
 */

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/ai-generations/me',
            handler: 'ai-generation.findMine',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
