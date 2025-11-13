import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Event {
  _id: string;
  title: string;
  description: string;
  slug: { current: string };
  eventDate: string;
  location: string;
  address?: string;
  price?: number;
  maxAttendees?: number;
  isActive: boolean;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/content/events');
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.data);
      } else {
        setError(data.message || 'Failed to load events');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Head>
        <title>Events | Vendetta Roasting</title>
        <meta name="description" content="Join us for coffee tastings, workshops, and community events" />
      </Head>

      <div className="bg-cream-light min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-coffee-dark mb-4">Upcoming Events</h1>
            <p className="text-lg text-coffee max-w-2xl mx-auto">
              Join us for coffee tastings, brewing workshops, and community events
            </p>
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-coffee">Loading events...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="text-center py-12">
              <p className="text-coffee text-lg">No upcoming events at this time.</p>
              <p className="text-coffee mt-2">Check back soon for new events!</p>
            </div>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold text-coffee-dark mb-2">
                      {event.title}
                    </h2>
                    <div className="mb-4 space-y-2">
                      <p className="text-coffee">
                        <span className="font-medium">📅 Date:</span>{' '}
                        {formatDate(event.eventDate)}
                      </p>
                      <p className="text-coffee">
                        <span className="font-medium">📍 Location:</span> {event.location}
                      </p>
                      {event.address && (
                        <p className="text-sm text-gray-600">{event.address}</p>
                      )}
                      {event.price !== undefined && event.price !== null && (
                        <p className="text-coffee">
                          <span className="font-medium">💰 Price:</span> $
                          {event.price.toFixed(2)}
                        </p>
                      )}
                      {event.maxAttendees && (
                        <p className="text-sm text-gray-600">
                          Max {event.maxAttendees} attendees
                        </p>
                      )}
                    </div>
                    <p className="text-coffee mb-4 line-clamp-3">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

