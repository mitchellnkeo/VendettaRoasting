import SEO from '../components/SEO';
import Link from 'next/link';

export default function ReturnPolicy() {
  return (
    <>
      <SEO
        title="Return & Refund Policy"
        description="Return and refund policy for Vendetta Roasting products."
        canonical="/return-policy"
      />
      <div className="bg-cream-light min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-coffee-dark mb-8">Return & Refund Policy</h1>
          <p className="text-coffee mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">1. Return Eligibility</h2>
              <p className="text-coffee leading-relaxed mb-4">
                We want you to be completely satisfied with your purchase. If you are not satisfied, you may return 
                eligible items within 30 days of delivery for a refund or exchange.
              </p>
              <p className="text-coffee leading-relaxed mb-4">
                To be eligible for a return, items must be:
              </p>
              <ul className="list-disc list-inside text-coffee mb-4 space-y-2 ml-4">
                <li>Unopened and in original packaging</li>
                <li>In the same condition as when received</li>
                <li>Returned within 30 days of delivery</li>
                <li>Accompanied by proof of purchase (order number or receipt)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">2. Non-Returnable Items</h2>
              <p className="text-coffee leading-relaxed mb-4">
                The following items are not eligible for return:
              </p>
              <ul className="list-disc list-inside text-coffee mb-4 space-y-2 ml-4">
                <li>Opened or used products</li>
                <li>Perishable items (coffee beans that have been opened)</li>
                <li>Items damaged by customer misuse</li>
                <li>Items returned more than 30 days after delivery</li>
                <li>Items without proof of purchase</li>
                <li>Custom or personalized items</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">3. How to Initiate a Return</h2>
              <p className="text-coffee leading-relaxed mb-4">
                To initiate a return, please follow these steps:
              </p>
              <ol className="list-decimal list-inside text-coffee mb-4 space-y-2 ml-4">
                <li>Contact us at <Link href="/contact" className="text-coffee-light hover:text-coffee-dark underline">our contact page</Link> or email us with your order number</li>
                <li>Provide your order number and reason for return</li>
                <li>We will send you a Return Authorization (RA) number and return instructions</li>
                <li>Package the item securely in its original packaging</li>
                <li>Include the RA number on the outside of the package</li>
                <li>Ship the return to the address provided</li>
              </ol>
              <p className="text-coffee leading-relaxed mb-4">
                <strong>Important:</strong> Returns without a Return Authorization number may not be processed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">4. Return Shipping</h2>
              <p className="text-coffee leading-relaxed mb-4">
                Return shipping costs are the responsibility of the customer unless the return is due to our error 
                (wrong item shipped, defective product, etc.).
              </p>
              <p className="text-coffee leading-relaxed mb-4">
                We recommend using a trackable shipping method for returns. We are not responsible for items lost 
                during return shipping.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">5. Refund Process</h2>
              <p className="text-coffee leading-relaxed mb-4">
                Once we receive and inspect your return, we will process your refund:
              </p>
              <ul className="list-disc list-inside text-coffee mb-4 space-y-2 ml-4">
                <li>Refunds will be issued to the original payment method</li>
                <li>Processing time: 5-10 business days after we receive the returned item</li>
                <li>You will receive an email confirmation when the refund is processed</li>
                <li>It may take additional time for the refund to appear in your account (depending on your bank or credit card company)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">6. Refund Amount</h2>
              <p className="text-coffee leading-relaxed mb-4">
                Refunds will include:
              </p>
              <ul className="list-disc list-inside text-coffee mb-4 space-y-2 ml-4">
                <li>The purchase price of the returned item(s)</li>
                <li>Original shipping costs (if the entire order is returned)</li>
              </ul>
              <p className="text-coffee leading-relaxed mb-4">
                Refunds will NOT include:
              </p>
              <ul className="list-disc list-inside text-coffee mb-4 space-y-2 ml-4">
                <li>Return shipping costs (unless the return is due to our error)</li>
                <li>Any discounts or promotions applied to the original order</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">7. Exchanges</h2>
              <p className="text-coffee leading-relaxed mb-4">
                We currently do not offer direct exchanges. If you would like a different item, please return the 
                original item for a refund and place a new order for the desired item.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">8. Defective or Damaged Items</h2>
              <p className="text-coffee leading-relaxed mb-4">
                If you receive a defective or damaged item, please contact us immediately. We will:
              </p>
              <ul className="list-disc list-inside text-coffee mb-4 space-y-2 ml-4">
                <li>Send a replacement item at no cost to you</li>
                <li>Provide a prepaid return label for the defective item</li>
                <li>Process a full refund if a replacement is not available</li>
              </ul>
              <p className="text-coffee leading-relaxed mb-4">
                Please include photos of the damage or defect when contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">9. Wrong Item Received</h2>
              <p className="text-coffee leading-relaxed mb-4">
                If you receive the wrong item, please contact us immediately. We will:
              </p>
              <ul className="list-disc list-inside text-coffee mb-4 space-y-2 ml-4">
                <li>Send the correct item at no cost to you</li>
                <li>Provide a prepaid return label for the incorrect item</li>
                <li>Process a full refund if the correct item is not available</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">10. Cancellations</h2>
              <p className="text-coffee leading-relaxed mb-4">
                You may cancel an order before it ships. Once an order has shipped, it cannot be cancelled and must 
                be returned using our standard return process.
              </p>
              <p className="text-coffee leading-relaxed mb-4">
                To cancel an order, please contact us as soon as possible with your order number.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">11. Subscription Cancellations</h2>
              <p className="text-coffee leading-relaxed mb-4">
                If you have a subscription, you can cancel it at any time through your account dashboard or by 
                contacting us. Cancellations will take effect at the end of your current billing cycle.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">12. Contact Us</h2>
              <p className="text-coffee leading-relaxed mb-4">
                If you have questions about returns or refunds, please contact us:
              </p>
              <div className="bg-cream p-6 rounded-xl mt-4">
                <p className="text-coffee font-semibold mb-2">Vendetta Roasting</p>
                <p className="text-coffee mb-2">
                  Email: <Link href="/contact" className="text-coffee-light hover:text-coffee-dark underline">Contact Us</Link>
                </p>
                <p className="text-coffee">
                  Website: <Link href="/" className="text-coffee-light hover:text-coffee-dark underline">vendettaroasting.com</Link>
                </p>
              </div>
            </section>
          </div>

          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="inline-block bg-coffee hover:bg-coffee-light text-cream-light px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-soft hover:shadow-warm"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

