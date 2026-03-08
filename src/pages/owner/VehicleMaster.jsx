import { useState } from 'react';
import { FLEET_VEHICLES, DRIVERS } from '../../data/ownerData';

const VEHICLE_TYPES = ['All', 'Auto Rickshaw', 'Tempo', 'Mini Truck', 'Full Truck'];
const STATUS_OPTIONS = ['active', 'maintenance', 'offline'];
const STATUS_LABELS = { active: 'Active', maintenance: 'Maintenance', offline: 'Offline' };

const emptyVehicle = {
  id: '', regNo: '', type: 'Auto Rickshaw', typeId: 1, make: '', model: '',
  year: new Date().getFullYear(), color: '', capacity: '', volume: '',
  fuelType: 'Diesel', assignedDriverId: '', assignedDriverName: '',
  status: 'active', insuranceExpiry: '', fitnessExpiry: '',
  lastService: '', odometer: '', baseCity: '', permitType: 'Local', notes: '',
};

const FUEL_TYPES = ['Diesel', 'CNG', 'Petrol', 'Electric', 'LNG'];
const PERMIT_TYPES = ['Local', 'State', 'National'];
const TYPE_ID_MAP = { 'Auto Rickshaw': 1, 'Mini Truck': 2, 'Full Truck': 3, 'Tempo': 4 };

export default function VehicleMaster() {
  const [vehicles, setVehicles] = useState(FLEET_VEHICLES);
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [form, setForm] = useState(emptyVehicle);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = vehicles.filter(v => {
    const matchType = filterType === 'All' || v.type === filterType;
    const matchStatus = filterStatus === 'All' || v.status === filterStatus;
    const matchSearch = !search ||
      v.regNo.toLowerCase().includes(search.toLowerCase()) ||
      v.make.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.assignedDriverName.toLowerCase().includes(search.toLowerCase()) ||
      v.baseCity.toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  const openAdd = () => {
    setEditVehicle(null);
    setForm({ ...emptyVehicle, id: `V${String(vehicles.length + 1).padStart(3, '0')}` });
    setShowModal(true);
  };

  const openEdit = (v) => {
    setEditVehicle(v.id);
    setForm({ ...v });
    setShowModal(true);
  };

  const saveVehicle = () => {
    if (!form.regNo || !form.make || !form.model) return;
    const driver = DRIVERS.find(d => d.id === form.assignedDriverId);
    const record = {
      ...form,
      typeId: TYPE_ID_MAP[form.type] || 1,
      assignedDriverName: driver ? driver.name : (form.assignedDriverName || 'Unassigned'),
      capacity: Number(form.capacity),
      volume: Number(form.volume),
      odometer: Number(form.odometer),
    };
    if (editVehicle) {
      setVehicles(vs => vs.map(v => v.id === editVehicle ? record : v));
    } else {
      setVehicles(vs => [...vs, record]);
    }
    setShowModal(false);
  };

  const deleteVehicle = (id) => {
    setVehicles(vs => vs.filter(v => v.id !== id));
    setConfirmDelete(null);
  };

  const toggleStatus = (id) => {
    setVehicles(vs => vs.map(v => {
      if (v.id !== id) return v;
      const next = { active: 'maintenance', maintenance: 'offline', offline: 'active' };
      return { ...v, status: next[v.status] };
    }));
  };

  const totalByType = VEHICLE_TYPES.slice(1).map(t => ({
    type: t,
    count: vehicles.filter(v => v.type === t).length,
    active: vehicles.filter(v => v.type === t && v.status === 'active').length,
  }));

  return (
    <div className="owner-page">
      {/* Summary Cards */}
      <div className="kpi-grid kpi-grid-sm">
        {totalByType.map(t => (
          <div key={t.type} className="kpi-card" style={{ borderTopColor: '#F97316' }}>
            <div className="kpi-icon" style={{ background: '#F9731622' }}>🚛</div>
            <div className="kpi-body">
              <div className="kpi-value">{t.count}</div>
              <div className="kpi-label">{t.type}</div>
              <div className="kpi-sub">{t.active} active</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Actions */}
      <div className="owner-card">
        <div className="table-toolbar">
          <input className="owner-search" placeholder="🔍 Search reg, make, driver, city..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="owner-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
            {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <select className="owner-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Vehicle</button>
        </div>

        <div className="table-meta">Showing {filtered.length} of {vehicles.length} vehicles</div>

        <div className="table-responsive">
          <table className="owner-table">
            <thead>
              <tr>
                <th>Reg No.</th><th>Type</th><th>Make / Model</th><th>Year</th>
                <th>Capacity</th><th>Assigned Driver</th><th>Base City</th>
                <th>Insurance Exp.</th><th>Odometer</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => {
                const insExp = new Date(v.insuranceExpiry);
                const insAlert = insExp <= new Date('2026-05-08');
                return (
                  <tr key={v.id}>
                    <td className="mono font-bold">{v.regNo}</td>
                    <td>{v.type}</td>
                    <td>{v.make} {v.model}</td>
                    <td>{v.year}</td>
                    <td>{v.capacity} kg<br /><small>{v.volume} cbm</small></td>
                    <td>{v.assignedDriverName !== 'Unassigned' ? v.assignedDriverName : <em className="muted">Unassigned</em>}</td>
                    <td>{v.baseCity}</td>
                    <td className={insAlert ? 'text-danger' : ''}>{v.insuranceExpiry}{insAlert && ' ⚠️'}</td>
                    <td>{Number(v.odometer).toLocaleString('en-IN')} km</td>
                    <td>
                      <button className={`status-badge status-${v.status} clickable`} onClick={() => toggleStatus(v.id)} title="Click to cycle status">
                        {STATUS_LABELS[v.status]}
                      </button>
                    </td>
                    <td className="action-cell">
                      <button className="icon-btn" onClick={() => openEdit(v)} title="Edit">✏️</button>
                      <button className="icon-btn danger" onClick={() => setConfirmDelete(v.id)} title="Delete">🗑️</button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={11} className="empty-row">No vehicles match your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-field">
                  <label>Registration No. *</label>
                  <input className="owner-input" value={form.regNo} onChange={e => setForm(f => ({ ...f, regNo: e.target.value }))} placeholder="DL01AB1234" />
                </div>
                <div className="form-field">
                  <label>Vehicle Type *</label>
                  <select className="owner-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    {VEHICLE_TYPES.slice(1).map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label>Make *</label>
                  <input className="owner-input" value={form.make} onChange={e => setForm(f => ({ ...f, make: e.target.value }))} placeholder="Tata, Eicher..." />
                </div>
                <div className="form-field">
                  <label>Model *</label>
                  <input className="owner-input" value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} placeholder="407 Gold..." />
                </div>
                <div className="form-field">
                  <label>Year</label>
                  <input className="owner-input" type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label>Color</label>
                  <input className="owner-input" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label>Capacity (kg)</label>
                  <input className="owner-input" type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label>Volume (cbm)</label>
                  <input className="owner-input" type="number" value={form.volume} onChange={e => setForm(f => ({ ...f, volume: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label>Fuel Type</label>
                  <select className="owner-input" value={form.fuelType} onChange={e => setForm(f => ({ ...f, fuelType: e.target.value }))}>
                    {FUEL_TYPES.map(ft => <option key={ft}>{ft}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label>Assign Driver</label>
                  <select className="owner-input" value={form.assignedDriverId || ''} onChange={e => setForm(f => ({ ...f, assignedDriverId: e.target.value }))}>
                    <option value="">Unassigned</option>
                    {DRIVERS.map(d => <option key={d.id} value={d.id}>{d.name} — {d.vehicleType}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label>Base City</label>
                  <input className="owner-input" value={form.baseCity} onChange={e => setForm(f => ({ ...f, baseCity: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label>Permit Type</label>
                  <select className="owner-input" value={form.permitType} onChange={e => setForm(f => ({ ...f, permitType: e.target.value }))}>
                    {PERMIT_TYPES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label>Insurance Expiry</label>
                  <input className="owner-input" type="date" value={form.insuranceExpiry} onChange={e => setForm(f => ({ ...f, insuranceExpiry: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label>Fitness Expiry</label>
                  <input className="owner-input" type="date" value={form.fitnessExpiry} onChange={e => setForm(f => ({ ...f, fitnessExpiry: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label>Last Service</label>
                  <input className="owner-input" type="date" value={form.lastService} onChange={e => setForm(f => ({ ...f, lastService: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label>Odometer (km)</label>
                  <input className="owner-input" type="number" value={form.odometer} onChange={e => setForm(f => ({ ...f, odometer: e.target.value }))} />
                </div>
                <div className="form-field full-width">
                  <label>Status</label>
                  <select className="owner-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
                <div className="form-field full-width">
                  <label>Notes</label>
                  <textarea className="owner-input" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveVehicle}>
                {editVehicle ? 'Save Changes' : 'Add Vehicle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal-box modal-sm" onClick={e => e.stopPropagation()}>
            <h3>Remove Vehicle?</h3>
            <p>Are you sure you want to remove this vehicle from the fleet? This cannot be undone.</p>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => deleteVehicle(confirmDelete)}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
