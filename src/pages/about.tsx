import Head from 'next/head';
import Image from 'next/image';

export default function About() {
  return (
    <>
      <Head>
        <title>About Us | Vendetta Roasting</title>
        <meta name="description" content="Learn about Vendetta Roasting's passion for exceptional coffee and commitment to ethical sourcing" />
      </Head>

      <div className="bg-cream-light min-h-screen">
        {/* Hero Section */}
        <section className="bg-coffee-dark text-cream-light py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Crafting exceptional coffee with passion, precision, and a commitment to ethical sourcing
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Image Placeholder */}
              <div className="mb-12">
                <div className="bg-gray-300 h-96 w-full rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-lg">Roasting Facility Image</span>
                </div>
              </div>

              {/* Our Story */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-coffee-dark mb-6">How We Started</h2>
                <div className="space-y-4 text-coffee">
                  <p className="text-lg leading-relaxed">
                    Vendetta Roasting was born from a passion for exceptional coffee and a commitment to ethical sourcing. 
                    Our journey began in a small garage in Seattle, where we experimented with different roasting techniques 
                    to bring out the unique characteristics of each bean.
                  </p>
                  <p className="text-lg leading-relaxed">
                    What started as a weekend hobby quickly grew into a mission to share the world's finest coffees with our 
                    community. We discovered that great coffee isn't just about the beans—it's about the relationships we build 
                    with farmers, the care we take in roasting, and the joy we bring to every cup.
                  </p>
                </div>
              </div>

              {/* Our Mission */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-coffee-dark mb-6">Our Mission</h2>
                <div className="space-y-4 text-coffee">
                  <p className="text-lg leading-relaxed">
                    Today, we work directly with farmers around the world to source the finest beans, paying fair prices and 
                    supporting sustainable farming practices. We believe that great coffee should be accessible to everyone, 
                    which is why we're committed to transparency in our sourcing and fair pricing in our business.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Every batch we roast is carefully crafted to highlight the unique flavors and characteristics of each origin. 
                    We're not just selling coffee—we're sharing stories, building community, and celebrating the art of roasting.
                  </p>
                </div>
              </div>

              {/* Values Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="bg-coffee-light h-48 w-full rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-cream-light text-sm">Quality Icon</span>
                  </div>
                  <h3 className="text-xl font-semibold text-coffee-dark mb-3">Quality First</h3>
                  <p className="text-coffee">
                    We source only the finest beans and roast them with precision to bring out their best flavors.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="bg-coffee-light h-48 w-full rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-cream-light text-sm">Ethics Icon</span>
                  </div>
                  <h3 className="text-xl font-semibold text-coffee-dark mb-3">Ethical Sourcing</h3>
                  <p className="text-coffee">
                    We work directly with farmers, ensuring fair prices and supporting sustainable practices.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="bg-coffee-light h-48 w-full rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-cream-light text-sm">Community Icon</span>
                  </div>
                  <h3 className="text-xl font-semibold text-coffee-dark mb-3">Community Focus</h3>
                  <p className="text-coffee">
                    We're committed to building a coffee community that celebrates great coffee and great people.
                  </p>
                </div>
              </div>

              {/* Location Section */}
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-coffee-dark mb-6">Visit Us</h2>
                <div className="space-y-4 text-coffee">
                  <p className="text-lg">
                    <strong>Address:</strong><br />
                    123 Coffee Street<br />
                    Seattle, WA 98101
                  </p>
                  <p className="text-lg">
                    <strong>Hours:</strong><br />
                    Monday - Friday: 7:00 AM - 6:00 PM<br />
                    Saturday - Sunday: 8:00 AM - 5:00 PM
                  </p>
                  <p className="text-lg">
                    <strong>Contact:</strong><br />
                    Email: info@vendettaroasting.com<br />
                    Phone: (206) 555-1234
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

