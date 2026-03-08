import { useBooking } from '../context/BookingContext';
import { VEHICLE_TYPES } from '../data/services';
import { CUSTOMER_REVIEWS } from '../data/reviews';
import { MAJOR_CITIES, POPULAR_ROUTES } from '../data/locations';
import { MOCK_USERS } from '../data/mockData';
import { useState, useRef } from 'react';

const filterCities = (q) => {
  if (q.length < 2) return [];
  return MAJOR_CITIES.filter(c =>
    c.name.toLowerCase().startsWith(q.toLowerCase()) ||
    c.name.toLowerCase().includes(q.toLowerCase())
  ).slice(0, 8);
};

const LIVE_STATS = [
  { icon: '🚛', value: '12,400+', label: 'Deliveries Done',  color: '#FF6B35' },
  { icon: '👷', value: '820+',    label: 'Verified Drivers', color: '#004E89' },
  { icon: '🏙️', value: '20+',     label: 'Cities Covered',   color: '#10B981' },
  { icon: '⭐', value: '4.8',      label: 'Avg Rating',       color: '#F59E0B' },
];

const HOW_IT_WORKS = [
  { num: '1', title: 'Enter Locations', icon: '📍' },
  { num: '2', title: 'Pick Vehicle',    icon: '🚛' },
  { num: '3', title: 'Pay Securely',    icon: '💳' },
  { num: '4', title: 'Track Live',      icon: '🗺️' },
];

const ROLE_CARDS = [
  { id: 'customer', icon: '📦', label: 'Customer', desc: 'Ship goods instantly',  cta: 'Book Now',       color: '#FF6B35', disabled: false },
  { id: 'driver',   icon: '🚛', label: 'Driver',   desc: 'Earn ₹50K+ monthly',   cta: 'Join as Driver', color: '#004E89', disabled: false },
  { id: 'owner',    icon: '🏢', label: 'Owner',    desc: 'Manage your fleet',     cta: 'Owner Portal',   color: '#8B5CF6', disabled: true  },
];

export default function HomePage() {
  const { setPage, isAuthenticated, showToast } = useBooking();
  const [fromText, setFromText] = useState('');
  const [toText,   setToText]   = useState('');
  const [date,     setDate]     = useState('');
  const [fromSugg, setFromSugg] = useState([]);
  const [toSugg,   setToSugg]   = useState([]);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo,   setShowTo]   = useState(false);
  const fromTimer = useRef(null);
  const toTimer   = useRef(null);

  const handleFrom = e => { const s = filterCities(e.target.value); setFromText(e.target.value); setFromSugg(s); setShowFrom(s.length > 0); };
  const handleTo   = e => { const s = filterCities(e.target.value); setToText(e.target.value);   setToSugg(s);   setShowTo(s.length > 0); };

  const handleQuickBook = () => {
    if (!fromText || !toText || !date) { showToast('Please fill pickup, dropoff and date', 'error'); return; }
    setPage(isAuthenticated ? 'booking' : 'login');
  };

  const ddStyle = {
    position:'absolute', top:'100%', left:0, right:0, zIndex:200,
    background:'white', border:'1px solid #E2E8F0',
    borderRadius:'10px', boxShadow:'0 8px 24px rgba(0,0,0,0.12)',
    listStyle:'none', margin:'4px 0', padding:0, maxHeight:'220px', overflowY:'auto',
  };
  const ddItem = {
    padding:'10px 14px', cursor:'pointer', borderBottom:'1px solid #f0f0f0',
    display:'flex', justifyContent:'space-between', alignItems:'center',
  };

  return (
    <div style={{ paddingTop: '60px' }}>

      {/* ── Demo Banner ── */}
      {!isAuthenticated && (
        <div className="demo-banner">
          <span className="demo-banner-label">🔑 Demo Ready:</span>
          {MOCK_USERS.map(u => (
            <span key={u.id} className="demo-banner-cred">
              {u.role === 'owner' ? '🏢' : u.role === 'driver' ? '🚛' : '📦'} {u.phone}/{u.password} <em>({u.role})</em>
            </span>
          ))}
          <button className="demo-banner-btn" onClick={() => setPage('login')}>Login Now →</button>
        </div>
      )}

      {/* ════ HERO — Two Column ════ */}
      <section className="hero-two-col">
        {/* Left */}
        <div className="hero-left">
          <div className="hero-badge">🚀 India's #1 Lorry Booking Platform</div>
          <h1 className="hero-headline">
            Fast &amp; Reliable<br />
            <span className="hero-highlight">Lorry Booking</span><br />
            Across India
          </h1>
          <p className="hero-subtext">
            Book lorries, autos &amp; trucks instantly. Track in real-time. Deliver safely.
          </p>

          {/* Booking Form */}
          <div className="hero-form-card">
            <div className="hero-form-row">
              <div style={{ flex:1, position:'relative' }}>
                <div className="hero-input-wrap">
                  <span className="hero-input-prefix">📍</span>
                  <input className="hero-input" type="text" placeholder="From — pickup city"
                    value={fromText} onChange={handleFrom}
                    onFocus={() => fromSugg.length > 0 && setShowFrom(true)}
                    onBlur={() => { fromTimer.current = setTimeout(() => setShowFrom(false), 150); }}
                    autoComplete="off" />
                </div>
                {showFrom && (
                  <ul style={ddStyle}>
                    {fromSugg.map(c => (
                      <li key={c.id} onMouseDown={() => { setFromText(c.name); setShowFrom(false); }} style={ddItem}
                        onMouseEnter={e => e.currentTarget.style.background = '#FFF7ED'}
                        onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                        <span style={{ fontWeight:600 }}>{c.name}</span>
                        <span style={{ fontSize:12, color:'#94A3B8' }}>{c.state}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="hero-swap">⇄</div>

              <div style={{ flex:1, position:'relative' }}>
                <div className="hero-input-wrap">
                  <span className="hero-input-prefix">🏁</span>
                  <input className="hero-input" type="text" placeholder="To — dropoff city"
                    value={toText} onChange={handleTo}
                    onFocus={() => toSugg.length > 0 && setShowTo(true)}
                    onBlur={() => { toTimer.current = setTimeout(() => setShowTo(false), 150); }}
                    autoComplete="off" />
                </div>
                {showTo && (
                  <ul style={ddStyle}>
                    {toSugg.map(c => (
                      <li key={c.id} onMouseDown={() => { setToText(c.name); setShowTo(false); }} style={ddItem}
                        onMouseEnter={e => e.currentTarget.style.background = '#FFF7ED'}
                        onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                        <span style={{ fontWeight:600 }}>{c.name}</span>
                        <span style={{ fontSize:12, color:'#94A3B8' }}>{c.state}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="hero-form-row" style={{ gap:12 }}>
              <div style={{ flex:1 }}>
                <div className="hero-input-wrap">
                  <span className="hero-input-prefix">📅</span>
                  <input className="hero-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
                </div>
              </div>
              <button className="hero-cta-btn" onClick={handleQuickBook}>
                Get Quote &amp; Book 🚀
              </button>
            </div>
          </div>

          <div className="hero-trust-bar">
            <span>✓ Free cancel within 5 mins</span>
            <span>✓ No hidden charges</span>
            <span>✓ 24/7 support</span>
          </div>
        </div>

        {/* Right */}
        <div className="hero-right">
          {/* Role Cards */}
          <div className="hero-role-stack">
            {ROLE_CARDS.map(r => (
              <div key={r.id}
                className={`hero-role-row${r.disabled ? ' role-row-disabled' : ''}`}
                style={{ borderLeftColor: r.color }}
                onClick={() => !r.disabled && setPage(isAuthenticated ? 'booking' : 'login')}
                title={r.disabled ? 'Login with owner credentials to access' : ''}>
                <span className="hero-role-icon">{r.icon}</span>
                <div className="hero-role-body">
                  <span className="hero-role-name">{r.label}</span>
                  <span className="hero-role-desc">{r.desc}</span>
                </div>
                <span className="hero-role-action" style={{ color: r.color }}>
                  {r.disabled ? '🔒 Login' : `${r.cta} →`}
                </span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="hero-stats-grid">
            {LIVE_STATS.map(s => (
              <div key={s.label} className="hero-stat-cell">
                <div className="hero-stat-icon" style={{ background: s.color + '18' }}>{s.icon}</div>
                <div className="hero-stat-val" style={{ color: s.color }}>{s.value}</div>
                <div className="hero-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="hero-how-card">
            <div className="hero-how-heading">How it works</div>
            <div className="hero-how-row">
              {HOW_IT_WORKS.map((s, i) => (
                <div key={s.num} className="hero-how-step">
                  {i > 0 && <div className="hero-how-connector" />}
                  <div className="hero-how-circle">{s.icon}</div>
                  <div className="hero-how-label">{s.num}. {s.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════ VEHICLES ════ */}
      <section className="home-section home-section-gray">
        <div className="home-inner">
          <div className="section-head"><h2>Choose Your Vehicle</h2><p>Right-sized for every shipment</p></div>
          <div className="vehicles-showcase">
            {VEHICLE_TYPES.map(v => (
              <div key={v.id} className="vsc-card" onClick={() => setPage(isAuthenticated ? 'booking' : 'login')}>
                <div className="vsc-icon">{v.emoji}</div>
                <h3 className="vsc-name">{v.name}</h3>
                <p className="vsc-desc">{v.description}</p>
                <div className="vsc-specs">
                  <span>⚖️ {v.capacity}</span>
                  <span>📦 {v.maxVolume}</span>
                </div>
                <div className="vsc-price">₹{v.basePrice} + ₹{v.perKmPrice}/km</div>
                <div className="vsc-cta">Book Now →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ ROUTES + CITIES ════ */}
      <section className="home-section">
        <div className="home-inner">
          <div className="routes-cities-layout">
            <div className="routes-col">
              <h2>Popular Routes</h2>
              <p>Most booked this week</p>
              {POPULAR_ROUTES.map(r => (
                <div key={r.id} className="route-item-card" onClick={() => setPage(isAuthenticated ? 'booking' : 'login')}>
                  <div className="ric-route">
                    <span>{r.from}</span>
                    <span className="ric-arrow">→</span>
                    <span>{r.to}</span>
                  </div>
                  <div className="ric-meta">{r.distance} km · {r.duration}</div>
                  <div className="ric-bar-wrap">
                    <div className="ric-bar-fill" style={{ width: `${Math.min(100, 30 + r.id * 10)}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="cities-col">
              <h2>Cities We Cover</h2>
              <p>20+ major cities across India</p>
              <div className="city-tags">
                {MAJOR_CITIES.map(c => (
                  <button key={c.id} className="city-tag" onClick={() => setPage(isAuthenticated ? 'booking' : 'login')}>
                    📍 {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ REVIEWS ════ */}
      <section className="home-section home-section-gray">
        <div className="home-inner">
          <div className="section-head"><h2>Trusted by Thousands</h2><p>What our customers say</p></div>
          <div className="reviews-layout">
            {CUSTOMER_REVIEWS.slice(0, 3).map(r => (
              <div key={r.id} className="review-item">
                <div className="review-stars">{'⭐'.repeat(r.rating)}</div>
                <p className="review-text">"{r.review}"</p>
                <div className="review-who">
                  <span className="review-ava">{r.avatar}</span>
                  <div>
                    <div className="review-who-name">{r.name}</div>
                    <div className="review-who-city">{r.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CTA ════ */}
      <section className="cta-strip">
        <div className="cta-strip-inner">
          <div>
            <h2 style={{ color:'white', marginBottom:8 }}>Ready to Ship?</h2>
            <p style={{ color:'rgba(255,255,255,0.85)', marginBottom:0 }}>Join 12,000+ happy customers</p>
          </div>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <button className="cta-btn-white" onClick={() => setPage(isAuthenticated ? 'booking' : 'login')}>
              🚛 Book a Lorry Now
            </button>
            {!isAuthenticated && (
              <button className="cta-btn-outline" onClick={() => setPage('signup')}>
                Create Free Account
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
