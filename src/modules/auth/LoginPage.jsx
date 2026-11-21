import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import AuthInput from './components/AuthInput';
import PasswordInput from './components/PasswordInput';
import { validateLoginForm, getAuthErrorMessage } from './authUtils';
import './AuthForm.css';

/**
 * Google Logo SVG Component (brand-compliant)
 */
const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

const DEFAULT_EMAIL = 'admin123@gmail.com';
const DEFAULT_PASSWORD = '1234';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { login, loginWithGoogle, currentUser, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (currentUser) {
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || googleLoading) return;

    setFormError('');

    const trimmedEmail = email.trim();
    const isDefaultAdmin =
      trimmedEmail === DEFAULT_EMAIL && password === DEFAULT_PASSWORD;

    // Validate normally unless the user typed the default admin credentials
    if (!isDefaultAdmin) {
      const validation = validateLoginForm({ email: trimmedEmail, password });
      if (!validation.isValid) {
        setFormError(validation.error);
        return;
      }
    }

    try {
      setLoading(true);
      await login(trimmedEmail, password, rememberMe);
      navigate(from, { replace: true });
    } catch (err) {
      if (isDefaultAdmin && !isConfigured) {
        localStorage.setItem(
          'resumate_demo_user',
          JSON.stringify({
            uid: 'admin-default-001',
            email: DEFAULT_EMAIL,
            displayName: 'Admin',
          })
        );
        navigate(from, { replace: true });
        return;
      }
      const friendlyMsg = getAuthErrorMessage(err.code);
      setFormError(friendlyMsg || err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading || googleLoading) return;
    setFormError('');

    try {
      setGoogleLoading(true);
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        const friendlyMsg = getAuthErrorMessage(err.code);
        setFormError(friendlyMsg || err.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Brand Header */}
        <div className="auth-header">
          <Link to="/" className="auth-brand" aria-label="Go to RESUMATE AI homepage">
            <div className="brand-icon">
              <Sparkles size={18} />
            </div>
            <span className="brand-name">
              RESUMATE <span>AI</span>
            </span>
          </Link>
          <h1>Welcome Back</h1>
          <p>Sign in to audit resumes, analyze job descriptions, and track skill gaps.</p>
        </div>

        {/* Dev Mode Warning */}
        {!isConfigured && (
          <div className="alert alert-warning" role="alert">
            <AlertCircle size={18} />
            <div>
              <strong>Developer Mode Active:</strong> Firebase credentials are not yet configured in <code>.env</code>.
              You can explore all modules freely during local development!
            </div>
          </div>
        )}

        {/* Auth Card */}
        <div className="auth-card auth-form-card">
          {/* Error Message */}
          {formError && (
            <div className="alert alert-danger" role="alert">
              <AlertCircle size={18} />
              <span>{formError}</span>
            </div>
          )}

          {/* Google Sign-In */}
          {isConfigured && (
            <>
              <button
                type="button"
                className="google-signin-btn"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
              >
                {googleLoading ? (
                  <span className="spinner spinner-sm" aria-hidden="true" />
                ) : (
                  <GoogleLogo />
                )}
                Continue with Google
              </button>

              <div className="auth-divider">or</div>
            </>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} noValidate>
            <AuthInput
              id="login-email"
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="admin123@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={loading || googleLoading}
            />

            <PasswordInput
              id="login-password"
              label="Password"
              placeholder="••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={loading || googleLoading}
              rightHeaderAction={
                <Link to="/forgot-password" style={{ fontSize: 'var(--font-xs)' }}>
                  Forgot Password?
                </Link>
              }
            />

            {/* Remember Me Option */}
            <div className="auth-form-checkbox-row">
              <label className="auth-checkbox-label" htmlFor="login-remember-me">
                <input
                  id="login-remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading || googleLoading}
                />
                <span>Remember me on this device</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={LogIn}
              isLoading={loading}
              disabled={loading || googleLoading}
              style={{ width: '100%', marginTop: '6px' }}
            >
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register">Create an Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;