import SEO from '../components/SEO';
import Link from 'next/link';

export default function ShippingPolicy() {
  return (
    <>
      <SEO
        title="Shipping Policy"
        description="Shipping information, delivery times, and policies for Vendetta Roasting orders."
        canonical="/shipping-policy"
      />
      <div className="bg-cream-light min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-coffee-dark mb-8">Shipping Policy</h1>
          <p className="text-coffee mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">1. Shipping Methods</h2>
              <p className="text-coffee leading-relaxed mb-4">
                We offer various shipping options to meet your needs. Available shipping methods and rates will be displayed 
                at checkout based on your shipping address.
              </p>
              <p className="text-coffee leading-relaxed mb-4">
                Standard shipping methods include:
              </p>
              <ul className="list-disc list-inside text-coffee mb-4 space-y-2 ml-4">
                <li>Standard Ground Shipping</li>
                <li>Expedited Shipping (2-3 business days)</li>
                <li>Overnight Shipping (available for select locations)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">2. Processing Time</h2>
              <p className="text-coffee leading-relaxed mb-4">
                Orders are typically processed within 1-2 business days (Monday through Friday, excluding holidays). 
                Processing time begins after payment is confirmed.
              </p>
              <p className="text-coffee leading-relaxed mb-4">
                During peak seasons or promotional periods, processing may take longer. We will notify you if there are 
                any delays in processing your order.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">3. Delivery Time</h2>
              <p className="text-coffee leading-relaxed mb-4">
                Delivery times vary based on your location and the shipping method selected:
              </p>
              <ul className="list-disc list-inside text-coffee mb-4 space-y-2 ml-4">
                <li><strong>Standard Ground:</strong> 5-7 business days</li>
                <li><strong>Expedited:</strong> 2-3 business days</li>
                <li><strong>Overnight:</strong> 1 business day (if ordered before cutoff time)</li>
              </ul>
              <p className="text-coffee leading-relaxed mb-4">
                <strong>Note:</strong> Delivery times are estimates and do not include processing time. Actual delivery 
                times may vary due to weather, carrier delays, or other factors beyond our control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">4. Shipping Costs</h2>
              <p className="text-coffee leading-relaxed mb-4">
                Shipping costs are calculated based on:
              </p>
              <ul className="list-disc list-inside text-coffee mb-4 space-y-2 ml-4">
                <li>Shipping method selected</li>
                <li>Package weight and dimensions</li>
                <li>Destination address</li>
              </ul>
              <p className="text-coffee leading-relaxed mb-4">
                Shipping costs will be displayed at checkout before you complete your purchase. We may offer free shipping 
                promotions from time to time, which will be clearly indicated.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">5. Shipping Address</h2>
              <p className="text-coffee leading-relaxed mb-4">
                Please ensure your shipping address is correct at checkout. We are not responsible for orders shipped to 
                incorrect addresses provided by the customer.
              </p>
              <p className="text-coffee leading-relaxed mb-4">
                If you need to change your shipping address after placing an order, please contact us immediately. 
                We may be able to update the address if the order has not yet shipped.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">6. Order Tracking</h2>
              <p className="text-coffee leading-relaxed mb-4">
                Once your order ships, you will receive an email with tracking information. You can use this tracking 
                number to monitor your package's progress through the carrier's website.
              </p>
              <p className="text-coffee leading-relaxed mb-4">
                If you have questions about your shipment, please contact us with your order number.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">7. International Shipping</h2>
              <p className="text-coffee leading-relaxed mb-4">
                Currently, we primarily ship within the United States. For international shipping inquiries, please 
                <Link href="/contact" className="text-coffee-light hover:text-coffee-dark underline"> contact us</Link> 
                {' '}before placing your order.
              </p>
              <p className="text-coffee leading-relaxed mb-4">
                International orders may be subject to:
              </p>
              <ul className="list-disc list-inside text-coffee mb-4 space-y-2 ml-4">
                <li>Customs duties and taxes</li>
                <li>Additional shipping fees</li>
                <li>Longer delivery times</li>
                <li>Import restrictions</li>
              </ul>
              <p className="text-coffee leading-relaxed mb-4">
                The customer is responsible for all customs fees and import duties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">8. Lost or Damaged Packages</h2>
              <p className="text-coffee leading-relaxed mb-4">
                If your package is lost or damaged during shipping, please contact us immediately. We will work with 
                the shipping carrier to resolve the issue.
              </p>
              <p className="text-coffee leading-relaxed mb-4">
                We recommend inspecting your package upon delivery. If you notice any damage, please take photos and 
                contact us within 48 hours of delivery.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">9. Undeliverable Packages</h2>
              <p className="text-coffee leading-relaxed mb-4">
                If a package is returned to us as undeliverable, we will contact you to arrange reshipment. Additional 
                shipping fees may apply for reshipment.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">10. Wholesale Orders</h2>
              <p className="text-coffee leading-relaxed mb-4">
                Wholesale orders may have different shipping terms and arrangements. Please refer to your wholesale 
                agreement or contact your account representative for specific shipping information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">11. Contact Us</h2>
              <p className="text-coffee leading-relaxed mb-4">
                If you have questions about shipping, please contact us:
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

