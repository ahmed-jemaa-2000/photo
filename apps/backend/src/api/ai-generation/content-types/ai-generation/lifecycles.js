'use strict';

/**
 * ai-generation lifecycle hooks
 * Automatically assigns the authenticated user to new generations
 */

module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;
        const { user } = event.state;

        // Auto-assign the authenticated user to the generation
        if (user && !data.user) {
            data.user = user.id;
        }
    },
};
