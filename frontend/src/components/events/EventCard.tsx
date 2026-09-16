import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Bookmark, BookmarkCheck, ArrowRight, Calendar } from 'lucide-react';
import { Event } from '../../types/event';
import {
  formatDate,
  formatDateRange,
  getCategoryColor,
  getCategoryLabel,
  getModeLabel,
  isDeadlinePassed,
} from '../../utils/eventUtils';
import EventStatusBadge from './EventStatusBadge';

interface Props {
  event: Event;
  showStatus?: boolean;
  onBookmark?: (id: string, isBookmarked: boolean) => void;
  isBookmarked?: boolean;
  bookmarkLoading?: boolean;
}

// Maps category → light background pill colors (Section 13)
const getCategoryPillStyle = () => ({
  background: '#EFF1F9',
  color: '#2E58D7',
  border: '1px solid #E8EBF4',
});

const EventCard: React.FC<Props> = ({
  event,
  showStatus = false,
  onBookmark,
  isBookmarked = false,
  bookmarkLoading = false,
}) => {
  const deadlinePassed = isDeadlinePassed(event.registrationDeadline);
  const modeLabel = getModeLabel(event.mode);
  const registered = event._count?.registrations ?? 0;
  const isFull = registered >= event.capacity;

  const imageSrc =
    event.image ||
    `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80`;

  // Generate a subtle branded bg for the image placeholder
  const gradients = [
    'linear-gradient(135deg, #EFF1F9 0%, #E7EDFF 100%)',
    'linear-gradient(135deg, #E8F9FC 0%, #EFF1F9 100%)',
    'linear-gradient(135deg, #FFE2EB 0%, #EFF1F9 100%)',
    'linear-gradient(135deg, #EFF1F9 0%, #FFE2EB 100%)',
    'linear-gradient(135deg, #E7EDFF 0%, #E8F9FC 100%)',
  ];
  const cardGradient = gradients[event.title.length % gradients.length];

  return (
    <div
      className="event-card card-light"
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: '#FFFFFF',
        border: '1px solid #DDE2F0',
        borderRadius: 14,
        boxShadow: '0 4px 18px rgba(11, 30, 74, 0.06)',
      }}
    >
      {/* Image / Banner */}
      <div style={{ position: 'relative', height: 160, overflow: 'hidden', flexShrink: 0, background: cardGradient }}>
        <img
          src={imageSrc}
          alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {/* Subtle overlay for readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(11,30,74,0.45) 0%, transparent 50%)',
          }}
        />

        {/* Mode tag (top-left) */}
        <span
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            background: 'rgba(255,255,255,0.92)',
            color: '#0B1E4A',
            border: '1px solid #DDE2F0',
            padding: '2px 10px',
            borderRadius: '999px',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            backdropFilter: 'blur(6px)',
          }}
        >
          {modeLabel}
        </span>

        {/* Bookmark (top-right) */}
        {onBookmark && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onBookmark(event.id, isBookmarked);
            }}
            disabled={bookmarkLoading}
            style={{
              position: 'absolute',
              top: 8,
              right: 10,
              background: isBookmarked ? '#FFE2EB' : 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #DDE2F0',
              borderRadius: '999px',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isBookmarked ? '#C1205B' : '#0B1E4A',
              transition: 'all 0.2s',
              boxShadow: '0 2px 6px rgba(11,30,74,0.08)',
            }}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark event'}
          >
            {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          </button>
        )}

        {/* Status badge */}
        {showStatus && (
          <div style={{ position: 'absolute', bottom: 8, right: 10 }}>
            <EventStatusBadge status={event.status} size="sm" />
          </div>
        )}

        {/* Full badge */}
        {isFull && (
          <span style={{
            position: 'absolute',
            bottom: 8,
            left: 10,
            background: '#FFE2EB',
            color: '#9A2A2A',
            border: '1px solid #C1205B',
            padding: '2px 8px',
            borderRadius: '999px',
            fontSize: '0.65rem',
            fontWeight: 700,
          }}>
            FULL
          </span>
        )}
      </div>

      {/* Card Body */}
      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

        {/* Category tag */}
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          <span
            className="tag-pill"
            style={getCategoryPillStyle()}
          >
            {getCategoryLabel(event.category)}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            color: '#0B1E4A',
            fontSize: '0.9375rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: 0,
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {event.title}
        </h3>

        {/* Organizer snippet */}
        {event.organizer?.name && (
          <p style={{ fontSize: '0.75rem', color: '#5B6487', margin: 0, fontWeight: 500 }}>
            {event.organizer.name}
          </p>
        )}

        {/* Meta row */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#5B6487', fontSize: '0.8rem' }}>
            <Calendar size={13} style={{ flexShrink: 0, color: '#2E58D7' }} />
            {formatDateRange(event.startDate, event.endDate)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#5B6487', fontSize: '0.8rem' }}>
            <MapPin size={13} style={{ flexShrink: 0, color: '#00CBE8' }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {event.location}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              color: deadlinePassed ? '#9A2A2A' : '#5B6487',
            }}
          >
            <Clock size={13} style={{ flexShrink: 0, color: deadlinePassed ? '#9A2A2A' : '#7C849E' }} />
            {deadlinePassed ? 'Registration closed' : `Deadline: ${formatDate(event.registrationDeadline)}`}
          </div>
        </div>

        {/* View Details Button (Section 5: Primary Blue pill) */}
        <Link
          to={`/events/${event.id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.375rem',
            padding: '0.55rem 1rem',
            borderRadius: '999px',
            background: deadlinePassed || isFull ? '#EFF1F9' : '#2E58D7',
            color: deadlinePassed || isFull ? '#7C849E' : '#FFFFFF',
            border: deadlinePassed || isFull ? '1px solid #DDE2F0' : 'none',
            fontWeight: 700,
            fontSize: '0.8125rem',
            textDecoration: 'none',
            transition: 'all 0.2s',
            marginTop: '0.5rem',
            boxShadow: deadlinePassed || isFull ? 'none' : '0 4px 12px rgba(46, 88, 215, 0.25)',
          }}
          onMouseEnter={e => {
            if (!deadlinePassed && !isFull) {
              (e.currentTarget as HTMLAnchorElement).style.background = '#1C3FA8';
            }
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = deadlinePassed || isFull ? '#EFF1F9' : '#2E58D7';
          }}
        >
          {deadlinePassed ? 'View Event' : isFull ? 'Event Full' : 'View Details'}
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
