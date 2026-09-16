import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Bookmark } from 'lucide-react';
import { Event } from '../../types/event';
import { formatDateRange } from '../../utils/eventUtils';

interface Props {
  event: Event;
  showStatus?: boolean;
  onBookmark?: (id: string, isBookmarked: boolean) => void;
  isBookmarked?: boolean;
  bookmarkLoading?: boolean;
}

// Visual banner renderer adhering to the Deep Navy (#091838) dark section specification
const EventBannerGraphic: React.FC<{ event: Event }> = ({ event }) => {
  const id = event.id;

  if (id === 'build-for-bharat') {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #091838 0%, #0B1E4A 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.75rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Google "G" icon */}
          <svg width="40" height="40" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <div>
            <div style={{ color: '#FFFFFF', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              Build
            </div>
            <div style={{ color: '#7AD9E8', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              for Bharat
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '55%',
            backgroundImage: `url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.35,
            maskImage: 'linear-gradient(to right, transparent, black)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span style={{ color: '#7AD9E8', fontSize: '0.85rem', fontWeight: 600 }}>Google</span>
        </div>
      </div>
    );
  }

  if (id === 'adobe-genai-challenge') {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #091838 0%, #1A0D22 50%, #0B1E4A 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.75rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: 38,
              height: 38,
              background: '#C1205B',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '1.4rem',
            }}
          >
            A
          </div>
          <div>
            <div style={{ color: '#FFFFFF', fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Adobe
            </div>
            <div style={{ color: '#7AD9E8', fontSize: '1.05rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
              GenAI Challenge
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '50%',
            backgroundImage: `url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
            maskImage: 'linear-gradient(to right, transparent, black)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black)',
          }}
        />
      </div>
    );
  }

  if (id === 'techsparks-2026') {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #091838 0%, #0B1E4A 50%, #1C3FA8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.35,
          }}
        />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <span
            style={{
              color: '#FFFFFF',
              fontSize: '1.25rem',
              fontWeight: 900,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            TECHSPARKS <span style={{ color: '#00CBE8' }}>2026</span>
          </span>
        </div>
      </div>
    );
  }

  if (id === 'microsoft-azure-workshop') {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #091838 0%, #0B1E4A 60%, #2E58D7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.75rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', width: 26, height: 26 }}>
            <div style={{ background: '#F25022', borderRadius: 2 }} />
            <div style={{ background: '#7FBA00', borderRadius: 2 }} />
            <div style={{ background: '#00A4EF', borderRadius: 2 }} />
            <div style={{ background: '#FFB900', borderRadius: 2 }} />
          </div>
          <span style={{ color: '#FFFFFF', fontSize: '1.25rem', fontWeight: 800 }}>Microsoft</span>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '50%',
            backgroundImage: `url('https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.35,
            maskImage: 'linear-gradient(to right, transparent, black)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black)',
          }}
        />
      </div>
    );
  }

  if (id === 'nvidia-ai-summit-2026') {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #091838 0%, #0B1E4A 50%, #0F3325 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '1.25rem 1.75rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#00CBE8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#091838' }} />
          </div>
          <div>
            <div style={{ color: '#FFFFFF', fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              NVIDIA
            </div>
            <div style={{ color: '#7AD9E8', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.15 }}>
              AI Summit
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '55%',
            backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.35,
            maskImage: 'linear-gradient(to right, transparent, black)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black)',
          }}
        />
      </div>
    );
  }

  if (id === 'hackwithindia-2026') {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #091838 0%, #1A0D22 50%, #0B1E4A 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '1.25rem 1.75rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ color: '#C1205B', fontSize: '1.4rem', fontWeight: 800, fontFamily: 'monospace' }}>{'</>'}</span>
          <span style={{ color: '#FFFFFF', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            HackWithIndia
          </span>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '50%',
            backgroundImage: `url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.35,
            maskImage: 'linear-gradient(to right, transparent, black)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black)',
          }}
        />
      </div>
    );
  }

  // Generic banner for any other event with deep navy base
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#091838' }}>
      <img
        src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80'}
        alt={event.title}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80';
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(9, 24, 56, 0.85) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};

const EventCard: React.FC<Props> = ({
  event,
  onBookmark,
  isBookmarked = false,
  bookmarkLoading = false,
}) => {
  const getSubCategory = () => {
    if (event.subCategory) return event.subCategory;
    switch (event.category) {
      case 'TECHNOLOGY':
        return 'Hackathon';
      case 'WORKSHOP':
        return 'Workshop';
      case 'CONFERENCE':
        return 'Conference';
      case 'COLLEGE_FEST':
        return 'Tech Fest';
      case 'SEMINAR':
        return 'Seminar';
      default:
        return 'Other';
    }
  };

  const categoryName = getSubCategory();

  // Status badge adhering to locked palette:
  // Green (#DCFCE7 / #16A34A) for Registration Open,
  // Soft pink (#FFE2EB / #C1205B) for Closing Soon,
  // Soft lavender/cyan (#E8F9FC / #0B1E4A) for Upcoming
  const getStatusBadge = () => {
    const badge = event.registrationStatusBadge || 'Registration Open';
    if (badge === 'Closing Soon') {
      return {
        text: 'Closing Soon',
        bg: '#FFE2EB',
        color: '#C1205B',
        dot: '#C1205B',
      };
    }
    if (badge === 'Upcoming') {
      return {
        text: 'Upcoming',
        bg: '#E8F9FC',
        color: '#0B1E4A',
        dot: '#00CBE8',
      };
    }
    return {
      text: 'Registration Open',
      bg: '#DCFCE7',
      color: '#16A34A',
      dot: '#16A34A',
    };
  };

  const status = getStatusBadge();
  const entryFeeText = event.entryFee || 'Free';

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 14,
        border: '1px solid #DDE2F0',
        overflow: 'hidden',
        boxShadow: '0 4px 18px rgba(11, 30, 74, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = '#7AD9E8';
        e.currentTarget.style.boxShadow = '0 8px 28px rgba(11, 30, 74, 0.10)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#DDE2F0';
        e.currentTarget.style.boxShadow = '0 4px 18px rgba(11, 30, 74, 0.06)';
      }}
    >
      {/* Banner Header – half height */}
      <div style={{ height: 80, width: '100%', flexShrink: 0 }}>
        <EventBannerGraphic event={event} />
      </div>

      {/* Card Content */}
      <div style={{ padding: '0.625rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Badges Row: Default tag (Section 13) + Status badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          {/* Default Tag: #EFF1F9 bg, #2E58D7 text, #E8EBF4 border */}
          <span
            style={{
              background: '#EFF1F9',
              color: '#2E58D7',
              border: '1px solid #E8EBF4',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: 999,
            }}
          >
            {categoryName}
          </span>

          {/* Status Badge */}
          <span
            style={{
              background: status.bg,
              color: status.color,
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: 999,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: status.dot,
                display: 'inline-block',
              }}
            />
            {status.text}
          </span>
        </div>

        {/* Title: #0B1E4A font-weight 800 */}
        <h3
          style={{
            fontSize: '0.875rem',
            fontWeight: 800,
            color: '#0B1E4A',
            margin: '0 0 0.125rem 0',
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
            fontFamily: '"DM Sans", "Inter", system-ui, sans-serif',
          }}
        >
          {event.title}
        </h3>

        {/* Organizer subtitle: #5B6487 */}
        <p
          style={{
            fontSize: '0.75rem',
            color: '#5B6487',
            fontWeight: 500,
            margin: '0 0 0.4rem 0',
          }}
        >
          {event.organizer?.name || 'Organized by Student Club'}
        </p>

        {/* Location Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.75rem',
            color: '#5B6487',
            marginBottom: '0.25rem',
          }}
        >
          <MapPin size={12} color="#2E58D7" style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {event.location}
          </span>
        </div>

        {/* Date Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.75rem',
            color: '#5B6487',
            marginBottom: '0.5rem',
          }}
        >
          <Calendar size={12} color="#2E58D7" style={{ flexShrink: 0 }} />
          <span>{formatDateRange(event.startDate, event.endDate)}</span>
        </div>

        {/* Bottom Footer: Entry Fee + Secondary Button + Bookmark */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.4rem',
            borderTop: '1px solid #E8EBF4',
          }}
        >
          {/* Entry Fee */}
          <div style={{ fontSize: '0.75rem', color: '#5B6487' }}>
            Entry:{' '}
            <strong style={{ color: '#0B1E4A', fontWeight: 700 }}>
              {entryFeeText}
            </strong>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            {/* Secondary Button spec: #FFFFFF bg, #0B1E4A text, #DDE2F0 border, 999px radius */}
            <Link
              to={`/events/${event.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.3rem 0.75rem',
                borderRadius: 999,
                border: '1px solid #DDE2F0',
                background: '#FFFFFF',
                color: '#0B1E4A',
                fontWeight: 600,
                fontSize: '0.75rem',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#EFF1F9';
                e.currentTarget.style.borderColor = '#2E58D7';
                e.currentTarget.style.color = '#2E58D7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.borderColor = '#DDE2F0';
                e.currentTarget.style.color = '#0B1E4A';
              }}
            >
              View details
            </Link>

            {/* Bookmark button */}
            <button
              onClick={() => onBookmark?.(event.id, isBookmarked)}
              disabled={bookmarkLoading}
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                border: isBookmarked ? '1px solid #C1205B' : '1px solid #DDE2F0',
                background: isBookmarked ? '#FFE2EB' : '#FFFFFF',
                color: isBookmarked ? '#C1205B' : '#7C849E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              title={isBookmarked ? 'Saved' : 'Save Event'}
              aria-label="Bookmark event"
              onMouseEnter={(e) => {
                if (!isBookmarked) {
                  e.currentTarget.style.borderColor = '#2E58D7';
                  e.currentTarget.style.color = '#2E58D7';
                }
              }}
              onMouseLeave={(e) => {
                if (!isBookmarked) {
                  e.currentTarget.style.borderColor = '#DDE2F0';
                  e.currentTarget.style.color = '#7C849E';
                }
              }}
            >
              <Bookmark size={12} fill={isBookmarked ? '#C1205B' : 'none'} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventCard;
