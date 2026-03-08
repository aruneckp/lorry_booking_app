import { useState } from 'react';
import { FLEET_VEHICLES, DRIVERS, OWNER_ALL_BOOKINGS } from '../../data/ownerData';

const VEHICLE_TYPES = ['All', 'Auto Rickshaw', 'Tempo', 'Mini Truck', 'Full Truck'];
const AVAIL_LABELS = { available: 'Available', 'on-trip': 'On Trip', 'on-leave': 'On Leave', inactive: 'Inactive' };

function isBusyOn(date, driverId) {
  return OWNER_ALL_BOOKINGS.some(b =>
    b.driverId === driverId &&
    b.date === date &&
    ['confirmed', 'in-transit', 'pending'].includes(b.status)
  );
}

function isVehicleBusy(date, vehicleId) {
  return OWNER_ALL_BOOKINGS.some(b =>
    b.vehicleId === vehicleId &&
    b.date === date &&
    ['confirmed', 'in-transit', 'pending'].includes(b.status)
  );
}

export default function AvailabilityView() {
  const [tab, setTab] = useState('vehicles'); // vehicles | drivers
  const [filterDate, setFilterDate] = useState('2026-03-08');
  const [filterTime, setFilterTime] = useState('09:00');
  const [filterType, setFilterType] = useState('All');

  const filteredVehicles = FLEET_VEHICLES.filter(v => {
    const matchType = filterType === 'All' || v.type === filterType;
    return matchType;
  }).map(v => ({
    ...v,
    effectiveStatus: v.status !== 'active'
      ? v.status
      : isVehicleBusy(filterDate, v.id)
        ? 'booked'
        : 'available',
  }));

  const filteredDrivers = DRIVERS.filter(d => {
    const matchType = filterType === 'All' || d.vehicleType === filterType;
    return matchType;
  }).map(d => ({
    ...d,
    effectiveAvail: d.availability === 'on-leave' || d.availability === 'inactive'
      ? d.availability
      : isBusyOn(filterDate, d.id)
        ? 'on-trip'
        : 'available',
  }));

  const vAvail = filteredVehicles.filter(v => v.effectiveStatus === 'available').length;
  const vBooked = filteredVehicles.filter(v => v.effectiveStatus === 'booked').length;
  const vMaint = filteredVehicles.filter(v => v.effectiveStatus === 'maintenance').length;
  const dAvail = filteredDrivers.filter(d => d.effectiveAvail === 'available').length;
  const dTrip = filteredDrivers.filter(d => d.effectiveAvail === 'on-trip').length;
  const dLeave = filteredDrivers.filter(d => ['on-leave', 'inactive'].includes(d.effectiveAvail)).length;

  const statusColor = (s) => ({
    available: '#10B981', booked: '#3B82F6', maintenance: '#F59E0B',
    offline: '#6B7280', 'on-trip': '#3B82F6', 'on-leave': '#F59E0B', inactive: '#6B7280',
  }[s] || '#6B7280');

  return (
    <div className="owner-page">
      {/* Filters */}
      <div className="owner-card">
        <div className="table-toolbar" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div className="form-field" style={{ margin: 0 }}>
            <label style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: 4 }}>Date</label>
            <input className="owner-input" type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={{ width: 160 }} />
          </div>
          <div className="form-field" style={{ margin: 0 }}>
            <label style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: 4 }}>Time Slot</label>
            <input className="owner-input" type="time" value={filterTime} onChange={e => setFilterTime(e.target.value)} style={{ width: 120 }} />
          </div>
          <div className="form-field" style={{ margin: 0 }}>
            <label style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: 4 }}>Vehicle Type</label>
            <select className="owner-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
              {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="avail-summary-chips">
            <span className="avail-chip avail-chip-green">{vAvail} vehicles free</span>
            <span className="avail-chip avail-chip-blue">{vBooked} booked</span>
            <span className="avail-chip avail-chip-orange">{vMaint} in maintenance</span>
          </div>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="owner-tabs">
        <button className={`owner-tab${tab === 'vehicles' ? ' active' : ''}`} onClick={() => setTab('vehicles')}>
          🚛 Vehicles ({filteredVehicles.length})
        </button>
        <button className={`owner-tab${tab === 'drivers' ? ' active' : ''}`} onClick={() => setTab('drivers')}>
          👷 Drivers ({filteredDrivers.length})
        </button>
      </div>

      {tab === 'vehicles' && (
        <div className="avail-grid">
          {filteredVehicles.map(v => (
            <div key={v.id} className="avail-card" style={{ borderLeftColor: statusColor(v.effectiveStatus) }}>
              <div className="avail-card-header">
                <span className="avail-reg">{v.regNo}</span>
                <span className="avail-status-dot" style={{ background: statusColor(v.effectiveStatus) }} />
                <span className="avail-status-label" style={{ color: statusColor(v.effectiveStatus) }}>
                  {v.effectiveStatus === 'available' ? '✓ Available' :
                   v.effectiveStatus === 'booked' ? '⏳ Booked' :
                   v.effectiveStatus === 'maintenance' ? '🔧 Maintenance' : '⚫ Offline'}
                </span>
              </div>
              <div className="avail-card-body">
                <div className="avail-type">{v.type}</div>
                <div className="avail-detail">{v.make} {v.model} · {v.year}</div>
                <div className="avail-detail">📍 {v.baseCity} · ⛽ {v.fuelType}</div>
                <div className="avail-detail">⚖️ {v.capacity} kg · 📦 {v.volume} cbm</div>
                <div className="avail-driver">
                  {v.assignedDriverName !== 'Unassigned'
                    ? `👷 ${v.assignedDriverName}`
                    : <em className="muted">No driver assigned</em>}
                </div>
                {v.notes && <div className="avail-notes">📝 {v.notes}</div>}
              </div>
            </div>
          ))}
          {filteredVehicles.length === 0 && (
            <div className="empty-state">No vehicles match the selected filters</div>
          )}
        </div>
      )}

      {tab === 'drivers' && (
        <>
          <div className="owner-card" style={{ marginBottom: 8, padding: '10px 16px', display: 'flex', gap: 16 }}>
            <span className="avail-chip avail-chip-green">{dAvail} available</span>
            <span className="avail-chip avail-chip-blue">{dTrip} on trip</span>
            <span className="avail-chip avail-chip-orange">{dLeave} on leave / inactive</span>
          </div>
          <div className="avail-grid">
            {filteredDrivers.map(d => (
              <div key={d.id} className="avail-card" style={{ borderLeftColor: statusColor(d.effectiveAvail) }}>
                <div className="avail-card-header">
                  <span className="avail-reg">{d.name}</span>
                  <span className="avail-status-dot" style={{ background: statusColor(d.effectiveAvail) }} />
                  <span className="avail-status-label" style={{ color: statusColor(d.effectiveAvail) }}>
                    {AVAIL_LABELS[d.effectiveAvail] || d.effectiveAvail}
                  </span>
                </div>
                <div className="avail-card-body">
                  <div className="avail-type">📞 {d.phone}</div>
                  <div className="avail-detail">🚛 {d.vehicleType} · {d.assignedVehicleReg || 'No vehicle'}</div>
                  <div className="avail-detail">📍 {d.baseCity} · {d.experience} yr exp</div>
                  <div className="avail-detail">⭐ {d.rating} · {d.totalTrips} trips</div>
                  <div className="avail-detail">🪪 {d.licenseNo} ({d.licenseType})</div>
                  {d.notes && <div className="avail-notes">📝 {d.notes}</div>}
                </div>
              </div>
            ))}
            {filteredDrivers.length === 0 && (
              <div className="empty-state">No drivers match the selected filters</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
