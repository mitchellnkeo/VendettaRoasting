import { useState, useEffect } from 'react';
import SEO from '../components/SEO';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/content/faqs');
      const data = await response.json();
      
      if (data.success) {
        setFaqs(data.data);
      } else {
        setError(data.message || 'Failed to load FAQs');
      }
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(faqs.map((faq) => faq.category)))];
  
  const filteredFaqs = selectedCategory === 'all'
    ? faqs
    : faqs.filter((faq) => faq.category === selectedCategory);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <>
      <SEO
        title="Frequently Asked Questions"
        description="Find answers to frequently asked questions about Vendetta Roasting, our products, shipping, subscriptions, and more."
        url="/faq"
      />

      <div className="bg-cream-light min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-coffee-dark mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-coffee">
              Find answers to common questions about our coffee, shipping, and services
            </p>
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-coffee">Loading FAQs...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Category Filter */}
              <div className="mb-8 flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      selectedCategory === category
                        ? 'bg-coffee text-cream-light'
                        : 'bg-white text-coffee hover:bg-coffee-light hover:text-cream-light'
                    }`}
                  >
                    {formatCategory(category)}
                  </button>
                ))}
              </div>

              {/* FAQs List */}
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-coffee">No FAQs found in this category.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <div
                      key={faq._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(faq._id)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-cream transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-coffee-dark pr-4">
                          {faq.question}
                        </h3>
                        <span className="text-coffee text-2xl flex-shrink-0">
                          {openFaq === faq._id ? '−' : '+'}
                        </span>
                      </button>
                      {openFaq === faq._id && (
                        <div className="px-6 py-4 border-t border-gray-200">
                          <p className="text-coffee whitespace-pre-line">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

