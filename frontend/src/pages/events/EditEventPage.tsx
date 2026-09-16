import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEventDetails } from '../../hooks/useEvents';
import { eventApi } from '../../services/eventApi';
import { useAuth } from '../../context/AuthContext';
import EventForm from '../../components/events/EventForm';
import { CreateEventForm } from '../../types/event';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit, Loader2 } from 'lucide-react';

const EditEventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { event, loading, error } = useEventDetails(id!);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#2E58D7', margin: '0 auto' }} />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: '#9A2A2A', fontWeight: 600 }}>⚠️ {error || 'Event not found'}</p>
        <Link to="/events" className="btn btn-secondary" style={{ display: 'inline-flex', marginTop: '1rem' }}>
          Back to Events
        </Link>
      </div>
    );
  }

  const canEdit =
    user &&
    (user.role === 'ADMIN' || (user.role === 'ORGANIZER' && event.organizerId === user.id));

  if (!canEdit) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: '#9A2A2A', fontSize: '1.125rem', fontWeight: 600 }}>🚫 You do not have permission to edit this event.</p>
      </div>
    );
  }

  const handleSubmit = async (data: Partial<CreateEventForm>) => {
    setSaving(true);
    try {
      await eventApi.updateEvent(id!, data);
      toast.success('Event updated successfully!');
      navigate(`/events/${id}`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to={`/events/${id}`} className="btn btn-secondary" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
          <ArrowLeft size={15} /> Back to Event
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Edit size={20} color="#2E58D7" />
          </div>
          <h1 style={{ color: '#0B1E4A', fontSize: '1.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Edit Event
          </h1>
        </div>
        <p style={{ color: '#5B6487', marginTop: '0.375rem', marginBottom: 0, fontSize: '0.875rem' }}>
          {event.title}
        </p>
      </div>

      <EventForm
        initialData={event}
        onSubmit={handleSubmit}
        isLoading={saving}
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default EditEventPage;
