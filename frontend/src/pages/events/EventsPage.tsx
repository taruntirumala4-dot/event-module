import React, { useState, useMemo } from 'react';
import { useLocation as useRouterLocation } from 'react-router-dom';
import {
  Search,
  Calendar,
  Layers,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import EventCard from '../../components/events/EventCard';
import { useEvents } from '../../hooks/useEvents';
import { Event } from '../../types/event';

// Custom Rupee Icon
const RupeeIcon = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <span style={{ fontSize: size, fontWeight: 700, color, lineHeight: 1, display: 'inline-block' }}>₹</span>
);

const EventsPage: React.FC = () => {
  const routerLocation = useRouterLocation();
  const searchParams = new URLSearchParams(routerLocation.search);
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  // Search state
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [appliedSearch, setAppliedSearch] = useState(initialSearch);

  // Quick dropdown filter states
  const [dateFilter, setDateFilter] = useState('Anytime');
  const [typeDropdown, setTypeDropdown] = useState('All Types');
  const [cityDropdown, setCityDropdown] = useState('All Cities');
  const [feeDropdown, setFeeDropdown] = useState('All');

  // Sidebar accordion toggle states
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    type: true,
    location: true,
    fee: true,
    date: true,
  });

  // Sidebar checkbox selections
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  // Sorting
  const [sortBy, setSortBy] = useState<'Latest' | 'Soonest' | 'Popular'>('Latest');

  // Fetch from useEvents hook
  const { data, loading } = useEvents({ page: 1, limit: 100 });

  // Toggle accordion section
  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Toggle filter item helper
  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchInput('');
    setAppliedSearch('');
    setDateFilter('Anytime');
    setTypeDropdown('All Types');
    setCityDropdown('All Cities');
    setFeeDropdown('All');
    setSelectedTypes([]);
    setSelectedLocations([]);
    setSelectedFees([]);
    setSelectedDates([]);
  };

  // Process and filter the events
  const filteredEvents = useMemo(() => {
    const rawEvents: Event[] = data?.events || [];

    return rawEvents.filter((event) => {
      // 1. Text search
      if (appliedSearch.trim()) {
        const q = appliedSearch.toLowerCase();
        const matchTitle = event.title.toLowerCase().includes(q);
        const matchLoc = event.location.toLowerCase().includes(q);
        const matchDesc = event.description.toLowerCase().includes(q);
        const matchOrg = event.organizer?.name?.toLowerCase().includes(q);
        if (!matchTitle && !matchLoc && !matchDesc && !matchOrg) return false;
      }

      // 2. Type filter (sidebar checkboxes + dropdown)
      const subCat = event.subCategory || (event.category === 'TECHNOLOGY' ? 'Hackathon' : event.category);
      if (selectedTypes.length > 0) {
        const matchesAnyType = selectedTypes.some(
          (t) =>
            subCat.toLowerCase() === t.toLowerCase() ||
            event.category.toLowerCase() === t.toLowerCase()
        );
        if (!matchesAnyType) return false;
      }
      if (typeDropdown !== 'All Types' && !subCat.toLowerCase().includes(typeDropdown.toLowerCase())) {
        return false;
      }

      // 3. Location filter (sidebar checkboxes + dropdown)
      if (selectedLocations.length > 0) {
        const matchesAnyLoc = selectedLocations.some((loc) => {
          if (loc === 'Others') {
            return !['Chennai', 'Bengaluru', 'Hyderabad', 'Pune', 'Delhi'].some((city) =>
              event.location.toLowerCase().includes(city.toLowerCase())
            );
          }
          return event.location.toLowerCase().includes(loc.toLowerCase());
        });
        if (!matchesAnyLoc) return false;
      }
      if (cityDropdown !== 'All Cities' && !event.location.toLowerCase().includes(cityDropdown.toLowerCase())) {
        return false;
      }

      // 4. Entry fee filter (sidebar checkboxes + dropdown)
      const isFree = !event.entryFee || event.entryFee.toLowerCase() === 'free';
      if (selectedFees.length > 0) {
        const wantFree = selectedFees.includes('Free');
        const wantPaid = selectedFees.includes('Paid');
        if (wantFree && !wantPaid && !isFree) return false;
        if (wantPaid && !wantFree && isFree) return false;
      }
      if (feeDropdown === 'Free' && !isFree) return false;
      if (feeDropdown === 'Paid' && isFree) return false;

      return true;
    });
  }, [
    data,
    appliedSearch,
    selectedTypes,
    typeDropdown,
    selectedLocations,
    cityDropdown,
    selectedFees,
    feeDropdown,
  ]);

  // Sort events
  const sortedEvents = useMemo(() => {
    const list = [...filteredEvents];
    if (sortBy === 'Soonest') {
      return list.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    }
    if (sortBy === 'Popular') {
      return list.sort((a, b) => (b._count?.registrations ?? 0) - (a._count?.registrations ?? 0));
    }
    // Default: 'Latest'
    return list;
  }, [filteredEvents, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(searchInput);
  };

  return (
    <div style={{ background: '#EFF1F9', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* ══════════════ 7. HERO SECTION (Theme Spec locked) ══════════════ */}
      <section
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #EFF1F9 68%, #FFE2EB 100%)',
          borderBottom: '1px solid #DDE2F0',
          padding: '2.5rem 1.5rem 2.25rem',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          {/* Top Hero Row: Headline on left + Doodle Photo Graphic on right */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              flexWrap: 'wrap',
              marginBottom: '2rem',
            }}
          >
            {/* Left Headline */}
            <div style={{ maxWidth: 640 }}>
              <div
                style={{
                  color: '#2E58D7',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.65rem',
                }}
              >
                TECH EVENTS
              </div>
              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)',
                  fontWeight: 800,
                  color: '#0B1E4A',
                  margin: '0 0 0.75rem 0',
                  letterSpacing: '-0.035em',
                  lineHeight: 1.15,
                  fontFamily: '"DM Sans", "Inter", system-ui, sans-serif',
                }}
              >
                Discover <span style={{ color: '#2E58D7' }}>Tech Events</span>
              </h1>
              <p
                style={{
                  fontSize: '1.05rem',
                  color: '#5B6487',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Explore hackathons, workshops, tech fests and more happening across colleges.
              </p>
            </div>

            {/* Right: Graphic with Organic Shape Mask, Crowd Photo & Doodles */}
            <div
              style={{
                position: 'relative',
                width: 320,
                height: 180,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Doodle annotations */}
              <div
                style={{
                  position: 'absolute',
                  left: -5,
                  top: 15,
                  zIndex: 4,
                  textAlign: 'right',
                  fontFamily: 'cursive, "Segoe Print", "Comic Sans MS", sans-serif',
                }}
              >
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0B1E4A', lineHeight: 1.1 }}>
                  Code
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0B1E4A', lineHeight: 1.1, marginTop: 4 }}>
                  Connect
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0B1E4A', lineHeight: 1.1, marginTop: 4 }}>
                  Create
                </div>
                {/* Curved hand-drawn editorial red arrow pointing right */}
                <div style={{ marginTop: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <svg width="34" height="28" viewBox="0 0 34 28" fill="none">
                    <path
                      d="M2 10C8 10 18 12 28 22M28 22L20 22M28 22L26 14"
                      stroke="#9A2A2A"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Cyan sparkle accents */}
              <div
                style={{
                  position: 'absolute',
                  right: 15,
                  top: 5,
                  zIndex: 4,
                  color: '#00CBE8',
                  fontSize: '1.4rem',
                  fontWeight: 900,
                }}
              >
                ✦
              </div>
              <div
                style={{
                  position: 'absolute',
                  right: 5,
                  top: 35,
                  zIndex: 4,
                  color: '#7AD9E8',
                  fontSize: '1rem',
                  fontWeight: 900,
                }}
              >
                +
              </div>

              {/* Organic curved shape container with crowd photo (Deep Navy border/base) */}
              <div
                style={{
                  width: 250,
                  height: 160,
                  marginLeft: 'auto',
                  borderRadius: '35% 65% 55% 45% / 45% 40% 60% 55%',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 10px 25px -5px rgba(11, 30, 74, 0.20)',
                  border: '3px solid #FFFFFF',
                  background: '#091838',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80"
                  alt="Tech conference audience"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(9, 24, 56, 0.75)',
                    backdropFilter: 'blur(4px)',
                    padding: '2px 10px',
                    borderRadius: 4,
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  Google
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════ SEARCH BAR & FILTER STRIP ══════════════ */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 14,
              border: '1px solid #DDE2F0',
              boxShadow: '0 4px 18px rgba(11, 30, 74, 0.06)',
              padding: '0.85rem 1.25rem',
            }}
          >
            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Search size={20} color="#7C849E" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search by event name, domain or city..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.95rem',
                  color: '#0B1E4A',
                  background: 'transparent',
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#2E58D7',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 999,
                  padding: '0.65rem 1.75rem',
                  fontSize: '0.925rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  boxShadow: '0 4px 14px rgba(46, 88, 215, 0.25)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#1C3FA8')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#2E58D7')}
              >
                Search
              </button>
            </form>

            <div style={{ height: 1, background: '#E8EBF4', margin: '0.85rem 0' }} />

            {/* Quick Filter Strip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap',
              }}
            >
              {/* Date Filter Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.875rem', color: '#5B6487' }}>
                <Calendar size={16} color="#2E58D7" />
                <span style={{ fontWeight: 500 }}>Date</span>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontWeight: 700,
                    color: '#0B1E4A',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="Anytime">Anytime</option>
                  <option value="Today">Today</option>
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                </select>
              </div>

              {/* Event Type Filter Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.875rem', color: '#5B6487' }}>
                <Layers size={16} color="#2E58D7" />
                <span style={{ fontWeight: 500 }}>Event Type</span>
                <select
                  value={typeDropdown}
                  onChange={(e) => setTypeDropdown(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontWeight: 700,
                    color: '#0B1E4A',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="All Types">All Types</option>
                  <option value="Hackathon">Hackathons</option>
                  <option value="Workshop">Workshops</option>
                  <option value="Conference">Conferences</option>
                  <option value="Tech Fest">Tech Fests</option>
                  <option value="Seminar">Seminars</option>
                </select>
              </div>

              {/* Location Filter Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.875rem', color: '#5B6487' }}>
                <MapPin size={16} color="#2E58D7" />
                <span style={{ fontWeight: 500 }}>Location</span>
                <select
                  value={cityDropdown}
                  onChange={(e) => setCityDropdown(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontWeight: 700,
                    color: '#0B1E4A',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="All Cities">All Cities</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Noida">Noida</option>
                </select>
              </div>

              {/* Entry Fee Filter Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.875rem', color: '#5B6487' }}>
                <RupeeIcon size={16} color="#2E58D7" />
                <span style={{ fontWeight: 500 }}>Entry Fee</span>
                <select
                  value={feeDropdown}
                  onChange={(e) => setFeeDropdown(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontWeight: 700,
                    color: '#0B1E4A',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="All">All</option>
                  <option value="Free">Free</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              {/* Clear Filters Link */}
              <button
                type="button"
                onClick={handleClearFilters}
                style={{
                  marginLeft: 'auto',
                  background: 'transparent',
                  border: 'none',
                  color: '#2E58D7',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 6,
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ MAIN CONTENT CONTAINER ══════════════ */}
      <div style={{ maxWidth: 1320, margin: '2rem auto 0', padding: '0 1.5rem' }}>
        
        {/* Results Counter & Sort Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0B1E4A' }}>
            Showing {sortedEvents.length} tech events
          </div>

          {/* Sort By Dropdown (Secondary button pill styling) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.875rem',
              color: '#5B6487',
              background: '#FFFFFF',
              border: '1px solid #DDE2F0',
              padding: '0.45rem 1rem',
              borderRadius: 999,
            }}
          >
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'Latest' | 'Soonest' | 'Popular')}
              style={{
                border: 'none',
                background: 'transparent',
                fontWeight: 700,
                color: '#0B1E4A',
                fontSize: '0.875rem',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="Latest">Latest</option>
              <option value="Soonest">Happening Soonest</option>
              <option value="Popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* 2-Column Layout: Sidebar (Left) + Event Grid (Right) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '270px minmax(0, 1fr)',
            gap: '2rem',
            alignItems: 'flex-start',
          }}
          className="responsive-events-grid"
        >
          {/* ══════════════ LEFT SIDEBAR: "Filter by" ══════════════ */}
          <aside
            style={{
              background: '#FFFFFF',
              borderRadius: 14,
              border: '1px solid #DDE2F0',
              padding: '1.5rem',
              boxShadow: '0 4px 18px rgba(11, 30, 74, 0.06)',
            }}
          >
            <h2
              style={{
                fontSize: '1.1rem',
                fontWeight: 800,
                color: '#0B1E4A',
                margin: '0 0 1.25rem 0',
                letterSpacing: '-0.02em',
              }}
            >
              Filter by
            </h2>

            {/* 1. Event Type Section */}
            <div style={{ borderBottom: '1px solid #E8EBF4', paddingBottom: '1.15rem', marginBottom: '1.15rem' }}>
              <button
                onClick={() => toggleSection('type')}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '0.925rem',
                  fontWeight: 700,
                  color: '#0B1E4A',
                  marginBottom: openSections.type ? '0.75rem' : 0,
                }}
              >
                <span>Event Type</span>
                {openSections.type ? <ChevronUp size={16} color="#7C849E" /> : <ChevronDown size={16} color="#7C849E" />}
              </button>

              {openSections.type && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {[
                    { name: 'Hackathon', count: 8 },
                    { name: 'Workshop', count: 7 },
                    { name: 'Conference', count: 5 },
                    { name: 'Tech Fest', count: 3 },
                    { name: 'Seminar', count: 2 },
                    { name: 'Other', count: 2 },
                  ].map((item) => (
                    <label
                      key={item.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        fontSize: '0.85rem',
                        color: '#5B6487',
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(item.name)}
                        onChange={() => toggleItem(selectedTypes, setSelectedTypes, item.name)}
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          accentColor: '#2E58D7',
                          cursor: 'pointer',
                        }}
                      />
                      <span>{item.name} ({item.count})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Location Section */}
            <div style={{ borderBottom: '1px solid #E8EBF4', paddingBottom: '1.15rem', marginBottom: '1.15rem' }}>
              <button
                onClick={() => toggleSection('location')}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '0.925rem',
                  fontWeight: 700,
                  color: '#0B1E4A',
                  marginBottom: openSections.location ? '0.75rem' : 0,
                }}
              >
                <span>Location</span>
                {openSections.location ? <ChevronUp size={16} color="#7C849E" /> : <ChevronDown size={16} color="#7C849E" />}
              </button>

              {openSections.location && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {[
                    { name: 'Chennai', count: 6 },
                    { name: 'Bengaluru', count: 4 },
                    { name: 'Hyderabad', count: 3 },
                    { name: 'Pune', count: 3 },
                    { name: 'Delhi', count: 2 },
                    { name: 'Others', count: 6 },
                  ].map((item) => (
                    <label
                      key={item.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        fontSize: '0.85rem',
                        color: '#5B6487',
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(item.name)}
                        onChange={() => toggleItem(selectedLocations, setSelectedLocations, item.name)}
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          accentColor: '#2E58D7',
                          cursor: 'pointer',
                        }}
                      />
                      <span>{item.name} ({item.count})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Entry Fee Section */}
            <div style={{ borderBottom: '1px solid #E8EBF4', paddingBottom: '1.15rem', marginBottom: '1.15rem' }}>
              <button
                onClick={() => toggleSection('fee')}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '0.925rem',
                  fontWeight: 700,
                  color: '#0B1E4A',
                  marginBottom: openSections.fee ? '0.75rem' : 0,
                }}
              >
                <span>Entry Fee</span>
                {openSections.fee ? <ChevronUp size={16} color="#7C849E" /> : <ChevronDown size={16} color="#7C849E" />}
              </button>

              {openSections.fee && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {[
                    { name: 'Free', count: 14 },
                    { name: 'Paid', count: 8 },
                  ].map((item) => (
                    <label
                      key={item.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        fontSize: '0.85rem',
                        color: '#5B6487',
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFees.includes(item.name)}
                        onChange={() => toggleItem(selectedFees, setSelectedFees, item.name)}
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          accentColor: '#2E58D7',
                          cursor: 'pointer',
                        }}
                      />
                      <span>{item.name} ({item.count})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Date Section */}
            <div>
              <button
                onClick={() => toggleSection('date')}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '0.925rem',
                  fontWeight: 700,
                  color: '#0B1E4A',
                  marginBottom: openSections.date ? '0.75rem' : 0,
                }}
              >
                <span>Date</span>
                {openSections.date ? <ChevronUp size={16} color="#7C849E" /> : <ChevronDown size={16} color="#7C849E" />}
              </button>

              {openSections.date && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {['Today', 'This Week', 'This Month', 'Custom Range'].map((item) => (
                    <label
                      key={item}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        fontSize: '0.85rem',
                        color: '#5B6487',
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDates.includes(item)}
                        onChange={() => toggleItem(selectedDates, setSelectedDates, item)}
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          accentColor: '#2E58D7',
                          cursor: 'pointer',
                        }}
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* ══════════════ RIGHT CONTENT: 2-COLUMN EVENT GRID ══════════════ */}
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#5B6487' }}>
                <p>Loading events...</p>
              </div>
            ) : sortedEvents.length === 0 ? (
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 14,
                  border: '1px solid #DDE2F0',
                  padding: '3.5rem 2rem',
                  textAlign: 'center',
                  boxShadow: '0 4px 18px rgba(11, 30, 74, 0.06)',
                }}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B1E4A', margin: '0 0 0.5rem 0' }}>
                  No tech events found
                </h3>
                <p style={{ color: '#5B6487', fontSize: '0.925rem', marginBottom: '1.25rem' }}>
                  Try relaxing your filter criteria or search query to see more events.
                </p>
                <button
                  onClick={handleClearFilters}
                  style={{
                    background: '#2E58D7',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.65rem 1.5rem',
                    borderRadius: 999,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#1C3FA8')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#2E58D7')}
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {sortedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};

export default EventsPage;
