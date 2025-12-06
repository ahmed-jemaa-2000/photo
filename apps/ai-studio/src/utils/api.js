/**
 * API Utility with retry logic for resilient API calls
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Retry configuration
 */
const DEFAULT_RETRY_CONFIG = {
    maxRetries: 3,
    baseDelay: 1000, // 1 second
    maxDelay: 10000, // 10 seconds
    retryableStatuses: [408, 429, 500, 502, 503, 504],
};

/**
 * Sleep utility
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculate retry delay with exponential backoff + jitter
 */
const getRetryDelay = (attempt, config = DEFAULT_RETRY_CONFIG) => {
    const exponentialDelay = Math.min(
        config.baseDelay * Math.pow(2, attempt),
        config.maxDelay
    );
    // Add jitter (±25%)
    const jitter = exponentialDelay * 0.25 * (Math.random() * 2 - 1);
    return exponentialDelay + jitter;
};

/**
 * Fetch with automatic retry on transient failures
 */
export async function fetchWithRetry(url, options = {}, config = DEFAULT_RETRY_CONFIG) {
    let lastError;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);

            // If response is ok, return it
            if (response.ok) {
                return response;
            }

            // Check if status is retryable
            if (config.retryableStatuses.includes(response.status) && attempt < config.maxRetries) {
                const delay = getRetryDelay(attempt, config);
                console.warn(`[API] Request failed with ${response.status}, retrying in ${Math.round(delay)}ms...`);
                await sleep(delay);
                continue;
            }

            // Non-retryable error
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Request failed with status ${response.status}`);

        } catch (error) {
            lastError = error;

            // Network errors are retryable
            if (error.name === 'TypeError' && attempt < config.maxRetries) {
                const delay = getRetryDelay(attempt, config);
                console.warn(`[API] Network error, retrying in ${Math.round(delay)}ms...`);
                await sleep(delay);
                continue;
            }

            throw error;
        }
    }

    throw lastError;
}

/**
 * API client with retry logic
 */
export const api = {
    /**
     * POST request with retry
     */
    async post(endpoint, data, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const isFormData = data instanceof FormData;

        const fetchOptions = {
            method: 'POST',
            ...options,
            headers: {
                ...(!isFormData && { 'Content-Type': 'application/json' }),
                ...options.headers,
            },
            body: isFormData ? data : JSON.stringify(data),
        };

        const response = await fetchWithRetry(url, fetchOptions);
        return response.json();
    },

    /**
     * GET request with retry
     */
    async get(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const response = await fetchWithRetry(url, options);
        return response.json();
    },
};

export default api;
