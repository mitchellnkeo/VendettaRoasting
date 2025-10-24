// Email service configuration
// For production, you would use a real email service like SendGrid, Mailgun, or AWS SES

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
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
    subject: `Order Confirmation #${orderId} - Vendetta Roasting`,
    html,
    text
  }
}

// Simulate email sending (in production, integrate with real email service)
export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    // In production, you would:
    // 1. Use SendGrid, Mailgun, AWS SES, or similar service
    // 2. Replace this simulation with actual email sending
    
    console.log('📧 EMAIL CONFIRMATION SENT:')
    console.log('To:', emailData.to)
    console.log('Subject:', emailData.subject)
    console.log('HTML Preview:', emailData.html.substring(0, 200) + '...')
    console.log('---')
    
    // Simulate email service delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return true
  } catch (error) {
    console.error('Email sending failed:', error)
    return false
  }
}
