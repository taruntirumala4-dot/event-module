import React, { useState } from 'react';
import { Event } from '../../types/event';
import { eventApi } from '../../services/eventApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { getRegistrationButtonState } from '../../utils/eventUtils';
import { CheckCircle, UserCheck, Loader2 } from 'lucide-react';

interface Props {
  event: Event;
  onRegistered?: (updated: Event) => void;
}

const EventRegistration: React.FC<Props> = ({ event, onRegistered }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(event.isRegistered || false);

  const updatedEvent = { ...event, _count: { registrations: event._count.registrations } };
  const btnState = getRegistrationButtonState(updatedEvent, isRegistered);

  if (!user) {
    return (
      <a href="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
        Login to Register
      </a>
    );
  }

  if (user.role !== 'STUDENT') {
    return (
      <div
        style={{
          background: '#EFF1F9',
          border: '1px solid #DDE2F0',
          borderRadius: 10,
          padding: '0.875rem 1rem',
          color: '#5B6487',
          fontSize: '0.875rem',
          textAlign: 'center',
          fontWeight: 600,
        }}
      >
        Only students can register for events.
      </div>
    );
  }

  const handleRegister = async () => {
    setLoading(true);
    try {
      await eventApi.registerForEvent(event.id);
      setIsRegistered(true);
      toast.success('Successfully registered for the event! 🎉');
      onRegistered?.({ ...event, isRegistered: true, _count: { registrations: event._count.registrations + 1 } });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!confirm('Are you sure you want to cancel your registration?')) return;
    setLoading(true);
    try {
      await eventApi.unregisterFromEvent(event.id);
      setIsRegistered(false);
      toast.success('Registration cancelled');
      onRegistered?.({ ...event, isRegistered: false, _count: { registrations: Math.max(0, event._count.registrations - 1) } });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to cancel');
    } finally {
      setLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            background: '#EFF1F9',
            border: '1px solid #DDE2F0',
            borderRadius: 10,
            padding: '0.875rem 1rem',
            color: '#0B1E4A',
            fontWeight: 700,
            fontSize: '0.875rem',
          }}
        >
          <CheckCircle size={18} color="#16a34a" />
          You are registered for this event
        </div>
        <button onClick={handleUnregister} disabled={loading} className="btn btn-secondary">
          {loading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : null}
          Cancel Registration
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleRegister}
      disabled={btnState.disabled || loading}
      className={`btn btn-${btnState.variant === 'success' ? 'success' : btnState.variant === 'secondary' ? 'secondary' : 'primary'}`}
      style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
      id="register-btn"
    >
      {loading ? (
        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
      ) : (
        <UserCheck size={16} />
      )}
      {loading ? 'Registering...' : btnState.label}
    </button>
  );
};

export default EventRegistration;
