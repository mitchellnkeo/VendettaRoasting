import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface AboutPageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string | null;
  howWeStartedTitle: string;
  howWeStartedContent: Array<{ paragraph: string }>;
  howWeStartedImage: string | null;
  missionTitle: string;
  missionContent: Array<{ paragraph: string }>;
  values: Array<{
    title: string;
    description: string;
    icon: string | null;
  }>;
  visitUsTitle: string;
  visitUsAddress: string;
  visitUsHours: string;
  visitUsContact: string;
}

export default function About() {
  const [content, setContent] = useState<AboutPageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content/aboutPage');
        const data = await response.json();
        if (data.success && data.data) {
          setContent(data.data);
        }
      } catch (error) {
        console.error('Error fetching about page content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

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
        <title>About Us | Vendetta Roasting</title>
        <meta name="description" content="Learn about Vendetta Roasting's passion for exceptional coffee and commitment to ethical sourcing" />
      </Head>

      <div className="bg-cream-light min-h-screen">
        {/* Hero Section */}
        <section className="bg-coffee-dark text-cream-light py-20 relative">
          {content.heroImage && (
            <div className="absolute inset-0 opacity-20">
              <Image src={content.heroImage} alt={content.heroTitle} fill className="object-cover" />
            </div>
          )}
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{content.heroTitle}</h1>
            <p className="text-xl max-w-3xl mx-auto">
              {content.heroSubtitle}
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* How We Started Image */}
              {content.howWeStartedImage && (
                <div className="mb-12">
                  <div className="relative h-96 w-full rounded-lg overflow-hidden">
                    <Image src={content.howWeStartedImage} alt={content.howWeStartedTitle} fill className="object-cover" />
                  </div>
                </div>
              )}

              {/* Our Story */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-coffee-dark mb-6">{content.howWeStartedTitle}</h2>
                <div className="space-y-4 text-coffee">
                  {content.howWeStartedContent.map((item, index) => (
                    <p key={index} className="text-lg leading-relaxed">
                      {item.paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Our Mission */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-coffee-dark mb-6">{content.missionTitle}</h2>
                <div className="space-y-4 text-coffee">
                  {content.missionContent.map((item, index) => (
                    <p key={index} className="text-lg leading-relaxed">
                      {item.paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Values Section */}
              {content.values && content.values.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {content.values.map((value, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                      {value.icon ? (
                        <div className="relative h-48 w-full rounded-lg mb-4 overflow-hidden">
                          <Image src={value.icon} alt={value.title} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="bg-coffee-light h-48 w-full rounded-lg mb-4 flex items-center justify-center">
                          <span className="text-cream-light text-sm">Icon</span>
                        </div>
                      )}
                      <h3 className="text-xl font-semibold text-coffee-dark mb-3">{value.title}</h3>
                      <p className="text-coffee">{value.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Location Section */}
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-coffee-dark mb-6">{content.visitUsTitle}</h2>
                <div className="space-y-4 text-coffee">
                  {content.visitUsAddress && (
                    <p className="text-lg">
                      <strong>Address:</strong><br />
                      {content.visitUsAddress.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < content.visitUsAddress.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  )}
                  {content.visitUsHours && (
                    <p className="text-lg">
                      <strong>Hours:</strong><br />
                      {content.visitUsHours.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < content.visitUsHours.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  )}
                  {content.visitUsContact && (
                    <p className="text-lg">
                      <strong>Contact:</strong><br />
                      {content.visitUsContact.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < content.visitUsContact.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}


