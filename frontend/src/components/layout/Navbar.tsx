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
        background: '#FFFFFF',
        borderBottom: '1px solid #DDE2F0',
        boxShadow: '0 4px 18px rgba(11, 30, 74, 0.04)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 64, gap: '1.5rem' }}>

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
                background: 'linear-gradient(135deg, #2E58D7, #00CBE8)',
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0B1E4A', letterSpacing: '-0.035em' }}>
              Intern<span style={{ color: '#2E58D7' }}>Atlas</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flex: 1 }} className="hidden-mobile">
            <Link
              to="/events"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: isActive('/events') ? '#2E58D7' : '#0B1E4A',
                background: isActive('/events') ? '#EFF1F9' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
            >
              Opportunities <ChevronDown size={14} />
            </Link>

            <Link
              to="/events/create"
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#0B1E4A',
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#2E58D7';
                e.currentTarget.style.background = '#EFF1F9';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#0B1E4A';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              For Employers
            </Link>

            <Link
              to="/events"
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#0B1E4A',
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#2E58D7';
                e.currentTarget.style.background = '#EFF1F9';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#0B1E4A';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              For Colleges
            </Link>

            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#0B1E4A',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#2E58D7';
                e.currentTarget.style.background = '#EFF1F9';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#0B1E4A';
                e.currentTarget.style.background = 'transparent';
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
                    padding: '0.4rem 0.85rem',
                    borderRadius: '999px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: isActive('/my-events') ? '#2E58D7' : '#0B1E4A',
                    background: isActive('/my-events') ? '#EFF1F9' : 'transparent',
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
                    padding: '0.4rem 0.85rem',
                    borderRadius: '999px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: isActive('/saved-events') ? '#2E58D7' : '#0B1E4A',
                    background: isActive('/saved-events') ? '#EFF1F9' : 'transparent',
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
                  padding: '0.4rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isActive('/events/create') ? '#2E58D7' : '#0B1E4A',
                  background: isActive('/events/create') ? '#EFF1F9' : 'transparent',
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
                  padding: '0.4rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isActive('/admin/events') ? '#9A2A2A' : '#0B1E4A',
                  background: isActive('/admin/events') ? '#FFE2EB' : 'transparent',
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
                style={{ position: 'absolute', left: '0.875rem', color: '#7C849E', pointerEvents: 'none' }}
              />
              <input
                type="text"
                placeholder="Search events, competitions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: '2.35rem',
                  paddingRight: '1rem',
                  paddingTop: '0.45rem',
                  paddingBottom: '0.45rem',
                  border: '1px solid #DDE2F0',
                  borderRadius: '999px',
                  fontSize: '0.8125rem',
                  color: '#0B1E4A',
                  background: '#FFFFFF',
                  width: 220,
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#2E58D7';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(46,88,215,0.12)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#DDE2F0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <span style={{
                position: 'absolute',
                right: '0.75rem',
                fontSize: '0.65rem',
                color: '#7C849E',
                background: '#EFF1F9',
                padding: '1px 6px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                border: '1px solid #DDE2F0',
              }}>⌘K</span>
            </div>

            {/* Notification bell (logged in) */}
            {user && (
              <button
                style={{
                  position: 'relative',
                  width: 36,
                  height: 36,
                  border: '1px solid #DDE2F0',
                  borderRadius: '999px',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#0B1E4A',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#2E58D7';
                  (e.currentTarget as HTMLButtonElement).style.color = '#2E58D7';
                  (e.currentTarget as HTMLButtonElement).style.background = '#EFF1F9';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#DDE2F0';
                  (e.currentTarget as HTMLButtonElement).style.color = '#0B1E4A';
                  (e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF';
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
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2E58D7, #00CBE8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(46,88,215,0.2)',
                  }}
                  title={user.name}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden-mobile" style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0B1E4A', lineHeight: 1.2 }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '999px',
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
                    border: '1px solid #DDE2F0',
                    borderRadius: '999px',
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#9A2A2A',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FFE2EB')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#FFFFFF')}
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* Secondary Button: Login */}
                <Link
                  to="/login"
                  style={{
                    padding: '0.5rem 1.125rem',
                    borderRadius: '999px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#0B1E4A',
                    border: '1px solid #DDE2F0',
                    background: '#FFFFFF',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.15s',
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
                  }}
                >
                  <LogIn size={13} /> Login
                </Link>
                {/* Primary Button: Sign Up */}
                <Link
                  to="/register"
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '999px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    background: '#2E58D7',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.15s',
                    boxShadow: '0 4px 14px rgba(46, 88, 215, 0.25)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1C3FA8')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#2E58D7')}
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
                border: '1px solid #DDE2F0',
                borderRadius: '999px',
                background: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#0B1E4A',
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
          background: '#FFFFFF',
          borderTop: '1px solid #DDE2F0',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.375rem',
          boxShadow: '0 8px 24px rgba(11, 30, 74, 0.08)',
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
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: isActive(to) ? '#2E58D7' : '#0B1E4A',
                textDecoration: 'none',
                background: isActive(to) ? '#EFF1F9' : 'transparent',
              }}
            >
              {icon} {label}
            </Link>
          ))}
          <div style={{ borderTop: '1px solid #DDE2F0', marginTop: '0.5rem', paddingTop: '0.75rem' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem', color: '#0B1E4A' }}>{user.name}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#5B6487' }}>{user.email}</p>
                </div>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.5rem 0.875rem',
                    borderRadius: '999px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#9A2A2A',
                    border: '1px solid #DDE2F0',
                    background: '#FFE2EB',
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
                    borderRadius: '999px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#0B1E4A',
                    border: '1px solid #DDE2F0',
                    background: '#FFFFFF',
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
                    borderRadius: '999px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    background: '#2E58D7',
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
