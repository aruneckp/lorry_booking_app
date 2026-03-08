import { useState } from 'react';
import { ITEMS_POLICY } from '../../data/ownerData';

function PolicySection({ title, icon, color, categories, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [openCats, setOpenCats] = useState({});

  const toggleCat = (cat) => setOpenCats(prev => ({ ...prev, [cat]: !prev[cat] }));

  return (
    <div className="policy-section" style={{ borderTopColor: color }}>
      <button className="policy-section-header" onClick={() => setOpen(o => !o)}>
        <span className="policy-icon">{icon}</span>
        <span className="policy-title">{title}</span>
        <span className="policy-count">{categories.length} categories</span>
        <span className="policy-toggle">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="policy-body">
          {categories.map((cat, i) => (
            <div key={i} className="policy-cat">
              <button className="policy-cat-header" onClick={() => toggleCat(cat.category)}>
                <span className="policy-cat-name">{cat.category}</span>
                {cat.condition && <span className="policy-condition">⚠ {cat.condition}</span>}
                <span className="policy-cat-toggle">{openCats[cat.category] ? '−' : '+'}</span>
              </button>
              {openCats[cat.category] && (
                <ul className="policy-items">
                  {cat.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ItemsPolicy() {
  const [search, setSearch] = useState('');

  const filterCategories = (cats) => {
    if (!search) return cats;
    return cats.map(cat => ({
      ...cat,
      items: cat.items.filter(item => item.toLowerCase().includes(search.toLowerCase())),
    })).filter(cat =>
      cat.category.toLowerCase().includes(search.toLowerCase()) || cat.items.length > 0
    );
  };

  const allowedFiltered = filterCategories(ITEMS_POLICY.allowed);
  const restrictedFiltered = filterCategories(ITEMS_POLICY.restricted);
  const prohibitedFiltered = filterCategories(ITEMS_POLICY.prohibited);

  return (
    <div className="owner-page">
      {/* Header Info */}
      <div className="kpi-grid kpi-grid-sm">
        <div className="kpi-card" style={{ borderTopColor: '#10B981' }}>
          <div className="kpi-icon" style={{ background: '#10B98122' }}>✅</div>
          <div className="kpi-body">
            <div className="kpi-value">{ITEMS_POLICY.allowed.reduce((s, c) => s + c.items.length, 0)}+</div>
            <div className="kpi-label">Allowed Items</div>
            <div className="kpi-sub">{ITEMS_POLICY.allowed.length} categories</div>
          </div>
        </div>
        <div className="kpi-card" style={{ borderTopColor: '#F59E0B' }}>
          <div className="kpi-icon" style={{ background: '#F59E0B22' }}>⚠️</div>
          <div className="kpi-body">
            <div className="kpi-value">{ITEMS_POLICY.restricted.reduce((s, c) => s + c.items.length, 0)}</div>
            <div className="kpi-label">Restricted Items</div>
            <div className="kpi-sub">Prior approval needed</div>
          </div>
        </div>
        <div className="kpi-card" style={{ borderTopColor: '#EF4444' }}>
          <div className="kpi-icon" style={{ background: '#EF444422' }}>❌</div>
          <div className="kpi-body">
            <div className="kpi-value">{ITEMS_POLICY.prohibited.reduce((s, c) => s + c.items.length, 0)}</div>
            <div className="kpi-label">Prohibited Items</div>
            <div className="kpi-sub">Strictly not allowed</div>
          </div>
        </div>
        <div className="kpi-card" style={{ borderTopColor: '#3B82F6' }}>
          <div className="kpi-icon" style={{ background: '#3B82F622' }}>📋</div>
          <div className="kpi-body">
            <div className="kpi-value">Ver 2.1</div>
            <div className="kpi-label">Policy Version</div>
            <div className="kpi-sub">Updated Mar 2026</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="owner-card" style={{ padding: '12px 16px' }}>
        <input
          className="owner-search"
          style={{ width: '100%' }}
          placeholder="🔍 Search items across all categories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Policy Sections */}
      <div className="owner-card" style={{ padding: 0, overflow: 'hidden' }}>
        <PolicySection
          title="Allowed Items — Accepted for transport"
          icon="✅"
          color="#10B981"
          categories={allowedFiltered}
          defaultOpen={true}
        />
        <PolicySection
          title="Restricted Items — Special approval required"
          icon="⚠️"
          color="#F59E0B"
          categories={restrictedFiltered}
          defaultOpen={false}
        />
        <PolicySection
          title="Prohibited Items — Strictly not accepted"
          icon="❌"
          color="#EF4444"
          categories={prohibitedFiltered}
          defaultOpen={false}
        />
      </div>

      {/* Legal Note */}
      <div className="owner-card policy-legal">
        <h4>📜 Legal Disclaimer</h4>
        <p>
          LorryHub Transport Pvt. Ltd. reserves the right to refuse transportation of any item that
          violates applicable laws, poses safety risks, or is not properly declared. Customers are
          responsible for accurate declaration of goods. False declaration may result in legal action
          under the Motor Vehicles Act 1988 and other applicable laws.
        </p>
        <p>
          All restricted items require written approval and supporting documentation prior to booking.
          Contact <strong>compliance@lorryhub.com</strong> for special cargo requirements.
        </p>
        <p className="policy-updated">Last updated: March 2026 · Version 2.1</p>
      </div>
    </div>
  );
}
