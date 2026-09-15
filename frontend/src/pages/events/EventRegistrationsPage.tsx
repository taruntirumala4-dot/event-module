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
        <p style={{ color: '#f87171' }}>🚫 Access denied</p>
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
          <Users size={22} color="#818cf8" />
          <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
            Registrations
          </h1>
        </div>
        {event && (
          <p style={{ color: '#64748b', marginTop: '0.375rem', marginBottom: 0, fontSize: '0.875rem' }}>
            {event.title}
          </p>
        )}
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
          { label: 'Total Registered', value: registrations.length, color: '#818cf8' },
          { label: 'Capacity', value: event?.capacity || 0, color: '#06b6d4' },
          { label: 'Spots Remaining', value: Math.max(0, (event?.capacity || 0) - registrations.length), color: '#34d399' },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '0.875rem',
              padding: '1.25rem',
            }}
          >
            <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '0 0 0.5rem', fontWeight: 500 }}>
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
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : error ? (
        <p style={{ color: '#f87171' }}>⚠️ {error}</p>
      ) : registrations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <Users size={40} style={{ marginBottom: '1rem', opacity: 0.4 }} />
          <p style={{ margin: 0 }}>No registrations yet</p>
        </div>
      ) : (
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '1rem',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 1fr',
              padding: '0.75rem 1.25rem',
              background: 'rgba(255,255,255,0.04)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#64748b',
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
                borderBottom: i < registrations.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                alignItems: 'center',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, #4f46e5, #06b6d4)`,
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
                <span style={{ color: '#f1f5f9', fontWeight: 500, fontSize: '0.875rem' }}>
                  {reg.student.name}
                </span>
              </div>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {reg.student.email}
              </span>
              <span style={{ color: '#64748b', fontSize: '0.8rem' }} title={formatDate(reg.registeredAt)}>
                {timeAgo(reg.registeredAt)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* CSV download hint */}
      {registrations.length > 0 && (
        <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <Download size={12} /> {registrations.length} registrant{registrations.length !== 1 ? 's' : ''} total
        </p>
      )}
    </div>
  );
};

export default EventRegistrationsPage;
