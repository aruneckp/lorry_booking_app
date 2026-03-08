// ============================================================
// OWNER DATA — Fleet, Drivers, Items Policy, Transactions
// ============================================================

// ── Vehicle Fleet ──────────────────────────────────────────
export const FLEET_VEHICLES = [
  {
    id: 'V001', regNo: 'DL01AB1234', type: 'Auto Rickshaw', typeId: 1,
    make: 'Bajaj', model: 'RE Compact', year: 2022, color: 'Yellow',
    capacity: 500, volume: 1.5, fuelType: 'CNG',
    assignedDriverId: 'D001', assignedDriverName: 'Ramesh Yadav',
    status: 'active', // active | maintenance | offline
    insuranceExpiry: '2026-12-31', fitnessExpiry: '2027-06-30',
    lastService: '2026-01-15', odometer: 45200, baseCity: 'Delhi',
    permitType: 'Local', notes: '',
  },
  {
    id: 'V002', regNo: 'DL02CD5678', type: 'Auto Rickshaw', typeId: 1,
    make: 'Bajaj', model: 'RE Max', year: 2021, color: 'Yellow',
    capacity: 500, volume: 1.5, fuelType: 'CNG',
    assignedDriverId: 'D002', assignedDriverName: 'Mohan Lal',
    status: 'active',
    insuranceExpiry: '2026-11-30', fitnessExpiry: '2026-11-30',
    lastService: '2025-12-10', odometer: 62100, baseCity: 'Delhi',
    permitType: 'Local', notes: 'Insurance renewal due soon',
  },
  {
    id: 'V003', regNo: 'MH03EF9012', type: 'Tempo', typeId: 4,
    make: 'Mahindra', model: 'Supro', year: 2023, color: 'White',
    capacity: 800, volume: 4, fuelType: 'Diesel',
    assignedDriverId: 'D003', assignedDriverName: 'Mohammad Ali',
    status: 'active',
    insuranceExpiry: '2027-03-15', fitnessExpiry: '2028-03-15',
    lastService: '2026-02-20', odometer: 28500, baseCity: 'Mumbai',
    permitType: 'State', notes: '',
  },
  {
    id: 'V004', regNo: 'MH04GH3456', type: 'Tempo', typeId: 4,
    make: 'Tata', model: 'Ace', year: 2022, color: 'White',
    capacity: 800, volume: 4, fuelType: 'Diesel',
    assignedDriverId: null, assignedDriverName: 'Unassigned',
    status: 'maintenance',
    insuranceExpiry: '2026-09-30', fitnessExpiry: '2027-09-30',
    lastService: '2025-11-05', odometer: 54800, baseCity: 'Mumbai',
    permitType: 'State', notes: 'Engine overhaul in progress',
  },
  {
    id: 'V005', regNo: 'KA05IJ7890', type: 'Mini Truck', typeId: 2,
    make: 'Ashok Leyland', model: 'Dost+', year: 2023, color: 'Blue',
    capacity: 1500, volume: 8, fuelType: 'Diesel',
    assignedDriverId: 'D004', assignedDriverName: 'Venkatesh S.',
    status: 'active',
    insuranceExpiry: '2027-05-31', fitnessExpiry: '2028-05-31',
    lastService: '2026-03-01', odometer: 19200, baseCity: 'Bangalore',
    permitType: 'National', notes: '',
  },
  {
    id: 'V006', regNo: 'KA06KL1234', type: 'Mini Truck', typeId: 2,
    make: 'Eicher', model: 'Pro 2049', year: 2021, color: 'Red',
    capacity: 1500, volume: 8, fuelType: 'Diesel',
    assignedDriverId: 'D005', assignedDriverName: 'Anand Kumar',
    status: 'active',
    insuranceExpiry: '2026-08-31', fitnessExpiry: '2027-08-31',
    lastService: '2026-01-28', odometer: 71300, baseCity: 'Bangalore',
    permitType: 'National', notes: '',
  },
  {
    id: 'V007', regNo: 'TN07MN5678', type: 'Mini Truck', typeId: 2,
    make: 'Tata', model: '407 Gold', year: 2022, color: 'White',
    capacity: 1500, volume: 8, fuelType: 'Diesel',
    assignedDriverId: 'D006', assignedDriverName: 'Biswajit Roy',
    status: 'active',
    insuranceExpiry: '2027-01-31', fitnessExpiry: '2027-12-31',
    lastService: '2026-02-10', odometer: 38900, baseCity: 'Chennai',
    permitType: 'National', notes: '',
  },
  {
    id: 'V008', regNo: 'DL08OP9012', type: 'Full Truck', typeId: 3,
    make: 'Tata', model: '1109 Turbo', year: 2020, color: 'Orange',
    capacity: 5000, volume: 25, fuelType: 'Diesel',
    assignedDriverId: 'D007', assignedDriverName: 'Deepak Singh',
    status: 'active',
    insuranceExpiry: '2026-07-31', fitnessExpiry: '2027-07-31',
    lastService: '2026-01-05', odometer: 134500, baseCity: 'Delhi',
    permitType: 'National', notes: '',
  },
  {
    id: 'V009', regNo: 'MH09QR3456', type: 'Full Truck', typeId: 3,
    make: 'Bharat Benz', model: '1217R', year: 2021, color: 'Silver',
    capacity: 5000, volume: 25, fuelType: 'Diesel',
    assignedDriverId: null, assignedDriverName: 'Unassigned',
    status: 'offline',
    insuranceExpiry: '2026-10-31', fitnessExpiry: '2027-10-31',
    lastService: '2025-10-20', odometer: 98200, baseCity: 'Mumbai',
    permitType: 'National', notes: 'Awaiting RTO permit renewal',
  },
  {
    id: 'V010', regNo: 'UP10ST7890', type: 'Full Truck', typeId: 3,
    make: 'Eicher', model: 'Pro 6031', year: 2023, color: 'Green',
    capacity: 5000, volume: 25, fuelType: 'Diesel',
    assignedDriverId: 'D008', assignedDriverName: 'Rajiv Tiwari',
    status: 'active',
    insuranceExpiry: '2027-06-30', fitnessExpiry: '2028-06-30',
    lastService: '2026-02-25', odometer: 22700, baseCity: 'Lucknow',
    permitType: 'National', notes: '',
  },
];

// ── Driver Master ───────────────────────────────────────────
export const DRIVERS = [
  {
    id: 'D001', name: 'Ramesh Yadav', phone: '9871001001',
    email: 'ramesh.yadav@lorryhub.com',
    licenseNo: 'DL-0119-2345678', licenseType: 'LMV-NT',
    licenseExpiry: '2028-05-15',
    experience: 6, rating: 4.8, totalTrips: 412,
    assignedVehicleId: 'V001', assignedVehicleReg: 'DL01AB1234',
    vehicleType: 'Auto Rickshaw',
    availability: 'available', // available | on-trip | on-leave | inactive
    baseCity: 'Delhi', joinDate: '2022-01-10',
    documents: { license: true, pcc: true, medicalFitness: true, aadhar: true },
    notes: 'Star performer — 98% on-time',
  },
  {
    id: 'D002', name: 'Mohan Lal', phone: '9871002002',
    email: 'mohan.lal@lorryhub.com',
    licenseNo: 'DL-0220-3456789', licenseType: 'LMV-NT',
    licenseExpiry: '2027-08-20',
    experience: 5, rating: 4.6, totalTrips: 308,
    assignedVehicleId: 'V002', assignedVehicleReg: 'DL02CD5678',
    vehicleType: 'Auto Rickshaw',
    availability: 'on-trip',
    baseCity: 'Delhi', joinDate: '2022-06-15',
    documents: { license: true, pcc: true, medicalFitness: true, aadhar: true },
    notes: '',
  },
  {
    id: 'D003', name: 'Mohammad Ali', phone: '9821003003',
    email: 'mohammad.ali@lorryhub.com',
    licenseNo: 'MH-0118-4567890', licenseType: 'LMV-NT',
    licenseExpiry: '2029-02-10',
    experience: 8, rating: 4.9, totalTrips: 687,
    assignedVehicleId: 'V003', assignedVehicleReg: 'MH03EF9012',
    vehicleType: 'Tempo',
    availability: 'available',
    baseCity: 'Mumbai', joinDate: '2021-03-01',
    documents: { license: true, pcc: true, medicalFitness: true, aadhar: true },
    notes: 'Most experienced driver in fleet',
  },
  {
    id: 'D004', name: 'Venkatesh S.', phone: '9845004004',
    email: 'venkatesh.s@lorryhub.com',
    licenseNo: 'KA-0221-5678901', licenseType: 'TRANS',
    licenseExpiry: '2026-11-25',
    experience: 4, rating: 4.7, totalTrips: 241,
    assignedVehicleId: 'V005', assignedVehicleReg: 'KA05IJ7890',
    vehicleType: 'Mini Truck',
    availability: 'on-trip',
    baseCity: 'Bangalore', joinDate: '2023-01-20',
    documents: { license: true, pcc: true, medicalFitness: true, aadhar: true },
    notes: 'License renewal due Nov 2026',
  },
  {
    id: 'D005', name: 'Anand Kumar', phone: '9845005005',
    email: 'anand.kumar@lorryhub.com',
    licenseNo: 'KA-0119-6789012', licenseType: 'TRANS',
    licenseExpiry: '2028-09-30',
    experience: 7, rating: 4.6, totalTrips: 519,
    assignedVehicleId: 'V006', assignedVehicleReg: 'KA06KL1234',
    vehicleType: 'Mini Truck',
    availability: 'available',
    baseCity: 'Bangalore', joinDate: '2021-07-12',
    documents: { license: true, pcc: true, medicalFitness: true, aadhar: true },
    notes: '',
  },
  {
    id: 'D006', name: 'Biswajit Roy', phone: '9831006006',
    email: 'biswajit.roy@lorryhub.com',
    licenseNo: 'WB-0220-7890123', licenseType: 'TRANS',
    licenseExpiry: '2027-04-18',
    experience: 5, rating: 4.5, totalTrips: 376,
    assignedVehicleId: 'V007', assignedVehicleReg: 'TN07MN5678',
    vehicleType: 'Mini Truck',
    availability: 'on-trip',
    baseCity: 'Chennai', joinDate: '2022-09-05',
    documents: { license: true, pcc: true, medicalFitness: false, aadhar: true },
    notes: 'Medical fitness certificate due for renewal',
  },
  {
    id: 'D007', name: 'Deepak Singh', phone: '9811007007',
    email: 'deepak.singh@lorryhub.com',
    licenseNo: 'DL-0117-8901234', licenseType: 'HMV',
    licenseExpiry: '2029-12-01',
    experience: 10, rating: 4.8, totalTrips: 834,
    assignedVehicleId: 'V008', assignedVehicleReg: 'DL08OP9012',
    vehicleType: 'Full Truck',
    availability: 'available',
    baseCity: 'Delhi', joinDate: '2020-04-15',
    documents: { license: true, pcc: true, medicalFitness: true, aadhar: true },
    notes: 'HMV certified — handles bulk cargo',
  },
  {
    id: 'D008', name: 'Rajiv Tiwari', phone: '9891008008',
    email: 'rajiv.tiwari@lorryhub.com',
    licenseNo: 'UP-0122-9012345', licenseType: 'HMV',
    licenseExpiry: '2027-07-14',
    experience: 3, rating: 4.3, totalTrips: 112,
    assignedVehicleId: 'V010', assignedVehicleReg: 'UP10ST7890',
    vehicleType: 'Full Truck',
    availability: 'on-leave',
    baseCity: 'Lucknow', joinDate: '2024-01-08',
    documents: { license: true, pcc: false, medicalFitness: true, aadhar: true },
    notes: 'PCC pending. Currently on leave until Mar 15',
  },
  {
    id: 'D009', name: 'Suresh Kumar', phone: '9111222333',
    email: 'suresh.kumar@lorryhub.com',
    licenseNo: 'DL-0119-0123456', licenseType: 'LMV-NT',
    licenseExpiry: '2028-03-22',
    experience: 5, rating: 4.7, totalTrips: 298,
    assignedVehicleId: 'V004', assignedVehicleReg: 'MH04GH3456',
    vehicleType: 'Tempo',
    availability: 'available',
    baseCity: 'Mumbai', joinDate: '2022-11-01',
    documents: { license: true, pcc: true, medicalFitness: true, aadhar: true },
    notes: 'Vehicle in maintenance',
  },
];

// ── Items Policy ────────────────────────────────────────────
export const ITEMS_POLICY = {
  allowed: [
    { category: 'Household & Furniture', items: ['Sofas, chairs, tables, beds', 'Packed household appliances', 'Kitchen utensils and cookware', 'Clothing, textiles, and linens', 'Packed glassware and crockery (properly cushioned)'] },
    { category: 'Electronics (Packed)', items: ['TVs, monitors (original packed)', 'Computers, laptops in carry cases', 'Mobile phones and accessories', 'Industrial electronics (packed)', 'Refrigerators, washing machines (drained, packed)'] },
    { category: 'Office Equipment', items: ['Office furniture and fixtures', 'Stationery and files', 'Printers and scanners (packed)', 'Server equipment (packed, static-safe)'] },
    { category: 'Food & Agriculture', items: ['Packaged dry food items', 'Grains, pulses, rice (bagged)', 'Fresh fruits and vegetables', 'Packaged beverages (non-alcoholic)', 'Dairy products in insulated packing'] },
    { category: 'Industrial & Construction', items: ['Building materials (bricks, tiles, cement bags)', 'Steel rods and structural materials', 'Machinery parts (properly packed)', 'Pipes, fittings, hardware items', 'Agricultural equipment and tools'] },
    { category: 'E-commerce & Retail', items: ['General merchandise parcels', 'Packaged retail goods', 'Books, stationery', 'Sports equipment', 'Toys and games (packed)'] },
  ],
  restricted: [
    { category: 'Alcohol & Tobacco', condition: 'Valid state excise license required. Declared manifest mandatory.', items: ['Beer, wine, spirits (sealed original packaging)', 'Cigarettes and tobacco products', 'Hookah products'] },
    { category: 'Pharmaceuticals', condition: 'Cold chain or controlled storage may apply. Drug license copy required.', items: ['Prescription medicines', 'Medical devices and equipment', 'Vaccines and biologics (cold chain vehicle)', 'Hospital supplies'] },
    { category: 'High Value Goods', condition: 'Additional insurance required. Declared value must be accurate.', items: ['Jewellery, precious stones (insured)', 'Fine art and antiques', 'Currency, cheques, demand drafts', 'High-value electronics (declared)'] },
    { category: 'Live Cargo', condition: 'Specialized vehicle required. Animal welfare compliance needed.', items: ['Pets (cats, dogs — with health certificate)', 'Livestock (farm animals)', 'Aquarium fish (oxygen packaging)'] },
    { category: 'Oversized / Overweight', condition: 'Special permit from RTO required. Route survey needed.', items: ['Machinery exceeding 5000 kg', 'Prefabricated structures', 'Wind turbine components', 'Construction cranes or heavy equipment'] },
  ],
  prohibited: [
    { category: 'Explosives & Weapons', items: ['Ammunition, firearms, explosives', 'Fireworks and pyrotechnics', 'Detonators and fuses', 'Military/defense equipment without permit'] },
    { category: 'Hazardous Chemicals', items: ['Acids and corrosive substances', 'Petrol, LPG cylinders (consumer)', 'Industrial solvents (Class I & II)', 'Bleach, oxidizers, peroxides', 'Pesticides (concentrated, class IA/IB)'] },
    { category: 'Illegal Substances', items: ['Narcotics, controlled substances', 'Counterfeit goods of any kind', 'Stolen or misappropriated goods', 'Smuggled items or goods without invoices'] },
    { category: 'Radioactive & Biohazard', items: ['Nuclear or radioactive material', 'Biohazardous medical waste', 'Pathological samples (without IATA packaging)', 'Human remains (without proper permits)'] },
    { category: 'Wildlife & Environment', items: ['Endangered species (CITES protected)', 'Wildlife parts (ivory, fur, feathers)', 'Protected plants and timber (without permit)', 'Soil and plant matter across state lines (quarantine restrictions)'] },
  ],
};

// ── Booking Assignments (for owner view) ───────────────────
export const OWNER_ALL_BOOKINGS = [
  { id: 'LH2601', from: 'Delhi', to: 'Jaipur', date: '2026-03-10', vehicle: 'Mini Truck', vehicleId: 'V005', driverId: 'D004', driver: 'Venkatesh S.', customer: 'Rahul Sharma', fare: 770, status: 'in-transit', distance: 268 },
  { id: 'LH2602', from: 'Mumbai', to: 'Pune', date: '2026-02-28', vehicle: 'Auto Rickshaw', vehicleId: 'V001', driverId: 'D001', driver: 'Ramesh Yadav', customer: 'Rahul Sharma', fare: 242, status: 'completed', distance: 149 },
  { id: 'LH2603', from: 'Bangalore', to: 'Chennai', date: '2026-02-15', vehicle: 'Full Truck', vehicleId: 'V008', driverId: 'D007', driver: 'Deepak Singh', customer: 'Rahul Sharma', fare: 6960, status: 'completed', distance: 348 },
  { id: 'LH2604', from: 'Noida', to: 'Delhi', date: '2026-03-12', vehicle: 'Tempo', vehicleId: null, driverId: null, driver: 'Unassigned', customer: 'Rahul Sharma', fare: 430, status: 'pending', distance: 20 },
  { id: 'LH2605', from: 'Hyderabad', to: 'Chennai', date: '2026-03-09', vehicle: 'Mini Truck', vehicleId: 'V006', driverId: 'D005', driver: 'Anand Kumar', customer: 'Priya Patel', fare: 2796, status: 'confirmed', distance: 626 },
  { id: 'LH2606', from: 'Kolkata', to: 'Bhubaneswar', date: '2026-02-20', vehicle: 'Full Truck', vehicleId: 'V010', driverId: 'D008', driver: 'Rajiv Tiwari', customer: 'Priya Patel', fare: 4940, status: 'completed', distance: 440 },
];

// ── Transaction History (Daily — last 90 days) ─────────────
// Generate realistic daily revenue data for Jan–Mar 2026
function genTx(dateStr, count, vehicles) {
  const bookingIds = [];
  const fares = [];
  let total = 0;
  const types = { 'Auto Rickshaw': 0, 'Tempo': 0, 'Mini Truck': 0, 'Full Truck': 0 };
  for (let i = 0; i < count; i++) {
    const t = vehicles[i % vehicles.length];
    const f = Math.round(t.base + Math.random() * t.range);
    total += f;
    fares.push(f);
    types[t.type] = (types[t.type] || 0) + 1;
    bookingIds.push(`LH${dateStr.replace(/-/g,'').slice(2)}${String(i+1).padStart(2,'0')}`);
  }
  return { date: dateStr, bookings: count, revenue: total, byType: types };
}

const vehicleMix = [
  { type: 'Auto Rickshaw', base: 150, range: 300 },
  { type: 'Tempo', base: 300, range: 500 },
  { type: 'Mini Truck', base: 600, range: 1800 },
  { type: 'Full Truck', base: 1500, range: 6000 },
  { type: 'Mini Truck', base: 600, range: 1800 },
  { type: 'Tempo', base: 300, range: 500 },
];

export const DAILY_TRANSACTIONS = [
  // January 2026
  genTx('2026-01-01', 5, vehicleMix), genTx('2026-01-02', 7, vehicleMix),
  genTx('2026-01-03', 4, vehicleMix), genTx('2026-01-04', 6, vehicleMix),
  genTx('2026-01-05', 8, vehicleMix), genTx('2026-01-06', 9, vehicleMix),
  genTx('2026-01-07', 6, vehicleMix), genTx('2026-01-08', 7, vehicleMix),
  genTx('2026-01-09', 5, vehicleMix), genTx('2026-01-10', 8, vehicleMix),
  genTx('2026-01-11', 6, vehicleMix), genTx('2026-01-12', 4, vehicleMix),
  genTx('2026-01-13', 7, vehicleMix), genTx('2026-01-14', 9, vehicleMix),
  genTx('2026-01-15', 8, vehicleMix), genTx('2026-01-16', 6, vehicleMix),
  genTx('2026-01-17', 5, vehicleMix), genTx('2026-01-18', 7, vehicleMix),
  genTx('2026-01-19', 4, vehicleMix), genTx('2026-01-20', 8, vehicleMix),
  genTx('2026-01-21', 9, vehicleMix), genTx('2026-01-22', 7, vehicleMix),
  genTx('2026-01-23', 6, vehicleMix), genTx('2026-01-24', 5, vehicleMix),
  genTx('2026-01-25', 8, vehicleMix), genTx('2026-01-26', 3, vehicleMix),
  genTx('2026-01-27', 7, vehicleMix), genTx('2026-01-28', 8, vehicleMix),
  genTx('2026-01-29', 6, vehicleMix), genTx('2026-01-30', 9, vehicleMix),
  genTx('2026-01-31', 7, vehicleMix),
  // February 2026
  genTx('2026-02-01', 8, vehicleMix), genTx('2026-02-02', 6, vehicleMix),
  genTx('2026-02-03', 9, vehicleMix), genTx('2026-02-04', 7, vehicleMix),
  genTx('2026-02-05', 8, vehicleMix), genTx('2026-02-06', 5, vehicleMix),
  genTx('2026-02-07', 6, vehicleMix), genTx('2026-02-08', 8, vehicleMix),
  genTx('2026-02-09', 7, vehicleMix), genTx('2026-02-10', 9, vehicleMix),
  genTx('2026-02-11', 6, vehicleMix), genTx('2026-02-12', 5, vehicleMix),
  genTx('2026-02-13', 8, vehicleMix), genTx('2026-02-14', 10, vehicleMix),
  genTx('2026-02-15', 9, vehicleMix), genTx('2026-02-16', 7, vehicleMix),
  genTx('2026-02-17', 8, vehicleMix), genTx('2026-02-18', 6, vehicleMix),
  genTx('2026-02-19', 7, vehicleMix), genTx('2026-02-20', 9, vehicleMix),
  genTx('2026-02-21', 8, vehicleMix), genTx('2026-02-22', 6, vehicleMix),
  genTx('2026-02-23', 7, vehicleMix), genTx('2026-02-24', 9, vehicleMix),
  genTx('2026-02-25', 10, vehicleMix), genTx('2026-02-26', 8, vehicleMix),
  genTx('2026-02-27', 7, vehicleMix), genTx('2026-02-28', 9, vehicleMix),
  // March 2026
  genTx('2026-03-01', 8, vehicleMix), genTx('2026-03-02', 6, vehicleMix),
  genTx('2026-03-03', 9, vehicleMix), genTx('2026-03-04', 7, vehicleMix),
  genTx('2026-03-05', 8, vehicleMix), genTx('2026-03-06', 6, vehicleMix),
  genTx('2026-03-07', 5, vehicleMix), genTx('2026-03-08', 4, vehicleMix),
];

// ── Computed monthly rollups ────────────────────────────────
export function getMonthlyStats(year, month) {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  const days = DAILY_TRANSACTIONS.filter(d => d.date.startsWith(prefix));
  return {
    month: prefix,
    totalBookings: days.reduce((s, d) => s + d.bookings, 0),
    totalRevenue: days.reduce((s, d) => s + d.revenue, 0),
    days: days.length,
    avgPerDay: days.length
      ? Math.round(days.reduce((s, d) => s + d.revenue, 0) / days.length)
      : 0,
  };
}

export function getWeeklyStats(weekDates) {
  const days = DAILY_TRANSACTIONS.filter(d => weekDates.includes(d.date));
  return {
    totalBookings: days.reduce((s, d) => s + d.bookings, 0),
    totalRevenue: days.reduce((s, d) => s + d.revenue, 0),
  };
}

// Popular routes summary
export const TOP_ROUTES = [
  { from: 'Delhi', to: 'Jaipur', bookings: 38, avgFare: 820, distance: 268 },
  { from: 'Mumbai', to: 'Pune', bookings: 31, avgFare: 280, distance: 149 },
  { from: 'Bangalore', to: 'Chennai', bookings: 27, avgFare: 5400, distance: 348 },
  { from: 'Hyderabad', to: 'Chennai', bookings: 22, avgFare: 3100, distance: 626 },
  { from: 'Delhi', to: 'Lucknow', bookings: 19, avgFare: 1640, distance: 547 },
  { from: 'Kolkata', to: 'Bhubaneswar', bookings: 15, avgFare: 4200, distance: 440 },
];
