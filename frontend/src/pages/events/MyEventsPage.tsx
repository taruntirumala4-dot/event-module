import React from 'react';
import { Link } from 'react-router-dom';
import { useMyEvents } from '../../hooks/useEvents';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatDateRange, getCategoryColor, getCategoryLabel } from '../../utils/eventUtils';
import { Calendar, MapPin, CalendarCheck, ArrowRight, Loader2 } from 'lucide-react';

const MyEventsPage: React.FC = () => {
  const { user } = useAuth();
  const { registrations, loading, error } = useMyEvents();

  if (!user) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: '#64748b' }}>Please <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>login</Link> to view your registered events.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
          <CalendarCheck size={20} color="#2563eb" />
          <span style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 600 }}>My Activity</span>
        </div>
        <h1 style={{ color: '#0f172a', fontSize: '1.875rem', fontWeight: 800, margin: 0 }}>
          My Registered Events
        </h1>
        <p style={{ color: '#64748b', marginTop: '0.375rem', marginBottom: 0 }}>
          Events you have signed up for
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : error ? (
        <p style={{ color: '#ef4444' }}>⚠️ {error}</p>
      ) : registrations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <CalendarCheck size={32} color="#2563eb" />
          </div>
          <h3 style={{ color: '#0f172a', margin: '0 0 0.5rem', fontWeight: 700 }}>No registered events yet</h3>
          <p style={{ color: '#64748b', margin: '0 0 1.5rem' }}>Browse events and register to see them here.</p>
          <Link to="/events" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            Browse Events <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {registrations.map((reg) => (
            <div
              key={reg.id}
              className="fade-in"
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'center',
                flexWrap: 'wrap',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              {/* Image */}
              <img
                src={reg.event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&auto=format&fit=crop'}
                alt={reg.event.title}
                style={{ width: 84, height: 84, borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&auto=format&fit=crop'; }}
              />
              {/* Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ color: getCategoryColor(reg.event.category), fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  {getCategoryLabel(reg.event.category)}
                </span>
                <h3 style={{ color: '#0f172a', fontSize: '1.0625rem', fontWeight: 700, margin: '0.25rem 0 0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {reg.event.title}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: '#64748b', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={14} color="#2563eb" /> {formatDateRange(reg.event.startDate, reg.event.endDate)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={14} color="#2563eb" /> {reg.event.location}
                  </span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0.5rem 0 0' }}>
                  Registered on {formatDate(reg.registeredAt)}
                </p>
              </div>
              {/* Action */}
              <Link
                to={`/events/${reg.event.id}`}
                className="btn btn-secondary"
                style={{ flexShrink: 0 }}
              >
                View Details <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEventsPage;
