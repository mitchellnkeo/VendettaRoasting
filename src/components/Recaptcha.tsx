/**
 * Google reCAPTCHA v3 Component
 * 
 * This component loads the reCAPTCHA script and provides a function
 * to execute the reCAPTCHA check and get a token.
 */

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

interface RecaptchaProps {
  siteKey: string;
  onToken: (token: string) => void;
  action: string;
}

export default function Recaptcha({ siteKey, onToken, action }: RecaptchaProps) {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Load reCAPTCHA script if not already loaded
    if (!scriptLoaded.current && !window.grecaptcha) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      scriptLoaded.current = true;
    }

    // Wait for grecaptcha to be ready
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        // Execute reCAPTCHA
        window.grecaptcha
          .execute(siteKey, { action })
          .then((token) => {
            onToken(token);
          })
          .catch((error) => {
            console.error('reCAPTCHA error:', error);
            // If reCAPTCHA fails, still allow form submission (fail open)
            // In production, you might want to fail closed
            onToken('');
          });
      });
    } else {
      // If script hasn't loaded yet, wait a bit and try again
      const checkInterval = setInterval(() => {
        if (window.grecaptcha) {
          clearInterval(checkInterval);
          window.grecaptcha.ready(() => {
            window.grecaptcha
              .execute(siteKey, { action })
              .then((token) => {
                onToken(token);
              })
              .catch((error) => {
                console.error('reCAPTCHA error:', error);
                onToken('');
              });
          });
        }
      }, 100);

      // Cleanup
      return () => clearInterval(checkInterval);
    }
  }, [siteKey, action, onToken]);

  // This component doesn't render anything visible
  return null;
}

/**
 * Hook to get reCAPTCHA token
 */
export function useRecaptcha(siteKey: string | undefined, action: string): () => Promise<string> {
  return async () => {
    if (!siteKey || !window.grecaptcha) {
      return '';
    }

    try {
      await new Promise<void>((resolve) => {
        window.grecaptcha.ready(() => {
          resolve();
        });
      });

      const token = await window.grecaptcha.execute(siteKey, { action });
      return token;
    } catch (error) {
      console.error('reCAPTCHA error:', error);
      return '';
    }
  };
}

