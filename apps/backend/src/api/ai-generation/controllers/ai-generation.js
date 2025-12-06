'use strict';

/**
 * ai-generation controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::ai-generation.ai-generation', ({ strapi }) => ({
    /**
     * Get AI generations for the current authenticated user
     */
    async findMine(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized('You must be logged in');
        }

        try {
            const generations = await strapi.entityService.findMany(
                'api::ai-generation.ai-generation',
                {
                    filters: {
                        user: user.id,
                    },
                    populate: ['product'],
                    sort: { createdAt: 'desc' },
                    limit: 100,
                }
            );

            return {
                data: generations.map(gen => ({
                    id: gen.id,
                    imageUrl: gen.imageUrl,
                    downloadUrl: gen.downloadUrl,
                    category: gen.category,
                    prompt: gen.prompt,
                    createdAt: gen.createdAt,
                    product: gen.product ? {
                        id: gen.product.id,
                        name: gen.product.name,
                    } : null,
                })),
            };
        } catch (error) {
            strapi.log.error('Error fetching user generations:', error);
            return ctx.internalServerError('Failed to fetch generations');
        }
    },
}));
