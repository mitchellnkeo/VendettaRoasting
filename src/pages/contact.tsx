import Head from 'next/head';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder form submission
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Head>
        <title>Contact Us | Vendetta Roasting</title>
        <meta name="description" content="Get in touch with Vendetta Roasting. We'd love to hear from you!" />
      </Head>

      <div className="bg-cream-light min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-coffee-dark mb-4">Contact Us</h1>
              <p className="text-lg text-coffee max-w-2xl mx-auto">
                Have a question? Want to learn more about our coffee? We'd love to hear from you!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-coffee-dark mb-6">Get in Touch</h2>
                
                <div className="space-y-6 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-coffee-dark mb-2">Location</h3>
                    <p className="text-coffee">
                      123 Coffee Street<br />
                      Seattle, WA 98101
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-coffee-dark mb-2">Hours</h3>
                    <p className="text-coffee">
                      Monday - Friday: 7:00 AM - 6:00 PM<br />
                      Saturday - Sunday: 8:00 AM - 5:00 PM
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-coffee-dark mb-2">Contact</h3>
                    <p className="text-coffee">
                      Email: <a href="mailto:info@vendettaroasting.com" className="text-coffee hover:text-coffee-light underline">info@vendettaroasting.com</a><br />
                      Phone: <a href="tel:+12065551234" className="text-coffee hover:text-coffee-light underline">(206) 555-1234</a>
                    </p>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-gray-300 h-64 w-full rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Map Placeholder</span>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-coffee-dark mb-6">Send us a Message</h2>
                
                {submitted ? (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    Thank you for your message! We'll get back to you soon.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-coffee-dark mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-coffee-dark mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-coffee-dark mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee focus:border-transparent"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="wholesale">Wholesale Inquiry</option>
                        <option value="subscription">Subscription Question</option>
                        <option value="order">Order Question</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-coffee-dark mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee focus:border-transparent"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-coffee hover:bg-coffee-light text-cream-light px-6 py-3 rounded-md font-medium transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

