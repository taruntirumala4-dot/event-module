import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  Calendar,
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
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeStyle = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return { background: '#fee2e2', color: '#991b1b' };
      case 'ORGANIZER':
        return { background: '#fef3c7', color: '#92400e' };
      default:
        return { background: '#dbeafe', color: '#1e40af' };
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 60, gap: '1.5rem' }}>

          {/* Brand Logo */}
          <Link
            to="/events"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>
              Event<span style={{ color: '#2563eb' }}>Sphere</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1 }} className="hidden-mobile">
            <Link
              to="/events"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.375rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: isActive('/events') ? '#2563eb' : '#475569',
                background: isActive('/events') ? '#eff6ff' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
            >
              Opportunities <ChevronDown size={14} />
            </Link>

            <Link
              to="/events/create"
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#475569',
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#1e293b')}
              onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
            >
              For Employers
            </Link>

            <Link
              to="/events"
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#475569',
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#1e293b')}
              onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
            >
              For Colleges
            </Link>

            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.375rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#475569',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              Resources <ChevronDown size={14} />
            </span>

            {user?.role === 'STUDENT' && (
              <>
                <Link
                  to="/my-events"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: isActive('/my-events') ? '#2563eb' : '#475569',
                    background: isActive('/my-events') ? '#eff6ff' : 'transparent',
                    textDecoration: 'none',
                  }}
                >
                  <Ticket size={14} /> My Events
                </Link>
                <Link
                  to="/saved-events"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: isActive('/saved-events') ? '#2563eb' : '#475569',
                    background: isActive('/saved-events') ? '#eff6ff' : 'transparent',
                    textDecoration: 'none',
                  }}
                >
                  <Bookmark size={14} /> Saved
                </Link>
              </>
            )}

            {(user?.role === 'ORGANIZER' || user?.role === 'ADMIN') && (
              <Link
                to="/events/create"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: isActive('/events/create') ? '#16a34a' : '#475569',
                  background: isActive('/events/create') ? '#f0fdf4' : 'transparent',
                  textDecoration: 'none',
                }}
              >
                <PlusCircle size={14} /> Create Event
              </Link>
            )}

            {user?.role === 'ADMIN' && (
              <Link
                to="/admin/events"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: isActive('/admin/events') ? '#dc2626' : '#475569',
                  background: isActive('/admin/events') ? '#fef2f2' : 'transparent',
                  textDecoration: 'none',
                }}
              >
                <ShieldCheck size={14} /> Admin
              </Link>
            )}
          </nav>

          {/* Right: Search + Notification + Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto', flexShrink: 0 }}>
            {/* Search bar */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} className="hidden-mobile">
              <Search
                size={15}
                style={{ position: 'absolute', left: '0.75rem', color: '#94a3b8', pointerEvents: 'none' }}
              />
              <input
                type="text"
                placeholder="Search events, competitions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: '2.25rem',
                  paddingRight: '1rem',
                  paddingTop: '0.4rem',
                  paddingBottom: '0.4rem',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                  color: '#1e293b',
                  background: '#f8fafc',
                  width: 220,
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#2563eb';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <span style={{
                position: 'absolute',
                right: '0.625rem',
                fontSize: '0.65rem',
                color: '#94a3b8',
                background: '#e2e8f0',
                padding: '1px 5px',
                borderRadius: '4px',
                fontFamily: 'monospace',
              }}>⌘K</span>
            </div>

            {/* Notification bell (logged in) */}
            {user && (
              <button
                style={{
                  position: 'relative',
                  width: 36,
                  height: 36,
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '8px',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#2563eb';
                  (e.currentTarget as HTMLButtonElement).style.color = '#2563eb';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0';
                  (e.currentTarget as HTMLButtonElement).style.color = '#64748b';
                }}
              >
                <Bell size={16} />
              </button>
            )}

            {/* Auth area */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                {/* Avatar circle */}
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                  title={user.name}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden-mobile" style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', lineHeight: 1.2 }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0px 5px',
                      borderRadius: '4px',
                      ...getRoleBadgeStyle(user.role),
                    }}
                  >
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  style={{
                    width: 32,
                    height: 32,
                    border: '1px solid #fee2e2',
                    borderRadius: '7px',
                    background: '#fff5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#dc2626',
                    transition: 'all 0.15s',
                  }}
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link
                  to="/login"
                  style={{
                    padding: '0.4rem 0.875rem',
                    borderRadius: '7px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#475569',
                    border: '1.5px solid #e2e8f0',
                    background: '#ffffff',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    transition: 'all 0.15s',
                  }}
                >
                  <LogIn size={13} /> Login
                </Link>
                <Link
                  to="/register"
                  style={{
                    padding: '0.4rem 0.875rem',
                    borderRadius: '7px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    background: '#1e293b',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#0f172a')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#1e293b')}
                >
                  <UserPlus size={13} /> Sign Up
                </Link>
              </div>
            )}

            {/* Mobile burger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                width: 36,
                height: 36,
                border: '1.5px solid #e2e8f0',
                borderRadius: '8px',
                background: '#ffffff',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569',
              }}
              className="show-mobile"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.375rem',
        }}>
          {[
            { to: '/events', label: 'Discover Events', icon: <Calendar size={16} /> },
            ...(user?.role === 'STUDENT' ? [
              { to: '/my-events', label: 'My Registered Events', icon: <Ticket size={16} /> },
              { to: '/saved-events', label: 'Saved Events', icon: <Bookmark size={16} /> },
            ] : []),
            ...(user?.role === 'ORGANIZER' || user?.role === 'ADMIN' ? [
              { to: '/events/create', label: 'Create Event', icon: <PlusCircle size={16} /> },
            ] : []),
            ...(user?.role === 'ADMIN' ? [
              { to: '/admin/events', label: 'Admin Panel', icon: <ShieldCheck size={16} /> },
            ] : []),
          ].map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.625rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#475569',
                textDecoration: 'none',
                background: isActive(to) ? '#eff6ff' : 'transparent',
              }}
            >
              {icon} {label}
            </Link>
          ))}
          <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '0.5rem', paddingTop: '0.75rem' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>{user.name}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{user.email}</p>
                </div>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.5rem 0.875rem',
                    borderRadius: '7px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#dc2626',
                    border: '1px solid #fee2e2',
                    background: '#fff5f5',
                    cursor: 'pointer',
                  }}
                >
                  <LogOut size={13} /> Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.375rem',
                    padding: '0.5rem',
                    borderRadius: '7px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#475569',
                    border: '1.5px solid #e2e8f0',
                    background: '#ffffff',
                    textDecoration: 'none',
                  }}
                >
                  <LogIn size={13} /> Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.375rem',
                    padding: '0.5rem',
                    borderRadius: '7px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    background: '#1e293b',
                    textDecoration: 'none',
                  }}
                >
                  <UserPlus size={13} /> Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
