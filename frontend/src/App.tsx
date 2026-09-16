import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layout
import Navbar from './components/layout/Navbar';

// Pages
import EventsPage from './pages/events/EventsPage';
import EventDetailsPage from './pages/events/EventDetailsPage';
import CreateEventPage from './pages/events/CreateEventPage';
import EditEventPage from './pages/events/EditEventPage';
import MyEventsPage from './pages/events/MyEventsPage';
import SavedEventsPage from './pages/events/SavedEventsPage';
import EventRegistrationsPage from './pages/events/EventRegistrationsPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

const NotFound: React.FC = () => (
  <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', background: '#EFF1F9' }}>
    <div style={{
      width: 72,
      height: 72,
      borderRadius: '14px',
      background: '#FFFFFF',
      border: '1px solid #DDE2F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.75rem',
      fontWeight: 800,
      color: '#2E58D7',
      marginBottom: '1.5rem',
      boxShadow: '0 4px 18px rgba(11, 30, 74, 0.06)',
    }}>
      404
    </div>
    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0B1E4A', margin: '0 0 0.5rem', letterSpacing: '-0.035em' }}>Page Not Found</h2>
    <p style={{ color: '#5B6487', maxWidth: 360, margin: '0 0 1.5rem', lineHeight: 1.6, fontSize: '0.9375rem' }}>
      The page or event resource you're looking for doesn't exist or has been relocated.
    </p>
    <Link to="/events" className="btn btn-primary" style={{ textDecoration: 'none' }}>
      Return to Discover Events
    </Link>
  </div>
);

const Footer: React.FC = () => (
  <footer style={{ background: '#091838', color: '#FFFFFF', marginTop: 'auto' }}>
    {/* CTA Banner (Dark Section) */}
    <div style={{
      background: 'linear-gradient(135deg, #091838 0%, #0B1E4A 100%)',
      padding: '2.5rem 1.5rem',
      borderBottom: '1px solid rgba(221, 226, 240, 0.12)',
    }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: '#7AD9E8', margin: '0 0 0.375rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
            A BRIGHTER TOMORROW
          </p>
          <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.035em' }}>
            Opportunities don't wait. Build today <span className="editorial-italic" style={{ color: '#7AD9E8' }}>for a brighter tomorrow.</span>
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link to="/register" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.5rem',
            borderRadius: '999px',
            background: '#2E58D7',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.875rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s',
            boxShadow: '0 4px 14px rgba(46, 88, 215, 0.3)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#1C3FA8')}
          onMouseLeave={e => (e.currentTarget.style.background = '#2E58D7')}>
            Create your free profile →
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {['👤', '👤', '👤'].map((emoji, i) => (
              <span key={i} style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: `hsl(${220 + i * 25}, 75%, 55%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                marginLeft: i > 0 ? '-10px' : 0,
                border: '2px solid #091838',
              }}>{emoji}</span>
            ))}
            <span style={{ fontSize: '0.8125rem', color: '#DDE2F0', fontWeight: 600, marginLeft: '0.5rem' }}>
              1M+ students are already on InternAtlas.
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Footer links */}
    <div style={{ maxWidth: 1320, margin: '0 auto', padding: '2.5rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem' }}>
      {/* Brand */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
            InternAtlas<span style={{ color: '#38BDF8' }}>.</span>
          </span>
        </div>
        <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, marginTop: '0.5rem', color: '#DDE2F0' }}>
          Opportunities today.<br />A brighter tomorrow.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          {['IG', 'LI', 'X', '▶'].map((s) => (
            <a key={s} href="#" style={{
              width: 28,
              height: 28,
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.6rem',
              fontWeight: 700,
              color: '#7AD9E8',
              textDecoration: 'none',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,203,232,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}>{s}</a>
          ))}
        </div>
      </div>

      {/* For Students */}
      <div>
        <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.875rem' }}>For Students</h4>
        {['Internships', 'Jobs', 'Competitions', 'Hackathons', 'Contests', 'Quizzes', 'Events', 'College Festivals'].map(item => (
          <Link key={item} to="/events" style={{ display: 'block', fontSize: '0.8rem', color: '#DDE2F0', textDecoration: 'none', marginBottom: '0.4rem', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#7AD9E8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#DDE2F0')}>
            {item}
          </Link>
        ))}
      </div>

      {/* For Employers */}
      <div>
        <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.875rem' }}>For Employers</h4>
        {['Post an internship', 'Post a job', 'Post a competition', 'Employer branding', 'Talent solutions', 'Pricing'].map(item => (
          <Link key={item} to="/events/create" style={{ display: 'block', fontSize: '0.8rem', color: '#DDE2F0', textDecoration: 'none', marginBottom: '0.4rem', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#7AD9E8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#DDE2F0')}>
            {item}
          </Link>
        ))}
      </div>

      {/* For Colleges */}
      <div>
        <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.875rem' }}>For Colleges</h4>
        {['Promote your college', 'Post events', 'College dashboard', 'Partner with us', 'Campus ambassador'].map(item => (
          <Link key={item} to="/events" style={{ display: 'block', fontSize: '0.8rem', color: '#DDE2F0', textDecoration: 'none', marginBottom: '0.4rem', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#7AD9E8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#DDE2F0')}>
            {item}
          </Link>
        ))}
      </div>

      {/* Resources */}
      <div>
        <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.875rem' }}>Resources</h4>
        {['Career blog', 'Guides', 'Resume tips', 'Interview prep', 'Skill tests', 'Success stories'].map(item => (
          <span key={item} style={{ display: 'block', fontSize: '0.8rem', color: '#DDE2F0', marginBottom: '0.4rem' }}>{item}</span>
        ))}
      </div>

      {/* Company */}
      <div>
        <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.875rem' }}>Company</h4>
        {['About us', 'Careers', 'Press', 'Contact', 'Help Center'].map(item => (
          <span key={item} style={{ display: 'block', fontSize: '0.8rem', color: '#DDE2F0', marginBottom: '0.4rem' }}>{item}</span>
        ))}
      </div>
    </div>

    {/* Bottom bar */}
    <div style={{
      borderTop: '1px solid rgba(221, 226, 240, 0.12)',
      padding: '1rem 1.5rem',
      maxWidth: 1320,
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.75rem',
    }}>
      <span style={{ fontSize: '0.75rem', color: '#7C849E' }}>© 2026 InternAtlas. All rights reserved.</span>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {['Privacy', 'Terms', 'Cookies', 'Made for India 🇮🇳'].map(item => (
          <span key={item} style={{ fontSize: '0.75rem', color: '#7C849E', cursor: 'pointer' }}>{item}</span>
        ))}
      </div>
    </div>
  </footer>
);

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#EFF1F9', color: '#0B1E4A' }}>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#FFFFFF',
                color: '#0B1E4A',
                border: '1px solid #DDE2F0',
                fontSize: '13px',
                borderRadius: '14px',
                boxShadow: '0 4px 18px rgba(11, 30, 74, 0.08)',
              },
              success: {
                iconTheme: {
                  primary: '#16a34a',
                  secondary: '#FFFFFF',
                },
              },
              error: {
                iconTheme: {
                  primary: '#9A2A2A',
                  secondary: '#FFFFFF',
                },
              },
            }}
          />

          <Navbar />

          <main style={{ flex: 1 }}>
            <Routes>
              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/events" replace />} />

              {/* Public Event Discovery & Details */}
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailsPage />} />

              {/* Organizer / Admin Actions */}
              <Route path="/events/create" element={<CreateEventPage />} />
              <Route path="/events/:id/edit" element={<EditEventPage />} />
              <Route path="/events/:id/registrations" element={<EventRegistrationsPage />} />

              {/* Student Personal Views */}
              <Route path="/my-events" element={<MyEventsPage />} />
              <Route path="/saved-events" element={<SavedEventsPage />} />

              {/* Admin Moderation */}
              <Route path="/admin/events" element={<AdminEventsPage />} />

              {/* Authentication */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
