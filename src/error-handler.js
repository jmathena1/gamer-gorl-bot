/**
 * Centralized error handling and logging
 */

/**
 * Log error details with context
 * @param {string} context - Where the error occurred (e.g., "steam.getUserWishlistGameIds")
 * @param {Error} error - The error object
 * @param {object} metadata - Additional context (e.g., {steamUserId: "123"})
 */
export function logError(context, error, metadata = {}) {
    const errorInfo = {
        context,
        timestamp: new Date().toISOString(),
        message: error.message,
        status: error.status || error.response?.status,
        ...metadata
    };

    console.error('[ERROR]', JSON.stringify(errorInfo, null, 2));
}

/**
 * Extract user-friendly error message from various error types
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export function getUserMessage(error) {
    if (error.response?.status === 404) {
        return "Resource not found";
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
        return "Access denied";
    }
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        return "Connection error - please try again later";
    }
    return "An error occurred - please try again later";
}

/**
 * Handle API call errors with logging
 * @param {Error} error - The error object
 * @param {string} context - Where the error occurred
 * @param {object} metadata - Additional context
 * @returns {null}
 */
export function handleAPIError(error, context, metadata = {}) {
    logError(context, error, metadata);
    return null;
}
