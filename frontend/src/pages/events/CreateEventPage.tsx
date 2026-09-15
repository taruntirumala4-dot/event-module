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
        <p style={{ color: '#f87171', fontSize: '1.125rem' }}>🚫 Only organizers can create events.</p>
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
        <Link to="/events/organizer/my-events" className="btn btn-secondary" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
          <ArrowLeft size={15} /> My Events
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <PlusCircle size={22} color="#2563eb" />
          <h1 style={{ color: '#0f172a', fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
            Create New Event
          </h1>
        </div>
        <p style={{ color: '#64748b', marginTop: '0.375rem', marginBottom: 0 }}>
          Fill in the details below. Your event will be reviewed by an admin before publishing.
        </p>
      </div>

      <EventForm onSubmit={handleSubmit} isLoading={loading} submitLabel="Submit for Review" />
    </div>
  );
};

export default CreateEventPage;
