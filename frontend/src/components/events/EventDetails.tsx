import React from 'react';
import { Event } from '../../types/event';
import {
  formatDate,
  formatDateRange,
  formatTime,
  getCategoryColor,
  getCategoryLabel,
  getModeColor,
  getModeLabel,
  getCapacityPercent,
  isDeadlinePassed,
} from '../../utils/eventUtils';
import EventStatusBadge from './EventStatusBadge';
import EventRegistration from './EventRegistration';
import EventBookmark from './EventBookmark';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  Tag,
  Globe,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface Props {
  event: Event;
  onUpdate?: (event: Event) => void;
}

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({
  icon,
  label,
  value,
}) => (
  <div
    style={{
      display: 'flex',
      gap: '0.875rem',
      padding: '0.875rem 0',
      borderBottom: '1px solid #f1f5f9',
      alignItems: 'flex-start',
    }}
  >
    <div style={{ color: '#2563eb', flexShrink: 0, marginTop: 2 }}>{icon}</div>
    <div style={{ flex: 1 }}>
      <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '0 0 0.25rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
        {label}
      </p>
      <div style={{ color: '#0f172a', fontSize: '0.9375rem', fontWeight: 600 }}>{value}</div>
    </div>
  </div>
);

const EventDetails: React.FC<Props> = ({ event, onUpdate }) => {
  const registered = event._count?.registrations ?? 0;
  const capacityPct = getCapacityPercent(registered, event.capacity);
  const deadlinePassed = isDeadlinePassed(event.registrationDeadline);
  const isFull = registered >= event.capacity;

  return (
    <div className="fade-in">
      {/* Hero Image Card */}
      <div
        style={{
          position: 'relative',
          height: 380,
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '2rem',
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)',
        }}
      >
        <img
          src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'}
          alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80';
          }}
        />
        {/* Dark gradient for text readability over image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.45) 50%, transparent 100%)',
          }}
        />
        <div style={{ position: 'absolute', bottom: '1.75rem', left: '1.75rem', right: '1.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.875rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span
              style={{
                background: `${getCategoryColor(event.category)}25`,
                color: '#ffffff',
                backgroundColor: getCategoryColor(event.category),
                padding: '4px 14px',
                borderRadius: 9999,
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
              }}
            >
              {getCategoryLabel(event.category)}
            </span>
            <span
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '4px 12px',
                borderRadius: 9999,
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {getModeLabel(event.mode)}
            </span>
            <EventStatusBadge status={event.status} />
          </div>
          <h1
            style={{
              color: '#ffffff',
              fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
              fontWeight: 800,
              margin: 0,
              lineHeight: 1.25,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            {event.title}
          </h1>
        </div>
      </div>

      {/* Rejection reason */}
      {event.status === 'REJECTED' && event.rejectionReason && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            display: 'flex',
            gap: '0.75rem',
            color: '#b91c1c',
            marginBottom: '1.5rem',
            fontSize: '0.9375rem',
          }}
        >
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <strong>Rejection reason:</strong> {event.rejectionReason}
          </div>
        </div>
      )}

      {/* Main Grid: Left Details + Right Sidebar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)',
          gap: '1.75rem',
        }}
        className="details-grid"
      >
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* About Section */}
          <section
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <h2 style={{ color: '#0f172a', fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1rem 0' }}>
              About This Event
            </h2>
            <p style={{ color: '#334155', lineHeight: 1.8, margin: 0, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
              {event.description}
            </p>
          </section>

          {/* Event Details Section */}
          <section
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <h2 style={{ color: '#0f172a', fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1rem 0' }}>
              Event Information
            </h2>
            <InfoRow
              icon={<Calendar size={18} />}
              label="Date"
              value={formatDateRange(event.startDate, event.endDate)}
            />
            <InfoRow
              icon={<Clock size={18} />}
              label="Time"
              value={`${formatTime(event.startTime)} – ${formatTime(event.endTime)}`}
            />
            <InfoRow
              icon={<MapPin size={18} />}
              label="Location"
              value={
                <div>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{event.location}</span>
                  {event.venue && <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 2 }}>{event.venue}</div>}
                </div>
              }
            />
            <InfoRow
              icon={<Globe size={18} />}
              label="Mode"
              value={getModeLabel(event.mode)}
            />
            <InfoRow
              icon={<User size={18} />}
              label="Organizer"
              value={event.organizer.name}
            />
            <InfoRow
              icon={<Tag size={18} />}
              label="Eligibility"
              value={event.eligibility || 'Open to all students'}
            />
            {event.registrationLink && (
              <InfoRow
                icon={<ExternalLink size={18} />}
                label="External Registration"
                value={
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    Register on external portal →
                  </a>
                }
              />
            )}
          </section>
        </div>

        {/* Right column — sticky registration sidebar */}
        <div>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.75rem',
              position: 'sticky',
              top: '5.5rem',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)',
            }}
          >
            <h3 style={{ color: '#0f172a', fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1.25rem 0' }}>
              Registration
            </h3>

            {/* Deadline Banner */}
            <div
              style={{
                background: deadlinePassed ? '#fef2f2' : '#eff6ff',
                border: `1px solid ${deadlinePassed ? '#fecaca' : '#bfdbfe'}`,
                borderRadius: '10px',
                padding: '0.875rem 1rem',
                marginBottom: '1.25rem',
              }}
            >
              <p style={{ margin: '0 0 0.25rem', fontSize: '0.75rem', color: deadlinePassed ? '#991b1b' : '#1e40af', fontWeight: 600, textTransform: 'uppercase' }}>
                Registration Deadline
              </p>
              <p
                style={{
                  margin: 0,
                  fontWeight: 700,
                  color: deadlinePassed ? '#dc2626' : '#1d4ed8',
                  fontSize: '0.95rem',
                }}
              >
                {deadlinePassed ? '⛔ ' : '⏰ '}
                {formatDate(event.registrationDeadline)}
                {deadlinePassed && ' (Closed)'}
              </p>
            </div>

            {/* Capacity Bar */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 500 }}>
                  <Users size={15} />
                  Attendee Capacity
                </span>
                <span style={{ color: isFull ? '#ef4444' : '#0f172a', fontSize: '0.875rem', fontWeight: 700 }}>
                  {registered} / {event.capacity} {isFull && '(Full)'}
                </span>
              </div>
              <div style={{ height: 8, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${capacityPct}%`,
                    background: isFull
                      ? '#ef4444'
                      : capacityPct > 80
                      ? '#f59e0b'
                      : 'linear-gradient(90deg, #2563eb, #38bdf8)',
                    borderRadius: 9999,
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>

            {/* Register button */}
            <EventRegistration event={event} onRegistered={onUpdate} />

            {/* Bookmark button */}
            <div style={{ marginTop: '0.875rem' }}>
              <EventBookmark
                eventId={event.id}
                initialBookmarked={event.isBookmarked}
                onChanged={(bm) => onUpdate?.({ ...event, isBookmarked: bm })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
