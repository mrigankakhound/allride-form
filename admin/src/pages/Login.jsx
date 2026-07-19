import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Hardcoded credentials ────────────────────────────────────────────────────
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'allride@123';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate brief async check
    await new Promise((r) => setTimeout(r, 600));

    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem('isAdmin', 'true');
      navigate('/dashboard');
    } else {
      setError('Invalid Username or Password');
    }
    setLoading(false);
  };

  return (
    <div className="login-root">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo-wrap">
          <div className="login-logo-icon">
            <i className="bi bi-shield-lock-fill" />
          </div>
          <div className="login-brand-name">ALL RIDE Rentals</div>
          <div className="login-brand-sub">Admin Portal</div>
        </div>

        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">Sign in to access the admin dashboard</p>

        {/* Error Alert */}
        {error && (
          <div className="login-error-alert" role="alert">
            <i className="bi bi-exclamation-circle-fill" />
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="login-form-group">
            <label className="login-label" htmlFor="admin-username">Username</label>
            <div className="login-input-wrap">
              <i className="bi bi-person-fill login-input-icon" />
              <input
                id="admin-username"
                type="text"
                className="login-input"
                placeholder="Enter username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                autoComplete="username"
                autoFocus
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-form-group">
            <label className="login-label" htmlFor="admin-password">Password</label>
            <div className="login-input-wrap">
              <i className="bi bi-lock-fill login-input-icon" />
              <input
                id="admin-password"
                type={showPw ? 'text' : 'password'}
                className="login-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                autoComplete="current-password"
                required
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                style={{
                  position: 'absolute', right: 12, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem',
                }}
                tabIndex={-1}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                <i className={`bi ${showPw ? 'bi-eye-slash' : 'bi-eye'}`} />
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            id="btn-admin-login"
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right" />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="login-footer-note">
          <i className="bi bi-shield-check me-1" />
          Secured admin access — ALL RIDE Rentals
        </p>
      </div>
    </div>
  );
};

export default Login;
