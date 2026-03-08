import { useState } from 'react';
import { OWNER_ALL_BOOKINGS } from '../../data/ownerData';
import { MOCK_BOOKINGS } from '../../data/mockData';

// Merge all bookings for owner view
const allBookings = [
  ...OWNER_ALL_BOOKINGS,
  // add any extra from MOCK_BOOKINGS that aren't already in OWNER_ALL_BOOKINGS
  ...Object.values(MOCK_BOOKINGS).flat().filter(b =>
    !OWNER_ALL_BOOKINGS.some(o => o.id === b.id)
  ).map(b => ({
    id: b.id, from: b.from, to: b.to, date: b.date,
    vehicle: b.vehicle, vehicleId: null, driverId: null,
    driver: b.driver, customer: 'Demo Customer',
    fare: b.fare, status: b.status, distance: b.distance || 0,
  })),
];

const STATUS_OPTIONS = ['All', 'pending', 'confirmed', 'in-transit', 'completed', 'cancelled'];

export default function AllBookings() {
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [selected, setSelected] = useState(null);

  const filtered = allBookings.filter(b => {
    const matchStatus = filterStatus === 'All' || b.status === filterStatus;
    const matchSearch = !search ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.from.toLowerCase().includes(search.toLowerCase()) ||
      b.to.toLowerCase().includes(search.toLowerCase()) ||
      b.customer.toLowerCase().includes(search.toLowerCase()) ||
      b.driver.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  }).sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'fare-desc') return b.fare - a.fare;
    if (sortBy === 'fare-asc') return a.fare - b.fare;
    return 0;
  });

  const totalRevenue = allBookings.filter(b => b.status === 'completed').reduce((s, b) => s + b.fare, 0);
  const activeCount = allBookings.filter(b => ['in-transit', 'confirmed'].includes(b.status)).length;
  const pendingCount = allBookings.filter(b => b.status === 'pending').length;

  return (
    <div className="owner-page">
      {/* Summary */}
      <div className="kpi-grid kpi-grid-sm">
        <div className="kpi-card" style={{ borderTopColor: '#F97316' }}>
          <div className="kpi-icon" style={{ background: '#F9731622' }}>📋</div>
          <div className="kpi-body">
            <div className="kpi-value">{allBookings.length}</div>
            <div className="kpi-label">Total Bookings</div>
          </div>
        </div>
        <div className="kpi-card" style={{ borderTopColor: '#3B82F6' }}>
          <div className="kpi-icon" style={{ background: '#3B82F622' }}>🚦</div>
          <div className="kpi-body">
            <div className="kpi-value">{activeCount}</div>
            <div className="kpi-label">Active Now</div>
          </div>
        </div>
        <div className="kpi-card" style={{ borderTopColor: '#F59E0B' }}>
          <div className="kpi-icon" style={{ background: '#F59E0B22' }}>⏳</div>
          <div className="kpi-body">
            <div className="kpi-value">{pendingCount}</div>
            <div className="kpi-label">Pending Assignment</div>
          </div>
        </div>
        <div className="kpi-card" style={{ borderTopColor: '#10B981' }}>
          <div className="kpi-icon" style={{ background: '#10B98122' }}>💰</div>
          <div className="kpi-body">
            <div className="kpi-value">₹{totalRevenue.toLocaleString('en-IN')}</div>
            <div className="kpi-label">Completed Revenue</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="owner-card">
        <div className="table-toolbar">
          <input className="owner-search" placeholder="🔍 Search ID, route, customer, driver..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="owner-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
          </select>
          <select className="owner-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="date-desc">Latest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="fare-desc">Highest Fare</option>
            <option value="fare-asc">Lowest Fare</option>
          </select>
        </div>
        <div className="table-meta">Showing {filtered.length} of {allBookings.length} bookings</div>

        <div className="table-responsive">
          <table className="owner-table">
            <thead>
              <tr>
                <th>Booking ID</th><th>Date</th><th>Route</th><th>Customer</th>
                <th>Vehicle</th><th>Driver</th><th>Distance</th><th>Fare</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  <td className="mono font-bold">{b.id}</td>
                  <td>{new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                  <td>{b.from} → {b.to}</td>
                  <td>{b.customer}</td>
                  <td>{b.vehicle}</td>
                  <td>{b.driver === 'Unassigned' ? <em className="muted">Unassigned</em> : b.driver}</td>
                  <td>{b.distance > 0 ? `${b.distance} km` : '—'}</td>
                  <td>₹{b.fare.toLocaleString('en-IN')}</td>
                  <td><span className={`status-badge status-${b.status}`}>{b.status}</span></td>
                  <td>
                    <button className="icon-btn" onClick={() => setSelected(b)} title="View">👁️</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="empty-row">No bookings match your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Booking — {selected.id}</h3>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="driver-detail-grid">
                <div><strong>Status:</strong> <span className={`status-badge status-${selected.status}`}>{selected.status}</span></div>
                <div><strong>Date:</strong> {new Date(selected.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div><strong>From:</strong> {selected.from}</div>
                <div><strong>To:</strong> {selected.to}</div>
                <div><strong>Distance:</strong> {selected.distance > 0 ? `${selected.distance} km` : 'N/A'}</div>
                <div><strong>Vehicle:</strong> {selected.vehicle}</div>
                <div><strong>Driver:</strong> {selected.driver}</div>
                <div><strong>Customer:</strong> {selected.customer}</div>
                <div><strong>Fare:</strong> ₹{selected.fare.toLocaleString('en-IN')}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
