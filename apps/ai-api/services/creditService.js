/**
 * Credit Service - Handles credit validation and deduction via Strapi API
 */
const axios = require('axios');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

// Credit costs by generation type
const CREDIT_COSTS = {
    photo: 1,
    video: 3,
};

/**
 * Get credit cost for generation type
 */
function getCreditCost(type) {
    return CREDIT_COSTS[type] || CREDIT_COSTS.photo;
}

/**
 * Validate user token with Strapi and get user info
 * @param {string} token - JWT token
 * @returns {Promise<{valid: boolean, user?: object, error?: string}>}
 */
async function validateToken(token) {
    if (!token) {
        return { valid: false, error: 'No token provided' };
    }

    try {
        const response = await axios.get(`${STRAPI_URL}/api/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return { valid: true, user: response.data };
    } catch (error) {
        console.error('Token validation error:', error.message);
        return { valid: false, error: 'Invalid or expired token' };
    }
}

/**
 * Get user's credit balance
 * @param {string} token - JWT token
 * @returns {Promise<{balance: number, error?: string}>}
 */
async function getCredits(token) {
    try {
        const response = await axios.get(`${STRAPI_URL}/api/user-credits/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return { balance: response.data.balance };
    } catch (error) {
        console.error('Get credits error:', error.message);
        return { balance: 0, error: error.message };
    }
}

/**
 * Check if user has sufficient credits
 * @param {string} token - JWT token
 * @param {string} generationType - 'photo' or 'video'
 * @returns {Promise<{allowed: boolean, balance: number, cost: number, error?: string}>}
 */
async function checkCredits(token, generationType = 'photo') {
    const cost = getCreditCost(generationType);
    const { balance, error } = await getCredits(token);

    if (error) {
        return { allowed: false, balance: 0, cost, error };
    }

    return {
        allowed: balance >= cost,
        balance,
        cost,
        error: balance < cost ? `Insufficient credits. Need ${cost}, have ${balance}` : null,
    };
}

/**
 * Deduct credits after successful generation
 * @param {string} token - JWT token
 * @param {string} generationType - 'photo' or 'video'
 * @param {object} metadata - Additional info to log
 * @returns {Promise<{success: boolean, newBalance?: number, error?: string}>}
 */
async function deductCredits(token, generationType = 'photo', metadata = {}) {
    const cost = getCreditCost(generationType);
    const type = generationType === 'video' ? 'video_generation' : 'photo_generation';

    try {
        const response = await axios.post(
            `${STRAPI_URL}/api/user-credits/deduct`,
            {
                amount: cost,
                type,
                metadata,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return {
            success: true,
            newBalance: response.data.balance,
            deducted: cost,
        };
    } catch (error) {
        console.error('Deduct credits error:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.message,
        };
    }
}

/**
 * Express middleware to extract auth token from cookie or header
 */
function extractToken(req, res, next) {
    // Try Authorization header first
    let token = req.headers.authorization?.replace('Bearer ', '');

    // Fall back to cookie
    if (!token && req.headers.cookie) {
        const cookies = req.headers.cookie.split(';').reduce((acc, c) => {
            const [key, val] = c.trim().split('=');
            acc[key] = val;
            return acc;
        }, {});
        token = cookies['auth_token'];
    }

    req.authToken = token;
    next();
}

/**
 * Express middleware to require authentication
 */
async function requireAuth(req, res, next) {
    const token = req.authToken;

    if (!token) {
        return res.status(401).json({
            error: 'Authentication required',
            code: 'NO_TOKEN',
        });
    }

    const { valid, user, error } = await validateToken(token);

    if (!valid) {
        return res.status(401).json({
            error: error || 'Invalid token',
            code: 'INVALID_TOKEN',
        });
    }

    req.user = user;
    next();
}

/**
 * Express middleware to require sufficient credits
 * @param {string} generationType - 'photo' or 'video'
 */
function requireCredits(generationType = 'photo') {
    return async (req, res, next) => {
        const token = req.authToken;
        const { allowed, balance, cost, error } = await checkCredits(token, generationType);

        if (!allowed) {
            return res.status(402).json({
                error: error || 'Insufficient credits',
                code: 'INSUFFICIENT_CREDITS',
                balance,
                required: cost,
            });
        }

        req.creditBalance = balance;
        req.creditCost = cost;
        next();
    };
}

module.exports = {
    CREDIT_COSTS,
    getCreditCost,
    validateToken,
    getCredits,
    checkCredits,
    deductCredits,
    extractToken,
    requireAuth,
    requireCredits,
};
