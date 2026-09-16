import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import EventList, { SkeletonCard } from '../../components/events/EventList';
import EventSearch from '../../components/events/EventSearch';
import EventFilter from '../../components/events/EventFilter';
import EventPagination from '../../components/events/EventPagination';
import { useEvents } from '../../hooks/useEvents';
import { type EventCategory, type EventMode } from '../../types/event';
import { ArrowRight, ChevronLeft, ChevronRight, Users, CheckCircle, Shield } from 'lucide-react';

// ─── Hero Feature Cards (Section 10 & 1) ──────────────────────────────────────
const heroFeatureCards = [
  {
    label: 'Internships',
    title: 'From classroom to career.',
    desc: 'Internships that create real impact.',
    bg: 'linear-gradient(135deg, #091838 0%, #0B1E4A 100%)',
    borderColor: 'rgba(122, 217, 232, 0.25)',
    icon: '🎓',
  },
  {
    label: 'Jobs',
    title: 'Real jobs for bright minds.',
    desc: 'Find roles. Build what\'s next.',
    bg: 'linear-gradient(135deg, #0B1E4A 0%, #2E58D7 100%)',
    borderColor: 'rgba(46, 88, 215, 0.35)',
    icon: '💼',
  },
  {
    label: 'Competitions',
    title: 'Compete. Create. Grow.',
    desc: 'Hackathons, contests, events and more.',
    bg: 'linear-gradient(135deg, #091838 0%, #1C3FA8 100%)',
    borderColor: 'rgba(0, 203, 232, 0.25)',
    icon: '🏆',
  },
];

// ─── Category Grid (Section 12) ───────────────────────────────────────────────
const categories = [
  { icon: '💼', label: 'Internships', variant: 'default' },
  { icon: '👔', label: 'Jobs', variant: 'default' },
  { icon: '🏆', label: 'Competitions', variant: 'default' },
  { icon: '💻', label: 'Hackathons', variant: 'cyan' },
  { icon: '⭐', label: 'Contests', variant: 'default' },
  { icon: '📊', label: 'Quizzes', variant: 'cyan' },
  { icon: '📅', label: 'Events', variant: 'cyan' },
  { icon: '🏫', label: 'College Festivals', variant: 'default' },
  { icon: '🎭', label: 'Cultural Events', variant: 'default' },
];

// ─── Featured Cards (Section 10 Dark Sections) ───────────────────────────────
const featuredItems = [
  {
    brand: 'Google',
    brandColor: '#00CBE8',
    bgColor: '#091838',
    title: 'Build for Bharat',
    subtitle: 'Google Solution Challenge',
    tag: 'Registrations open',
  },
  {
    brand: 'Adobe',
    brandColor: '#C1205B',
    bgColor: '#091838',
    title: 'Create what\'s next.',
    subtitle: 'Adobe GenAI Challenge',
    tag: 'Ends 30 Sep 2026',
  },
  {
    brand: '🏅',
    brandColor: '#7AD9E8',
    bgColor: '#091838',
    title: 'Smart India Hackathon 2026',
    subtitle: 'Innovate. Solve. Impact.',
    tag: 'Registrations open',
  },
  {
    brand: 'unstop',
    brandColor: '#2E58D7',
    bgColor: '#091838',
    title: 'National Case Study Challenge',
    subtitle: 'Think. Solve. Stand out.',
    tag: 'Ends 15 Oct 2026',
  },
  {
    brand: 'TED',
    brandColor: '#9A2A2A',
    bgColor: '#091838',
    title: 'Ideas that move India.',
    subtitle: 'Campus Events',
    tag: 'Explore events',
  },
];

const EventsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [localFilters, setLocalFilters] = useState<{
    category: EventCategory | '';
    mode: EventMode | '';
    location: string;
    date: string;
  }>({ category: '', mode: '', location: '', date: '' });

  const { data, loading, error, filters, updateFilters, setPage } = useEvents({ page: 1, limit: 9 });

  const searchTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      if (searchTimer.current) clearTimeout(searchTimer.current);
      searchTimer.current = setTimeout(() => {
        updateFilters({ search: value });
      }, 400);
    },
    [updateFilters]
  );

  const handleFilterChange = (f: Partial<typeof localFilters>) => {
    const updated = { ...localFilters, ...f };
    setLocalFilters(updated);
    updateFilters({
      category: updated.category || undefined,
      mode: updated.mode || undefined,
      location: updated.location || undefined,
      date: updated.date || undefined,
    });
  };

  const clearFilters = () => {
    setSearch('');
    setLocalFilters({ category: '', mode: '', location: '', date: '' });
    updateFilters({ search: '', category: undefined, mode: undefined, location: undefined, date: undefined });
  };

  const hasActiveFilters = search || localFilters.category || localFilters.mode || localFilters.location || localFilters.date;

  return (
    <div>
      {/* ══════════════ HERO SECTION (Section 7) ══════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #EFF1F9 68%, #FFE2EB 100%)',
        padding: '3rem 1.5rem 2.5rem',
        borderBottom: '1px solid #DDE2F0',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}>
          {/* Left: Headline */}
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2E58D7', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.75rem' }}>
              INDIA'S OPPORTUNITY PLATFORM
            </p>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              fontWeight: 800,
              color: '#0B1E4A',
              margin: '0 0 0.5rem',
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
            }}>
              Your next{' '}
              <span className="editorial-italic" style={{
                fontFamily: '"DM Serif Display", Georgia, serif',
                fontStyle: 'italic',
                color: '#9A2A2A',
                fontWeight: 400,
              }}>
                chapter
              </span>{' '}
              starts here.
            </h1>
            <p style={{ fontSize: '1rem', color: '#5B6487', margin: '0 0 2rem', maxWidth: 460, lineHeight: 1.6 }}>
              Internships, jobs, competitions, hackathons, events and more — all in one place for every student in India.
            </p>

            {/* CTA Buttons (Section 5: Primary Blue + Pill Radius) */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link to="/register" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.75rem',
                borderRadius: '999px',
                background: '#2E58D7',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.9375rem',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(46, 88, 215, 0.25)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#1C3FA8')}
              onMouseLeave={e => (e.currentTarget.style.background = '#2E58D7')}>
                Create your free profile →
              </Link>
              <Link to="/events" onClick={clearFilters} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.75rem',
                borderRadius: '999px',
                background: '#FFFFFF',
                color: '#0B1E4A',
                fontWeight: 600,
                fontSize: '0.9375rem',
                textDecoration: 'none',
                border: '1px solid #DDE2F0',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#EFF1F9';
                e.currentTarget.style.borderColor = '#2E58D7';
                e.currentTarget.style.color = '#2E58D7';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.borderColor = '#DDE2F0';
                e.currentTarget.style.color = '#0B1E4A';
              }}>
                Explore opportunities
              </Link>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { icon: <Users size={15} />, text: '100% free for students' },
                { icon: <CheckCircle size={15} />, text: 'Verified opportunities' },
                { icon: <Shield size={15} />, text: 'Trusted by 500+ companies' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: '#5B6487', fontWeight: 500 }}>
                  <span style={{ color: '#00CBE8' }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Feature Cards (Section 10 Dark/Navy System) */}
          <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }} className="hero-cards-hide">
            {heroFeatureCards.map((card) => (
              <div
                key={card.label}
                style={{
                  width: 145,
                  borderRadius: '14px',
                  background: card.bg,
                  border: `1px solid ${card.borderColor}`,
                  padding: '1.25rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 205,
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 4px 18px rgba(11, 30, 74, 0.08)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(11, 30, 74, 0.14)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 18px rgba(11, 30, 74, 0.08)';
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{card.icon}</div>
                <div>
                  <p style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.25rem', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
                    {card.title}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: '#DDE2F0', margin: '0 0 1rem', lineHeight: 1.4 }}>
                    {card.desc}
                  </p>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    background: 'rgba(255,255,255,0.18)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                    backdropFilter: 'blur(4px)',
                  }}>
                    {card.label} <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* ══════════════ CATEGORY GRID (Section 12) ══════════════ */}
        <section style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => {
              const catMap: Record<string, EventCategory> = {
                'Competitions': 'OTHER' as EventCategory,
                'Hackathons': 'TECHNOLOGY' as EventCategory,
                'Events': 'CULTURAL' as EventCategory,
                'College Festivals': 'COLLEGE_FEST' as EventCategory,
                'Cultural Events': 'CULTURAL' as EventCategory,
                'Contests': 'ACADEMIC' as EventCategory,
                'Quizzes': 'WORKSHOP' as EventCategory,
              };
              const isSelected = catMap[cat.label] && localFilters.category === catMap[cat.label];
              const isCyan = cat.variant === 'cyan';

              const cardBg = isSelected ? '#FFE2EB' : isCyan ? '#E8F9FC' : '#FFFFFF';
              const cardBorder = isSelected ? '#C1205B' : isCyan ? '#7AD9E8' : '#DDE2F0';

              return (
                <button
                  key={cat.label}
                  className="category-btn"
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.375rem',
                    minWidth: 80,
                    background: cardBg,
                    borderColor: cardBorder,
                    borderRadius: '14px',
                    boxShadow: '0 4px 18px rgba(11, 30, 74, 0.04)',
                  }}
                  onClick={() => {
                    if (catMap[cat.label]) {
                      if (isSelected) {
                        handleFilterChange({ category: '' });
                      } else {
                        handleFilterChange({ category: catMap[cat.label] });
                      }
                    } else {
                      clearFilters();
                    }
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#0B1E4A', textAlign: 'center' }}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ══════════════ FEATURED (Section 10 Dark Sections) ══════════════ */}
        <section style={{ marginBottom: '2.5rem' }}>
          <div className="section-header">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <h2 className="section-title">Featured</h2>
              <span className="section-subtitle">Handpicked opportunities, events and stories for you.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              <button style={{
                width: 32,
                height: 32,
                borderRadius: '999px',
                border: '1px solid #DDE2F0',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#0B1E4A',
                boxShadow: '0 2px 8px rgba(11, 30, 74, 0.04)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#7AD9E8';
                e.currentTarget.style.color = '#2E58D7';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#DDE2F0';
                e.currentTarget.style.color = '#0B1E4A';
              }}>
                <ChevronLeft size={16} />
              </button>
              <button style={{
                width: 32,
                height: 32,
                borderRadius: '999px',
                border: '1px solid #DDE2F0',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#0B1E4A',
                boxShadow: '0 2px 8px rgba(11, 30, 74, 0.04)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#7AD9E8';
                e.currentTarget.style.color = '#2E58D7';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#DDE2F0';
                e.currentTarget.style.color = '#0B1E4A';
              }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="scroll-x">
            {featuredItems.map((item, i) => (
              <div
                key={i}
                className="featured-card"
                style={{
                  minWidth: 210,
                  minHeight: 240,
                  background: '#091838',
                  border: '1px solid rgba(221, 226, 240, 0.14)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 14,
                  boxShadow: '0 4px 18px rgba(11, 30, 74, 0.12)',
                }}
              >
                {/* Brand */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: item.brandColor }}>{item.brand}</span>
                  <button style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#7AD9E8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                  }}>♡</button>
                </div>
                {/* Content */}
                <div>
                  <p style={{ fontWeight: 800, fontSize: '1rem', color: '#FFFFFF', margin: '0 0 0.25rem', lineHeight: 1.3, letterSpacing: '-0.02em' }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#DDE2F0', margin: '0 0 0.75rem', lineHeight: 1.4 }}>
                    {item.subtitle}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#7AD9E8', fontWeight: 600 }}>{item.tag}</span>
                    <button style={{
                      width: 28,
                      height: 28,
                      borderRadius: '999px',
                      background: '#2E58D7',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#1C3FA8')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#2E58D7')}>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ SEARCH + FILTER ══════════════ */}
        <section style={{ marginBottom: '1.25rem' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <EventSearch value={search} onChange={handleSearch} />
          </div>
          <EventFilter filters={localFilters} onChange={handleFilterChange} onClear={clearFilters} />
        </section>

        {/* ══════════════ EVENTS SECTION ══════════════ */}
        <section>
          <div className="section-header" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <h2 className="section-title">Events</h2>
              <span className="section-subtitle">Join events, college festivals and more.</span>
            </div>
            <Link to="/events" className="view-all-link">View all →</Link>
          </div>

          {/* Results count */}
          {data && !loading && (
            <p style={{ color: '#7C849E', fontSize: '0.8125rem', marginBottom: '1rem' }}>
              Showing <strong style={{ color: '#0B1E4A' }}>{data.total}</strong> event{data.total !== 1 ? 's' : ''}
              {filters.search && <> matching "<strong style={{ color: '#0B1E4A' }}>{filters.search}</strong>"</>}
              {hasActiveFilters && (
                <button onClick={clearFilters} style={{ marginLeft: '0.75rem', fontSize: '0.75rem', color: '#2E58D7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
                  Clear filters ✕
                </button>
              )}
            </p>
          )}

          {/* Event Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              background: '#FFE2EB',
              border: '1px solid #C1205B',
              borderRadius: '14px',
              color: '#9A2A2A',
            }}>
              <p style={{ fontSize: '1rem', margin: 0, fontWeight: 700 }}>⚠️ {error}</p>
              <p style={{ color: '#5B6487', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                {import.meta.env.PROD
                  ? 'If the server was idle, please allow ~30 seconds for it to wake up and refresh.'
                  : 'Make sure the backend server is running on port 5000.'}
              </p>
            </div>
          ) : (
            <EventList events={data?.events || []} />
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <EventPagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={setPage}
              total={data.total}
              limit={data.limit}
            />
          )}
        </section>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-cards-hide { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default EventsPage;
