import { useBooking } from '../context/BookingContext';
import { VEHICLE_TYPES } from '../data/services';
import { MAJOR_CITIES } from '../data/locations';
import { ITEMS_POLICY } from '../data/ownerData';
import { useState, useRef } from 'react';

const haversineDistance = (city1, city2) => {
  const R = 6371;
  const dLat = ((city2.lat - city1.lat) * Math.PI) / 180;
  const dLng = ((city2.lng - city1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((city1.lat * Math.PI) / 180) *
      Math.cos((city2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const filterCities = (query) => {
  if (query.length < 2) return [];
  return MAJOR_CITIES.filter(
    (c) =>
      c.name.toLowerCase().startsWith(query.toLowerCase()) ||
      c.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);
};

const TRUST_ITEMS = [
  { icon: '🛡️', text: 'Insured up to ₹50,000' },
  { icon: '📍', text: 'Real-time GPS tracking' },
  { icon: '✓', text: 'Free cancel within 5 mins' },
  { icon: '💳', text: 'Secure payment gateway' },
  { icon: '☎️', text: '24/7 customer support' },
];

export default function BookingPage() {
  const { setPage, currentBooking, setCurrentBooking, showToast } = useBooking();

  const [fromText, setFromText] = useState(currentBooking.fromLocation || '');
  const [toText, setToText] = useState(currentBooking.toLocation || '');
  const [fromCity, setFromCity] = useState(null);
  const [toCity, setToCity] = useState(null);
  const [fromSugg, setFromSugg] = useState([]);
  const [toSugg, setToSugg] = useState([]);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const fromTimer = useRef(null);
  const toTimer = useRef(null);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [date, setDate] = useState(currentBooking.date || '');
  const [time, setTime] = useState(currentBooking.time || '');
  const [weight, setWeight] = useState(currentBooking.weight || '');
  const [notes, setNotes] = useState(currentBooking.notes || '');
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  const distance = fromCity && toCity ? haversineDistance(fromCity, toCity) : null;

  const getFare = () => {
    if (!selectedVehicle || !distance) return null;
    const v = VEHICLE_TYPES.find((v) => v.id === selectedVehicle);
    return {
      base: v.basePrice,
      distanceCharge: Math.round(distance * v.perKmPrice),
      total: v.basePrice + Math.round(distance * v.perKmPrice),
    };
  };

  const fare = getFare();
  const vehicleDetails = selectedVehicle ? VEHICLE_TYPES.find(v => v.id === selectedVehicle) : null;

  const handleFromChange = (e) => {
    const val = e.target.value;
    setFromText(val);
    setFromCity(null);
    const s = filterCities(val);
    setFromSugg(s);
    setShowFrom(s.length > 0);
  };

  const handleToChange = (e) => {
    const val = e.target.value;
    setToText(val);
    setToCity(null);
    const s = filterCities(val);
    setToSugg(s);
    setShowTo(s.length > 0);
  };

  const selectFrom = (city) => { setFromText(city.name); setFromCity(city); setShowFrom(false); };
  const selectTo   = (city) => { setToText(city.name);   setToCity(city);   setShowTo(false);   };

  const handleProceedToCheckout = () => {
    if (!fromText || !toText || !date || !time || !selectedVehicle) {
      showToast('Please fill in all booking details', 'error');
      return;
    }
    if (!disclaimerAccepted) {
      setShowDisclaimer(true);
      return;
    }
    const vehicle = VEHICLE_TYPES.find((v) => v.id === selectedVehicle);
    setCurrentBooking({
      fromLocation: fromText,
      toLocation: toText,
      vehicleType: selectedVehicle,
      vehicleName: vehicle.name,
      date,
      time,
      weight,
      notes,
      distance: distance || 50,
      baseFare: vehicle.basePrice,
      distanceCharge: Math.round((distance || 50) * vehicle.perKmPrice),
      fare: vehicle.basePrice + Math.round((distance || 50) * vehicle.perKmPrice),
    });
    showToast('Proceeding to checkout...', 'success');
    setTimeout(() => setPage('checkout'), 500);
  };

  const dropdownStyle = {
    position: 'absolute', top: '100%', left: 0, right: 0,
    background: 'white', border: '1px solid var(--border)',
    borderRadius: '8px', boxShadow: 'var(--shadow)',
    listStyle: 'none', margin: 0, padding: 0,
    zIndex: 200, maxHeight: '220px', overflowY: 'auto',
  };

  const suggItemBase = {
    padding: '10px 14px', cursor: 'pointer',
    borderBottom: '1px solid var(--border)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  };

  return (
    <div className="bk-shell">
      {/* ── Left column: form ── */}
      <div className="bk-left">
        <h1 style={{ marginBottom: '24px' }}>📦 Book Your Lorry</h1>

        {/* Trip details */}
        <div className="bk-card">
          <h3 className="bk-card-title">Trip Details</h3>

          <div className="form-row">
            <div className="form-group" style={{ position: 'relative' }}>
              <label>From Location</label>
              <input type="text" placeholder="Enter pickup city"
                value={fromText} onChange={handleFromChange}
                onFocus={() => fromSugg.length > 0 && setShowFrom(true)}
                onBlur={() => { fromTimer.current = setTimeout(() => setShowFrom(false), 150); }}
                autoComplete="off" />
              {showFrom && (
                <ul style={dropdownStyle}>
                  {fromSugg.map((city) => (
                    <li key={city.id} onMouseDown={() => selectFrom(city)} style={suggItemBase}
                      onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                      <span style={{ fontWeight: 500 }}>{city.name}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>{city.state}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label>To Location</label>
              <input type="text" placeholder="Enter dropoff city"
                value={toText} onChange={handleToChange}
                onFocus={() => toSugg.length > 0 && setShowTo(true)}
                onBlur={() => { toTimer.current = setTimeout(() => setShowTo(false), 150); }}
                autoComplete="off" />
              {showTo && (
                <ul style={dropdownStyle}>
                  {toSugg.map((city) => (
                    <li key={city.id} onMouseDown={() => selectTo(city)} style={suggItemBase}
                      onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                      <span style={{ fontWeight: 500 }}>{city.name}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>{city.state}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {distance && (
            <div className="bk-distance-badge">
              📏 Estimated distance: <strong>{distance} km</strong>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input type="number" placeholder="Approx weight" value={weight} onChange={e => setWeight(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Special Notes (Optional)</label>
            <textarea placeholder="Any special handling instructions?" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>

        {/* Vehicle selection */}
        <div className="bk-card">
          <h3 className="bk-card-title">Select Vehicle Type</h3>
          <div className="bk-vehicle-grid">
            {VEHICLE_TYPES.map((vehicle) => (
              <div key={vehicle.id}
                className={`bk-vehicle-tile${selectedVehicle === vehicle.id ? ' selected' : ''}`}
                onClick={() => setSelectedVehicle(vehicle.id)}>
                <div className="bk-vt-icon">{vehicle.emoji}</div>
                <div className="bk-vt-name">{vehicle.name}</div>
                <div className="bk-vt-cap">{vehicle.capacity}</div>
                <div className="bk-vt-price">₹{vehicle.basePrice} + ₹{vehicle.perKmPrice}/km</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline" onClick={() => setPage('home')} style={{ flex: 1 }}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleProceedToCheckout} style={{ flex: 2 }}>
            Proceed to Payment →
          </button>
        </div>
      </div>

      {/* ── Right column: sticky summary ── */}
      <div className="bk-right">
        {/* Fare card */}
        <div className="bk-summary-card">
          <div className="bk-summary-title">💰 Fare Summary</div>
          {fare ? (
            <>
              <div className="bk-summary-route">{fromText} → {toText}</div>
              <div className="bk-summary-meta">{distance} km • {vehicleDetails?.name}</div>
              <div className="bk-fare-rows">
                <div className="bk-fare-row"><span>Base Fare</span><span>₹{fare.base}</span></div>
                <div className="bk-fare-row"><span>Distance ({distance} km × ₹{vehicleDetails?.perKmPrice})</span><span>₹{fare.distanceCharge}</span></div>
                <div className="bk-fare-row"><span>GST (0%)</span><span>₹0</span></div>
                <div className="bk-fare-total"><span>Total</span><span>₹{fare.total}</span></div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={handleProceedToCheckout}>
                Book Now →
              </button>
            </>
          ) : (
            <div className="bk-summary-empty">
              <div style={{ fontSize: 32, marginBottom: 8 }}>🚛</div>
              <p>Select route &amp; vehicle<br />to see fare estimate</p>
            </div>
          )}
        </div>

        {/* Selected vehicle info */}
        {vehicleDetails && (
          <div className="bk-veh-info-card">
            <div className="bk-veh-info-header">
              <span style={{ fontSize: 28 }}>{vehicleDetails.emoji}</span>
              <div>
                <div className="bk-veh-info-name">{vehicleDetails.name}</div>
                <div className="bk-veh-info-desc">{vehicleDetails.description}</div>
              </div>
            </div>
            <div className="bk-veh-specs">
              <div className="bk-veh-spec"><span>⚖️</span> {vehicleDetails.capacity}</div>
              <div className="bk-veh-spec"><span>📦</span> {vehicleDetails.maxVolume}</div>
            </div>
          </div>
        )}

        {/* Trust signals */}
        <div className="bk-trust-card">
          <div className="bk-trust-title">Why book with us?</div>
          {TRUST_ITEMS.map((t, i) => (
            <div key={i} className="bk-trust-item">
              <span className="bk-trust-ico">{t.icon}</span>
              <span>{t.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Items Disclaimer Modal */}
      {showDisclaimer && (
        <div className="modal-overlay" onClick={() => setShowDisclaimer(false)}>
          <div className="modal-box" style={{ maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📦 Items Policy — Please Read Before Booking</h3>
              <button className="modal-close" onClick={() => setShowDisclaimer(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="disclaimer-section disclaimer-allowed">
                <h4>✅ Allowed Items</h4>
                <ul>
                  {ITEMS_POLICY.allowed.slice(0, 3).map((c, i) => (
                    <li key={i}><strong>{c.category}:</strong> {c.items.slice(0, 3).join(', ')}...</li>
                  ))}
                </ul>
              </div>
              <div className="disclaimer-section disclaimer-restricted">
                <h4>⚠️ Restricted (Prior approval needed)</h4>
                <ul>
                  {ITEMS_POLICY.restricted.map((c, i) => (
                    <li key={i}><strong>{c.category}:</strong> {c.condition}</li>
                  ))}
                </ul>
              </div>
              <div className="disclaimer-section disclaimer-prohibited">
                <h4>❌ Strictly Prohibited</h4>
                <ul>
                  {ITEMS_POLICY.prohibited.map((c, i) => (
                    <li key={i}><strong>{c.category}:</strong> {c.items.slice(0, 2).join(', ')}</li>
                  ))}
                </ul>
              </div>
              <p className="disclaimer-legal">
                By proceeding, you confirm that your shipment complies with LorryHub's transport policy
                and all applicable laws. False declaration may result in cancellation without refund and legal action.
              </p>
              <label className="disclaimer-checkbox">
                <input type="checkbox" checked={disclaimerAccepted}
                  onChange={e => setDisclaimerAccepted(e.target.checked)} />
                &nbsp; I have read and agree to the Items Policy. My shipment does not contain any prohibited items.
              </label>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDisclaimer(false)}>Go Back</button>
              <button className="btn btn-primary" disabled={!disclaimerAccepted}
                onClick={() => { setShowDisclaimer(false); handleProceedToCheckout(); }}>
                Accept & Proceed →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
