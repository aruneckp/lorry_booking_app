import { useState } from 'react';
import { useBooking } from '../../context/BookingContext';

const NAV_ITEMS = [
  { id: 'dashboard',     icon: '📊', label: 'Dashboard' },
  { id: 'tracking',      icon: '🛰️', label: 'Live Tracking' },
  { id: 'transactions',  icon: '💰', label: 'Transactions' },
  { id: 'availability',  icon: '🗓️', label: 'Availability' },
  { id: 'vehicles',      icon: '🚛', label: 'Vehicle Master' },
  { id: 'drivers',       icon: '👷', label: 'Driver Master' },
  { id: 'items',         icon: '📦', label: 'Items Policy' },
  { id: 'allbookings',   icon: '📋', label: 'All Bookings' },
];

export default function OwnerLayout({ children, activePage, setActivePage }) {
  const { currentUser, logout } = useBooking();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="owner-shell">
      {/* Sidebar */}
      <aside className={`owner-sidebar${sidebarOpen ? '' : ' collapsed'}`}>
        <div className="owner-logo">
          <span className="owner-logo-icon">🚛</span>
          {sidebarOpen && <span className="owner-logo-text">LorryHub<br /><small>Owner Portal</small></span>}
        </div>

        <nav className="owner-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`owner-nav-item${activePage === item.id ? ' active' : ''}`}
              onClick={() => setActivePage(item.id)}
              title={item.label}
            >
              <span className="owner-nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="owner-nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="owner-sidebar-footer">
          {sidebarOpen && (
            <div className="owner-user-info">
              <div className="owner-avatar">{currentUser?.name?.charAt(0)}</div>
              <div>
                <div className="owner-user-name">{currentUser?.name}</div>
                <div className="owner-user-role">Fleet Owner</div>
              </div>
            </div>
          )}
          <button className="owner-logout-btn" onClick={logout} title="Logout">
            🚪{sidebarOpen && ' Logout'}
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="owner-main">
        {/* Top Bar */}
        <header className="owner-topbar">
          <button className="owner-toggle-btn" onClick={() => setSidebarOpen(o => !o)} title="Toggle sidebar">
            {sidebarOpen ? '◀' : '▶'}
          </button>
          <h2 className="owner-topbar-title">
            {NAV_ITEMS.find(n => n.id === activePage)?.icon}{' '}
            {NAV_ITEMS.find(n => n.id === activePage)?.label}
          </h2>
          <div className="owner-topbar-right">
            <span className="owner-badge-live">● LIVE</span>
            <span className="owner-topbar-date">{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="owner-content">
          {children}
        </main>
      </div>
    </div>
  );
}
