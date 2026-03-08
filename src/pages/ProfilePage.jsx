import { useBooking } from '../context/BookingContext';
import { useState } from 'react';

export default function ProfilePage() {
  const { currentUser, userBookings, setPage, logout, showToast } = useBooking();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });

  const totalSpent = userBookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.fare || 0), 0);
  const completedCount = userBookings.filter(b => b.status === 'completed').length;
  const activeCount = userBookings.filter(b => ['pending', 'confirmed', 'in-transit'].includes(b.status)).length;
  const avgFare = completedCount > 0 ? Math.round(totalSpent / completedCount) : 0;

  const handleSave = () => {
    if (!formData.name) { showToast('Please enter your name', 'error'); return; }
    showToast('Profile updated successfully!', 'success');
    setIsEditing(false);
  };

  const initials = currentUser?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="pf-shell">
      {/* ── Left: profile card + edit form ── */}
      <div className="pf-left">
        {/* Avatar card */}
        <div className="pf-avatar-card">
          <div className="pf-avatar">{initials}</div>
          <div className="pf-name">{currentUser?.name}</div>
          <div className="pf-role-badge">
            {currentUser?.role === 'driver' ? '🚛 Transporter' : '📦 Shipper'}
          </div>
          <div className="pf-phone">📱 +91 {currentUser?.phone}</div>
          {currentUser?.email && <div className="pf-email">✉️ {currentUser.email}</div>}
          {currentUser?.company && <div className="pf-company">🏢 {currentUser.company}</div>}
        </div>

        {/* Personal info */}
        <div className="pf-card">
          <div className="pf-card-header">
            <h3>Personal Information</h3>
            <button className="btn btn-outline btn-sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : '✏️ Edit'}
            </button>
          </div>

          {isEditing ? (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Phone Number (Read-only)</label>
                <input type="tel" value={formData.phone} disabled style={{ background: 'var(--border)' }} />
              </div>
              <button className="btn btn-primary" onClick={handleSave} style={{ width: '100%' }}>
                Save Changes
              </button>
            </>
          ) : (
            <div className="booking-details">
              <div className="detail-row"><span className="detail-label">Name</span><span>{formData.name}</span></div>
              <div className="detail-row"><span className="detail-label">Email</span><span>{formData.email || '—'}</span></div>
              <div className="detail-row"><span className="detail-label">Phone</span><span>{formData.phone}</span></div>
              <div className="detail-row"><span className="detail-label">Role</span>
                <span>{currentUser?.role === 'driver' ? 'Transporter' : 'Shipper'}</span></div>
              {currentUser?.gstNo && (
                <div className="detail-row"><span className="detail-label">GST No</span><span>{currentUser.gstNo}</span></div>
              )}
            </div>
          )}
        </div>

        {/* Account settings */}
        <div className="pf-card">
          <h3 style={{ marginBottom: '16px' }}>⚙️ Account Settings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              '🔐 Change Password',
              '🔔 Notification Settings',
              '📋 View Terms & Conditions',
              '👥 Refer a Friend',
            ].map(label => (
              <button key={label} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>{label}</button>
            ))}
          </div>
        </div>

        <div className="pf-card">
          <button className="btn btn-outline" style={{ width: '100%', borderColor: 'var(--error)', color: 'var(--error)' }}
            onClick={logout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* ── Right: stats + activity ── */}
      <div className="pf-right">
        {/* Stats grid */}
        <div className="pf-stats-grid">
          {[
            { icon: '📋', label: 'Total Bookings', value: userBookings.length, color: 'var(--primary)' },
            { icon: '🚦', label: 'Active Now',      value: activeCount,         color: '#F59E0B' },
            { icon: '✓',  label: 'Completed',       value: completedCount,      color: '#10B981' },
            { icon: '💰', label: 'Total Spent',     value: `₹${totalSpent.toLocaleString('en-IN')}`, color: '#8B5CF6' },
          ].map(s => (
            <div key={s.label} className="pf-stat-cell">
              <div className="pf-stat-icon">{s.icon}</div>
              <div className="pf-stat-val" style={{ color: s.color }}>{s.value}</div>
              <div className="pf-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Avg fare */}
        {completedCount > 0 && (
          <div className="pf-avg-card">
            <div style={{ fontSize: 13, color: 'var(--text-light)' }}>Average fare per trip</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>₹{avgFare.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: 12, color: 'var(--text-light)' }}>across {completedCount} completed trip{completedCount !== 1 ? 's' : ''}</div>
          </div>
        )}

        {/* Recent bookings */}
        {userBookings.length > 0 && (
          <div className="pf-card">
            <div className="pf-card-header">
              <h3>Recent Bookings</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setPage('myBookings')}>View All</button>
            </div>
            <div>
              {userBookings.slice(0, 5).map((b) => (
                <div key={b.id} className="pf-booking-row">
                  <div className="pf-booking-route">
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{b.from} → {b.to}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                      {b.vehicle} · {new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '15px' }}>₹{b.fare}</div>
                    <div className={`pf-status-dot status-${b.status}`}>{b.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved addresses */}
        <div className="pf-card">
          <h3 style={{ marginBottom: '12px' }}>📍 Saved Addresses</h3>
          <div style={{ color: 'var(--text-light)', textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📌</div>
            <p style={{ marginBottom: 12 }}>No saved addresses yet.</p>
            <button className="btn btn-outline btn-sm">+ Add Address</button>
          </div>
        </div>

        {/* Payment methods */}
        <div className="pf-card">
          <h3 style={{ marginBottom: '12px' }}>💳 Payment Methods</h3>
          <div style={{ color: 'var(--text-light)', textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💳</div>
            <p style={{ marginBottom: 12 }}>No saved payment methods.</p>
            <button className="btn btn-outline btn-sm">+ Add Payment Method</button>
          </div>
        </div>
      </div>
    </div>
  );
}
