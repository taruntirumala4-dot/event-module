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
  const { event, setEvent, loading, error } = useEventDetails(id!);
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
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', padding: '6rem 1rem' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p style={{ color: '#f87171', fontSize: '1.125rem' }}>⚠️ {error || 'Event not found'}</p>
        <Link to="/events" className="btn btn-secondary" style={{ display: 'inline-flex', marginTop: '1rem' }}>
          <ArrowLeft size={16} /> Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Back + Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Link to="/events" className="btn btn-secondary" style={{ display: 'inline-flex' }}>
          <ArrowLeft size={15} /> Back to Events
        </Link>
        {canEdit && (
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            <Link to={`/events/${id}/edit`} className="btn btn-outline" style={{ display: 'inline-flex' }}>
              <Edit size={14} /> Edit Event
            </Link>
            <button onClick={handleDelete} disabled={deleting} className="btn btn-danger">
              {deleting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
              Delete
            </button>
          </div>
        )}
      </div>

      <EventDetails event={event} onUpdate={(updated: Event) => setEvent(updated)} />
    </div>
  );
};

export default EventDetailsPage;
