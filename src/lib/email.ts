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
        .header { background-color: #8B4513; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .order-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .total { font-weight: bold; font-size: 18px; color: #8B4513; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .button { display: inline-block; background-color: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>☕ Vendetta Roasting</h1>
          <h2>Order Confirmation</h2>
        </div>
        
        <div class="content">
          <h3>Thank you for your order, ${customerName}!</h3>
          <p>We've received your order and will begin processing it shortly. Here are your order details:</p>
          
          <div class="order-details">
            <h4>Order Information</h4>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Estimated Delivery:</strong> ${estimatedDelivery}</p>
            
            <h4>Items Ordered</h4>
            ${items.map(item => `
              <div class="item">
                <span>${item.name} × ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
            
            <div class="item total">
              <span>Total</span>
              <span>$${orderTotal.toFixed(2)}</span>
            </div>
            
            <h4>Shipping Address</h4>
            <p>
              ${shippingAddress.street}<br>
              ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}<br>
              ${shippingAddress.country}
            </p>
          </div>
          
          <p>We'll send you a tracking number once your order ships. If you have any questions, please don't hesitate to contact us.</p>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/orders/${orderId}" class="button">Track Your Order</a>
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/shop" class="button">Continue Shopping</a>
          </div>
        </div>
        
        <div class="footer">
          <p>Vendetta Roasting - Premium Coffee Roasters</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
    Order Confirmation - Vendetta Roasting
    
    Thank you for your order, ${customerName}!
    
    Order ID: ${orderId}
    Order Date: ${new Date().toLocaleDateString()}
    Estimated Delivery: ${estimatedDelivery}
    
    Items Ordered:
    ${items.map(item => `- ${item.name} × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`).join('\n')}
    
    Total: $${orderTotal.toFixed(2)}
    
    Shipping Address:
    ${shippingAddress.street}
    ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}
    ${shippingAddress.country}
    
    Track your order: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/orders/${orderId}
    Continue shopping: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/shop
    
    Thank you for choosing Vendetta Roasting!
  `

  return {
    to: customerEmail,
    from: FROM_EMAIL,
    replyTo: ADMIN_EMAIL,
    subject: `Order Confirmation #${orderId} - Vendetta Roasting`,
    html,
    text
  }
}

// Email template for contact form submission (to admin)
export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export const createContactFormEmail = (data: ContactFormData): EmailData => {
  const { name, email, subject, message } = data

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
        .header { background-color: #8B4513; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #8B4513; }
        .value { margin-top: 5px; padding: 10px; background-color: white; border-radius: 5px; }
        .message { white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>☕ Vendetta Roasting</h1>
          <h2>New Contact Form Submission</h2>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${name}</div>
          </div>
          
          <div class="field">
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${email}">${email}</a></div>
          </div>
          
          <div class="field">
            <div class="label">Subject:</div>
            <div class="value">${subject}</div>
          </div>
          
          <div class="field">
            <div class="label">Message:</div>
            <div class="value message">${message}</div>
          </div>
          
          <p style="margin-top: 30px;">
            <a href="mailto:${email}" style="background-color: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reply to ${name}
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
    New Contact Form Submission - Vendetta Roasting
    
    Name: ${name}
    Email: ${email}
    Subject: ${subject}
    
    Message:
    ${message}
    
    Reply to: ${email}
  `

  return {
    to: ADMIN_EMAIL,
    from: FROM_EMAIL,
    replyTo: email,
    subject: `New Contact Form: ${subject}`,
    html,
    text
  }
}

// Email template for contact form auto-reply (to customer)
export const createContactFormAutoReply = (data: ContactFormData): EmailData => {
  const { name, email, subject } = data

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
        .header { background-color: #8B4513; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>☕ Vendetta Roasting</h1>
          <h2>Thank You for Contacting Us</h2>
        </div>
        
        <div class="content">
          <p>Hi ${name},</p>
          
          <p>Thank you for reaching out to us! We've received your message regarding "${subject}" and will get back to you as soon as possible.</p>
          
          <p>We typically respond within 24-48 hours during business days.</p>
          
          <p>If you have any urgent questions, please feel free to call us at (206) 555-1234.</p>
          
          <p>Best regards,<br>
          The Vendetta Roasting Team</p>
        </div>
        
        <div class="footer">
          <p>Vendetta Roasting - Premium Coffee Roasters</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
    Thank You for Contacting Us - Vendetta Roasting
    
    Hi ${name},
    
    Thank you for reaching out to us! We've received your message regarding "${subject}" and will get back to you as soon as possible.
    
    We typically respond within 24-48 hours during business days.
    
    If you have any urgent questions, please feel free to call us at (206) 555-1234.
    
    Best regards,
    The Vendetta Roasting Team
  `

  return {
    to: email,
    from: FROM_EMAIL,
    subject: `Thank You for Contacting Vendetta Roasting`,
    html,
    text
  }
}

// Email template for wholesale application (to admin)
export interface WholesaleApplicationData {
  businessName: string
  contactName: string
  email: string
  phone: string
  businessAddress: string
  businessType: string
  message: string
}

export const createWholesaleApplicationEmail = (data: WholesaleApplicationData): EmailData => {
  const { businessName, contactName, email, phone, businessAddress, businessType, message } = data

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
        .header { background-color: #8B4513; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #8B4513; }
        .value { margin-top: 5px; padding: 10px; background-color: white; border-radius: 5px; }
        .message { white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>☕ Vendetta Roasting</h1>
          <h2>New Wholesale Application</h2>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="label">Business Name:</div>
            <div class="value">${businessName}</div>
          </div>
          
          <div class="field">
            <div class="label">Contact Name:</div>
            <div class="value">${contactName}</div>
          </div>
          
          <div class="field">
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${email}">${email}</a></div>
          </div>
          
          <div class="field">
            <div class="label">Phone:</div>
            <div class="value"><a href="tel:${phone}">${phone}</a></div>
          </div>
          
          <div class="field">
            <div class="label">Business Type:</div>
            <div class="value">${businessType}</div>
          </div>
          
          <div class="field">
            <div class="label">Business Address:</div>
            <div class="value">${businessAddress}</div>
          </div>
          
          ${message ? `
          <div class="field">
            <div class="label">Additional Information:</div>
            <div class="value message">${message}</div>
          </div>
          ` : ''}
          
          <p style="margin-top: 30px;">
            <a href="mailto:${email}" style="background-color: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Contact ${contactName}
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
    New Wholesale Application - Vendetta Roasting
    
    Business Name: ${businessName}
    Contact Name: ${contactName}
    Email: ${email}
    Phone: ${phone}
    Business Type: ${businessType}
    Business Address: ${businessAddress}
    ${message ? `\nAdditional Information:\n${message}` : ''}
    
    Reply to: ${email}
  `

  return {
    to: ADMIN_EMAIL,
    from: FROM_EMAIL,
    replyTo: email,
    subject: `New Wholesale Application: ${businessName}`,
    html,
    text
  }
}

// Email template for wholesale application confirmation (to applicant)
export const createWholesaleApplicationConfirmation = (data: WholesaleApplicationData): EmailData => {
  const { businessName, contactName, email } = data

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
        .header { background-color: #8B4513; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>☕ Vendetta Roasting</h1>
          <h2>Wholesale Application Received</h2>
        </div>
        
        <div class="content">
          <p>Hi ${contactName},</p>
          
          <p>Thank you for your interest in becoming a wholesale partner with Vendetta Roasting!</p>
          
          <p>We've received your application for <strong>${businessName}</strong> and our team will review it within 2-3 business days.</p>
          
          <p>We'll contact you at ${email} once we've reviewed your application. If you have any questions in the meantime, please don't hesitate to reach out.</p>
          
          <p>Best regards,<br>
          The Vendetta Roasting Team</p>
        </div>
        
        <div class="footer">
          <p>Vendetta Roasting - Premium Coffee Roasters</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
    Wholesale Application Received - Vendetta Roasting
    
    Hi ${contactName},
    
    Thank you for your interest in becoming a wholesale partner with Vendetta Roasting!
    
    We've received your application for ${businessName} and our team will review it within 2-3 business days.
    
    We'll contact you at ${email} once we've reviewed your application. If you have any questions in the meantime, please don't hesitate to reach out.
    
    Best regards,
    The Vendetta Roasting Team
  `

  return {
    to: email,
    from: FROM_EMAIL,
    subject: `Wholesale Application Received - Vendetta Roasting`,
    html,
    text
  }
}

// Send email using Resend
export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    // If no API key is set, fall back to console logging (for development)
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY not set. Email will not be sent.')
      console.log('📧 EMAIL (SIMULATED):')
      console.log('To:', emailData.to)
      console.log('Subject:', emailData.subject)
      console.log('HTML Preview:', emailData.html.substring(0, 200) + '...')
      return true // Return true so the app doesn't break
    }

    const result = await resend.emails.send({
      from: emailData.from || FROM_EMAIL,
      to: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text || emailData.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      replyTo: emailData.replyTo,
    })

    if (result.error) {
      console.error('Resend API error:', result.error)
      return false
    }

    console.log('✅ Email sent successfully:', result.data?.id)
    return true
  } catch (error) {
    console.error('Email sending failed:', error)
    return false
  }
}

// Email template for low stock alert (to admin)
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
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

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
        .header { background-color: #ff6b6b; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .product { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #ff6b6b; }
        .product-name { font-weight: bold; color: #8B4513; }
        .inventory { color: #ff6b6b; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .button { display: inline-block; background-color: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Low Stock Alert</h1>
          <h2>Vendetta Roasting</h2>
        </div>
        
        <div class="content">
          <p>The following products are running low on inventory:</p>
          
          ${products.map(product => `
            <div class="product">
              <div class="product-name">${product.name}</div>
              <div>SKU: ${product.sku}</div>
              <div class="inventory">Current Stock: ${product.currentInventory} (Threshold: ${product.threshold})</div>
            </div>
          `).join('')}
          
          <p style="margin-top: 30px;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/products" class="button">
              View Products in Admin
            </a>
          </p>
        </div>
        
        <div class="footer">
          <p>Vendetta Roasting - Premium Coffee Roasters</p>
          <p>This is an automated alert. Please review and restock as needed.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Low Stock Alert - Vendetta Roasting
    
    The following products are running low on inventory:
    
    ${products.map(product => `
    ${product.name} (SKU: ${product.sku})
    Current Stock: ${product.currentInventory} (Threshold: ${product.threshold})
    `).join('\n')}
    
    View products in admin: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/products
  `;

  return {
    to: adminEmail,
    from: fromEmail,
    subject: `Low Stock Alert: ${products.length} Product${products.length > 1 ? 's' : ''} Need Restocking`,
    html,
    text
  }
}

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
        .header { background-color: #8B4513; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; }
        .order-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .tracking-box { background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .tracking-number { font-size: 18px; font-weight: bold; color: #2e7d32; margin: 10px 0; }
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
          <h3>Great news, ${customerName}!</h3>
          <p>Your order <strong>#${orderNumber}</strong> has been shipped and is on its way to you.</p>
          
          ${trackingNumber ? `
            <div class="tracking-box">
              <h4 style="margin-top: 0; color: #2e7d32;">📦 Tracking Information</h4>
              <div class="tracking-number">${trackingNumber}</div>
              ${trackingUrl ? `<p><a href="${trackingUrl}" style="color: #8B4513; text-decoration: none;">Track Your Package →</a></p>` : ''}
              <p style="margin-bottom: 0;"><strong>Estimated Delivery:</strong> ${estimatedDelivery}</p>
            </div>
          ` : `
            <div class="tracking-box">
              <p><strong>Estimated Delivery:</strong> ${estimatedDelivery}</p>
            </div>
          `}
          
          <div class="order-details">
            <h4>Items Shipped</h4>
            ${items.map(item => `
              <div class="item">
                <span>${item.name} × ${item.quantity}</span>
              </div>
            `).join('')}
            
            <h4 style="margin-top: 20px;">Shipping Address</h4>
            <p>
              ${shippingAddress.street}<br>
              ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}<br>
              ${shippingAddress.country}
            </p>
          </div>
          
          <p>You'll receive another email when your order is delivered. If you have any questions, please don't hesitate to contact us.</p>
          
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
    
    Great news, ${customerName}!
    
    Your order #${orderNumber} has been shipped and is on its way to you.
    
    ${trackingNumber ? `Tracking Number: ${trackingNumber}\n${trackingUrl ? `Track Your Package: ${trackingUrl}\n` : ''}` : ''}
    Estimated Delivery: ${estimatedDelivery}
    
    Items Shipped:
    ${items.map(item => `- ${item.name} × ${item.quantity}`).join('\n')}
    
    Shipping Address:
    ${shippingAddress.street}
    ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}
    ${shippingAddress.country}
    
    View order details: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/orders/${orderNumber}
    
    Thank you for choosing Vendetta Roasting!
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
    
    View order details: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/orders/${orderNumber}
    Shop again: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/shop
    
    Thank you for choosing Vendetta Roasting!
  `;

  return {
    to: customerEmail,
    from: fromEmail,
    subject: `Your Order #${orderNumber} Has Been Delivered! ✅`,
    html,
    text
  };
};
