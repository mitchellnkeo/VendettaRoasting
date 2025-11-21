import Head from 'next/head';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ContactPageContent {
  heroTitle: string;
  heroSubtitle: string;
  getInTouchTitle: string;
  locationTitle: string;
  locationAddress: string;
  hoursTitle: string;
  hours: string;
  contactTitle: string;
  contactInfo: string;
  mapImage: string | null;
  mapEmbedUrl: string | null;
  formTitle: string;
  formSuccessMessage: string;
}

export default function Contact() {
  const [content, setContent] = useState<ContactPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content/contactPage');
        const data = await response.json();
        if (data.success && data.data) {
          setContent(data.data);
        }
      } catch (error) {
        console.error('Error fetching contact page content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

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
        <title>Contact Us | Vendetta Roasting</title>
        <meta name="description" content="Get in touch with Vendetta Roasting. We'd love to hear from you!" />
      </Head>

      <div className="bg-cream-light min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-coffee-dark mb-4">{content.heroTitle}</h1>
              <p className="text-lg text-coffee max-w-2xl mx-auto">
                {content.heroSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-coffee-dark mb-6">{content.getInTouchTitle}</h2>
                
                <div className="space-y-6 mb-8">
                  {content.locationAddress && (
                    <div>
                      <h3 className="text-lg font-semibold text-coffee-dark mb-2">{content.locationTitle}</h3>
                      <p className="text-coffee whitespace-pre-line">
                        {content.locationAddress}
                      </p>
                    </div>
                  )}
                  
                  {content.hours && (
                    <div>
                      <h3 className="text-lg font-semibold text-coffee-dark mb-2">{content.hoursTitle}</h3>
                      <p className="text-coffee whitespace-pre-line">
                        {content.hours}
                      </p>
                    </div>
                  )}
                  
                  {content.contactInfo && (
                    <div>
                      <h3 className="text-lg font-semibold text-coffee-dark mb-2">{content.contactTitle}</h3>
                      <p className="text-coffee whitespace-pre-line">
                        {content.contactInfo.split('\n').map((line, i) => {
                          // Extract email and phone links
                          const emailMatch = line.match(/Email:\s*(.+)/);
                          const phoneMatch = line.match(/Phone:\s*(.+)/);
                          if (emailMatch) {
                            return (
                              <span key={i}>
                                Email:{' '}
                                <a href={`mailto:${emailMatch[1]}`} className="text-coffee hover:text-coffee-light underline">
                                  {emailMatch[1]}
                                </a>
                                {i < content.contactInfo.split('\n').length - 1 && <br />}
                              </span>
                            );
                          }
                          if (phoneMatch) {
                            return (
                              <span key={i}>
                                Phone:{' '}
                                <a href={`tel:${phoneMatch[1].replace(/\D/g, '')}`} className="text-coffee hover:text-coffee-light underline">
                                  {phoneMatch[1]}
                                </a>
                                {i < content.contactInfo.split('\n').length - 1 && <br />}
                              </span>
                            );
                          }
                          return (
                            <span key={i}>
                              {line}
                              {i < content.contactInfo.split('\n').length - 1 && <br />}
                            </span>
                          );
                        })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Map */}
                {content.mapEmbedUrl ? (
                  <div className="h-64 w-full rounded-lg overflow-hidden">
                    <iframe
                      src={content.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                ) : content.mapImage ? (
                  <div className="relative h-64 w-full rounded-lg overflow-hidden">
                    <Image src={content.mapImage} alt="Map" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="bg-gray-300 h-64 w-full rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Map Placeholder</span>
                  </div>
                )}
              </div>

              {/* Contact Form */}
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-coffee-dark mb-6">{content.formTitle}</h2>
                
                {submitted ? (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {content.formSuccessMessage}
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

