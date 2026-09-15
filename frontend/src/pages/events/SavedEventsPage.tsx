import React from 'react';
import { Link } from 'react-router-dom';
import { useSavedEvents } from '../../hooks/useEvents';
import { useAuth } from '../../context/AuthContext';
import { eventApi } from '../../services/eventApi';
import toast from 'react-hot-toast';
import EventCard from '../../components/events/EventCard';
import { Bookmark, ArrowRight, Loader2 } from 'lucide-react';

const SavedEventsPage: React.FC = () => {
  const { user } = useAuth();
  const { bookmarks, setBookmarks, loading, error } = useSavedEvents();

  if (!user) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: '#64748b' }}>Please <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>login</Link> to view saved events.</p>
      </div>
    );
  }

  const handleRemoveBookmark = async (eventId: string) => {
    try {
      await eventApi.removeBookmark(eventId);
      setBookmarks((prev) => prev.filter((b) => b.eventId !== eventId));
      toast.success('Removed from saved events');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to remove');
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
          <Bookmark size={20} color="#2563eb" />
          <span style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 600 }}>My Library</span>
        </div>
        <h1 style={{ color: '#0f172a', fontSize: '1.875rem', fontWeight: 800, margin: 0 }}>
          Saved Events
        </h1>
        <p style={{ color: '#64748b', marginTop: '0.375rem', marginBottom: 0 }}>
          {bookmarks.length} event{bookmarks.length !== 1 ? 's' : ''} saved in your library
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : error ? (
        <p style={{ color: '#ef4444' }}>⚠️ {error}</p>
      ) : bookmarks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Bookmark size={32} color="#2563eb" />
          </div>
          <h3 style={{ color: '#0f172a', margin: '0 0 0.5rem', fontWeight: 700 }}>No saved events</h3>
          <p style={{ color: '#64748b', margin: '0 0 1.5rem' }}>Bookmark events to save them for later access.</p>
          <Link to="/events" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            Explore Events <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {bookmarks.map((bm) => (
            <div key={bm.id} className="fade-in">
              <EventCard
                event={bm.event}
                isBookmarked
                onBookmark={() => handleRemoveBookmark(bm.eventId)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedEventsPage;
