/**
 * Input Sanitization Utilities
 * 
 * Functions to sanitize user input and prevent XSS attacks
 */

/**
 * Sanitize string input
 * Removes HTML tags and dangerous characters
 */
export function sanitizeString(input: string | undefined | null): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');

  // Escape special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Sanitize email address
 * Validates format and removes dangerous characters
 */
export function sanitizeEmail(email: string | undefined | null): string {
  if (!email || typeof email !== 'string') {
    return '';
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmed = email.trim().toLowerCase();

  if (!emailRegex.test(trimmed)) {
    return '';
  }

  // Remove any HTML tags (shouldn't be in email, but just in case)
  return sanitizeString(trimmed);
}

/**
 * Sanitize text input (for longer text like comments, messages)
 * Preserves line breaks but removes HTML
 */
export function sanitizeText(input: string | undefined | null): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');

  // Escape special characters but preserve line breaks
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Sanitize URL
 * Validates and sanitizes URL input
 */
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);
    // Only allow http and https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '';
    }
    return parsed.toString();
  } catch {
    // If URL parsing fails, return empty string
    return '';
  }
}

/**
 * Sanitize phone number
 * Removes non-numeric characters except +, -, (, ), and spaces
 */
export function sanitizePhone(phone: string | undefined | null): string {
  if (!phone || typeof phone !== 'string') {
    return '';
  }

  // Keep only digits, +, -, (, ), and spaces
  return phone.replace(/[^\d+\-() ]/g, '').trim();
}

/**
 * Sanitize object with string values
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[]
): T {
  const sanitized = { ...obj };

  for (const field of fields) {
    if (typeof obj[field] === 'string') {
      sanitized[field] = sanitizeString(obj[field]) as any;
    }
  }

  return sanitized;
}

