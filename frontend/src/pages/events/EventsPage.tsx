import React, { useState, useMemo } from 'react';
import { useLocation as useRouterLocation } from 'react-router-dom';
import {
  Search,
  Calendar,
  Layers,
  MapPin,
  Filter,
  ArrowUpDown,
  X,
  RotateCcw,
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

  // Unified Filter States
  const [dateFilter, setDateFilter] = useState('Anytime');
  const [feeFilter, setFeeFilter] = useState<'All' | 'Free' | 'Paid'>('All');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  // Sorting
  const [sortBy, setSortBy] = useState<'Latest' | 'Soonest' | 'Popular'>('Latest');

  // Fetch from useEvents hook
  const { data, loading } = useEvents({ page: 1, limit: 100 });

  // Compute dynamic category & city counts from real events
  const counts = useMemo(() => {
    const raw: Event[] = data?.events || [];
    const typeMap: Record<string, number> = {
      Hackathon: 0,
      Workshop: 0,
      Conference: 0,
      'Tech Fest': 0,
      Seminar: 0,
    };
    const cityMap: Record<string, number> = {
      Chennai: 0,
      Bengaluru: 0,
      Hyderabad: 0,
      Pune: 0,
      Delhi: 0,
      Others: 0,
    };
    let freeCount = 0;
    let paidCount = 0;

    raw.forEach((ev) => {
      const sub = (ev.subCategory || (ev.category === 'TECHNOLOGY' ? 'Hackathon' : ev.category)).toLowerCase();
      if (sub.includes('hackathon')) typeMap.Hackathon++;
      else if (sub.includes('workshop')) typeMap.Workshop++;
      else if (sub.includes('conference')) typeMap.Conference++;
      else if (sub.includes('fest')) typeMap['Tech Fest']++;
      else if (sub.includes('seminar')) typeMap.Seminar++;
      else if (typeMap[ev.category] !== undefined) typeMap[ev.category]++;

      let matchedCity = false;
      ['Chennai', 'Bengaluru', 'Hyderabad', 'Pune', 'Delhi'].forEach((city) => {
        if (ev.location.toLowerCase().includes(city.toLowerCase())) {
          cityMap[city]++;
          matchedCity = true;
        }
      });
      if (!matchedCity) cityMap.Others++;

      const isFree = !ev.entryFee || ev.entryFee.toLowerCase() === 'free';
      if (isFree) freeCount++;
      else paidCount++;
    });

    return { typeMap, cityMap, freeCount, paidCount, total: raw.length };
  }, [data]);

  // Active filter count
  const activeFilterCount =
    selectedTypes.length +
    selectedLocations.length +
    (feeFilter !== 'All' ? 1 : 0) +
    (dateFilter !== 'Anytime' ? 1 : 0) +
    (appliedSearch ? 1 : 0);

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
    setFeeFilter('All');
    setSelectedTypes([]);
    setSelectedLocations([]);
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

      // 2. Type filter
      if (selectedTypes.length > 0) {
        const subCat = (event.subCategory || (event.category === 'TECHNOLOGY' ? 'Hackathon' : event.category)).toLowerCase();
        const matchesAnyType = selectedTypes.some(
          (t) =>
            subCat.includes(t.toLowerCase()) ||
            event.category.toLowerCase().includes(t.toLowerCase())
        );
        if (!matchesAnyType) return false;
      }

      // 3. Location filter
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

      // 4. Entry fee filter
      const isFree = !event.entryFee || event.entryFee.toLowerCase() === 'free';
      if (feeFilter === 'Free' && !isFree) return false;
      if (feeFilter === 'Paid' && isFree) return false;

      // 5. Date filter
      if (dateFilter !== 'Anytime') {
        const now = new Date();
        const start = new Date(event.startDate);
        const diffMs = start.getTime() - now.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (dateFilter === 'Today') {
          if (start.toDateString() !== now.toDateString()) return false;
        } else if (dateFilter === 'This Week') {
          if (diffDays < -1 || diffDays > 7) return false;
        } else if (dateFilter === 'This Month') {
          if (diffDays < -1 || diffDays > 30) return false;
        }
      }

      return true;
    });
  }, [
    data,
    appliedSearch,
    selectedTypes,
    selectedLocations,
    feeFilter,
    dateFilter,
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
                  fontSize: 'clamp(1.75rem, 4.2vw, 3rem)',
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
                maxWidth: '100%',
                height: 180,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
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

          {/* ══════════════ SEARCH BAR ══════════════ */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid #DDE2F0',
              boxShadow: '0 8px 30px rgba(11, 30, 74, 0.08)',
              padding: '0.85rem 1.25rem',
            }}
          >
            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Search size={20} color="#7C849E" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search by event title, tech stack, college or keyword..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.975rem',
                  color: '#0B1E4A',
                  background: 'transparent',
                }}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(''); setAppliedSearch(''); }}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#7C849E', padding: '0 4px', display: 'flex' }}
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
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
          </div>
        </div>
      </section>

      {/* ══════════════ MAIN CONTENT CONTAINER ══════════════ */}
      <div style={{ maxWidth: 1320, margin: '2rem auto 0', padding: '0 1.5rem' }}>
        
        {/* 1. Category Navigation Pills (Horizontal Bar) */}
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            overflowX: 'auto',
            paddingBottom: '0.4rem',
            marginBottom: '1rem',
          }}
        >
          {/* 'All Events' Pill */}
          <button
            type="button"
            onClick={() => setSelectedTypes([])}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1.15rem',
              borderRadius: 999,
              border: selectedTypes.length === 0 ? '1.5px solid #2E58D7' : '1px solid #DDE2F0',
              background: selectedTypes.length === 0 ? 'linear-gradient(135deg, #2E58D7 0%, #1C3FA8 100%)' : '#FFFFFF',
              color: selectedTypes.length === 0 ? '#FFFFFF' : '#0B1E4A',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: selectedTypes.length === 0 ? '0 4px 14px rgba(46, 88, 215, 0.25)' : '0 1px 4px rgba(11, 30, 74, 0.04)',
              transition: 'all 0.15s ease',
            }}
          >
            <span>All Events</span>
            <span
              style={{
                fontSize: '0.725rem',
                padding: '1px 6px',
                borderRadius: 999,
                background: selectedTypes.length === 0 ? 'rgba(255, 255, 255, 0.24)' : '#F1F5F9',
                color: selectedTypes.length === 0 ? '#FFFFFF' : '#5B6487',
                fontWeight: 700,
              }}
            >
              {counts.total}
            </span>
          </button>

          {/* Individual Category Pills */}
          {[
            { label: 'Hackathons', key: 'Hackathon' },
            { label: 'Workshops', key: 'Workshop' },
            { label: 'Conferences', key: 'Conference' },
            { label: 'Tech Fests', key: 'Tech Fest' },
            { label: 'Seminars', key: 'Seminar' },
          ].map(({ label, key }) => {
            const isSelected = selectedTypes.includes(key);
            const count = counts.typeMap[key] || 0;
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleItem(selectedTypes, setSelectedTypes, key)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.15rem',
                  borderRadius: 999,
                  border: isSelected ? '1.5px solid #2E58D7' : '1px solid #DDE2F0',
                  background: isSelected ? 'linear-gradient(135deg, #2E58D7 0%, #1C3FA8 100%)' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#0B1E4A',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? '0 4px 14px rgba(46, 88, 215, 0.25)' : '0 1px 4px rgba(11, 30, 74, 0.04)',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{label}</span>
                <span
                  style={{
                    fontSize: '0.725rem',
                    padding: '1px 6px',
                    borderRadius: 999,
                    background: isSelected ? 'rgba(255, 255, 255, 0.24)' : '#F1F5F9',
                    color: isSelected ? '#FFFFFF' : '#5B6487',
                    fontWeight: 700,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. Structured Horizontal Filter Toolbar ("Filter by" Bar) */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 14,
            border: '1px solid #DDE2F0',
            padding: '0.75rem 1.25rem',
            boxShadow: '0 3px 14px rgba(11, 30, 74, 0.04)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.85rem',
          }}
        >
          {/* Left Controls: Filter By + City + Entry Fee + Date */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            {/* Filter by Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#0B1E4A',
                fontWeight: 800,
                fontSize: '0.875rem',
                marginRight: '0.25rem',
              }}
            >
              <Filter size={16} color="#2E58D7" />
              <span>Filter by:</span>
            </div>

            {/* City / Location Dropdown */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: selectedLocations.length > 0 ? '#EFF1F9' : '#F8FAFD',
                border: selectedLocations.length > 0 ? '1.5px solid #2E58D7' : '1px solid #DDE2F0',
                borderRadius: 999,
                padding: '0.35rem 0.8rem',
                fontSize: '0.825rem',
              }}
            >
              <MapPin size={14} color="#2E58D7" />
              <span style={{ fontWeight: 600, color: '#5B6487' }}>City:</span>
              <select
                value={selectedLocations.length === 1 ? selectedLocations[0] : selectedLocations.length > 1 ? 'Multiple' : 'All'}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'All') setSelectedLocations([]);
                  else setSelectedLocations([val]);
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontWeight: 700,
                  color: selectedLocations.length > 0 ? '#2E58D7' : '#0B1E4A',
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="All">All Cities</option>
                {selectedLocations.length > 1 && <option value="Multiple" disabled>Multiple Selected</option>}
                <option value="Chennai">Chennai ({counts.cityMap.Chennai})</option>
                <option value="Bengaluru">Bengaluru ({counts.cityMap.Bengaluru})</option>
                <option value="Hyderabad">Hyderabad ({counts.cityMap.Hyderabad})</option>
                <option value="Pune">Pune ({counts.cityMap.Pune})</option>
                <option value="Delhi">Delhi ({counts.cityMap.Delhi})</option>
                <option value="Others">Others ({counts.cityMap.Others})</option>
              </select>
            </div>

            {/* Entry Fee Segmented Pill Control */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: '#EFF1F9',
                borderRadius: 999,
                padding: '3px',
                gap: '2px',
              }}
            >
              <span style={{ padding: '0 0.45rem', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.785rem', fontWeight: 600, color: '#5B6487' }}>
                <RupeeIcon size={12} color="#2E58D7" /> Fee:
              </span>
              {(['All', 'Free', 'Paid'] as const).map((fee) => {
                const isSelected = feeFilter === fee;
                const count = fee === 'All' ? counts.total : fee === 'Free' ? counts.freeCount : counts.paidCount;
                return (
                  <button
                    key={fee}
                    type="button"
                    onClick={() => setFeeFilter(fee)}
                    style={{
                      padding: '0.25rem 0.6rem',
                      borderRadius: 999,
                      border: 'none',
                      background: isSelected ? '#FFFFFF' : 'transparent',
                      color: isSelected ? '#2E58D7' : '#5B6487',
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: '0.785rem',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 1px 4px rgba(11, 30, 74, 0.12)' : 'none',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <span>{fee}</span>
                    <span style={{ fontSize: '0.685rem', opacity: isSelected ? 0.9 : 0.65 }}>({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Date & Schedule Dropdown */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: dateFilter !== 'Anytime' ? '#EFF1F9' : '#F8FAFD',
                border: dateFilter !== 'Anytime' ? '1.5px solid #2E58D7' : '1px solid #DDE2F0',
                borderRadius: 999,
                padding: '0.35rem 0.8rem',
                fontSize: '0.825rem',
              }}
            >
              <Calendar size={14} color="#2E58D7" />
              <span style={{ fontWeight: 600, color: '#5B6487' }}>Date:</span>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontWeight: 700,
                  color: dateFilter !== 'Anytime' ? '#2E58D7' : '#0B1E4A',
                  fontSize: '0.825rem',
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
          </div>

          {/* Right Controls: Sort & Reset */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              marginLeft: 'auto',
            }}
          >
            {/* Sort Control */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.825rem',
                color: '#5B6487',
                background: '#F8FAFD',
                border: '1px solid #DDE2F0',
                padding: '0.35rem 0.8rem',
                borderRadius: 999,
              }}
            >
              <ArrowUpDown size={14} color="#5B6487" />
              <span style={{ fontWeight: 600 }}>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'Latest' | 'Soonest' | 'Popular')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontWeight: 700,
                  color: '#0B1E4A',
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="Latest">Latest Added</option>
                <option value="Soonest">Happening Soonest</option>
                <option value="Popular">Most Popular</option>
              </select>
            </div>

            {/* Reset Button */}
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleClearFilters}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: '#FFE2EB',
                  border: '1px solid #FFD0DF',
                  color: '#C1205B',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 999,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#FFD2E0')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#FFE2EB')}
              >
                <RotateCcw size={12} /> Reset
              </button>
            )}
          </div>
        </div>

        {/* 3. Header & Active Filter Tags Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B1E4A', margin: 0, letterSpacing: '-0.02em' }}>
              All Tech Events
            </h2>
            <span style={{ fontSize: '0.875rem', color: '#5B6487', fontWeight: 600 }}>
              ({sortedEvents.length} {sortedEvents.length === 1 ? 'event' : 'events'} found)
            </span>
          </div>

          {/* Active Chips Strip */}
          {activeFilterCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#7C849E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Active:
              </span>

              {appliedSearch && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 999,
                    background: '#EFF1F9',
                    border: '1px solid #DDE2F0',
                    color: '#0B1E4A',
                    fontSize: '0.785rem',
                    fontWeight: 600,
                  }}
                >
                  Keyword: "{appliedSearch}"
                  <button
                    type="button"
                    onClick={() => { setAppliedSearch(''); setSearchInput(''); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#7C849E' }}
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedTypes.map((t) => (
                <span
                  key={t}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 999,
                    background: '#E7EDFF',
                    border: '1px solid #D1DCFE',
                    color: '#2E58D7',
                    fontSize: '0.785rem',
                    fontWeight: 600,
                  }}
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => toggleItem(selectedTypes, setSelectedTypes, t)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#2E58D7' }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              {selectedLocations.map((loc) => (
                <span
                  key={loc}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 999,
                    background: '#E8F9FC',
                    border: '1px solid #CEF2F8',
                    color: '#008BA3',
                    fontSize: '0.785rem',
                    fontWeight: 600,
                  }}
                >
                  📍 {loc}
                  <button
                    type="button"
                    onClick={() => toggleItem(selectedLocations, setSelectedLocations, loc)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#008BA3' }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              {feeFilter !== 'All' && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 999,
                    background: feeFilter === 'Free' ? '#DCFCE7' : '#FFE2EB',
                    border: feeFilter === 'Free' ? '1px solid #BBF7D0' : '1px solid #FFD0DF',
                    color: feeFilter === 'Free' ? '#166534' : '#9A2A2A',
                    fontSize: '0.785rem',
                    fontWeight: 600,
                  }}
                >
                  {feeFilter === 'Free' ? 'Free Entry' : 'Paid Entry'}
                  <button
                    type="button"
                    onClick={() => setFeeFilter('All')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {dateFilter !== 'Anytime' && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 999,
                    background: '#EFF1F9',
                    border: '1px solid #DDE2F0',
                    color: '#0B1E4A',
                    fontSize: '0.785rem',
                    fontWeight: 600,
                  }}
                >
                  🕒 {dateFilter}
                  <button
                    type="button"
                    onClick={() => setDateFilter('Anytime')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#7C849E' }}
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* 4. Full-Width Cards Grid */}
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
          <div className="responsive-cards-grid">
            {sortedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default EventsPage;
