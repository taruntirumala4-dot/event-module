import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/eventApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { UserPlus, Loader2 } from 'lucide-react';
import { UserRole } from '../../types/event';

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STUDENT' as UserRole });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await authApi.register(form);
      login(res.data.token, res.data.user);
      toast.success(`Account created! Welcome, ${res.data.user.name}!`);
      navigate('/events');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fff0f6 100%)',
    }}>
      {/* Left branding panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        background: 'linear-gradient(135deg, #2d1b69 0%, #1e3a8a 100%)',
        color: '#ffffff',
      }} className="auth-left-panel">
        <div style={{ maxWidth: 400, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', marginBottom: '2rem' }}>
            <div style={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }} />
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              Event<span style={{ color: '#a78bfa' }}>Sphere</span>
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, margin: '0 0 1rem', lineHeight: 1.2 }}>
            Same students.<br />
            <span style={{ color: '#a78bfa', fontStyle: 'italic' }}>Bigger futures.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9375rem', lineHeight: 1.6, margin: '0 0 2rem' }}>
            Create your free profile and unlock access to thousands of opportunities tailored for you.
          </p>

          {/* Feature list */}
          {[
            '✓ 100% free for students',
            '✓ Verified opportunities only',
            '✓ Apply with one click',
            '✓ Get notified on new events',
          ].map((item) => (
            <div key={item} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,255,255,0.07)',
              borderRadius: '8px',
              padding: '0.625rem 1rem',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.85)',
              textAlign: 'left',
            }}>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        background: '#ffffff',
        minWidth: 0,
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }} className="auth-mobile-logo">
            <div style={{
              width: 26,
              height: 26,
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }} />
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
              Event<span style={{ color: '#2563eb' }}>Sphere</span>
            </span>
          </div>

          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.375rem' }}>
            Create your account ✨
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9375rem', margin: '0 0 2rem' }}>
            Join the EventSphere platform — it's free!
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className="input"
                placeholder="John Doe"
                required
                id="reg-name"
              />
            </div>
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
                id="reg-email"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                className="input"
                placeholder="Min. 6 characters"
                required
                id="reg-password"
              />
            </div>

            <div>
              <label className="label">I am a...</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                {(['STUDENT', 'ORGANIZER'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => set('role', role)}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: `1.5px solid ${form.role === role ? '#2563eb' : '#e2e8f0'}`,
                      background: form.role === role ? '#eff6ff' : '#ffffff',
                      color: form.role === role ? '#2563eb' : '#475569',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{role === 'STUDENT' ? '🎓' : '🎪'}</span>
                    <span>{role === 'STUDENT' ? 'Student' : 'Organizer'}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                background: '#1e293b',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9375rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'background 0.15s',
                opacity: loading ? 0.7 : 1,
                marginTop: '0.5rem',
              }}
              id="reg-submit"
            >
              {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <UserPlus size={16} />}
              {loading ? 'Creating...' : 'Create Free Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.875rem', marginTop: '1.5rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
          .auth-mobile-logo { display: flex !important; }
        }
        @media (min-width: 769px) {
          .auth-mobile-logo { display: none !important; }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default RegisterPage;
