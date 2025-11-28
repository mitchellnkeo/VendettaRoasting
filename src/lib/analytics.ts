/**
 * Google Analytics 4 Integration
 * 
 * This module provides functions for tracking page views, events, and conversions.
 */

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'set' | 'js',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

/**
 * Initialize Google Analytics
 * Call this once when the app loads
 */
export function initGA(measurementId: string) {
  if (typeof window === 'undefined' || !measurementId) {
    return;
  }

  // Load gtag script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', measurementId, {
    page_path: window.location.pathname,
  });
}

/**
 * Track page view
 */
export function trackPageView(url: string, title?: string) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
    page_path: url,
    page_title: title,
  });
}

/**
 * Track custom event
 */
export function trackEvent(
  eventName: string,
  eventParams?: {
    [key: string]: any;
  }
) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', eventName, eventParams);
}

/**
 * Track purchase conversion
 */
export function trackPurchase(data: {
  transaction_id: string;
  value: number;
  currency?: string;
  items: Array<{
    item_id: string;
    item_name: string;
    item_category?: string;
    price: number;
    quantity: number;
  }>;
}) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', 'purchase', {
    transaction_id: data.transaction_id,
    value: data.value,
    currency: data.currency || 'USD',
    items: data.items,
  });
}

/**
 * Track subscription signup
 */
export function trackSubscriptionSignup(data: {
  subscription_id: string;
  value: number;
  currency?: string;
  plan_name?: string;
}) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', 'sign_up', {
    method: 'subscription',
    subscription_id: data.subscription_id,
    value: data.value,
    currency: data.currency || 'USD',
    plan_name: data.plan_name,
  });
}

/**
 * Track add to cart
 */
export function trackAddToCart(data: {
  item_id: string;
  item_name: string;
  item_category?: string;
  price: number;
  quantity: number;
}) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', 'add_to_cart', {
    currency: 'USD',
    value: data.price * data.quantity,
    items: [
      {
        item_id: data.item_id,
        item_name: data.item_name,
        item_category: data.item_category,
        price: data.price,
        quantity: data.quantity,
      },
    ],
  });
}

/**
 * Track remove from cart
 */
export function trackRemoveFromCart(data: {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
}) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', 'remove_from_cart', {
    currency: 'USD',
    value: data.price * data.quantity,
    items: [
      {
        item_id: data.item_id,
        item_name: data.item_name,
        price: data.price,
        quantity: data.quantity,
      },
    ],
  });
}

/**
 * Track begin checkout
 */
export function trackBeginCheckout(data: {
  value: number;
  currency?: string;
  items: Array<{
    item_id: string;
    item_name: string;
    item_category?: string;
    price: number;
    quantity: number;
  }>;
}) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', 'begin_checkout', {
    currency: data.currency || 'USD',
    value: data.value,
    items: data.items,
  });
}

/**
 * Track view item
 */
export function trackViewItem(data: {
  item_id: string;
  item_name: string;
  item_category?: string;
  price: number;
}) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', 'view_item', {
    currency: 'USD',
    value: data.price,
    items: [
      {
        item_id: data.item_id,
        item_name: data.item_name,
        item_category: data.item_category,
        price: data.price,
        quantity: 1,
      },
    ],
  });
}

/**
 * Track search
 */
export function trackSearch(searchTerm: string) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', 'search', {
    search_term: searchTerm,
  });
}

/**
 * Track form submission
 */
export function trackFormSubmit(formName: string, formId?: string) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', 'form_submit', {
    form_name: formName,
    form_id: formId,
  });
}

