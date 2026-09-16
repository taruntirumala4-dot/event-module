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
      borderBottom: '1px solid #E8EBF4',
      alignItems: 'flex-start',
    }}
  >
    <div style={{ color: '#2E58D7', flexShrink: 0, marginTop: 2 }}>{icon}</div>
    <div style={{ flex: 1 }}>
      <p style={{ color: '#7C849E', fontSize: '0.75rem', margin: '0 0 0.25rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
        {label}
      </p>
      <div style={{ color: '#0B1E4A', fontSize: '0.9375rem', fontWeight: 600 }}>{value}</div>
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
          borderRadius: 14,
          overflow: 'hidden',
          marginBottom: '2rem',
          boxShadow: '0 4px 18px rgba(11, 30, 74, 0.08)',
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
            background: 'linear-gradient(to top, rgba(9,24,56,0.92) 0%, rgba(9,24,56,0.45) 50%, transparent 100%)',
          }}
        />
        <div style={{ position: 'absolute', bottom: '1.75rem', left: '1.75rem', right: '1.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.875rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span
              style={{
                backgroundColor: '#2E58D7',
                color: '#FFFFFF',
                padding: '4px 14px',
                borderRadius: '999px',
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
                color: '#FFFFFF',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '4px 12px',
                borderRadius: '999px',
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
              color: '#FFFFFF',
              fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              margin: 0,
              lineHeight: 1.25,
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
            background: '#FFE2EB',
            border: '1px solid #C1205B',
            borderRadius: 14,
            padding: '1rem 1.25rem',
            display: 'flex',
            gap: '0.75rem',
            color: '#9A2A2A',
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
              background: '#FFFFFF',
              border: '1px solid #DDE2F0',
              borderRadius: 14,
              padding: '1.75rem',
              boxShadow: '0 4px 18px rgba(11, 30, 74, 0.04)',
            }}
          >
            <h2 style={{ color: '#0B1E4A', fontSize: '1.125rem', fontWeight: 800, margin: '0 0 1rem 0', letterSpacing: '-0.02em' }}>
              About This Event
            </h2>
            <p style={{ color: '#5B6487', lineHeight: 1.8, margin: 0, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
              {event.description}
            </p>
          </section>

          {/* Event Details Section */}
          <section
            style={{
              background: '#FFFFFF',
              border: '1px solid #DDE2F0',
              borderRadius: 14,
              padding: '1.75rem',
              boxShadow: '0 4px 18px rgba(11, 30, 74, 0.04)',
            }}
          >
            <h2 style={{ color: '#0B1E4A', fontSize: '1.125rem', fontWeight: 800, margin: '0 0 1rem 0', letterSpacing: '-0.02em' }}>
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
                  <span style={{ color: '#0B1E4A', fontWeight: 600 }}>{event.location}</span>
                  {event.venue && <div style={{ color: '#7C849E', fontSize: '0.85rem', marginTop: 2 }}>{event.venue}</div>}
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
                    style={{ color: '#2E58D7', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
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
              background: '#FFFFFF',
              border: '1px solid #DDE2F0',
              borderRadius: 14,
              padding: '1.75rem',
              position: 'sticky',
              top: '5.5rem',
              boxShadow: '0 4px 18px rgba(11, 30, 74, 0.06)',
            }}
          >
            <h3 style={{ color: '#0B1E4A', fontSize: '1.125rem', fontWeight: 800, margin: '0 0 1.25rem 0', letterSpacing: '-0.02em' }}>
              Registration
            </h3>

            {/* Deadline Banner */}
            <div
              style={{
                background: deadlinePassed ? '#FFE2EB' : '#EFF1F9',
                border: `1px solid ${deadlinePassed ? '#C1205B' : '#DDE2F0'}`,
                borderRadius: 10,
                padding: '0.875rem 1rem',
                marginBottom: '1.25rem',
              }}
            >
              <p style={{ margin: '0 0 0.25rem', fontSize: '0.75rem', color: deadlinePassed ? '#9A2A2A' : '#2E58D7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Registration Deadline
              </p>
              <p
                style={{
                  margin: 0,
                  fontWeight: 700,
                  color: deadlinePassed ? '#9A2A2A' : '#0B1E4A',
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
                <span style={{ color: '#5B6487', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 500 }}>
                  <Users size={15} style={{ color: '#2E58D7' }} />
                  Attendee Capacity
                </span>
                <span style={{ color: isFull ? '#9A2A2A' : '#0B1E4A', fontSize: '0.875rem', fontWeight: 700 }}>
                  {registered} / {event.capacity} {isFull && '(Full)'}
                </span>
              </div>
              <div style={{ height: 8, background: '#EFF1F9', borderRadius: 999, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${capacityPct}%`,
                    background: isFull
                      ? '#9A2A2A'
                      : capacityPct > 80
                      ? '#C1205B'
                      : 'linear-gradient(90deg, #2E58D7, #00CBE8)',
                    borderRadius: 999,
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
