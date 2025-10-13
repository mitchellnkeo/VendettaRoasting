import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function Wholesale() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessAddress: '',
    businessType: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would submit the form data to the server
    console.log('Form submitted:', formData);
    alert('Thank you for your interest in our wholesale program! We will review your application and get back to you soon.');
  };

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
              Wholesale Coffee Solutions
            </h1>
            <p className="text-xl text-cream mb-8">
              Partner with Vendetta Roasting to bring exceptional coffee to your business.
              We offer competitive pricing, reliable delivery, and dedicated support.
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
              <h2 className="text-3xl font-bold text-coffee-dark mb-6">Why Partner With Us?</h2>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="bg-coffee text-cream-light p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-coffee-dark mb-2">Quality & Consistency</h3>
                    <p className="text-coffee">
                      Our rigorous quality control ensures that every batch of coffee meets our high standards.
                      Your customers will enjoy the same exceptional experience with every cup.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-coffee text-cream-light p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-coffee-dark mb-2">Freshly Roasted</h3>
                    <p className="text-coffee">
                      Coffee is roasted to order and delivered within days of roasting, ensuring maximum freshness and flavor.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-coffee text-cream-light p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-coffee-dark mb-2">Dedicated Support</h3>
                    <p className="text-coffee">
                      Our wholesale team is here to help you select the right coffees, troubleshoot equipment issues, 
                      and provide barista training to ensure your success.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-coffee text-cream-light p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-coffee-dark mb-2">Seattle Area Delivery</h3>
                    <p className="text-coffee">
                      We offer pickup options and delivery within the Seattle area to ensure your business 
                      never runs out of great coffee.
                    </p>
                  </div>
                </div>
              </div>

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
                    className="w-full bg-coffee hover:bg-coffee-light text-cream-light py-3 rounded-md transition-colors"
                  >
                    Submit Application
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
