// Email service configuration using Resend
import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email "from" address - must be verified in Resend
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL || 'admin@vendettaroasting.com';

export interface EmailData {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
}

export interface OrderConfirmationData {
  orderId: string
  customerName: string
  customerEmail: string
  orderTotal: number
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  estimatedDelivery: string
}

// Email template for order confirmation
export const createOrderConfirmationEmail = (data: OrderConfirmationData): EmailData => {
  const { orderId, customerName, customerEmail, orderTotal, items, shippingAddress, estimatedDelivery } = data

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Vendetta Roasting</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #3a2618; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f5f0; padding: 30px; }
        .order-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .button { display: inline-block; background-color: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Vendetta Roasting</h1>
          <h2>Order Confirmation</h2>
        </div>
        
        <div class="content">
          <h3>Hello ${customerName}!</h3>
          <p>Thank you for your order! We've received your order and will begin processing it shortly.</p>
          
          <div class="order-details">
            <h4>Order Details</h4>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Estimated Delivery:</strong> ${estimatedDelivery}</p>
            
            <h4>Items Ordered</h4>
            ${items.map(item => `
              <div class="item">
                <span>${item.name} × ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee;">
              <div class="item">
                <strong>Total:</strong>
                <strong>$${orderTotal.toFixed(2)}</strong>
              </div>
            </div>
            </div>
            
          <div class="order-details">
            <h4>Shipping Address</h4>
            <p>${shippingAddress.street}<br>
              ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}<br>
            ${shippingAddress.country}</p>
          </div>
          
          <p>We'll send you another email when your order ships with tracking information.</p>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/orders/${orderId}" class="button">View Order Details</a>
          </div>
        </div>
        
        <div class="footer">
          <p>Vendetta Roasting - Premium Coffee Roasters</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Order Confirmation - Vendetta Roasting
    
    Hello ${customerName}!
    
    Thank you for your order! We've received your order and will begin processing it shortly.
    
    Order ID: ${orderId}
    Estimated Delivery: ${estimatedDelivery}
    
    Items Ordered:
    ${items.map(item => `- ${item.name} × ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}
    
    Total: $${orderTotal.toFixed(2)}
    
    Shipping Address:
    ${shippingAddress.street}
    ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}
    ${shippingAddress.country}
    
    We'll send you another email when your order ships with tracking information.
    
    View your order: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/orders/${orderId}
  `;

  return {
    to: customerEmail,
    from: FROM_EMAIL,
    subject: `Order Confirmation - Order #${orderId}`,
    html,
    text
  };
};

// Email template for contact form submission
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const createContactFormEmail = (data: ContactFormData): EmailData => {
  const { name, email, subject, message } = data;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission - Vendetta Roasting</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #3a2618; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f5f0; padding: 30px; }
        .message-box { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #3a2618; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Form Submission</h1>
        </div>
        
        <div class="content">
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          
          <div class="message-box">
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p style="margin-top: 20px;">
            <strong>Reply to:</strong> <a href="mailto:${email}">${email}</a>
          </p>
        </div>
        
        <div class="footer">
          <p>Vendetta Roasting - Contact Form</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    New Contact Form Submission - Vendetta Roasting
    
    From: ${name} (${email})
    Subject: ${subject}
    
    Message:
    ${message}
    
    Reply to: ${email}
  `;

  return {
    to: ADMIN_EMAIL,
    from: fromEmail,
    replyTo: email,
    subject: `Contact Form: ${subject}`,
    html,
    text
  };
};

// Email template for contact form auto-reply
export const createContactFormAutoReply = (data: { name: string; email: string }): EmailData => {
  const { name, email } = data;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You for Contacting Us - Vendetta Roasting</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #3a2618; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f5f0; padding: 30px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Vendetta Roasting</h1>
          <h2>Thank You for Contacting Us</h2>
        </div>
        
        <div class="content">
          <h3>Hello ${name}!</h3>
          <p>Thank you for reaching out to us. We've received your message and will get back to you as soon as possible.</p>
          <p>Our team typically responds within 24-48 hours during business days.</p>
          <p>If you have any urgent questions, please feel free to call us directly.</p>
          <p>Best regards,<br>The Vendetta Roasting Team</p>
        </div>
        
        <div class="footer">
          <p>Vendetta Roasting - Premium Coffee Roasters</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Thank You for Contacting Us - Vendetta Roasting
    
    Hello ${name}!
    
    Thank you for reaching out to us. We've received your message and will get back to you as soon as possible.
    
    Our team typically responds within 24-48 hours during business days.
    
    If you have any urgent questions, please feel free to call us directly.
    
    Best regards,
    The Vendetta Roasting Team
  `;

  return {
    to: email,
    from: fromEmail,
    subject: 'Thank You for Contacting Vendetta Roasting',
    html,
    text
  };
};

// Email template for wholesale application
export interface WholesaleApplicationData {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  website?: string;
  taxId?: string;
  expectedVolume?: string;
  additionalInfo?: string;
}

export const createWholesaleApplicationEmail = (data: WholesaleApplicationData): EmailData => {
  const { businessName, contactName, email, phone, address, website, taxId, expectedVolume, additionalInfo } = data;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Wholesale Application - Vendetta Roasting</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #3a2618; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f5f0; padding: 30px; }
        .info-box { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .info-row { padding: 8px 0; border-bottom: 1px solid #eee; }
        .info-row:last-child { border-bottom: none; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Wholesale Application</h1>
        </div>
        
        <div class="content">
          <div class="info-box">
            <div class="info-row"><strong>Business Name:</strong> ${businessName}</div>
            <div class="info-row"><strong>Contact Name:</strong> ${contactName}</div>
            <div class="info-row"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></div>
            <div class="info-row"><strong>Phone:</strong> ${phone}</div>
            ${website ? `<div class="info-row"><strong>Website:</strong> <a href="${website}" target="_blank">${website}</a></div>` : ''}
            ${taxId ? `<div class="info-row"><strong>Tax ID:</strong> ${taxId}</div>` : ''}
            ${expectedVolume ? `<div class="info-row"><strong>Expected Volume:</strong> ${expectedVolume}</div>` : ''}
          </div>
          
          <div class="info-box">
            <h4>Business Address</h4>
            <p>${address.street}<br>
            ${address.city}, ${address.state} ${address.zipCode}<br>
            ${address.country}</p>
          </div>
          
          ${additionalInfo ? `
            <div class="info-box">
              <h4>Additional Information</h4>
              <p>${additionalInfo.replace(/\n/g, '<br>')}</p>
            </div>
          ` : ''}
          
          <p style="margin-top: 20px;">
            <strong>Reply to:</strong> <a href="mailto:${email}">${email}</a> | <a href="tel:${phone}">${phone}</a>
          </p>
        </div>
        
        <div class="footer">
          <p>Vendetta Roasting - Wholesale Application</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    New Wholesale Application - Vendetta Roasting
    
    Business Name: ${businessName}
    Contact Name: ${contactName}
    Email: ${email}
    Phone: ${phone}
    ${website ? `Website: ${website}` : ''}
    ${taxId ? `Tax ID: ${taxId}` : ''}
    ${expectedVolume ? `Expected Volume: ${expectedVolume}` : ''}
    
    Business Address:
    ${address.street}
    ${address.city}, ${address.state} ${address.zipCode}
    ${address.country}
    
    ${additionalInfo ? `\nAdditional Information:\n${additionalInfo}` : ''}
    
    Reply to: ${email} | ${phone}
  `;

  return {
    to: ADMIN_EMAIL,
    from: fromEmail,
    replyTo: email,
    subject: `New Wholesale Application: ${businessName}`,
    html,
    text
  };
};

// Email template for wholesale application confirmation
export const createWholesaleApplicationConfirmation = (data: { businessName: string; contactName: string; email: string }): EmailData => {
  const { businessName, contactName, email } = data;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Wholesale Application Received - Vendetta Roasting</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #3a2618; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f5f0; padding: 30px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Vendetta Roasting</h1>
          <h2>Wholesale Application Received</h2>
        </div>
        
        <div class="content">
          <h3>Hello ${contactName}!</h3>
          <p>Thank you for your interest in becoming a wholesale partner with <strong>${businessName}</strong>.</p>
          <p>We've received your wholesale application and our team will review it carefully. We typically respond within 3-5 business days.</p>
          <p>If we need any additional information, we'll reach out to you at ${email}.</p>
          <p>We appreciate your interest in partnering with Vendetta Roasting!</p>
          <p>Best regards,<br>The Vendetta Roasting Team</p>
        </div>
        
        <div class="footer">
          <p>Vendetta Roasting - Premium Coffee Roasters</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Wholesale Application Received - Vendetta Roasting
    
    Hello ${contactName}!
    
    Thank you for your interest in becoming a wholesale partner with ${businessName}.
    
    We've received your wholesale application and our team will review it carefully. We typically respond within 3-5 business days.
    
    If we need any additional information, we'll reach out to you at ${email}.
    
    We appreciate your interest in partnering with Vendetta Roasting!
    
    Best regards,
    The Vendetta Roasting Team
  `;

  return {
    to: email,
    from: fromEmail,
    subject: 'Wholesale Application Received - Vendetta Roasting',
    html,
    text
  };
};

// Email template for order shipped notification
export interface OrderShippedData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery: string;
}

export const createOrderShippedEmail = (data: OrderShippedData): EmailData => {
  const { orderNumber, customerName, customerEmail, items, shippingAddress, trackingNumber, trackingUrl, estimatedDelivery } = data;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Order Has Shipped - Vendetta Roasting</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .order-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .tracking-box { background-color: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .button { display: inline-block; background-color: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚚 Vendetta Roasting</h1>
          <h2>Your Order Has Shipped!</h2>
        </div>
        
        <div class="content">
          <h3>Hello ${customerName}!</h3>
          <p>Great news! Your order <strong>#${orderNumber}</strong> has been shipped and is on its way to you.</p>
          
          ${trackingNumber ? `
            <div class="tracking-box">
              <p style="margin: 0 0 10px 0;"><strong>Tracking Number:</strong> ${trackingNumber}</p>
              ${trackingUrl ? `<p style="margin: 0;"><a href="${trackingUrl}" style="color: #2196F3; text-decoration: none;">Track Your Package →</a></p>` : ''}
            </div>
          ` : ''}
          
          <div class="order-details">
            <h4>Items Shipped</h4>
            ${items.map(item => `
              <div class="item">
                <span>${item.name} × ${item.quantity}</span>
              </div>
            `).join('')}
          </div>
          
          <div class="order-details">
            <h4>Shipping Address</h4>
            <p>${shippingAddress.street}<br>
            ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}<br>
            ${shippingAddress.country}</p>
          </div>
          
          <p><strong>Estimated Delivery:</strong> ${estimatedDelivery}</p>
          
          <p>You can track your order using the tracking information above. If you have any questions, please don't hesitate to reach out.</p>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/orders/${orderNumber}" class="button">View Order Details</a>
          </div>
        </div>
        
        <div class="footer">
          <p>Vendetta Roasting - Premium Coffee Roasters</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Your Order Has Shipped - Vendetta Roasting
    
    Hello ${customerName}!
    
    Great news! Your order #${orderNumber} has been shipped and is on its way to you.
    
    ${trackingNumber ? `Tracking Number: ${trackingNumber}${trackingUrl ? `\nTrack Your Package: ${trackingUrl}` : ''}` : ''}
    
    Items Shipped:
    ${items.map(item => `- ${item.name} × ${item.quantity}`).join('\n')}
    
    Shipping Address:
    ${shippingAddress.street}
    ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}
    ${shippingAddress.country}
    
    Estimated Delivery: ${estimatedDelivery}
    
    You can track your order using the tracking information above. If you have any questions, please don't hesitate to reach out.
    
    View your order: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/orders/${orderNumber}
  `;

  return {
    to: customerEmail,
    from: fromEmail,
    subject: `Your Order #${orderNumber} Has Shipped! 🚚`,
    html,
    text
  };
};

// Email template for order delivered notification
export interface OrderDeliveredData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
  deliveredDate: string;
}

export const createOrderDeliveredEmail = (data: OrderDeliveredData): EmailData => {
  const { orderNumber, customerName, customerEmail, items, deliveredDate } = data;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Order Has Been Delivered - Vendetta Roasting</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4caf50; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .order-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .delivery-box { background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .button { display: inline-block; background-color: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Vendetta Roasting</h1>
          <h2>Your Order Has Been Delivered!</h2>
        </div>
        
        <div class="content">
          <h3>Hello ${customerName}!</h3>
          <p>We're excited to let you know that your order <strong>#${orderNumber}</strong> has been delivered.</p>
          
          <div class="delivery-box">
            <p style="margin: 0;"><strong>Delivered on:</strong> ${deliveredDate}</p>
          </div>
          
          <div class="order-details">
            <h4>Items Delivered</h4>
            ${items.map(item => `
              <div class="item">
                <span>${item.name} × ${item.quantity}</span>
              </div>
            `).join('')}
          </div>
          
          <p>We hope you enjoy your coffee! If you have any questions or concerns about your order, please don't hesitate to reach out.</p>
          
          <p style="margin-top: 30px;">We'd love to hear about your experience. Consider leaving a review to help other coffee lovers discover great products!</p>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/orders/${orderNumber}" class="button">View Order Details</a>
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/shop" class="button" style="background-color: #4caf50;">Shop Again</a>
          </div>
        </div>
        
        <div class="footer">
          <p>Vendetta Roasting - Premium Coffee Roasters</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Your Order Has Been Delivered - Vendetta Roasting
    
    Hello ${customerName}!
    
    We're excited to let you know that your order #${orderNumber} has been delivered.
    
    Delivered on: ${deliveredDate}
    
    Items Delivered:
    ${items.map(item => `- ${item.name} × ${item.quantity}`).join('\n')}
    
    We hope you enjoy your coffee! If you have any questions or concerns about your order, please don't hesitate to reach out.
    
    We'd love to hear about your experience. Consider leaving a review to help other coffee lovers discover great products!
    
    View your order: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/orders/${orderNumber}
    Shop again: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/shop
  `;

  return {
    to: customerEmail,
    from: fromEmail,
    subject: `Your Order #${orderNumber} Has Been Delivered! ✅`,
    html,
    text
  };
};

// Email template for review request
export interface ReviewRequestData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    productSlug: string;
    productId: string;
    quantity: number;
  }>;
  deliveredDate: string;
}

export const createReviewRequestEmail = (data: ReviewRequestData): EmailData => {
  const { orderNumber, customerName, customerEmail, items, deliveredDate } = data;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const siteUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Create product review links
  const productLinks = items.map(item => {
    const reviewUrl = `${siteUrl}/shop/${item.productSlug}`;
    return {
      name: item.name,
      url: reviewUrl,
      quantity: item.quantity
    };
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>We'd Love Your Feedback - Vendetta Roasting</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #3a2618; color: white; padding: 30px 20px; text-align: center; }
        .content { background-color: #f9f5f0; padding: 30px; }
        .review-box { background-color: white; padding: 25px; margin: 20px 0; border-radius: 8px; border: 2px solid #f0e6d9; }
        .product-item { padding: 15px; margin: 10px 0; background-color: #f9f5f0; border-radius: 5px; border-left: 4px solid #3a2618; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .button { display: inline-block; background-color: #3a2618; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 10px 5px; font-weight: 600; }
        .button-secondary { background-color: #6b4f3d; }
        .stars { color: #ffc107; font-size: 24px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">⭐ Vendetta Roasting</h1>
          <h2 style="margin: 10px 0 0 0; font-weight: normal;">We'd Love Your Feedback!</h2>
        </div>
        
        <div class="content">
          <h3 style="color: #3a2618; margin-top: 0;">Hello ${customerName}!</h3>
          
          <p>Thank you for your recent order <strong>#${orderNumber}</strong>! We hope you're enjoying your coffee.</p>
          
          <div class="review-box">
            <p style="margin-top: 0; font-size: 18px; color: #3a2618;"><strong>Your opinion matters to us!</strong></p>
            <p>We'd be incredibly grateful if you could take a moment to share your experience with the products you received. Your review helps other coffee lovers discover great products and helps us continue to improve.</p>
            
            <div class="stars">⭐⭐⭐⭐⭐</div>
            
            <p style="margin-bottom: 0;"><strong>Products from your order:</strong></p>
          </div>
          
          ${productLinks.map((product, index) => `
            <div class="product-item">
              <p style="margin: 0 0 10px 0; font-weight: 600; color: #3a2618;">${product.name}</p>
              <p style="margin: 0; font-size: 14px; color: #666;">Quantity: ${product.quantity}</p>
              <div style="margin-top: 12px;">
                <a href="${product.url}" class="button" style="font-size: 14px; padding: 10px 20px;">Leave a Review →</a>
              </div>
            </div>
          `).join('')}
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #f0e6d9;">
            <p style="color: #666; font-size: 14px;">Thank you for being a valued customer!</p>
            <a href="${siteUrl}/orders/${orderNumber}" class="button button-secondary" style="margin-right: 10px;">View Order</a>
            <a href="${siteUrl}/shop" class="button button-secondary">Shop Again</a>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 5px 0;"><strong>Vendetta Roasting</strong> - Premium Coffee Roasters</p>
          <p style="margin: 5px 0; font-size: 12px;">Delivered on: ${deliveredDate}</p>
          <p style="margin: 5px 0; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    We'd Love Your Feedback - Vendetta Roasting
    
    Hello ${customerName}!
    
    Thank you for your recent order #${orderNumber}! We hope you're enjoying your coffee.
    
    Your opinion matters to us!
    
    We'd be incredibly grateful if you could take a moment to share your experience with the products you received. Your review helps other coffee lovers discover great products and helps us continue to improve.
    
    Products from your order:
    ${productLinks.map((product, index) => `
    ${index + 1}. ${product.name} (Quantity: ${product.quantity})
       Leave a review: ${product.url}
    `).join('\n')}
    
    Thank you for being a valued customer!
    
    View your order: ${siteUrl}/orders/${orderNumber}
    Shop again: ${siteUrl}/shop
    
    Delivered on: ${deliveredDate}
    
    Vendetta Roasting - Premium Coffee Roasters
    This is an automated message. Please do not reply to this email.
  `;

  return {
    to: customerEmail,
    from: fromEmail,
    subject: `⭐ We'd Love Your Feedback on Order #${orderNumber}`,
    html,
    text
  };
};

export interface LowStockAlertData {
  products: Array<{
    name: string;
    sku: string;
    currentInventory: number;
    threshold: number;
  }>;
}

export const createLowStockAlertEmail = (data: LowStockAlertData): EmailData => {
  const { products } = data;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const adminEmail = process.env.ADMIN_EMAIL || fromEmail;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Low Stock Alert - Vendetta Roasting</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #d32f2f; color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background-color: #f9f9f9; padding: 30px 20px; }
        .alert-box { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        .product-table { width: 100%; border-collapse: collapse; margin: 20px 0; background-color: white; }
        .product-table th, .product-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .product-table th { background-color: #3a2618; color: white; }
        .product-table tr:hover { background-color: #f5f5f5; }
        .inventory-low { color: #d32f2f; font-weight: bold; }
        .button { display: inline-block; padding: 12px 24px; background-color: #3a2618; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Low Stock Alert</h1>
        </div>
        <div class="content">
          <div class="alert-box">
            <strong>Action Required:</strong> ${products.length} product${products.length > 1 ? 's' : ''} ${products.length > 1 ? 'are' : 'is'} running low on inventory.
          </div>
          
          <h2>Products with Low Stock:</h2>
          <table class="product-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Current Inventory</th>
                <th>Threshold</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(product => `
                <tr>
                  <td>${product.name}</td>
                  <td>${product.sku}</td>
                  <td class="inventory-low">${product.currentInventory}</td>
                  <td>${product.threshold}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <p>Please review your inventory and restock these products as needed.</p>
          
          <div style="text-align: center;">
            <a href="${siteUrl}/admin/products" class="button">Manage Inventory</a>
          </div>
        </div>
        <div class="footer">
          <p>Vendetta Roasting - Inventory Management System</p>
          <p>This is an automated alert. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Low Stock Alert - Vendetta Roasting

    Action Required: ${products.length} product${products.length > 1 ? 's' : ''} ${products.length > 1 ? 'are' : 'is'} running low on inventory.

    Products with Low Stock:
    ${products.map(product => `
      - ${product.name} (SKU: ${product.sku})
        Current Inventory: ${product.currentInventory}
        Threshold: ${product.threshold}
    `).join('')}

    Please review your inventory and restock these products as needed.

    Manage Inventory: ${siteUrl}/admin/products

    This is an automated alert. Please do not reply to this email.
  `;

  return {
    to: adminEmail,
    from: fromEmail,
    subject: `⚠️ Low Stock Alert: ${products.length} Product${products.length > 1 ? 's' : ''} Need Restocking`,
    html,
    text
  };
};

// Send email function
export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Email not sent.');
      console.log('Would send email:', emailData);
      return false;
    }

    const result = await resend.emails.send({
      from: emailData.from || FROM_EMAIL,
      to: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
      replyTo: emailData.replyTo,
    });

    if (result.error) {
      console.error('Error sending email:', result.error);
      return false;
    }

    console.log('✅ Email sent successfully:', result.data);
    return true;
  } catch (error) {
    console.error('Error in sendEmail:', error);
    return false;
  }
}
