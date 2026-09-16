import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEventDetails } from '../../hooks/useEvents';
import EventDetails from '../../components/events/EventDetails';
import { Event } from '../../types/event';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Edit, Trash2, Loader2 } from 'lucide-react';
import { eventApi } from '../../services/eventApi';
import toast from 'react-hot-toast';

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { event, setEvent, loading, error } = useEventDetails(id || 'build-for-bharat');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const canEdit =
    user && event && (user.role === 'ADMIN' || (user.role === 'ORGANIZER' && event.organizerId === user.id));

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await eventApi.deleteEvent(id!);
      toast.success('Event deleted');
      navigate(user?.role === 'ORGANIZER' ? '/events/organizer/my-events' : '/events');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', background: '#EFF1F9' }}>
        <div style={{ textAlign: 'center', color: '#5B6487' }}>
          <Loader2 size={32} color="#2E58D7" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ fontWeight: 600, color: '#0B1E4A' }}>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={{ maxWidth: 800, margin: '4rem auto', textAlign: 'center', padding: '0 1.5rem' }}>
        <p style={{ color: '#9A2A2A', fontSize: '1.125rem', fontWeight: 600 }}>⚠️ {error || 'Event not found'}</p>
        <Link
          to="/events"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '1rem',
            color: '#2E58D7',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} /> Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: '#EFF1F9', minHeight: '100vh', padding: '1.75rem 1.5rem 4rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Top Header: Back Link + Actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <Link
            to="/events"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: '#0B1E4A',
              fontWeight: 600,
              fontSize: '0.925rem',
              textDecoration: 'none',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#2E58D7')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#0B1E4A')}
          >
            <ArrowLeft size={16} strokeWidth={2.5} color="#2E58D7" />
            <span>Back to Events</span>
          </Link>

          {canEdit && (
            <div style={{ display: 'flex', gap: '0.625rem' }}>
              <Link
                to={`/events/${id}/edit`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 1.15rem',
                  borderRadius: 999,
                  border: '1px solid #DDE2F0',
                  background: '#FFFFFF',
                  color: '#0B1E4A',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#EFF1F9';
                  e.currentTarget.style.borderColor = '#2E58D7';
                  e.currentTarget.style.color = '#2E58D7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#DDE2F0';
                  e.currentTarget.style.color = '#0B1E4A';
                }}
              >
                <Edit size={14} /> Edit Event
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 1.15rem',
                  borderRadius: 999,
                  border: '1px solid #FFE2EB',
                  background: '#FFE2EB',
                  color: '#9A2A2A',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#FCD4DF')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#FFE2EB')}
              >
                {deleting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
                Delete
              </button>
            </div>
          )}
        </div>

        <EventDetails event={event} onUpdate={(updated: Event) => setEvent(updated)} />
      </div>
    </div>
  );
};

export default EventDetailsPage;
