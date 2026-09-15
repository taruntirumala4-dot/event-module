import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { eventApi } from '../../services/eventApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Props {
  eventId: string;
  initialBookmarked?: boolean;
  onChanged?: (bookmarked: boolean) => void;
}

const EventBookmark: React.FC<Props> = ({ eventId, initialBookmarked = false, onChanged }) => {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const toggle = async () => {
    if (!user) {
      toast.error('Please login to save events');
      return;
    }
    if (user.role !== 'STUDENT') {
      toast.error('Only students can bookmark events');
      return;
    }
    setLoading(true);
    try {
      if (bookmarked) {
        await eventApi.removeBookmark(eventId);
        setBookmarked(false);
        toast.success('Removed from saved events');
        onChanged?.(false);
      } else {
        await eventApi.bookmarkEvent(eventId);
        setBookmarked(true);
        toast.success('Event saved!');
        onChanged?.(true);
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to update bookmark');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="btn"
      style={{
        width: '100%',
        justifyContent: 'center',
        padding: '0.75rem',
        gap: '0.5rem',
        background: bookmarked ? '#fef3c7' : '#ffffff',
        border: `1.5px solid ${bookmarked ? '#fde68a' : '#e2e8f0'}`,
        color: bookmarked ? '#92400e' : '#334155',
        fontWeight: 600,
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
      id="bookmark-btn"
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this event'}
    >
      {loading ? (
        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
      ) : bookmarked ? (
        <BookmarkCheck size={16} color="#d97706" />
      ) : (
        <Bookmark size={16} color="#64748b" />
      )}
      {bookmarked ? 'Saved in Library' : 'Save Event'}
    </button>
  );
};

export default EventBookmark;
