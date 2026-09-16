import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { eventApi } from '../../services/eventApi';
import { useAuth } from '../../context/AuthContext';
import EventForm from '../../components/events/EventForm';
import { CreateEventForm } from '../../types/event';
import toast from 'react-hot-toast';
import { ArrowLeft, PlusCircle } from 'lucide-react';

const CreateEventPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== 'ORGANIZER') {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p style={{ color: '#9A2A2A', fontSize: '1.125rem', fontWeight: 600 }}>🚫 Only organizers can create events.</p>
        <Link to="/events" className="btn btn-secondary" style={{ display: 'inline-flex', marginTop: '1rem' }}>
          Back to Events
        </Link>
      </div>
    );
  }

  const handleSubmit = async (data: Partial<CreateEventForm>) => {
    setLoading(true);
    try {
      const res = await eventApi.createEvent(data);
      toast.success('Event created! It is now pending admin approval. 🎉');
      navigate(`/events/${res.data.id}`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/events" className="btn btn-secondary" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
          <ArrowLeft size={15} /> All Events
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PlusCircle size={20} color="#2E58D7" />
          </div>
          <h1 style={{ color: '#0B1E4A', fontSize: '1.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Create New Event
          </h1>
        </div>
        <p style={{ color: '#5B6487', marginTop: '0.375rem', marginBottom: 0 }}>
          Fill in the details below. Your event will be reviewed by an admin before publishing.
        </p>
      </div>

      <EventForm onSubmit={handleSubmit} isLoading={loading} submitLabel="Submit for Review" />
    </div>
  );
};

export default CreateEventPage;
