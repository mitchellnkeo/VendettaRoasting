/**
 * Google reCAPTCHA v3 Integration
 * 
 * reCAPTCHA v3 is invisible and runs in the background.
 * It returns a score (0.0 to 1.0) indicating how likely the user is human.
 */

/**
 * Verify reCAPTCHA token with Google
 * 
 * @param token - reCAPTCHA token from frontend
 * @returns Object with success status and score
 */
export async function verifyRecaptcha(token: string): Promise<{
  success: boolean;
  score: number;
  error?: string;
}> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.warn('RECAPTCHA_SECRET_KEY not set. Skipping reCAPTCHA verification.');
    return { success: true, score: 1.0 }; // Allow request if reCAPTCHA not configured
  }

  if (!token) {
    return { success: false, score: 0, error: 'reCAPTCHA token is required' };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        score: 0,
        error: data['error-codes']?.join(', ') || 'reCAPTCHA verification failed',
      };
    }

    // Score threshold: 0.5 is recommended
    // Lower scores (closer to 0) indicate bot-like behavior
    const score = data.score || 0;
    const threshold = parseFloat(process.env.RECAPTCHA_SCORE_THRESHOLD || '0.5');

    return {
      success: score >= threshold,
      score,
      error: score < threshold ? 'reCAPTCHA score too low' : undefined,
    };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    // On error, allow the request (fail open) but log it
    // In production, you might want to fail closed
    return {
      success: true,
      score: 0.5,
      error: 'reCAPTCHA verification error',
    };
  }
}

/**
 * Validate reCAPTCHA token in API route
 * 
 * @param token - reCAPTCHA token from request body
 * @returns true if valid, false otherwise
 */
export async function validateRecaptcha(token: string | undefined): Promise<boolean> {
  if (!token) {
    return false;
  }

  const result = await verifyRecaptcha(token);
  return result.success;
}

