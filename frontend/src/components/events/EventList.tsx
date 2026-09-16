import React from 'react';
import { Event } from '../../types/event';
import EventCard from './EventCard';
import { useAuth } from '../../context/AuthContext';
import { eventApi } from '../../services/eventApi';
import toast from 'react-hot-toast';
import { CalendarX } from 'lucide-react';

interface Props {
  events: Event[];
  showStatus?: boolean;
  bookmarkedIds?: Set<string>;
  onBookmarkChange?: () => void;
}

const SkeletonCard = () => (
  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
    <div className="skeleton" style={{ height: 160 }} />
    <div style={{ padding: '0.875rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div className="skeleton" style={{ height: 12, width: '35%', borderRadius: 9999 }} />
      <div className="skeleton" style={{ height: 16, width: '90%' }} />
      <div className="skeleton" style={{ height: 12, width: '55%' }} />
      <div className="skeleton" style={{ height: 12, width: '45%' }} />
      <div className="skeleton" style={{ height: 34, borderRadius: 8 }} />
    </div>
  </div>
);

const EventList: React.FC<Props> = ({ events, showStatus = false, bookmarkedIds, onBookmarkChange }) => {
  const { user } = useAuth();
  const [loadingBookmark, setLoadingBookmark] = React.useState<string | null>(null);
  const [localBookmarks, setLocalBookmarks] = React.useState<Set<string>>(bookmarkedIds || new Set());

  React.useEffect(() => {
    if (bookmarkedIds) setLocalBookmarks(bookmarkedIds);
  }, [bookmarkedIds]);

  const handleBookmark = async (id: string, isBookmarked: boolean) => {
    if (!user) {
      toast.error('Please login to bookmark events');
      return;
    }
    setLoadingBookmark(id);
    try {
      if (isBookmarked) {
        await eventApi.removeBookmark(id);
        setLocalBookmarks((prev) => { const s = new Set(prev); s.delete(id); return s; });
        toast.success('Bookmark removed');
      } else {
        await eventApi.bookmarkEvent(id);
        setLocalBookmarks((prev) => new Set([...prev, id]));
        toast.success('Event bookmarked!');
      }
      onBookmarkChange?.();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to update bookmark');
    } finally {
      setLoadingBookmark(null);
    }
  };

  if (events.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CalendarX size={32} color="#2563eb" />
        </div>
        <h3 style={{ color: '#1e293b', margin: 0, fontSize: '1.125rem', fontWeight: 700 }}>No events found</h3>
        <p style={{ color: '#64748b', margin: 0, maxWidth: 300, lineHeight: 1.5 }}>
          Try adjusting your filters or search terms to find events.
        </p>
      </div>
    );
  }

  return (
    <div className="responsive-cards-grid">
      {events.map((event) => (
        <div key={event.id} className="fade-in">
          <EventCard
            event={event}
            showStatus={showStatus}
            onBookmark={user?.role === 'STUDENT' ? handleBookmark : undefined}
            isBookmarked={localBookmarks.has(event.id)}
            bookmarkLoading={loadingBookmark === event.id}
          />
        </div>
      ))}
    </div>
  );
};

export { SkeletonCard };
export default EventList;
