import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface WholesalePageContent {
  heroTitle: string;
  heroSubtitle: string;
  whyPartnerTitle: string;
  benefits: Array<{
    title: string;
    description: string;
    icon: string | null;
  }>;
  additionalContent: Array<{
    title: string;
    content: Array<{ paragraph: string }>;
    image: string | null;
  }>;
}

// Helper function to render icon SVG
const renderIcon = (iconName: string | null | undefined) => {
  if (!iconName) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  }

  const iconMap: Record<string, JSX.Element> = {
    checkmark: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    clock: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    users: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    cart: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  };

  return iconMap[iconName] || iconMap.checkmark;
};

export default function Wholesale() {
  const [content, setContent] = useState<WholesalePageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessAddress: '',
    businessType: '',
    message: ''
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content/wholesalePage');
        const data = await response.json();
        if (data.success && data.data) {
          setContent(data.data);
        }
      } catch (error) {
        console.error('Error fetching wholesale page content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/wholesale/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(true);
        setFormData({
          businessName: '',
          contactName: '',
          email: '',
          phone: '',
          businessAddress: '',
          businessType: '',
          message: ''
        });
        // Reset success message after 10 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 10000);
      } else {
        setSubmitError(data.message || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting wholesale application:', error);
      setSubmitError('An error occurred. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !content) {
    return (
      <div className="bg-cream-light min-h-screen flex items-center justify-center">
        <div className="text-coffee">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Wholesale | Vendetta Roasting</title>
        <meta name="description" content="Wholesale coffee solutions for your business" />
      </Head>

      {/* Hero Section */}
      <section className="relative h-[50vh] bg-coffee-dark flex items-center">
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div className="container mx-auto px-4 z-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-cream-light mb-6">
              {content.heroTitle}
            </h1>
            <p className="text-xl text-cream mb-8">
              {content.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-cream-light">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Information Column */}
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-coffee-dark mb-6">{content.whyPartnerTitle}</h2>
              
              <div className="space-y-8">
                {content.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-coffee text-cream-light p-3 rounded-full mr-4 flex-shrink-0">
                      {renderIcon(benefit.icon)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-coffee-dark mb-2">{benefit.title}</h3>
                      <p className="text-coffee">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Content Sections */}
              {content.additionalContent && content.additionalContent.length > 0 && (
                <div className="mt-12 space-y-8">
                  {content.additionalContent.map((section, index) => (
                    <div key={index}>
                      {section.image && (
                        <div className="relative h-64 w-full rounded-lg overflow-hidden mb-4">
                          <Image src={section.image} alt={section.title} fill className="object-cover" />
                        </div>
                      )}
                      <h3 className="text-2xl font-bold text-coffee-dark mb-4">{section.title}</h3>
                      {section.content && section.content.map((item, i) => (
                        <p key={i} className="text-coffee mb-4">{item.paragraph}</p>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-12 p-6 bg-coffee text-cream-light rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Already a wholesale partner?</h3>
                <p className="mb-4">Log in to your account to place orders, view invoices, and manage your subscription.</p>
                <Link href="/wholesale/login" className="inline-block bg-cream-light text-coffee px-6 py-3 rounded-md hover:bg-cream hover:text-coffee-dark transition-colors">
                  Wholesale Login
                </Link>
              </div>
            </div>

            {/* Application Form */}
            <div className="lg:w-1/2">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-coffee-dark mb-6">Apply for Wholesale Account</h2>
                
                {submitSuccess && (
                  <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    Thank you for your interest! We'll review your application and get back to you within 2-3 business days.
                  </div>
                )}
                
                {submitError && (
                  <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {submitError}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="businessName" className="block text-coffee-dark mb-2">Business Name*</label>
                      <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="contactName" className="block text-coffee-dark mb-2">Contact Name*</label>
                      <input
                        type="text"
                        id="contactName"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-coffee-dark mb-2">Email Address*</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-coffee-dark mb-2">Phone Number*</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="businessAddress" className="block text-coffee-dark mb-2">Business Address*</label>
                    <input
                      type="text"
                      id="businessAddress"
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="businessType" className="block text-coffee-dark mb-2">Business Type*</label>
                    <select
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                      required
                    >
                      <option value="">Select business type</option>
                      <option value="cafe">Café</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="hotel">Hotel</option>
                      <option value="office">Office</option>
                      <option value="retail">Retail Store</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-coffee-dark mb-2">Additional Information</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee"
                      placeholder="Tell us about your business and your coffee needs..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-coffee hover:bg-coffee-light text-cream-light py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
