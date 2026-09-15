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
  <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
    <div style={{
      width: 72,
      height: 72,
      borderRadius: '16px',
      background: '#eff6ff',
      border: '1px solid #bfdbfe',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.75rem',
      fontWeight: 800,
      color: '#2563eb',
      marginBottom: '1.5rem',
    }}>
      404
    </div>
    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.5rem' }}>Page Not Found</h2>
    <p style={{ color: '#64748b', maxWidth: 360, margin: '0 0 1.5rem', lineHeight: 1.6, fontSize: '0.9375rem' }}>
      The page or event resource you're looking for doesn't exist or has been relocated.
    </p>
    <Link to="/events" className="btn btn-primary" style={{ textDecoration: 'none' }}>
      Return to Discover Events
    </Link>
  </div>
);

const Footer: React.FC = () => (
  <footer style={{ background: '#0f172a', color: '#94a3b8', marginTop: 'auto' }}>
    {/* CTA Banner */}
    <div style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #1e3a8a 100%)',
      padding: '2.5rem 1.5rem',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 0.375rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            A BRIGHTER TOMORROW
          </p>
          <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Opportunities don't wait. Get started today.
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link to="/register" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.5rem',
            borderRadius: '8px',
            background: '#ffffff',
            color: '#1e293b',
            fontWeight: 700,
            fontSize: '0.875rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}>
            Create your free profile →
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {['👤', '👤', '👤'].map((emoji, i) => (
              <span key={i} style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: `hsl(${210 + i * 30}, 80%, 55%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                marginLeft: i > 0 ? '-10px' : 0,
                border: '2px solid #1e3a8a',
              }}>{emoji}</span>
            ))}
            <span style={{ fontSize: '0.8125rem', color: '#cbd5e1', fontWeight: 600, marginLeft: '0.5rem' }}>
              1M+ students are already on EventSphere.
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Footer links */}
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem' }}>
      {/* Brand */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div style={{
            width: 24,
            height: 24,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }} />
          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
            Event<span style={{ color: '#60a5fa' }}>Sphere</span>
          </span>
        </div>
        <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, marginTop: '0.5rem', color: '#64748b' }}>
          Opportunities today.<br />A brighter tomorrow.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          {['IG', 'LI', 'X', '▶'].map((s) => (
            <a key={s} href="#" style={{
              width: 28,
              height: 28,
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.07)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.6rem',
              fontWeight: 700,
              color: '#94a3b8',
              textDecoration: 'none',
              transition: 'all 0.15s',
            }}>{s}</a>
          ))}
        </div>
      </div>

      {/* For Students */}
      <div>
        <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.875rem' }}>For Students</h4>
        {['Internships', 'Jobs', 'Competitions', 'Hackathons', 'Contests', 'Quizzes', 'Events', 'College Festivals'].map(item => (
          <Link key={item} to="/events" style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', textDecoration: 'none', marginBottom: '0.4rem', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>
            {item}
          </Link>
        ))}
      </div>

      {/* For Employers */}
      <div>
        <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.875rem' }}>For Employers</h4>
        {['Post an internship', 'Post a job', 'Post a competition', 'Employer branding', 'Talent solutions', 'Pricing'].map(item => (
          <Link key={item} to="/events/create" style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', textDecoration: 'none', marginBottom: '0.4rem' }}>{item}</Link>
        ))}
      </div>

      {/* For Colleges */}
      <div>
        <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.875rem' }}>For Colleges</h4>
        {['Promote your college', 'Post events', 'College dashboard', 'Partner with us', 'Campus ambassador'].map(item => (
          <Link key={item} to="/events" style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', textDecoration: 'none', marginBottom: '0.4rem' }}>{item}</Link>
        ))}
      </div>

      {/* Resources */}
      <div>
        <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.875rem' }}>Resources</h4>
        {['Career blog', 'Guides', 'Resume tips', 'Interview prep', 'Skill tests', 'Success stories'].map(item => (
          <span key={item} style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem' }}>{item}</span>
        ))}
      </div>

      {/* Company */}
      <div>
        <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.875rem' }}>Company</h4>
        {['About us', 'Careers', 'Press', 'Contact', 'Help Center'].map(item => (
          <span key={item} style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem' }}>{item}</span>
        ))}
      </div>
    </div>

    {/* Bottom bar */}
    <div style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '1rem 1.5rem',
      maxWidth: 1280,
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.75rem',
    }}>
      <span style={{ fontSize: '0.75rem', color: '#475569' }}>© 2026 EventSphere. All rights reserved.</span>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {['Privacy', 'Terms', 'Cookies', 'Made for India 🇮🇳'].map(item => (
          <span key={item} style={{ fontSize: '0.75rem', color: '#475569', cursor: 'pointer' }}>{item}</span>
        ))}
      </div>
    </div>
  </footer>
);

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b' }}>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#ffffff',
                color: '#1e293b',
                border: '1px solid #e2e8f0',
                fontSize: '13px',
                borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              },
              success: {
                iconTheme: {
                  primary: '#16a34a',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#dc2626',
                  secondary: '#ffffff',
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
