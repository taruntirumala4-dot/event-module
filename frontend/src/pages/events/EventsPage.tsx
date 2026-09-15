import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import EventList, { SkeletonCard } from '../../components/events/EventList';
import EventSearch from '../../components/events/EventSearch';
import EventFilter from '../../components/events/EventFilter';
import EventPagination from '../../components/events/EventPagination';
import { useEvents } from '../../hooks/useEvents';
import { type EventCategory, type EventMode } from '../../types/event';
import { ArrowRight, ChevronLeft, ChevronRight, Users, CheckCircle, Shield } from 'lucide-react';

// ─── Hero Feature Cards ──────────────────────────────────────────────────────
const heroFeatureCards = [
  {
    label: 'Internships',
    title: 'From classroom to career.',
    desc: 'Internships that create real impact.',
    color: '#1e3a8a',
    bg: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
    icon: '🎓',
  },
  {
    label: 'Jobs',
    title: 'Real jobs for bright minds.',
    desc: 'Find roles. Build what\'s next.',
    color: '#1e293b',
    bg: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    icon: '💼',
  },
  {
    label: 'Competitions',
    title: 'Compete. Create. Grow.',
    desc: 'Hackathons, contests, events and more.',
    color: '#7c3aed',
    bg: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    icon: '🏆',
  },
];

// ─── Category Grid ───────────────────────────────────────────────────────────
const categories = [
  { icon: '💼', label: 'Internships', color: '#2563eb' },
  { icon: '👔', label: 'Jobs', color: '#dc2626' },
  { icon: '🏆', label: 'Competitions', color: '#16a34a' },
  { icon: '💻', label: 'Hackathons', color: '#9333ea' },
  { icon: '⭐', label: 'Contests', color: '#d97706' },
  { icon: '📊', label: 'Quizzes', color: '#e11d48' },
  { icon: '📅', label: 'Events', color: '#0891b2' },
  { icon: '🏫', label: 'College Festivals', color: '#059669' },
  { icon: '🎭', label: 'Cultural Events', color: '#7c3aed' },
];

// ─── Featured Cards ──────────────────────────────────────────────────────────
const featuredItems = [
  {
    brand: 'Google',
    brandColor: '#4285f4',
    bgColor: '#1a1a2e',
    title: 'Build for Bharat',
    subtitle: 'Google Solution Challenge',
    tag: 'Registrations open',
  },
  {
    brand: 'Adobe',
    brandColor: '#fa0f00',
    bgColor: '#1a0a00',
    title: 'Create what\'s next.',
    subtitle: 'Adobe GenAI Challenge',
    tag: 'Ends 30 Sep 2026',
  },
  {
    brand: '🏅',
    brandColor: '#f59e0b',
    bgColor: '#0a1a0a',
    title: 'Smart India Hackathon 2026',
    subtitle: 'Innovate. Solve. Impact.',
    tag: 'Registrations open',
  },
  {
    brand: 'unstop',
    brandColor: '#7c3aed',
    bgColor: '#0f0a1a',
    title: 'National Case Study Challenge',
    subtitle: 'Think. Solve. Stand out.',
    tag: 'Ends 15 Oct 2026',
  },
  {
    brand: 'TED',
    brandColor: '#e11d48',
    bgColor: '#1a0a0a',
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
      {/* ══════════════ HERO SECTION ══════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fff0f6 100%)',
        padding: '3rem 1.5rem 2.5rem',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}>
          {/* Left: Headline */}
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.75rem' }}>
              INDIA'S OPPORTUNITY PLATFORM
            </p>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              fontWeight: 900,
              color: '#1e293b',
              margin: '0 0 0.5rem',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}>
              Your next{' '}
              <span style={{
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontStyle: 'italic',
              }}>
                chapter
              </span>{' '}
              starts here.
            </h1>
            <p style={{ fontSize: '1rem', color: '#475569', margin: '0 0 2rem', maxWidth: 460, lineHeight: 1.6 }}>
              Internships, jobs, competitions, hackathons, events and more — all in one place for every student in India.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link to="/register" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                background: '#1e293b',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9375rem',
                textDecoration: 'none',
              }}>
                Create your free profile →
              </Link>
              <Link to="/events" onClick={clearFilters} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                background: '#ffffff',
                color: '#1e293b',
                fontWeight: 600,
                fontSize: '0.9375rem',
                textDecoration: 'none',
                border: '1.5px solid #e2e8f0',
              }}>
                Explore opportunities
              </Link>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { icon: <Users size={14} />, text: '100% free for students' },
                { icon: <CheckCircle size={14} />, text: 'Verified opportunities' },
                { icon: <Shield size={14} />, text: 'Trusted by 500+ companies' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: '#64748b' }}>
                  <span style={{ color: '#2563eb' }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Feature Cards */}
          <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }} className="hero-cards-hide">
            {heroFeatureCards.map((card) => (
              <div
                key={card.label}
                style={{
                  width: 145,
                  borderRadius: '16px',
                  background: card.bg,
                  padding: '1.25rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 200,
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{card.icon}</div>
                <div>
                  <p style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.25rem', lineHeight: 1.25 }}>
                    {card.title}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.65)', margin: '0 0 1rem', lineHeight: 1.4 }}>
                    {card.desc}
                  </p>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    background: 'rgba(255,255,255,0.15)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
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

        {/* ══════════════ CATEGORY GRID ══════════════ */}
        <section style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat.label}
                className="category-btn"
                style={{ flexDirection: 'column', alignItems: 'center', gap: '0.375rem', minWidth: 80 }}
                onClick={() => {
                  const catMap: Record<string, EventCategory> = {
                    'Competitions': 'OTHER' as EventCategory,
                    'Hackathons': 'TECHNOLOGY' as EventCategory,
                    'Events': 'CULTURAL' as EventCategory,
                    'College Festivals': 'COLLEGE_FEST' as EventCategory,
                    'Cultural Events': 'CULTURAL' as EventCategory,
                    'Contests': 'ACADEMIC' as EventCategory,
                    'Quizzes': 'WORKSHOP' as EventCategory,
                  };
                  if (catMap[cat.label]) handleFilterChange({ category: catMap[cat.label] });
                  else clearFilters();
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569', textAlign: 'center' }}>{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ══════════════ FEATURED ══════════════ */}
        <section style={{ marginBottom: '2.5rem' }}>
          <div className="section-header">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <h2 className="section-title">Featured</h2>
              <span className="section-subtitle">Handpicked opportunities, events and stories for you.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              <button style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                <ChevronLeft size={14} />
              </button>
              <button style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
          <div className="scroll-x">
            {featuredItems.map((item, i) => (
              <div
                key={i}
                className="featured-card"
                style={{
                  minWidth: 200,
                  minHeight: 240,
                  background: item.bgColor,
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 16,
                }}
              >
                {/* Brand */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: item.brandColor }}>{item.brand}</span>
                  <button style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>♡</button>
                </div>
                {/* Content */}
                <div>
                  <p style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff', margin: '0 0 0.25rem', lineHeight: 1.3 }}>{item.title}</p>
                  <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', margin: '0 0 0.75rem' }}>{item.subtitle}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{item.tag}</span>
                    <button style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ SEARCH + FILTER ══════════════ */}
        <section style={{ marginBottom: '1rem' }}>
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
            <p style={{ color: '#94a3b8', fontSize: '0.8125rem', marginBottom: '1rem' }}>
              Showing <strong style={{ color: '#475569' }}>{data.total}</strong> event{data.total !== 1 ? 's' : ''}
              {filters.search && <> matching "<strong style={{ color: '#475569' }}>{filters.search}</strong>"</>}
              {hasActiveFilters && (
                <button onClick={clearFilters} style={{ marginLeft: '0.75rem', fontSize: '0.75rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
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
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              color: '#dc2626',
            }}>
              <p style={{ fontSize: '1rem', margin: 0 }}>⚠️ {error}</p>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Make sure the backend server is running on port 5000.
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
