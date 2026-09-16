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
        <p style={{ color: '#5B6487' }}>Please <Link to="/login" style={{ color: '#2E58D7', fontWeight: 600 }}>login</Link> to view saved events.</p>
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
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bookmark size={18} color="#2E58D7" />
          </div>
          <span style={{ color: '#2E58D7', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>My Library</span>
        </div>
        <h1 style={{ color: '#0B1E4A', fontSize: '1.875rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
          Saved Events
        </h1>
        <p style={{ color: '#5B6487', marginTop: '0.375rem', marginBottom: 0 }}>
          {bookmarks.length} event{bookmarks.length !== 1 ? 's' : ''} saved in your library
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#5B6487' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#2E58D7', margin: '0 auto' }} />
        </div>
      ) : error ? (
        <p style={{ color: '#9A2A2A' }}>⚠️ {error}</p>
      ) : bookmarks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#FFFFFF', borderRadius: 14, border: '1px solid #DDE2F0', boxShadow: '0 4px 18px rgba(11, 30, 74, 0.04)' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Bookmark size={32} color="#2E58D7" />
          </div>
          <h3 style={{ color: '#0B1E4A', margin: '0 0 0.5rem', fontWeight: 800 }}>No saved events</h3>
          <p style={{ color: '#5B6487', margin: '0 0 1.5rem' }}>Bookmark events to save them for later access.</p>
          <Link to="/events" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            Explore Events <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="responsive-cards-grid">
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
