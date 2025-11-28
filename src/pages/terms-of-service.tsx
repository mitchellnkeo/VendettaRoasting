import SEO from '../components/SEO';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <>
      <SEO
        title="Terms of Service"
        description="Terms and conditions for using Vendetta Roasting's website and services."
        canonical="/terms-of-service"
      />
      <div className="bg-cream-light min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-coffee-dark mb-8">Terms of Service</h1>
          <p className="text-coffee mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">1. Agreement to Terms</h2>
              <p className="text-coffee leading-relaxed mb-4">
                By accessing or using the Vendetta Roasting website, you agree to be bound by these Terms of Service 
                and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited 
                from using or accessing this site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">2. Use License</h2>
              <p className="text-coffee leading-relaxed mb-4">
                Permission is granted to temporarily access and use the Vendetta Roasting website for personal, 
                non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-coffee mb-4 space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">3. Products and Pricing</h2>
              <p className="text-coffee leading-relaxed mb-4">
                We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant 
                that product descriptions, images, or other content on the site is accurate, complete, reliable, current, 
                or error-free.
              </p>
              <p className="text-coffee leading-relaxed mb-4">
                We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information 
                at any time without prior notice. We also reserve the right to refuse or cancel any orders placed for products 
                listed at incorrect prices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">4. Orders and Payment</h2>
              <h3 className="text-xl font-semibold text-coffee mb-3">Order Acceptance</h3>
              <p className="text-coffee leading-relaxed mb-4">
                Your order is an offer to purchase products from us. We reserve the right to accept or reject your order 
                for any reason, including product availability, errors in pricing or product information, or suspected fraud.
              </p>

              <h3 className="text-xl font-semibold text-coffee mb-3 mt-6">Payment</h3>
              <p className="text-coffee leading-relaxed mb-4">
                Payment must be received by us before we ship your order. We accept payment through Stripe, which accepts 
                major credit cards. All prices are in USD unless otherwise stated.
              </p>

              <h3 className="text-xl font-semibold text-coffee mb-3 mt-6">Order Confirmation</h3>
              <p className="text-coffee leading-relaxed mb-4">
                After placing an order, you will receive an email confirmation. This confirmation does not constitute our 
                acceptance of your order. We will send a separate email when your order ships.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">5. Shipping and Delivery</h2>
              <p className="text-coffee leading-relaxed mb-4">
                Shipping terms, costs, and delivery times are provided at checkout and in our <Link href="/shipping-policy" className="text-coffee-light hover:text-coffee-dark underline">Shipping Policy</Link>. 
                We are not responsible for delays caused by shipping carriers or customs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">6. Returns and Refunds</h2>
              <p className="text-coffee leading-relaxed mb-4">
                Our return and refund policy is detailed in our <Link href="/return-policy" className="text-coffee-light hover:text-coffee-dark underline">Return Policy</Link>. 
                Please review this policy before making a purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">7. User Accounts</h2>
              <p className="text-coffee leading-relaxed mb-4">
                When you create an account with us, you are responsible for maintaining the security of your account and password. 
                You agree to accept responsibility for all activities that occur under your account.
              </p>
              <p className="text-coffee leading-relaxed mb-4">
                You must notify us immediately of any unauthorized use of your account or any other breach of security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">8. Prohibited Uses</h2>
              <p className="text-coffee leading-relaxed mb-4">You may not use our website:</p>
              <ul className="list-disc list-inside text-coffee mb-4 space-y-2 ml-4">
                <li>In any way that violates any applicable law or regulation</li>
                <li>To transmit any malicious code, viruses, or harmful materials</li>
                <li>To collect or track personal information of others</li>
                <li>To spam, phish, or engage in any fraudulent activity</li>
                <li>To interfere with or disrupt the website or servers</li>
                <li>To impersonate or attempt to impersonate another person or entity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">9. Intellectual Property</h2>
              <p className="text-coffee leading-relaxed mb-4">
                All content on this website, including text, graphics, logos, images, and software, is the property of 
                Vendetta Roasting or its content suppliers and is protected by copyright, trademark, and other intellectual 
                property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">10. Disclaimer</h2>
              <p className="text-coffee leading-relaxed mb-4">
                THE MATERIALS ON VENDETTA ROASTING'S WEBSITE ARE PROVIDED ON AN 'AS IS' BASIS. VENDETTA ROASTING MAKES NO WARRANTIES, 
                EXPRESSED OR IMPLIED, AND HEREBY DISCLAIMS AND NEGATES ALL OTHER WARRANTIES INCLUDING, WITHOUT LIMITATION, IMPLIED 
                WARRANTIES OR CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT OF INTELLECTUAL 
                PROPERTY OR OTHER VIOLATION OF RIGHTS.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">11. Limitation of Liability</h2>
              <p className="text-coffee leading-relaxed mb-4">
                IN NO EVENT SHALL VENDETTA ROASTING OR ITS SUPPLIERS BE LIABLE FOR ANY DAMAGES (INCLUDING, WITHOUT LIMITATION, 
                DAMAGES FOR LOSS OF DATA OR PROFIT, OR DUE TO BUSINESS INTERRUPTION) ARISING OUT OF THE USE OR INABILITY TO USE 
                THE MATERIALS ON VENDETTA ROASTING'S WEBSITE, EVEN IF VENDETTA ROASTING OR A VENDETTA ROASTING AUTHORIZED 
                REPRESENTATIVE HAS BEEN NOTIFIED ORALLY OR IN WRITING OF THE POSSIBILITY OF SUCH DAMAGE.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">12. Indemnification</h2>
              <p className="text-coffee leading-relaxed mb-4">
                You agree to indemnify and hold harmless Vendetta Roasting, its officers, directors, employees, and agents from 
                any claims, damages, losses, liabilities, and expenses (including legal fees) arising out of your use of the website 
                or violation of these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">13. Governing Law</h2>
              <p className="text-coffee leading-relaxed mb-4">
                These Terms of Service shall be governed by and construed in accordance with the laws of the state of Washington, 
                United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">14. Changes to Terms</h2>
              <p className="text-coffee leading-relaxed mb-4">
                We reserve the right to modify these Terms of Service at any time. We will notify you of any changes by posting 
                the new Terms of Service on this page and updating the "Last updated" date. Your continued use of the website 
                after any changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">15. Contact Information</h2>
              <p className="text-coffee leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
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

