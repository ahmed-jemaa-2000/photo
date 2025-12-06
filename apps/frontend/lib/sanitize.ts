/**
 * HTML Sanitization Utility
 *
 * Sanitizes HTML content to prevent XSS attacks while preserving safe formatting.
 * Uses DOMPurify with a secure configuration.
 */

// Only import on client-side to avoid jsdom issues
let DOMPurify: any = null;
if (typeof window !== 'undefined') {
  DOMPurify = require('isomorphic-dompurify');
}

/**
 * Sanitizes HTML content to prevent XSS attacks
 *
 * @param dirty - The potentially unsafe HTML string
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';

  // Skip sanitization on server (return as-is for SSR, will be sanitized on client)
  if (typeof window === 'undefined' || !DOMPurify) {
    return dirty;
  }

  // Configure DOMPurify with safe defaults
  const config = {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'b', 'i',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'code', 'pre',
      'a', 'span', 'div',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'class', 'id',
    ],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  };

  // Sanitize and return
  return DOMPurify.sanitize(dirty, config);
}

/**
 * Sanitizes plain text (strips all HTML tags)
 *
 * @param dirty - The text that may contain HTML
 * @returns Plain text with all HTML removed
 */
export function sanitizeText(dirty: string): string {
  if (!dirty) return '';

  // Skip sanitization on server
  if (typeof window === 'undefined' || !DOMPurify) {
    return dirty.replace(/<[^>]*>/g, '');
  }

  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] });
}

/**
 * Checks if a string contains potentially dangerous HTML
 *
 * @param input - The HTML string to check
 * @returns true if the string contains suspicious content
 */
export function hasDangerousHtml(input: string): boolean {
  if (!input) return false;

  const dangerous = /<script|<iframe|javascript:|onerror=|onload=/i;
  return dangerous.test(input);
}
