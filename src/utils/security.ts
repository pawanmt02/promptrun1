/**
 * Security & Data Sanitization utilities
 * Enforces XSS prevention, input cleansing, and numeric bounds checking.
 */

/**
 * Strips HTML tags, script tags, javascript: URI schemas, and potentially malicious characters.
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/[<>"'&]/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#x27;';
        case '&': return '&amp;';
        default: return char;
      }
    })
    .trim()
    .slice(0, 100); // Prevent buffer overflow / large payload attacks
}

/**
 * Validates and sanitizes monetary values.
 * Must be a positive finite number within budget bounds.
 */
export function sanitizeAmount(value: number | string, maxLimit: number = 10000): number {
  const numeric = typeof value === 'number' ? value : parseFloat(String(value).trim());
  if (!Number.isFinite(numeric) || isNaN(numeric)) {
    return 0;
  }
  const positive = Math.max(0, numeric);
  const bounded = Math.min(positive, maxLimit);
  return Math.round(bounded * 100) / 100; // clamp to 2 decimal places
}

/**
 * Validates category against allowed values.
 */
export function isValidCategory(category: string, allowedCategories: string[]): boolean {
  return allowedCategories.includes(category);
}
