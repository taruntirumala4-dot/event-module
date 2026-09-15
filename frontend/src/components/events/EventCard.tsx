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

// Maps category → light background pill colors
const getCategoryPillStyle = (color: string) => ({
  background: `${color}18`,
  color: color,
  border: `1px solid ${color}30`,
});

const EventCard: React.FC<Props> = ({
  event,
  showStatus = false,
  onBookmark,
  isBookmarked = false,
  bookmarkLoading = false,
}) => {
  const deadlinePassed = isDeadlinePassed(event.registrationDeadline);
  const categoryColor = getCategoryColor(event.category);
  const modeLabel = getModeLabel(event.mode);
  const registered = event._count?.registrations ?? 0;
  const isFull = registered >= event.capacity;

  const imageSrc =
    event.image ||
    `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80`;

  // Generate a subtle branded bg for the image placeholder
  const gradients = [
    'linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)',
    'linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)',
    'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
    'linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%)',
  ];
  const cardGradient = gradients[event.title.length % gradients.length];

  return (
    <div
      className="event-card card-light"
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
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
            background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)',
          }}
        />

        {/* Mode tag (top-left) */}
        <span
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            background: 'rgba(255,255,255,0.92)',
            color: '#475569',
            padding: '2px 8px',
            borderRadius: '9999px',
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
              background: isBookmarked ? '#fef3c7' : 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(8px)',
              border: 'none',
              borderRadius: '8px',
              width: 30,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isBookmarked ? '#d97706' : '#64748b',
              transition: 'all 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
            padding: '2px 8px',
            borderRadius: '9999px',
            fontSize: '0.65rem',
            fontWeight: 700,
          }}>
            FULL
          </span>
        )}
      </div>

      {/* Card Body */}
      <div style={{ padding: '0.875rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

        {/* Category + Mode tags */}
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          <span
            className="tag-pill"
            style={getCategoryPillStyle(categoryColor)}
          >
            {getCategoryLabel(event.category)}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            color: '#1e293b',
            fontSize: '0.9375rem',
            fontWeight: 700,
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

        {/* Organizer / description snippet */}
        {event.organizer?.name && (
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, fontWeight: 500 }}>
            {event.organizer.name}
          </p>
        )}

        {/* Meta row */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.125rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem' }}>
            <Calendar size={12} style={{ flexShrink: 0, color: '#94a3b8' }} />
            {formatDateRange(event.startDate, event.endDate)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem' }}>
            <MapPin size={12} style={{ flexShrink: 0, color: '#94a3b8' }} />
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
              color: deadlinePassed ? '#dc2626' : '#64748b',
            }}
          >
            <Clock size={12} style={{ flexShrink: 0, color: deadlinePassed ? '#dc2626' : '#94a3b8' }} />
            {deadlinePassed ? 'Registration closed' : `Deadline: ${formatDate(event.registrationDeadline)}`}
          </div>
        </div>

        {/* View Details Button */}
        <Link
          to={`/events/${event.id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.375rem',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            background: deadlinePassed || isFull ? '#f1f5f9' : '#1e293b',
            color: deadlinePassed || isFull ? '#94a3b8' : '#ffffff',
            fontWeight: 600,
            fontSize: '0.8125rem',
            textDecoration: 'none',
            transition: 'all 0.2s',
            marginTop: '0.5rem',
          }}
          onMouseEnter={e => {
            if (!deadlinePassed && !isFull) {
              (e.currentTarget as HTMLAnchorElement).style.background = '#0f172a';
            }
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = deadlinePassed || isFull ? '#f1f5f9' : '#1e293b';
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
