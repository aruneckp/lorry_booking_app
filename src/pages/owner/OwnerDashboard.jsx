import { FLEET_VEHICLES, DRIVERS, DAILY_TRANSACTIONS, TOP_ROUTES, OWNER_ALL_BOOKINGS } from '../../data/ownerData';

const today = DAILY_TRANSACTIONS[DAILY_TRANSACTIONS.length - 1];
const yesterday = DAILY_TRANSACTIONS[DAILY_TRANSACTIONS.length - 2];

const thisWeek = DAILY_TRANSACTIONS.slice(-7);
const lastWeek = DAILY_TRANSACTIONS.slice(-14, -7);

const thisMonth = DAILY_TRANSACTIONS.filter(d => d.date.startsWith('2026-03'));
const lastMonth = DAILY_TRANSACTIONS.filter(d => d.date.startsWith('2026-02'));

function sum(arr, key) { return arr.reduce((s, d) => s + d[key], 0); }

const todayRevenue = today?.revenue || 0;
const yesterdayRevenue = yesterday?.revenue || 0;
const weekRevenue = sum(thisWeek, 'revenue');
const monthRevenue = sum(thisMonth, 'revenue');
const lastMonthRevenue = sum(lastMonth, 'revenue');
const weekBookings = sum(thisWeek, 'bookings');
const monthBookings = sum(thisMonth, 'bookings');

const activeVehicles = FLEET_VEHICLES.filter(v => v.status === 'active').length;
const maintenanceVehicles = FLEET_VEHICLES.filter(v => v.status === 'maintenance').length;
const availableDrivers = DRIVERS.filter(d => d.availability === 'available').length;
const onTripDrivers = DRIVERS.filter(d => d.availability === 'on-trip').length;
const activeTrips = OWNER_ALL_BOOKINGS.filter(b => ['in-transit', 'confirmed'].includes(b.status)).length;

function Trend({ value, prev, unit = '₹' }) {
  if (!prev) return null;
  const pct = Math.round(((value - prev) / prev) * 100);
  const up = pct >= 0;
  return (
    <span className={`kpi-trend ${up ? 'up' : 'down'}`}>
      {up ? '▲' : '▼'} {Math.abs(pct)}% vs prev
    </span>
  );
}

function KpiCard({ icon, label, value, sub, trend, prevValue, color }) {
  return (
    <div className="kpi-card" style={{ borderTopColor: color }}>
      <div className="kpi-icon" style={{ background: color + '22' }}>{icon}</div>
      <div className="kpi-body">
        <div className="kpi-value">{value}</div>
        <div className="kpi-label">{label}</div>
        {sub && <div className="kpi-sub">{sub}</div>}
        {trend && prevValue !== undefined && <Trend value={trend} prev={prevValue} />}
      </div>
    </div>
  );
}

// Simple CSS bar chart
function BarChart({ data, maxVal }) {
  const max = maxVal || Math.max(...data.map(d => d.value));
  return (
    <div className="bar-chart">
      {data.map((d, i) => (
        <div key={i} className="bar-col">
          <div className="bar-wrap">
            <div className="bar-fill" style={{ height: `${Math.round((d.value / max) * 100)}%` }} />
          </div>
          <div className="bar-label">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function OwnerDashboard() {
  const recentActivity = OWNER_ALL_BOOKINGS.slice(0, 5);

  // Last 7 days bar chart
  const weekChartData = thisWeek.map(d => ({
    label: new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short' }),
    value: d.revenue,
  }));

  // Monthly by vehicle type
  const byType = { 'Auto Rickshaw': 0, 'Tempo': 0, 'Mini Truck': 0, 'Full Truck': 0 };
  thisMonth.forEach(d => {
    Object.entries(d.byType).forEach(([k, v]) => { byType[k] = (byType[k] || 0) + v; });
  });
  const typeChartData = Object.entries(byType).map(([k, v]) => ({ label: k.replace(' ', '\n'), value: v }));

  // Expiry alerts
  const now = new Date('2026-03-08');
  const in60 = new Date('2026-05-08');
  const expiryAlerts = FLEET_VEHICLES.filter(v => {
    const d = new Date(v.insuranceExpiry);
    return d <= in60;
  });
  const docAlerts = DRIVERS.filter(d => Object.values(d.documents).some(v => !v));

  return (
    <div className="owner-page">
      {/* KPI Row 1 */}
      <div className="kpi-grid">
        <KpiCard icon="💰" label="Today's Revenue" value={`₹${todayRevenue.toLocaleString('en-IN')}`}
          sub={`${today?.bookings} bookings`} trend={todayRevenue} prevValue={yesterdayRevenue} color="#F97316" />
        <KpiCard icon="📅" label="This Week" value={`₹${weekRevenue.toLocaleString('en-IN')}`}
          sub={`${weekBookings} bookings`} trend={weekRevenue} prevValue={sum(lastWeek, 'revenue')} color="#3B82F6" />
        <KpiCard icon="📆" label="This Month" value={`₹${monthRevenue.toLocaleString('en-IN')}`}
          sub={`${monthBookings} bookings`} trend={monthRevenue} prevValue={lastMonthRevenue} color="#10B981" />
        <KpiCard icon="🚦" label="Active Trips" value={activeTrips} sub="In-transit & confirmed" color="#8B5CF6" />
      </div>

      {/* KPI Row 2 */}
      <div className="kpi-grid kpi-grid-sm">
        <KpiCard icon="🚛" label="Fleet Active" value={`${activeVehicles}/${FLEET_VEHICLES.length}`} sub={`${maintenanceVehicles} in maintenance`} color="#F97316" />
        <KpiCard icon="👷" label="Drivers Available" value={availableDrivers} sub={`${onTripDrivers} on trip`} color="#10B981" />
        <KpiCard icon="⚠️" label="Insurance Alerts" value={expiryAlerts.length} sub="Expiring within 60 days" color="#EF4444" />
        <KpiCard icon="📄" label="Doc Alerts" value={docAlerts.length} sub="Drivers with missing docs" color="#F59E0B" />
      </div>

      {/* Charts Row */}
      <div className="owner-charts-row">
        <div className="owner-chart-card">
          <h3 className="chart-title">Revenue — Last 7 Days</h3>
          <BarChart data={weekChartData} />
          <div className="chart-total">Total: ₹{weekRevenue.toLocaleString('en-IN')}</div>
        </div>

        <div className="owner-chart-card">
          <h3 className="chart-title">Bookings by Vehicle Type (This Month)</h3>
          <BarChart data={typeChartData} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="owner-bottom-row">
        {/* Recent Activity */}
        <div className="owner-card">
          <h3 className="owner-card-title">Recent Bookings</h3>
          <table className="owner-table">
            <thead>
              <tr><th>ID</th><th>Route</th><th>Customer</th><th>Vehicle</th><th>Fare</th><th>Status</th></tr>
            </thead>
            <tbody>
              {recentActivity.map(b => (
                <tr key={b.id}>
                  <td className="mono">{b.id}</td>
                  <td>{b.from} → {b.to}</td>
                  <td>{b.customer}</td>
                  <td>{b.vehicle}</td>
                  <td>₹{b.fare.toLocaleString('en-IN')}</td>
                  <td><span className={`status-badge status-${b.status}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Routes */}
        <div className="owner-card">
          <h3 className="owner-card-title">Top Routes (This Quarter)</h3>
          <div className="route-list">
            {TOP_ROUTES.map((r, i) => (
              <div key={i} className="route-item">
                <span className="route-rank">#{i + 1}</span>
                <div className="route-info">
                  <div className="route-name">{r.from} → {r.to}</div>
                  <div className="route-meta">{r.distance} km · Avg ₹{r.avgFare.toLocaleString('en-IN')}</div>
                </div>
                <div className="route-count">{r.bookings}<br /><small>trips</small></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(expiryAlerts.length > 0 || docAlerts.length > 0) && (
        <div className="owner-card alerts-card">
          <h3 className="owner-card-title">⚠️ Action Required</h3>
          <div className="alerts-grid">
            {expiryAlerts.map(v => (
              <div key={v.id} className="alert-item alert-warn">
                <strong>{v.regNo}</strong> — {v.type}<br />
                Insurance expires: {new Date(v.insuranceExpiry).toLocaleDateString('en-IN')}
              </div>
            ))}
            {docAlerts.map(d => (
              <div key={d.id} className="alert-item alert-error">
                <strong>{d.name}</strong> — Documents incomplete<br />
                {Object.entries(d.documents).filter(([, v]) => !v).map(([k]) => k).join(', ')}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
