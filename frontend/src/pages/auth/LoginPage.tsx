import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/eventApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { LogIn, Loader2, Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate('/events');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Login failed');
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
      {/* Left panel — branding (Section 10 Dark Sections) */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        background: 'linear-gradient(135deg, #091838 0%, #0B1E4A 100%)',
        color: '#FFFFFF',
      }} className="auth-left-panel">
        <div style={{ maxWidth: 400, textAlign: 'center' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', marginBottom: '2rem' }}>
            <div style={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #2E58D7, #00CBE8)',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }} />
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.035em' }}>
              Intern<span style={{ color: '#00CBE8' }}>Atlas</span>
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, margin: '0 0 1rem', lineHeight: 1.2, letterSpacing: '-0.035em' }}>
            Your next <span className="editorial-italic" style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontStyle: 'italic', color: '#7AD9E8' }}>chapter</span> starts here.
          </h2>
          <p style={{ color: '#DDE2F0', fontSize: '0.9375rem', lineHeight: 1.6, margin: '0 0 2rem' }}>
            Join thousands of students discovering internships, competitions, and events across India.
          </p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            {[
              { val: '1M+', label: 'Students' },
              { val: '500+', label: 'Companies' },
              { val: '10K+', label: 'Opportunities' },
            ].map(({ val, label }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(221, 226, 240, 0.1)', borderRadius: '14px', padding: '1rem 0.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#7AD9E8', margin: '0 0 0.25rem' }}>{val}</p>
                <p style={{ fontSize: '0.75rem', color: '#DDE2F0', margin: 0, fontWeight: 500 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        background: '#FFFFFF',
        minWidth: 0,
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }} className="auth-mobile-logo">
            <div style={{
              width: 26,
              height: 26,
              background: 'linear-gradient(135deg, #2E58D7, #00CBE8)',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }} />
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0B1E4A' }}>
              Intern<span style={{ color: '#2E58D7' }}>Atlas</span>
            </span>
          </div>

          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0B1E4A', margin: '0 0 0.375rem', letterSpacing: '-0.035em' }}>
            Welcome back 👋
          </h1>
          <p style={{ color: '#5B6487', fontSize: '0.9375rem', margin: '0 0 2rem' }}>
            Sign in to your InternAtlas account
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
                id="login-email"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                  required
                  id="login-password"
                  autoComplete="current-password"
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#7C849E',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                  }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '999px',
                background: '#2E58D7',
                color: '#FFFFFF',
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
                boxShadow: '0 4px 14px rgba(46, 88, 215, 0.25)',
              }}
              id="login-submit"
              onMouseEnter={e => (e.currentTarget.style.background = '#1C3FA8')}
              onMouseLeave={e => (e.currentTarget.style.background = '#2E58D7')}
            >
              {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <LogIn size={16} />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#5B6487', fontSize: '0.875rem', marginTop: '1.5rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#2E58D7', fontWeight: 700, textDecoration: 'none' }}>
              Sign up free
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

export default LoginPage;
