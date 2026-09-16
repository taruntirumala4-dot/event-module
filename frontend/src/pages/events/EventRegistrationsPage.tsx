import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventApi } from '../../services/eventApi';
import { useEventDetails } from '../../hooks/useEvents';
import { StudentRegistration } from '../../types/event';
import { formatDate, timeAgo } from '../../utils/eventUtils';
import { Users, ArrowLeft, Loader2, Mail, User, Download } from 'lucide-react';

const EventRegistrationsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { event, loading: eventLoading } = useEventDetails(id!);
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await eventApi.getEventRegistrations(id!);
        setRegistrations(res.data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load registrations');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (!user || (user.role !== 'ORGANIZER' && user.role !== 'ADMIN')) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: '#9A2A2A', fontWeight: 600 }}>🚫 Access denied</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to={`/events/${id}`} className="btn btn-secondary" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
          <ArrowLeft size={15} /> Back to Event
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={20} color="#2E58D7" />
          </div>
          <div>
            <h1 style={{ color: '#0B1E4A', fontSize: '1.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Registrations
            </h1>
            {event && (
              <p style={{ color: '#5B6487', marginTop: '0.25rem', marginBottom: 0, fontSize: '0.875rem' }}>
                {event.title}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {[
          { label: 'Total Registered', value: registrations.length, color: '#2E58D7' },
          { label: 'Capacity', value: event?.capacity || 0, color: '#00CBE8' },
          { label: 'Spots Remaining', value: Math.max(0, (event?.capacity || 0) - registrations.length), color: '#047857' },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: '#FFFFFF',
              border: '1px solid #DDE2F0',
              borderRadius: 14,
              padding: '1.25rem',
              boxShadow: '0 4px 18px rgba(11, 30, 74, 0.04)',
            }}
          >
            <p style={{ color: '#5B6487', fontSize: '0.75rem', margin: '0 0 0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {stat.label}
            </p>
            <p style={{ color: stat.color, fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
              {loading || eventLoading ? '—' : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#5B6487' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#2E58D7', margin: '0 auto' }} />
        </div>
      ) : error ? (
        <p style={{ color: '#9A2A2A' }}>⚠️ {error}</p>
      ) : registrations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#5B6487', background: '#FFFFFF', borderRadius: 14, border: '1px solid #DDE2F0' }}>
          <Users size={40} style={{ marginBottom: '1rem', color: '#9199B5' }} />
          <p style={{ margin: 0, fontWeight: 600, color: '#0B1E4A' }}>No registrations yet</p>
        </div>
      ) : (
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #DDE2F0',
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: '0 4px 18px rgba(11, 30, 74, 0.04)',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 1fr',
              padding: '0.875rem 1.25rem',
              background: '#F7F8FC',
              borderBottom: '1px solid #DDE2F0',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#5B6487',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <User size={12} /> Student
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Mail size={12} /> Email
            </span>
            <span>Registered</span>
          </div>

          {/* Rows */}
          {registrations.map((reg, i) => (
            <div
              key={reg.id}
              className="fade-in"
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 1fr',
                padding: '0.875rem 1.25rem',
                borderBottom: i < registrations.length - 1 ? '1px solid #ECEFF8' : 'none',
                alignItems: 'center',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = '#F9FAFD')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2E58D7, #00CBE8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'white',
                    flexShrink: 0,
                  }}
                >
                  {reg.student.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ color: '#0B1E4A', fontWeight: 600, fontSize: '0.875rem' }}>
                  {reg.student.name}
                </span>
              </div>
              <span style={{ color: '#5B6487', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {reg.student.email}
              </span>
              <span style={{ color: '#9199B5', fontSize: '0.8rem' }} title={formatDate(reg.registeredAt)}>
                {timeAgo(reg.registeredAt)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* CSV download hint */}
      {registrations.length > 0 && (
        <p style={{ color: '#5B6487', fontSize: '0.75rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 500 }}>
          <Download size={12} color="#2E58D7" /> {registrations.length} registrant{registrations.length !== 1 ? 's' : ''} total
        </p>
      )}
    </div>
  );
};

export default EventRegistrationsPage;
