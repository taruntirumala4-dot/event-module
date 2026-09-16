import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Bell,
  Menu,
  X,
  PlusCircle,
  ShieldCheck,
  Bookmark,
  Ticket,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path === '/events') {
      return location.pathname === '/' || location.pathname.startsWith('/events');
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/events?search=${encodeURIComponent(navSearch.trim())}`);
      setSearchModalOpen(false);
      setNavSearch('');
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#FFFFFF',
        borderBottom: '1px solid #DDE2F0',
        boxShadow: '0 4px 18px rgba(11, 30, 74, 0.04)',
      }}
    >
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 68, justifyContent: 'space-between' }}>
          
          {/* Left: Brand Logo & Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            <Link
              to="/events"
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: '#0B1E4A',
                  letterSpacing: '-0.035em',
                  fontFamily: '"DM Sans", "Inter", system-ui, sans-serif',
                }}
              >
                InternAtlas<span style={{ color: '#2E58D7' }}>.</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hidden-mobile">
              <Link
                to="/events"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#5B6487',
                  textDecoration: 'none',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 999,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#2E58D7';
                  e.currentTarget.style.background = '#EFF1F9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#5B6487';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Opportunities
              </Link>

              <Link
                to="/events"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2E58D7',
                  background: '#EFF1F9',
                  textDecoration: 'none',
                  padding: '0.45rem 0.95rem',
                  borderRadius: 999,
                  transition: 'all 0.15s',
                }}
              >
                Events
              </Link>

              <Link
                to="/events?category=ACADEMIC"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#5B6487',
                  textDecoration: 'none',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 999,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#2E58D7';
                  e.currentTarget.style.background = '#EFF1F9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#5B6487';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Scholarships
              </Link>

              <Link
                to="/events?category=COLLEGE_FEST"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#5B6487',
                  textDecoration: 'none',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 999,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#2E58D7';
                  e.currentTarget.style.background = '#EFF1F9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#5B6487';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                For Colleges
              </Link>

              <Link
                to="/events?category=WORKSHOP"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#5B6487',
                  textDecoration: 'none',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 999,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#2E58D7';
                  e.currentTarget.style.background = '#EFF1F9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#5B6487';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Resources
              </Link>
            </nav>
          </div>

          {/* Right: Search, Notification & Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem' }}>
            {/* Search Trigger Button */}
            <button
              onClick={() => setSearchModalOpen(!searchModalOpen)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#0B1E4A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.4rem',
                borderRadius: '50%',
                transition: 'background 0.15s',
              }}
              title="Search events"
              aria-label="Search events"
              onMouseEnter={(e) => (e.currentTarget.style.background = '#EFF1F9')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Search size={19} strokeWidth={2.2} />
            </button>

            {/* Notification Bell with Red Badge */}
            <div style={{ position: 'relative' }}>
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#0B1E4A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.4rem',
                  borderRadius: '50%',
                  transition: 'background 0.15s',
                }}
                title="Notifications"
                aria-label="Notifications"
                onMouseEnter={(e) => (e.currentTarget.style.background = '#EFF1F9')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Bell size={19} strokeWidth={2.2} />
              </button>
              {/* Selective pink/editorial accent dot */}
              <span
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#9A2A2A',
                  border: '2px solid #FFFFFF',
                }}
              />
            </div>

            {/* User Avatar with Dropdown */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '50%',
                }}
                aria-label="User profile"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                  alt={user ? user.name : 'User avatar'}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #DDE2F0',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://ui-avatars.com/api/?name=User&background=2E58D7&color=fff';
                  }}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: 240,
                    background: '#FFFFFF',
                    borderRadius: 14,
                    boxShadow: '0 8px 28px rgba(11, 30, 74, 0.10)',
                    border: '1px solid #DDE2F0',
                    padding: '0.5rem',
                    zIndex: 60,
                  }}
                >
                  {user ? (
                    <>
                      <div
                        style={{
                          padding: '0.75rem',
                          borderBottom: '1px solid #E8EBF4',
                          marginBottom: '0.35rem',
                        }}
                      >
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem', color: '#0B1E4A' }}>
                          {user.name}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#5B6487' }}>{user.email}</p>
                        <span
                          style={{
                            display: 'inline-block',
                            marginTop: '0.35rem',
                            fontSize: '0.675rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '999px',
                            background:
                              user.role === 'ADMIN'
                                ? '#FFE2EB'
                                : user.role === 'ORGANIZER'
                                ? '#E8F9FC'
                                : '#EFF1F9',
                            color:
                              user.role === 'ADMIN'
                                ? '#9A2A2A'
                                : user.role === 'ORGANIZER'
                                ? '#0B1E4A'
                                : '#2E58D7',
                          }}
                        >
                          {user.role}
                        </span>
                      </div>

                      <Link
                        to="/my-events"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 0.75rem',
                          borderRadius: 8,
                          fontSize: '0.85rem',
                          color: '#0B1E4A',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#EFF1F9')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Ticket size={16} color="#2E58D7" /> My Registrations
                      </Link>

                      <Link
                        to="/saved-events"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 0.75rem',
                          borderRadius: 8,
                          fontSize: '0.85rem',
                          color: '#0B1E4A',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#EFF1F9')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Bookmark size={16} color="#2E58D7" /> Saved Events
                      </Link>

                      {(user.role === 'ORGANIZER' || user.role === 'ADMIN') && (
                        <Link
                          to="/events/create"
                          onClick={() => setUserDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            borderRadius: 8,
                            fontSize: '0.85rem',
                            color: '#2E58D7',
                            textDecoration: 'none',
                            fontWeight: 600,
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#EFF1F9')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <PlusCircle size={16} /> Create Event
                        </Link>
                      )}

                      {user.role === 'ADMIN' && (
                        <Link
                          to="/admin/events"
                          onClick={() => setUserDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            borderRadius: 8,
                            fontSize: '0.85rem',
                            color: '#9A2A2A',
                            textDecoration: 'none',
                            fontWeight: 600,
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#FFE2EB')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <ShieldCheck size={16} /> Admin Portal
                        </Link>
                      )}

                      <div style={{ height: 1, background: '#E8EBF4', margin: '0.35rem 0' }} />

                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 0.75rem',
                          borderRadius: 8,
                          fontSize: '0.85rem',
                          color: '#9A2A2A',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#FFE2EB')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.6rem 0.75rem',
                          borderRadius: 8,
                          fontSize: '0.875rem',
                          color: '#0B1E4A',
                          textDecoration: 'none',
                          fontWeight: 600,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#EFF1F9')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <LogIn size={16} color="#2E58D7" /> Log In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.6rem 0.75rem',
                          fontSize: '0.875rem',
                          color: '#FFFFFF',
                          background: '#2E58D7',
                          textDecoration: 'none',
                          fontWeight: 600,
                          marginTop: '0.35rem',
                          borderRadius: 999,
                          justifyContent: 'center',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#1C3FA8')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#2E58D7')}
                      >
                        <UserPlus size={16} /> Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="show-mobile"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0B1E4A',
                padding: '0.4rem',
              }}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Modal Bar */}
        {searchModalOpen && (
          <form
            onSubmit={handleSearchSubmit}
            style={{
              padding: '0.75rem 0 1rem',
              borderTop: '1px solid #E8EBF4',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#7C849E',
                }}
              />
              <input
                type="text"
                autoFocus
                placeholder="Search by event name, domain or city..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.75rem',
                  borderRadius: 999,
                  border: '1px solid #DDE2F0',
                  outline: 'none',
                  fontSize: '0.9rem',
                  color: '#0B1E4A',
                  background: '#FFFFFF',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                background: '#2E58D7',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.65rem 1.25rem',
                borderRadius: 999,
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1C3FA8')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#2E58D7')}
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchModalOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '0.5rem',
                cursor: 'pointer',
                color: '#5B6487',
              }}
            >
              <X size={20} />
            </button>
          </form>
        )}
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: '#FFFFFF',
            borderTop: '1px solid #DDE2F0',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 600, color: '#0B1E4A', textDecoration: 'none' }}
          >
            Opportunities
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 700, color: '#2E58D7', textDecoration: 'none' }}
          >
            Events
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 600, color: '#0B1E4A', textDecoration: 'none' }}
          >
            Scholarships
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 600, color: '#0B1E4A', textDecoration: 'none' }}
          >
            For Colleges
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 600, color: '#0B1E4A', textDecoration: 'none' }}
          >
            Resources
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
