import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Share2,
  Users,
  Award,
  Phone,
  Mail,
  GraduationCap,
  Bookmark,
  CheckCircle,
  Mic,
  Gift,
  Network,
  FileCheck,
  Code2,
  Briefcase,
  Utensils,
  Navigation,
} from 'lucide-react';
import { Event } from '../../types/event';
import { formatDateRange } from '../../utils/eventUtils';
import { eventApi } from '../../services/eventApi';
import toast from 'react-hot-toast';

interface Props {
  event: Event;
  onUpdate?: (event: Event) => void;
}

const RupeeIcon = ({ size = 18, color = '#2E58D7' }: { size?: number; color?: string }) => (
  <span style={{ fontSize: size, fontWeight: 700, color, lineHeight: 1 }}>₹</span>
);

const EventDetails: React.FC<Props> = ({ event, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Events' | 'Venue' | 'Eligibility' | 'Contact'>('Overview');
  const [isSaved, setIsSaved] = useState(event.isBookmarked || false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(event.isRegistered || false);
  const [showRegModal, setShowRegModal] = useState(false);
  const [regForm, setRegForm] = useState({ name: '', email: '', college: '', year: '3rd Year' });

  // Share handler
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: event.title,
          text: `Check out ${event.title} on InternAtlas!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Event link copied to clipboard!');
    }
  };

  // Bookmark toggle
  const handleToggleSave = async () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    try {
      if (nextSaved) {
        await eventApi.bookmarkEvent(event.id);
        toast.success('Event saved to your bookmarks');
      } else {
        await eventApi.removeBookmark(event.id);
        toast.success('Removed from bookmarks');
      }
      onUpdate?.({ ...event, isBookmarked: nextSaved });
    } catch {
      setIsSaved(!nextSaved);
      toast.error('Failed to update bookmark');
    }
  };

  // Registration handler
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      await eventApi.registerForEvent(event.id);
      setHasRegistered(true);
      setShowRegModal(false);
      toast.success('🎉 You have registered for this event!');
      onUpdate?.({
        ...event,
        isRegistered: true,
        _count: { registrations: (event._count?.registrations ?? 0) + 1 },
      });
    } catch {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

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
      default:
        return 'Technology Event';
    }
  };

  const organizerName = event.organizer?.name || 'Google Developer Student Clubs';
  const entryFee = event.entryFee || 'Free';
  const expectedCrowd = event.expectedCrowd || `${event.capacity.toLocaleString()}+`;
  const contactPhone = event.contactPhone || '+91 98765 43210';
  const contactEmail = event.contactEmail || (event.organizer?.email || 'gdsc@google.com');
  const venueAddress =
    event.venue ||
    (event.location.includes('Bengaluru')
      ? 'Bangalore International Exhibition Centre (BIEC), Bengaluru, Karnataka - 560062'
      : `${event.location} - Exhibition & Convention Complex`);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', color: '#0B1E4A' }}>
      
      {/* ══════════════ 1. HERO BANNER CARD (Deep Navy Section) ══════════════ */}
      <div
        style={{
          borderRadius: 20,
          background: 'linear-gradient(135deg, #091838 0%, #0B1E4A 60%, #1C3FA8 100%)',
          position: 'relative',
          overflow: 'hidden',
          padding: '2.5rem 3rem',
          minHeight: 260,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: '0 8px 28px rgba(11, 30, 74, 0.15)',
          marginBottom: '1.25rem',
        }}
      >
        {/* Background Keynote Audience Silhouette */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '60%',
            backgroundImage: `url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.35,
            maskImage: 'linear-gradient(to right, transparent, black)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black)',
          }}
        />

        {/* Top-Right: Registration Status Badge */}
        <div style={{ position: 'absolute', top: '1.5rem', right: '1.75rem', zIndex: 5 }}>
          <span
            style={{
              background: 'rgba(220, 252, 231, 0.95)',
              backdropFilter: 'blur(8px)',
              color: '#15803D',
              fontSize: '0.825rem',
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: 999,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(11, 30, 74, 0.1)',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#16A34A',
                display: 'inline-block',
              }}
            />
            Registration Open
          </span>
        </div>

        {/* Banner Content (Google Logo + Title + Subtitle) */}
        <div style={{ position: 'relative', zIndex: 3, maxWidth: 620 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1rem' }}>
            {/* Google "G" / Sponsor Logo */}
            <svg width="56" height="56" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
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
              <h1
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                  fontWeight: 800,
                  margin: 0,
                  lineHeight: 1.15,
                  letterSpacing: '-0.035em',
                  fontFamily: '"DM Sans", "Inter", system-ui, sans-serif',
                }}
              >
                {event.title}
              </h1>
            </div>
          </div>

          <p
            style={{
              color: '#DDE2F0',
              fontSize: '1.05rem',
              margin: 0,
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            A nationwide hackathon to build solutions for a better India
          </p>
        </div>
      </div>

      {/* ══════════════ 2. QUICK INFO STRIP ══════════════ */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          border: '1px solid #DDE2F0',
          boxShadow: '0 4px 18px rgba(11, 30, 74, 0.06)',
          padding: '0.85rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#0B1E4A', fontSize: '0.9rem', fontWeight: 600 }}>
            <Calendar size={18} color="#2E58D7" />
            <span>{formatDateRange(event.startDate, event.endDate)}</span>
          </div>

          {/* Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#0B1E4A', fontSize: '0.9rem', fontWeight: 600 }}>
            <MapPin size={18} color="#2E58D7" />
            <span>{event.location}</span>
          </div>

          {/* Entry Fee */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#0B1E4A', fontSize: '0.9rem', fontWeight: 600 }}>
            <RupeeIcon size={18} color="#2E58D7" />
            <span>{entryFee}</span>
          </div>

          {/* Expected Crowd */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#0B1E4A', fontSize: '0.9rem', fontWeight: 600 }}>
            <Users size={18} color="#2E58D7" />
            <span>Expected Crowd {expectedCrowd}</span>
          </div>
        </div>

        {/* Share Button (Secondary button styling) */}
        <button
          onClick={handleShare}
          style={{
            background: '#FFFFFF',
            border: '1px solid #DDE2F0',
            color: '#0B1E4A',
            fontWeight: 600,
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            padding: '0.45rem 1.15rem',
            borderRadius: 999,
            transition: 'all 0.15s',
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
          <Share2 size={16} />
          <span>Share</span>
        </button>
      </div>

      {/* ══════════════ 3. TABS NAVIGATION BAR ══════════════ */}
      <div
        style={{
          display: 'flex',
          gap: '2.5rem',
          borderBottom: '1px solid #DDE2F0',
          marginBottom: '2rem',
        }}
      >
        {(['Overview', 'Events', 'Venue', 'Eligibility', 'Contact'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '0.75rem 0.25rem 1rem',
                fontSize: '0.95rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#2E58D7' : '#5B6487',
                cursor: 'pointer',
                position: 'relative',
                transition: 'color 0.15s',
              }}
            >
              {tab}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: -1,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: '#2E58D7',
                    borderRadius: '3px 3px 0 0',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ══════════════ 4. MAIN BODY (2 COLUMNS) ══════════════ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)',
          gap: '2.5rem',
          alignItems: 'flex-start',
        }}
        className="event-details-layout"
      >
        {/* ── LEFT COLUMN ── */}
        <div>
          {/* About the Event Section */}
          <section style={{ marginBottom: '2.25rem' }}>
            <h2
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#0B1E4A',
                margin: '0 0 1rem 0',
                letterSpacing: '-0.02em',
                fontFamily: '"DM Sans", "Inter", system-ui, sans-serif',
              }}
            >
              About the Event
            </h2>
            <p
              style={{
                fontSize: '0.975rem',
                color: '#5B6487',
                lineHeight: 1.75,
                margin: '0 0 1.75rem 0',
              }}
            >
              {event.description}
            </p>

            {/* 6 Information Badges / Cards Grid (2 cols x 3 rows) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem',
              }}
            >
              {/* 1. Event Type */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 14,
                  border: '1px solid #DDE2F0',
                  padding: '0.9rem 1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  boxShadow: '0 4px 18px rgba(11, 30, 74, 0.04)',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: '#EFF1F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Award size={20} color="#2E58D7" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#7C849E', fontWeight: 600 }}>Event Type</div>
                  <div style={{ fontSize: '0.925rem', color: '#0B1E4A', fontWeight: 700 }}>
                    {getSubCategory()}
                  </div>
                </div>
              </div>

              {/* 2. Organised by */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 14,
                  border: '1px solid #DDE2F0',
                  padding: '0.9rem 1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  boxShadow: '0 4px 18px rgba(11, 30, 74, 0.04)',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: '#EFF1F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Users size={20} color="#2E58D7" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#7C849E', fontWeight: 600 }}>Organised by</div>
                  <div style={{ fontSize: '0.925rem', color: '#0B1E4A', fontWeight: 700 }}>
                    {organizerName}
                  </div>
                </div>
              </div>

              {/* 3. Target Audience */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 14,
                  border: '1px solid #DDE2F0',
                  padding: '0.9rem 1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  boxShadow: '0 4px 18px rgba(11, 30, 74, 0.04)',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: '#EFF1F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <GraduationCap size={20} color="#2E58D7" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#7C849E', fontWeight: 600 }}>Target Audience</div>
                  <div style={{ fontSize: '0.925rem', color: '#0B1E4A', fontWeight: 700 }}>
                    {event.eligibility || 'Open to all students'}
                  </div>
                </div>
              </div>

              {/* 4. Entry Fee */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 14,
                  border: '1px solid #DDE2F0',
                  padding: '0.9rem 1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  boxShadow: '0 4px 18px rgba(11, 30, 74, 0.04)',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: '#EFF1F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <RupeeIcon size={20} color="#2E58D7" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#7C849E', fontWeight: 600 }}>Entry Fee</div>
                  <div style={{ fontSize: '0.925rem', color: '#0B1E4A', fontWeight: 700 }}>
                    {entryFee}
                  </div>
                </div>
              </div>

              {/* 5. Contact */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 14,
                  border: '1px solid #DDE2F0',
                  padding: '0.9rem 1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  boxShadow: '0 4px 18px rgba(11, 30, 74, 0.04)',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: '#EFF1F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Phone size={18} color="#2E58D7" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#7C849E', fontWeight: 600 }}>Contact</div>
                  <div style={{ fontSize: '0.925rem', color: '#0B1E4A', fontWeight: 700 }}>
                    {contactPhone}
                  </div>
                </div>
              </div>

              {/* 6. Email */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 14,
                  border: '1px solid #DDE2F0',
                  padding: '0.9rem 1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  boxShadow: '0 4px 18px rgba(11, 30, 74, 0.04)',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: '#EFF1F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Mail size={18} color="#2E58D7" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#7C849E', fontWeight: 600 }}>Email</div>
                  <div style={{ fontSize: '0.925rem', color: '#0B1E4A', fontWeight: 700 }}>
                    {contactEmail}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Row: Primary Button (#2E58D7) + Secondary Button (#FFFFFF) */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <button
                onClick={() => setShowRegModal(true)}
                disabled={hasRegistered}
                style={{
                  background: hasRegistered ? '#16A34A' : '#2E58D7',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 999,
                  padding: '0.85rem 2.25rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: hasRegistered ? 'default' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  boxShadow: '0 4px 14px rgba(46, 88, 215, 0.25)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!hasRegistered) e.currentTarget.style.background = '#1C3FA8';
                }}
                onMouseLeave={(e) => {
                  if (!hasRegistered) e.currentTarget.style.background = '#2E58D7';
                }}
              >
                {hasRegistered ? (
                  <>
                    <CheckCircle size={18} /> Registered
                  </>
                ) : (
                  <>Register Now →</>
                )}
              </button>

              <button
                onClick={handleToggleSave}
                style={{
                  background: isSaved ? '#FFE2EB' : '#FFFFFF',
                  color: isSaved ? '#C1205B' : '#0B1E4A',
                  border: isSaved ? '1px solid #C1205B' : '1px solid #DDE2F0',
                  borderRadius: 999,
                  padding: '0.85rem 1.75rem',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!isSaved) {
                    e.currentTarget.style.background = '#EFF1F9';
                    e.currentTarget.style.borderColor = '#2E58D7';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSaved) {
                    e.currentTarget.style.background = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#DDE2F0';
                  }
                }}
              >
                <Bookmark size={18} fill={isSaved ? '#C1205B' : 'none'} color={isSaved ? '#C1205B' : '#5B6487'} />
                <span>{isSaved ? 'Saved' : 'Save Event'}</span>
              </button>
            </div>
          </section>

          {/* Event Highlights Section */}
          <section>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#0B1E4A',
                margin: '0 0 1.25rem 0',
                letterSpacing: '-0.02em',
                fontFamily: '"DM Sans", "Inter", system-ui, sans-serif',
              }}
            >
              Event Highlights
            </h3>

            {/* 8 Highlight Badges (using light background pill styling) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                gap: '0.85rem',
              }}
            >
              {[
                { title: 'Expert Mentorship', icon: <Users size={16} color="#2E58D7" /> },
                { title: 'Tech Talks', icon: <Mic size={16} color="#2E58D7" /> },
                { title: 'Prizes & Goodies', icon: <Gift size={16} color="#2E58D7" /> },
                { title: 'Networking', icon: <Network size={16} color="#2E58D7" /> },
                { title: 'Certificates', icon: <FileCheck size={16} color="#2E58D7" /> },
                { title: 'Live Project Showcase', icon: <Code2 size={16} color="#2E58D7" /> },
                { title: 'Career Opportunities', icon: <Briefcase size={16} color="#2E58D7" /> },
                { title: 'Food & Refreshments', icon: <Utensils size={16} color="#2E58D7" /> },
              ].map((hl) => (
                <div
                  key={hl.title}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #DDE2F0',
                    borderRadius: 14,
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    boxShadow: '0 2px 8px rgba(11, 30, 74, 0.03)',
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: '#EFF1F9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {hl.icon}
                  </div>
                  <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#0B1E4A' }}>{hl.title}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── RIGHT COLUMN (SIDEBAR) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Mini Event Preview Card (Deep Navy Section) */}
          <div
            style={{
              borderRadius: 14,
              background: 'linear-gradient(135deg, #091838 0%, #0B1E4A 60%, #1C3FA8 100%)',
              padding: '1.5rem',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 18px rgba(11, 30, 74, 0.08)',
              border: '1px solid #DDE2F0',
            }}
          >
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <svg width="42" height="42" viewBox="0 0 24 24">
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
                <div style={{ color: '#FFFFFF', fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.15 }}>
                  Build
                </div>
                <div style={{ color: '#7AD9E8', fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.15 }}>
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
                width: '60%',
                backgroundImage: `url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80')`,
                backgroundSize: 'cover',
                opacity: 0.25,
              }}
            />
          </div>

          {/* Location Box */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 14,
              border: '1px solid #DDE2F0',
              padding: '1.5rem',
              boxShadow: '0 4px 18px rgba(11, 30, 74, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <MapPin size={18} color="#2E58D7" />
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0B1E4A' }}>Location</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#5B6487', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
              {venueAddress}
            </p>
            {/* Secondary Button spec */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '1px solid #DDE2F0',
                borderRadius: 999,
                padding: '0.55rem 1.25rem',
                color: '#0B1E4A',
                background: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.15s',
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
              <Navigation size={14} color="#2E58D7" />
              <span>View on Map</span>
            </a>
          </div>

          {/* Inspirational Quote Card (Section 9: Editorial Italic Style) */}
          <div
            style={{
              background: '#FFE2EB',
              borderRadius: 14,
              padding: '1.75rem 1.5rem',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid #FFE2EB',
              boxShadow: '0 4px 18px rgba(11, 30, 74, 0.04)',
            }}
          >
            <span
              style={{
                fontSize: '2.5rem',
                color: '#9A2A2A',
                fontFamily: '"DM Serif Display", Georgia, serif',
                lineHeight: 0.5,
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              “
            </span>
            <p
              style={{
                color: '#9A2A2A',
                fontSize: '1.15rem',
                fontWeight: 400,
                fontFamily: '"DM Serif Display", Georgia, serif',
                fontStyle: 'italic',
                margin: 0,
                lineHeight: 1.45,
              }}
            >
              Innovate today for a brighter tomorrow.
            </p>
            <span
              style={{
                fontSize: '2.5rem',
                color: '#9A2A2A',
                fontFamily: '"DM Serif Display", Georgia, serif',
                lineHeight: 0.5,
                display: 'block',
                textAlign: 'right',
                marginTop: '0.5rem',
              }}
            >
              ”
            </span>
          </div>

        </div>
      </div>

      {/* Registration Modal */}
      {showRegModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(9, 24, 56, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 14,
              maxWidth: 480,
              width: '100%',
              padding: '2rem',
              boxShadow: '0 8px 28px rgba(11, 30, 74, 0.15)',
              border: '1px solid #DDE2F0',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B1E4A', margin: '0 0 0.5rem 0', fontFamily: '"DM Sans", "Inter", system-ui, sans-serif' }}>
              Register for {event.title}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#5B6487', margin: '0 0 1.5rem 0' }}>
              Confirm your details to reserve your free pass.
            </p>

            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#0B1E4A', marginBottom: 4 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 10,
                    border: '1px solid #DDE2F0',
                    fontSize: '0.9rem',
                    outline: 'none',
                    color: '#0B1E4A',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#0B1E4A', marginBottom: 4 }}>
                  College Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@college.edu.in"
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 10,
                    border: '1px solid #DDE2F0',
                    fontSize: '0.9rem',
                    outline: 'none',
                    color: '#0B1E4A',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#0B1E4A', marginBottom: 4 }}>
                  College / University
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indian Institute of Science"
                  value={regForm.college}
                  onChange={(e) => setRegForm({ ...regForm, college: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 10,
                    border: '1px solid #DDE2F0',
                    fontSize: '0.9rem',
                    outline: 'none',
                    color: '#0B1E4A',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowRegModal(false)}
                  style={{
                    flex: 1,
                    background: '#FFFFFF',
                    border: '1px solid #DDE2F0',
                    padding: '0.75rem',
                    borderRadius: 999,
                    fontWeight: 600,
                    color: '#0B1E4A',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegistering}
                  style={{
                    flex: 1,
                    background: '#2E58D7',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: 999,
                    fontWeight: 700,
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(46, 88, 215, 0.25)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#1C3FA8')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#2E58D7')}
                >
                  {isRegistering ? 'Registering...' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default EventDetails;
