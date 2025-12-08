/**
 * API Utilities with retry logic and error handling
 */

/**
 * Fetch with exponential backoff retry
 * @param {string} url - URL to fetch
 * @param {RequestInit} options - Fetch options
 * @param {object} retryConfig - Retry configuration
 * @returns {Promise<Response>}
 */
export async function fetchWithRetry(url, options = {}, retryConfig = {}) {
    const {
        maxRetries = 3,
        baseDelay = 1000,
        maxDelay = 10000,
        retryOn = [500, 502, 503, 504, 429],
    } = retryConfig;

    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);

            // Don't retry on success or client errors (except rate limit)
            if (response.ok || (response.status < 500 && response.status !== 429)) {
                return response;
            }

            // Check if we should retry this status
            if (!retryOn.includes(response.status)) {
                return response;
            }

            // Store error for potential rethrow
            lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);

            // Don't retry if this was the last attempt
            if (attempt === maxRetries) {
                return response;
            }

            // Calculate delay with exponential backoff + jitter
            const delay = Math.min(
                baseDelay * Math.pow(2, attempt) + Math.random() * 500,
                maxDelay
            );

            console.log(`[Retry] Attempt ${attempt + 1}/${maxRetries} failed with ${response.status}, retrying in ${Math.round(delay)}ms...`);
            await sleep(delay);

        } catch (error) {
            lastError = error;

            // Network errors - retry
            if (attempt < maxRetries) {
                const delay = Math.min(
                    baseDelay * Math.pow(2, attempt) + Math.random() * 500,
                    maxDelay
                );
                console.log(`[Retry] Attempt ${attempt + 1}/${maxRetries} failed with network error, retrying in ${Math.round(delay)}ms...`);
                await sleep(delay);
            } else {
                throw error;
            }
        }
    }

    throw lastError;
}

/**
 * Sleep utility
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch JSON with retry
 * @param {string} url - URL to fetch
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<{data: any, response: Response}>}
 */
export async function fetchJsonWithRetry(url, options = {}) {
    const response = await fetchWithRetry(url, options);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
    }

    const data = await response.json();
    return { data, response };
}

/**
 * Build FormData from object
 */
export function buildFormData(data) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (typeof value === 'object') {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, String(value));
            }
        }
    });

    return formData;
}

export default {
    fetchWithRetry,
    fetchJsonWithRetry,
    buildFormData,
};
