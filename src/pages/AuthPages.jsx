import { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { MOCK_USERS } from '../data/mockData';

const ROLES = [
  { id: 'customer', icon: '📦', label: 'Customer', desc: 'Ship goods across India', color: '#FF6B35', disabled: false },
  { id: 'driver',   icon: '🚛', label: 'Driver',   desc: 'Drive & earn money',     color: '#004E89', disabled: false },
  { id: 'owner',    icon: '🏢', label: 'Owner',    desc: 'Manage your fleet',      color: '#8B5CF6', disabled: true,
    disabledNote: 'Owner accounts require admin setup. Contact admin@lorryhub.com' },
];

const FEATURES = [
  { icon: '⚡', text: 'Book in under 2 minutes' },
  { icon: '📍', text: 'Real-time GPS tracking' },
  { icon: '🛡️', text: 'Insured up to ₹50,000' },
  { icon: '🌆', text: '20+ cities covered' },
  { icon: '💳', text: 'Secure UPI & card payment' },
];

export default function AuthPages() {
  const { page, setPage, signup, login, showToast } = useBooking();
  const [isSignup, setIsSignup] = useState(page === 'signup');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [quickFilled, setQuickFilled] = useState(null);

  const quickFill = (u) => {
    setPhone(u.phone);
    setPassword(u.password);
    setIsSignup(false);
    setQuickFilled(u.name.split(' ')[0]);
    setTimeout(() => setQuickFilled(null), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !password) { showToast('Please fill in all fields', 'error'); return; }
    if (phone.length < 10) { showToast('Enter a valid 10-digit phone number', 'error'); return; }
    if (password.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }
    if (isSignup && password !== confirmPassword) { showToast('Passwords do not match', 'error'); return; }
    setLoading(true);
    try { isSignup ? await signup(phone, password, role) : await login(phone, password); }
    catch {} finally { setLoading(false); }
  };

  return (
    <div className="auth-shell">

      {/* ── LEFT — Brand Panel ── */}
      <div className="auth-left">
        <button className="auth-back-btn" onClick={() => setPage('home')}>← Back to Home</button>

        <div className="auth-brand-block">
          <div className="auth-brand-icon">🚛</div>
          <div className="auth-brand-name">LorryHub</div>
          <div className="auth-brand-tag">India's smartest logistics platform</div>
        </div>

        <ul className="auth-feature-list">
          {FEATURES.map((f, i) => (
            <li key={i} className="auth-feature-item">
              <span className="auth-feature-ico">{f.icon}</span> {f.text}
            </li>
          ))}
        </ul>

        {/* Demo Credentials */}
        <div className="auth-demo-box">
          <div className="auth-demo-heading">⚡ Quick Demo — click to auto-fill</div>
          {MOCK_USERS.map(u => (
            <button key={u.id} className="auth-demo-row" onClick={() => quickFill(u)}>
              <span className="auth-demo-role-ico">
                {u.role === 'customer' ? '📦' : u.role === 'driver' ? '🚛' : '🏢'}
              </span>
              <span className="auth-demo-uname">{u.name}</span>
              <span className="auth-demo-cred">{u.phone} / {u.password}</span>
              <span className="auth-demo-badge">{u.role}</span>
            </button>
          ))}
          {quickFilled && (
            <div className="auth-quick-ok">✓ Filled for {quickFilled} — now click Login!</div>
          )}
        </div>

        <div className="auth-stat-strip">
          {[['12K+','Deliveries'],['800+','Drivers'],['20+','Cities'],['4.8★','Rating']].map(([v,l]) => (
            <div key={l} className="auth-stat-item"><strong>{v}</strong><span>{l}</span></div>
          ))}
        </div>
      </div>

      {/* ── RIGHT — Form Panel ── */}
      <div className="auth-right">
        <div className="auth-form-card">

          {/* Login / Sign Up toggle */}
          <div className="auth-mode-tabs">
            <button className={`auth-mode-tab${!isSignup ? ' active' : ''}`} onClick={() => setIsSignup(false)}>Login</button>
            <button className={`auth-mode-tab${isSignup ? ' active' : ''}`} onClick={() => setIsSignup(true)}>Sign Up</button>
          </div>

          <h2 className="auth-form-title">
            {isSignup ? 'Create your account' : 'Welcome back!'}
          </h2>
          <p className="auth-form-sub">
            {isSignup ? 'Join thousands of happy shippers' : 'Sign in to manage your bookings'}
          </p>

          {/* Role selector — signup */}
          {isSignup && (
            <div className="auth-role-section">
              <div className="auth-role-label">I am a —</div>
              <div className="auth-role-grid">
                {ROLES.map(r => (
                  <button key={r.id} type="button" disabled={r.disabled}
                    title={r.disabled ? r.disabledNote : ''}
                    className={`auth-role-btn${role === r.id ? ' selected' : ''}${r.disabled ? ' locked' : ''}`}
                    style={role === r.id ? { borderColor: r.color } : {}}
                    onClick={() => !r.disabled && setRole(r.id)}
                  >
                    <span className="auth-role-btn-icon">{r.icon}</span>
                    <span className="auth-role-btn-label">{r.label}</span>
                    <span className="auth-role-btn-desc">{r.disabled ? '🔒 Admin only' : r.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Role pills on login */}
          {!isSignup && (
            <div className="auth-login-role-bar">
              {ROLES.map(r => (
                <div key={r.id} className={`auth-login-pill${r.disabled ? ' pill-locked' : ''}`}
                  title={r.disabled ? r.disabledNote : ''}>
                  {r.icon} {r.label}{r.disabled && ' 🔒'}
                </div>
              ))}
              <span className="auth-pill-hint">click demo cards on the left ↙</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form-field">
              <label>📱 Phone Number</label>
              <input className="auth-input" type="tel" placeholder="10-digit mobile number"
                value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,'').substring(0,10))}
                required autoFocus />
            </div>

            <div className="auth-form-field">
              <label>🔒 Password</label>
              <div className="auth-pass-row">
                <input className="auth-input" type={showPass ? 'text' : 'password'}
                  placeholder="Min 6 characters" value={password}
                  onChange={e => setPassword(e.target.value)} required />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPass(s => !s)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {isSignup && (
              <div className="auth-form-field">
                <label>🔒 Confirm Password</label>
                <input className="auth-input" type="password" placeholder="Re-enter password"
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              </div>
            )}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? '⏳ Please wait...' : isSignup ? '🚀 Create Account' : 'Login →'}
            </button>
          </form>

          <div className="auth-switch-row">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <button className="auth-switch-link" onClick={() => setIsSignup(s => !s)}>
              {isSignup ? ' Login' : ' Sign Up'}
            </button>
          </div>

          <div className="auth-owner-callout">
            🏢 Fleet Owner? Contact <strong>admin@lorryhub.com</strong> for owner account setup.
          </div>
        </div>
      </div>
    </div>
  );
}
