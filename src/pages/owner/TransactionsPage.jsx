import { useState } from 'react';
import { DAILY_TRANSACTIONS, TOP_ROUTES } from '../../data/ownerData';

const MONTHS = [
  { label: 'January 2026', prefix: '2026-01' },
  { label: 'February 2026', prefix: '2026-02' },
  { label: 'March 2026', prefix: '2026-03' },
];

function sum(arr, key) { return arr.reduce((s, d) => s + d[key], 0); }

function BarChart({ data, valuePrefix = '₹', maxValue }) {
  const max = maxValue || Math.max(...data.map(d => d.value), 1);
  return (
    <div className="bar-chart bar-chart-tall">
      {data.map((d, i) => (
        <div key={i} className="bar-col">
          <div className="bar-tooltip">
            {valuePrefix === '₹' ? `₹${d.value.toLocaleString('en-IN')}` : d.value}
          </div>
          <div className="bar-wrap">
            <div className="bar-fill" style={{ height: `${Math.max(2, Math.round((d.value / max) * 100))}%` }} />
          </div>
          <div className="bar-label">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function TransactionsPage() {
  const [period, setPeriod] = useState('daily'); // daily | weekly | monthly
  const [selectedMonth, setSelectedMonth] = useState('2026-03');

  // Daily view
  const dailyData = DAILY_TRANSACTIONS.filter(d => d.date.startsWith(selectedMonth));
  const dailyChart = dailyData.map(d => ({
    label: new Date(d.date).getDate().toString(),
    value: d.revenue,
  }));

  // Weekly view — bucket into ISO weeks for all data
  const weekMap = {};
  DAILY_TRANSACTIONS.forEach(d => {
    const dt = new Date(d.date);
    const startOfYear = new Date(dt.getFullYear(), 0, 1);
    const weekNo = Math.ceil(((dt - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
    const key = `W${weekNo}`;
    if (!weekMap[key]) weekMap[key] = { label: key, revenue: 0, bookings: 0 };
    weekMap[key].revenue += d.revenue;
    weekMap[key].bookings += d.bookings;
  });
  const weeklyChart = Object.values(weekMap).slice(-8).map(w => ({ label: w.label, value: w.revenue }));

  // Monthly view
  const monthlyData = MONTHS.map(m => {
    const days = DAILY_TRANSACTIONS.filter(d => d.date.startsWith(m.prefix));
    return {
      label: m.label.split(' ')[0].slice(0, 3),
      value: sum(days, 'revenue'),
      bookings: sum(days, 'bookings'),
    };
  });

  // Type breakdown for selected month
  const typeBreakdown = { 'Auto Rickshaw': 0, 'Tempo': 0, 'Mini Truck': 0, 'Full Truck': 0 };
  dailyData.forEach(d => {
    Object.entries(d.byType).forEach(([k, v]) => { typeBreakdown[k] = (typeBreakdown[k] || 0) + v; });
  });
  const totalByTypeBookings = Object.values(typeBreakdown).reduce((s, v) => s + v, 0);

  // KPIs
  const totalRevenue = sum(dailyData, 'revenue');
  const totalBookings = sum(dailyData, 'bookings');
  const avgDaily = dailyData.length ? Math.round(totalRevenue / dailyData.length) : 0;
  const bestDay = dailyData.reduce((best, d) => d.revenue > (best?.revenue || 0) ? d : best, null);

  // Compare to prev month
  const prevPrefix = selectedMonth === '2026-03' ? '2026-02' : selectedMonth === '2026-02' ? '2026-01' : null;
  const prevMonthData = prevPrefix ? DAILY_TRANSACTIONS.filter(d => d.date.startsWith(prevPrefix)) : [];
  const prevRevenue = sum(prevMonthData, 'revenue');
  const growth = prevRevenue > 0 ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100) : null;

  const chartData = period === 'daily' ? dailyChart : period === 'weekly' ? weeklyChart : monthlyData;
  const chartTitle = period === 'daily'
    ? `Daily Revenue — ${MONTHS.find(m => m.prefix === selectedMonth)?.label}`
    : period === 'weekly' ? 'Weekly Revenue — Last 8 Weeks'
    : 'Monthly Revenue — 2026';

  return (
    <div className="owner-page">
      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ borderTopColor: '#F97316' }}>
          <div className="kpi-icon" style={{ background: '#F9731622' }}>💰</div>
          <div className="kpi-body">
            <div className="kpi-value">₹{totalRevenue.toLocaleString('en-IN')}</div>
            <div className="kpi-label">Total Revenue</div>
            {growth !== null && (
              <span className={`kpi-trend ${growth >= 0 ? 'up' : 'down'}`}>
                {growth >= 0 ? '▲' : '▼'} {Math.abs(growth)}% vs prev month
              </span>
            )}
          </div>
        </div>
        <div className="kpi-card" style={{ borderTopColor: '#10B981' }}>
          <div className="kpi-icon" style={{ background: '#10B98122' }}>📦</div>
          <div className="kpi-body">
            <div className="kpi-value">{totalBookings}</div>
            <div className="kpi-label">Total Bookings</div>
            <div className="kpi-sub">{dailyData.length} active days</div>
          </div>
        </div>
        <div className="kpi-card" style={{ borderTopColor: '#3B82F6' }}>
          <div className="kpi-icon" style={{ background: '#3B82F622' }}>📊</div>
          <div className="kpi-body">
            <div className="kpi-value">₹{avgDaily.toLocaleString('en-IN')}</div>
            <div className="kpi-label">Avg Revenue / Day</div>
            <div className="kpi-sub">{(totalBookings / (dailyData.length || 1)).toFixed(1)} bookings/day</div>
          </div>
        </div>
        <div className="kpi-card" style={{ borderTopColor: '#8B5CF6' }}>
          <div className="kpi-icon" style={{ background: '#8B5CF622' }}>🏆</div>
          <div className="kpi-body">
            <div className="kpi-value">₹{bestDay?.revenue.toLocaleString('en-IN') || '—'}</div>
            <div className="kpi-label">Best Day</div>
            <div className="kpi-sub">{bestDay?.date ? new Date(bestDay.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}</div>
          </div>
        </div>
      </div>

      {/* Period & Month Controls */}
      <div className="owner-card" style={{ padding: '12px 16px' }}>
        <div className="table-toolbar">
          <div className="owner-tabs" style={{ margin: 0 }}>
            {['daily', 'weekly', 'monthly'].map(p => (
              <button key={p} className={`owner-tab${period === p ? ' active' : ''}`} onClick={() => setPeriod(p)} style={{ textTransform: 'capitalize' }}>
                {p}
              </button>
            ))}
          </div>
          {period === 'daily' && (
            <select className="owner-select" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
              {MONTHS.map(m => <option key={m.prefix} value={m.prefix}>{m.label}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="owner-card">
        <h3 className="chart-title">{chartTitle}</h3>
        <BarChart data={chartData} />
        <div className="chart-footer">
          Total: ₹{chartData.reduce((s, d) => s + d.value, 0).toLocaleString('en-IN')}
          &emsp;|&emsp;
          Bookings: {period === 'daily' ? totalBookings : period === 'weekly'
            ? Object.values(weekMap).slice(-8).reduce((s, w) => s + w.bookings, 0)
            : MONTHS.reduce((s, m) => s + sum(DAILY_TRANSACTIONS.filter(d => d.date.startsWith(m.prefix)), 'bookings'), 0)}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="owner-bottom-row">
        {/* Vehicle Type Breakdown */}
        <div className="owner-card">
          <h3 className="owner-card-title">Bookings by Vehicle Type{period === 'daily' ? ` (${MONTHS.find(m => m.prefix === selectedMonth)?.label})` : ''}</h3>
          <div className="type-breakdown">
            {Object.entries(typeBreakdown).map(([type, count]) => {
              const pct = totalByTypeBookings > 0 ? Math.round((count / totalByTypeBookings) * 100) : 0;
              const colors = { 'Auto Rickshaw': '#F97316', 'Tempo': '#10B981', 'Mini Truck': '#3B82F6', 'Full Truck': '#8B5CF6' };
              return (
                <div key={type} className="type-row">
                  <div className="type-label">{type}</div>
                  <div className="type-bar-wrap">
                    <div className="type-bar-fill" style={{ width: `${pct}%`, background: colors[type] }} />
                  </div>
                  <div className="type-count">{count} ({pct}%)</div>
                </div>
              );
            })}
          </div>
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

      {/* Daily Transaction Table */}
      {period === 'daily' && (
        <div className="owner-card">
          <h3 className="owner-card-title">Daily Breakdown — {MONTHS.find(m => m.prefix === selectedMonth)?.label}</h3>
          <div className="table-responsive">
            <table className="owner-table">
              <thead>
                <tr>
                  <th>Date</th><th>Bookings</th><th>Revenue</th>
                  <th>Auto</th><th>Tempo</th><th>Mini Truck</th><th>Full Truck</th>
                </tr>
              </thead>
              <tbody>
                {dailyData.map(d => (
                  <tr key={d.date}>
                    <td>{new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</td>
                    <td>{d.bookings}</td>
                    <td>₹{d.revenue.toLocaleString('en-IN')}</td>
                    <td>{d.byType['Auto Rickshaw'] || 0}</td>
                    <td>{d.byType['Tempo'] || 0}</td>
                    <td>{d.byType['Mini Truck'] || 0}</td>
                    <td>{d.byType['Full Truck'] || 0}</td>
                  </tr>
                ))}
                <tr className="table-total-row">
                  <td><strong>Total</strong></td>
                  <td><strong>{totalBookings}</strong></td>
                  <td><strong>₹{totalRevenue.toLocaleString('en-IN')}</strong></td>
                  <td><strong>{sum(dailyData.map(d => ({ v: d.byType['Auto Rickshaw'] || 0 })), 'v')}</strong></td>
                  <td><strong>{sum(dailyData.map(d => ({ v: d.byType['Tempo'] || 0 })), 'v')}</strong></td>
                  <td><strong>{sum(dailyData.map(d => ({ v: d.byType['Mini Truck'] || 0 })), 'v')}</strong></td>
                  <td><strong>{sum(dailyData.map(d => ({ v: d.byType['Full Truck'] || 0 })), 'v')}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
