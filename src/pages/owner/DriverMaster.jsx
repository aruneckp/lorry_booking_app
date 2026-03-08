import { useState } from 'react';
import { DRIVERS, FLEET_VEHICLES } from '../../data/ownerData';

const AVAIL_OPTIONS = ['All', 'available', 'on-trip', 'on-leave', 'inactive'];
const AVAIL_LABELS = { available: 'Available', 'on-trip': 'On Trip', 'on-leave': 'On Leave', inactive: 'Inactive' };
const VEHICLE_TYPES = ['All', 'Auto Rickshaw', 'Tempo', 'Mini Truck', 'Full Truck'];
const LICENSE_TYPES = ['LMV-NT', 'TRANS', 'HMV', 'LMV'];

const emptyDriver = {
  id: '', name: '', phone: '', email: '',
  licenseNo: '', licenseType: 'TRANS', licenseExpiry: '',
  experience: '', rating: 5.0, totalTrips: 0,
  assignedVehicleId: '', assignedVehicleReg: '', vehicleType: 'Mini Truck',
  availability: 'available', baseCity: '', joinDate: '',
  documents: { license: true, pcc: true, medicalFitness: true, aadhar: true },
  notes: '',
};

function StarRating({ value }) {
  return (
    <span className="star-rating">
      {'★'.repeat(Math.round(value))}{'☆'.repeat(5 - Math.round(value))}
      <span className="rating-val"> {value.toFixed(1)}</span>
    </span>
  );
}

function DocBadge({ docs }) {
  const allOk = Object.values(docs).every(Boolean);
  const missing = Object.entries(docs).filter(([, v]) => !v).map(([k]) => k);
  return allOk
    ? <span className="status-badge status-completed">All OK</span>
    : <span className="status-badge status-pending" title={`Missing: ${missing.join(', ')}`}>⚠ Incomplete</span>;
}

export default function DriverMaster() {
  const [drivers, setDrivers] = useState(DRIVERS);
  const [filterAvail, setFilterAvail] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editDriver, setEditDriver] = useState(null);
  const [form, setForm] = useState(emptyDriver);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [detailDriver, setDetailDriver] = useState(null);

  const filtered = drivers.filter(d => {
    const matchAvail = filterAvail === 'All' || d.availability === filterAvail;
    const matchType = filterType === 'All' || d.vehicleType === filterType;
    const matchSearch = !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search) ||
      d.licenseNo.toLowerCase().includes(search.toLowerCase()) ||
      d.baseCity.toLowerCase().includes(search.toLowerCase());
    return matchAvail && matchType && matchSearch;
  });

  const openAdd = () => {
    setEditDriver(null);
    setForm({ ...emptyDriver, id: `D${String(drivers.length + 1).padStart(3, '0')}` });
    setShowModal(true);
  };

  const openEdit = (d) => {
    setEditDriver(d.id);
    setForm({ ...d });
    setShowModal(true);
  };

  const saveDriver = () => {
    if (!form.name || !form.phone || !form.licenseNo) return;
    const vehicle = FLEET_VEHICLES.find(v => v.id === form.assignedVehicleId);
    const record = {
      ...form,
      assignedVehicleReg: vehicle ? vehicle.regNo : '',
      vehicleType: vehicle ? vehicle.type : form.vehicleType,
      experience: Number(form.experience),
      rating: Number(form.rating),
      totalTrips: Number(form.totalTrips),
    };
    if (editDriver) {
      setDrivers(ds => ds.map(d => d.id === editDriver ? record : d));
    } else {
      setDrivers(ds => [...ds, record]);
    }
    setShowModal(false);
  };

  const deleteDriver = (id) => {
    setDrivers(ds => ds.filter(d => d.id !== id));
    setConfirmDelete(null);
  };

  const updateDoc = (id, docKey, val) => {
    setDrivers(ds => ds.map(d => d.id !== id ? d : { ...d, documents: { ...d.documents, [docKey]: val } }));
  };

  // Summary stats
  const byAvail = AVAIL_OPTIONS.slice(1).map(a => ({
    label: AVAIL_LABELS[a], count: drivers.filter(d => d.availability === a).length,
    color: a === 'available' ? '#10B981' : a === 'on-trip' ? '#3B82F6' : '#F59E0B',
  }));

  return (
    <div className="owner-page">
      {/* Availability Summary */}
      <div className="kpi-grid kpi-grid-sm">
        {byAvail.map(a => (
          <div key={a.label} className="kpi-card" style={{ borderTopColor: a.color }}>
            <div className="kpi-icon" style={{ background: a.color + '22' }}>👷</div>
            <div className="kpi-body">
              <div className="kpi-value">{a.count}</div>
              <div className="kpi-label">{a.label}</div>
            </div>
          </div>
        ))}
        <div className="kpi-card" style={{ borderTopColor: '#8B5CF6' }}>
          <div className="kpi-icon" style={{ background: '#8B5CF622' }}>⭐</div>
          <div className="kpi-body">
            <div className="kpi-value">
              {drivers.length > 0 ? (drivers.reduce((s, d) => s + d.rating, 0) / drivers.length).toFixed(1) : '—'}
            </div>
            <div className="kpi-label">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="owner-card">
        <div className="table-toolbar">
          <input className="owner-search" placeholder="🔍 Search name, phone, license, city..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="owner-select" value={filterAvail} onChange={e => setFilterAvail(e.target.value)}>
            {AVAIL_OPTIONS.map(a => <option key={a} value={a}>{a === 'All' ? 'All Status' : AVAIL_LABELS[a]}</option>)}
          </select>
          <select className="owner-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
            {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Driver</button>
        </div>

        <div className="table-meta">Showing {filtered.length} of {drivers.length} drivers</div>

        <div className="table-responsive">
          <table className="owner-table">
            <thead>
              <tr>
                <th>Name</th><th>Phone</th><th>License</th><th>Exp.</th>
                <th>Rating</th><th>Trips</th><th>Vehicle</th><th>City</th>
                <th>Documents</th><th>Availability</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => {
                const licExp = new Date(d.licenseExpiry);
                const licAlert = licExp <= new Date('2026-12-31');
                return (
                  <tr key={d.id}>
                    <td>
                      <button className="link-btn" onClick={() => setDetailDriver(d)}>{d.name}</button>
                    </td>
                    <td className="mono">{d.phone}</td>
                    <td className={`mono ${licAlert ? 'text-warn' : ''}`}>
                      {d.licenseNo}<br /><small>{d.licenseType} · exp {d.licenseExpiry}</small>
                    </td>
                    <td>{d.experience} yr</td>
                    <td><StarRating value={d.rating} /></td>
                    <td>{d.totalTrips.toLocaleString('en-IN')}</td>
                    <td>{d.assignedVehicleReg || <em className="muted">None</em>}<br /><small>{d.vehicleType}</small></td>
                    <td>{d.baseCity}</td>
                    <td><DocBadge docs={d.documents} /></td>
                    <td>
                      <span className={`status-badge avail-${d.availability}`}>
                        {AVAIL_LABELS[d.availability]}
                      </span>
                    </td>
                    <td className="action-cell">
                      <button className="icon-btn" onClick={() => openEdit(d)} title="Edit">✏️</button>
                      <button className="icon-btn danger" onClick={() => setConfirmDelete(d.id)} title="Remove">🗑️</button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={11} className="empty-row">No drivers match your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Driver Detail Panel */}
      {detailDriver && (
        <div className="modal-overlay" onClick={() => setDetailDriver(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>👷 {detailDriver.name}</h3>
              <button className="modal-close" onClick={() => setDetailDriver(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="driver-detail-grid">
                <div><strong>Phone:</strong> {detailDriver.phone}</div>
                <div><strong>Email:</strong> {detailDriver.email}</div>
                <div><strong>License:</strong> {detailDriver.licenseNo} ({detailDriver.licenseType})</div>
                <div><strong>License Expiry:</strong> {detailDriver.licenseExpiry}</div>
                <div><strong>Experience:</strong> {detailDriver.experience} years</div>
                <div><strong>Rating:</strong> <StarRating value={detailDriver.rating} /></div>
                <div><strong>Total Trips:</strong> {detailDriver.totalTrips.toLocaleString('en-IN')}</div>
                <div><strong>Joined:</strong> {detailDriver.joinDate}</div>
                <div><strong>Base City:</strong> {detailDriver.baseCity}</div>
                <div><strong>Assigned Vehicle:</strong> {detailDriver.assignedVehicleReg || 'None'}</div>
                <div><strong>Status:</strong> <span className={`status-badge avail-${detailDriver.availability}`}>{AVAIL_LABELS[detailDriver.availability]}</span></div>
                <div><strong>Notes:</strong> {detailDriver.notes || '—'}</div>
              </div>
              <div className="doc-section">
                <h4>Documents</h4>
                <div className="doc-grid">
                  {Object.entries(detailDriver.documents).map(([key, val]) => (
                    <label key={key} className="doc-item">
                      <input type="checkbox" checked={val} onChange={e => updateDoc(detailDriver.id, key, e.target.checked)} />
                      <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className={val ? 'text-success' : 'text-danger'}>{val ? ' ✓' : ' ✗'}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setDetailDriver(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => { openEdit(detailDriver); setDetailDriver(null); }}>Edit Driver</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editDriver ? 'Edit Driver' : 'Add New Driver'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-field">
                  <label>Full Name *</label>
                  <input className="owner-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label>Phone *</label>
                  <input className="owner-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label>Email</label>
                  <input className="owner-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label>License No. *</label>
                  <input className="owner-input" value={form.licenseNo} onChange={e => setForm(f => ({ ...f, licenseNo: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label>License Type</label>
                  <select className="owner-input" value={form.licenseType} onChange={e => setForm(f => ({ ...f, licenseType: e.target.value }))}>
                    {LICENSE_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label>License Expiry</label>
                  <input className="owner-input" type="date" value={form.licenseExpiry} onChange={e => setForm(f => ({ ...f, licenseExpiry: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label>Experience (years)</label>
                  <input className="owner-input" type="number" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label>Base City</label>
                  <input className="owner-input" value={form.baseCity} onChange={e => setForm(f => ({ ...f, baseCity: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label>Assign Vehicle</label>
                  <select className="owner-input" value={form.assignedVehicleId || ''} onChange={e => setForm(f => ({ ...f, assignedVehicleId: e.target.value }))}>
                    <option value="">None</option>
                    {FLEET_VEHICLES.map(v => <option key={v.id} value={v.id}>{v.regNo} — {v.type}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label>Availability</label>
                  <select className="owner-input" value={form.availability} onChange={e => setForm(f => ({ ...f, availability: e.target.value }))}>
                    {AVAIL_OPTIONS.slice(1).map(a => <option key={a} value={a}>{AVAIL_LABELS[a]}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label>Join Date</label>
                  <input className="owner-input" type="date" value={form.joinDate} onChange={e => setForm(f => ({ ...f, joinDate: e.target.value }))} />
                </div>
                <div className="form-field full-width">
                  <label>Notes</label>
                  <textarea className="owner-input" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
                <div className="form-field full-width">
                  <label>Documents</label>
                  <div className="doc-grid">
                    {Object.entries(form.documents).map(([key, val]) => (
                      <label key={key} className="doc-item">
                        <input type="checkbox" checked={val} onChange={e => setForm(f => ({ ...f, documents: { ...f.documents, [key]: e.target.checked } }))} />
                        <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveDriver}>
                {editDriver ? 'Save Changes' : 'Add Driver'}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal-box modal-sm" onClick={e => e.stopPropagation()}>
            <h3>Remove Driver?</h3>
            <p>Are you sure you want to remove this driver from the roster?</p>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => deleteDriver(confirmDelete)}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
