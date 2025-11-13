import { useState, useEffect } from 'react';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  isFeatured: boolean;
  publishedAt: string;
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/content/announcements');
      const data = await response.json();
      
      if (data.success) {
        // Show featured announcements first, then regular ones
        const sorted = data.data.sort((a: Announcement, b: Announcement) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        });
        setAnnouncements(sorted.slice(0, 3)); // Show max 3 announcements
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || announcements.length === 0) {
    return null;
  }

  return (
    <div className="bg-coffee text-cream-light">
      <div className="container mx-auto px-4 py-3">
        <div className="space-y-2">
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              className={`text-center ${
                announcement.isFeatured
                  ? 'text-lg font-semibold'
                  : 'text-sm'
              }`}
            >
              {announcement.isFeatured && (
                <span className="inline-block bg-cream-light text-coffee px-2 py-1 rounded text-xs font-bold mr-2">
                  FEATURED
                </span>
              )}
              <span className="font-medium">{announcement.title}:</span>{' '}
              {announcement.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

