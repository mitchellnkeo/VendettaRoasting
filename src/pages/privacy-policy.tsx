import SEO from '../components/SEO';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Vendetta Roasting's privacy policy. Learn how we collect, use, and protect your personal information."
        canonical="/privacy-policy"
      />
      <div className="bg-cream-light min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-coffee-dark mb-8">Privacy Policy</h1>
          <p className="text-coffee mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">1. Introduction</h2>
              <p className="text-coffee leading-relaxed mb-4">
                Welcome to Vendetta Roasting. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy explains how we collect, use, and safeguard your information when you visit our website 
                or make a purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold text-coffee mb-3">Personal Information</h3>
              <p className="text-coffee leading-relaxed mb-4">
                When you make a purchase or attempt to make a purchase through our site, we collect the following information:
              </p>
              <ul className="list-disc list-inside text-coffee mb-4 space-y-2 ml-4">
                <li>Name</li>
                <li>Email address</li>
                <li>Billing address</li>
                <li>Shipping address</li>
                <li>Phone number</li>
                <li>Payment information (processed securely through Stripe)</li>
              </ul>

              <h3 className="text-xl font-semibold text-coffee mb-3 mt-6">Automatically Collected Information</h3>
              <p className="text-coffee leading-relaxed mb-4">
                When you visit our website, we automatically collect certain information about your device, including:
              </p>
              <ul className="list-disc list-inside text-coffee mb-4 space-y-2 ml-4">
                <li>Web browser type and version</li>
                <li>IP address</li>
                <li>Time zone</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Pages you visit and how you interact with our site</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">3. How We Use Your Information</h2>
              <p className="text-coffee leading-relaxed mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-coffee mb-4 space-y-2 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Send you order confirmations and updates</li>
                <li>Communicate with you about your orders, products, and services</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Improve our website and user experience</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Detect and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">4. Third-Party Services</h2>
              <p className="text-coffee leading-relaxed mb-4">
                We use trusted third-party services to operate our business:
              </p>
              <ul className="list-disc list-inside text-coffee mb-4 space-y-2 ml-4">
                <li><strong>Stripe:</strong> Payment processing. Your payment information is securely processed by Stripe and never stored on our servers.</li>
                <li><strong>Sanity:</strong> Content management system for our website.</li>
                <li><strong>Resend:</strong> Email delivery service for transactional emails.</li>
                <li><strong>Vercel:</strong> Website hosting and deployment platform.</li>
                <li><strong>Google reCAPTCHA:</strong> Bot protection and spam prevention.</li>
              </ul>
              <p className="text-coffee leading-relaxed mb-4">
                These services have their own privacy policies, and we encourage you to review them.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">5. Cookies</h2>
              <p className="text-coffee leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our website. 
                Cookies are small data files stored on your device that help us:
              </p>
              <ul className="list-disc list-inside text-coffee mb-4 space-y-2 ml-4">
                <li>Remember your preferences</li>
                <li>Keep you logged in to your account</li>
                <li>Analyze website traffic and usage</li>
                <li>Provide personalized content</li>
              </ul>
              <p className="text-coffee leading-relaxed mb-4">
                You can control cookies through your browser settings. However, disabling cookies may limit 
                your ability to use certain features of our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">6. Data Security</h2>
              <p className="text-coffee leading-relaxed mb-4">
                We implement appropriate technical and organizational measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
                over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">7. Your Rights</h2>
              <p className="text-coffee leading-relaxed mb-4">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc list-inside text-coffee mb-4 space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Objection:</strong> Object to processing of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Withdrawal:</strong> Withdraw consent for data processing where applicable</li>
              </ul>
              <p className="text-coffee leading-relaxed mb-4">
                To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">8. Data Retention</h2>
              <p className="text-coffee leading-relaxed mb-4">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this 
                privacy policy, unless a longer retention period is required or permitted by law. When we no longer 
                need your information, we will securely delete or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">9. Children's Privacy</h2>
              <p className="text-coffee leading-relaxed mb-4">
                Our website is not intended for children under the age of 13. We do not knowingly collect personal 
                information from children. If you believe we have collected information from a child, please contact 
                us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">10. Changes to This Policy</h2>
              <p className="text-coffee leading-relaxed mb-4">
                We may update this privacy policy from time to time. We will notify you of any changes by posting 
                the new policy on this page and updating the "Last updated" date. We encourage you to review this 
                policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-coffee-dark mb-4">11. Contact Us</h2>
              <p className="text-coffee leading-relaxed mb-4">
                If you have any questions about this privacy policy or our data practices, please contact us:
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

