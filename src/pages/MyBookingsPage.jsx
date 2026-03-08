import { useBooking } from '../context/BookingContext';
import { useState } from 'react';

const STATUS_COLOR = {
  pending: 'status-pending',
  confirmed: 'status-confirmed',
  'in-transit': 'status-in-transit',
  completed: 'status-completed',
  cancelled: '',
};

const STATUS_LABEL = {
  pending: '⏳ Pending',
  confirmed: '✓ Confirmed',
  'in-transit': '🚛 In Transit',
  completed: '✓ Completed',
  cancelled: '✕ Cancelled',
};

export default function MyBookingsPage() {
  const { setPage, userBookings } = useBooking();
  const [activeTab, setActiveTab] = useState('active');

  const totalSpent = userBookings.filter(b => b.status === 'completed').reduce((s, b) => s + (b.fare || 0), 0);
  const completedCount = userBookings.filter(b => b.status === 'completed').length;
  const activeCount = userBookings.filter(b => ['pending', 'confirmed', 'in-transit'].includes(b.status)).length;
  const cancelledCount = userBookings.filter(b => b.status === 'cancelled').length;

  const filteredBookings = userBookings.filter((b) => {
    if (activeTab === 'active') return ['pending', 'confirmed', 'in-transit'].includes(b.status);
    return b.status === activeTab;
  });

  return (
    <div className="mb-shell">
      {/* ── Left: bookings list ── */}
      <div className="mb-left">
        <div className="mb-header">
          <h1>📋 My Bookings</h1>
          <button className="btn btn-primary" onClick={() => setPage('booking')}>+ New Booking</button>
        </div>

        <div className="booking-tabs" style={{ marginBottom: '20px' }}>
          {['active', 'completed', 'cancelled'].map((tab) => (
            <button key={tab}
              className={`booking-tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'active' && activeCount > 0 && (
                <span className="tab-badge">{activeCount}</span>
              )}
            </button>
          ))}
        </div>

        {filteredBookings.length > 0 ? (
          <div className="bookings-grid">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <span className="booking-id">{booking.id}</span>
                  <span className={`booking-status ${STATUS_COLOR[booking.status] || ''}`}>
                    {STATUS_LABEL[booking.status] || booking.status}
                  </span>
                </div>

                <div className="bk-route-line">
                  <span>{booking.from}</span>
                  <span className="bk-route-arrow">→</span>
                  <span>{booking.to}</span>
                </div>

                <div className="booking-details">
                  {booking.distance && (
                    <div className="detail-row">
                      <span className="detail-label">📏 Distance</span>
                      <span>{booking.distance} km</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="detail-label">📅 Date</span>
                    <span>{new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🚛 Vehicle</span>
                    <span>{booking.vehicle}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">👤 Driver</span>
                    <span>{booking.driver}</span>
                  </div>
                  {booking.driverRating && (
                    <div className="detail-row">
                      <span className="detail-label">⭐ Rating</span>
                      <span>{booking.driverRating}</span>
                    </div>
                  )}
                  <div className="detail-row" style={{ borderTop: '1px solid var(--border)', paddingTop: '8px', marginTop: '8px' }}>
                    <span className="detail-label" style={{ fontWeight: 700 }}>Fare</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{booking.fare}</span>
                  </div>
                </div>

                <div className="booking-actions">
                  {['pending', 'confirmed', 'in-transit'].includes(booking.status) && (
                    <>
                      <button className="btn btn-primary btn-sm">Track</button>
                      <button className="btn btn-outline btn-sm">Chat</button>
                    </>
                  )}
                  {booking.status === 'completed' && (
                    <>
                      <button className="btn btn-outline btn-sm">Invoice</button>
                      <button className="btn btn-outline btn-sm">Rate</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No {activeTab} bookings</h3>
            <p>{activeTab === 'active' ? 'You have no active bookings. Create one now!' : 'No bookings in this category yet.'}</p>
            <button className="btn btn-primary" onClick={() => setPage('booking')} style={{ marginTop: '16px' }}>Book Now</button>
          </div>
        )}
      </div>

      {/* ── Right: stats sidebar ── */}
      <div className="mb-right">
        {/* Stats */}
        <div className="mb-stats-card">
          <div className="mb-stats-title">Overview</div>
          <div className="mb-stats-grid">
            {[
              { label: 'Total', value: userBookings.length, color: 'var(--primary)', icon: '📋' },
              { label: 'Active', value: activeCount, color: '#F59E0B', icon: '🚦' },
              { label: 'Completed', value: completedCount, color: '#10B981', icon: '✓' },
              { label: 'Cancelled', value: cancelledCount, color: '#EF4444', icon: '✕' },
            ].map(s => (
              <div key={s.label} className="mb-stat-cell">
                <div className="mb-stat-icon">{s.icon}</div>
                <div className="mb-stat-val" style={{ color: s.color }}>{s.value}</div>
                <div className="mb-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="mb-spent-row">
            <span>Total Spent</span>
            <span className="mb-spent-val">₹{totalSpent.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mb-actions-card">
          <div className="mb-stats-title">Quick Actions</div>
          <button className="mb-action-btn" onClick={() => setPage('booking')}>🚛 Book a Lorry</button>
          <button className="mb-action-btn" onClick={() => setPage('profile')}>👤 My Profile</button>
          <button className="mb-action-btn">☎️ Call Support</button>
          <button className="mb-action-btn">💬 Live Chat</button>
        </div>

        {/* Support card */}
        <div className="mb-support-card">
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎧</div>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Need Help?</div>
          <div style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 12 }}>
            Our support team is available 24/7 to assist you.
          </div>
          <button className="btn btn-outline btn-sm" style={{ width: '100%' }}>Contact Support</button>
        </div>

        {/* Trust */}
        <div className="mb-trust-strip">
          <div className="mb-trust-row"><span>✓</span> Secure &amp; encrypted</div>
          <div className="mb-trust-row"><span>✓</span> Real-time tracking</div>
          <div className="mb-trust-row"><span>✓</span> Instant notifications</div>
        </div>
      </div>
    </div>
  );
}
