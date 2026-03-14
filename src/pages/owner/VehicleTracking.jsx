import { useState, useEffect, useRef } from 'react';
import { MAJOR_CITIES } from '../../data/locations';

// ─── Map bounds (includes full Kashmir / Ladakh) ─────────────
const MAP_W = 560, MAP_H = 700;
const MIN_LAT = 6.5,  MAX_LAT = 38.5;
const MIN_LNG = 66.5, MAX_LNG = 98.0;
const LNG_SPAN = MAX_LNG - MIN_LNG;
const LAT_SPAN = MAX_LAT - MIN_LAT;

function toSVG(lat, lng) {
  return {
    x: ((lng - MIN_LNG) / LNG_SPAN) * MAP_W,
    y: ((MAX_LAT - lat) / LAT_SPAN) * MAP_H,
  };
}

// Helper: convert [lng,lat][] to SVG polyline points string
function toSVGPts(lnglats) {
  return lnglats.map(([lng, lat]) => {
    const p = toSVG(lat, lng); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(' ');
}

// ─── Full India outline (Survey of India) ────────────────────
// Used as base layer to prevent ocean gaps between state polygons
const INDIA_POINTS = toSVGPts([
  [68.0,23.5],[68.5,24.5],[69.5,25.5],[70.5,27.0],[70.5,29.0],[71.5,31.0],[73.0,32.0],
  [73.5,32.5],[73.0,33.5],[72.5,34.5],[73.0,35.5],[73.5,36.5],[74.0,37.0],
  [75.0,36.8],[76.0,36.5],[77.0,35.6],[77.8,35.2],
  [78.5,35.0],[79.0,34.5],[79.5,34.0],[80.0,33.5],
  [80.3,32.5],[80.5,31.5],[80.8,30.5],[82.0,30.0],[83.0,29.5],[85.0,27.5],
  [87.0,27.0],[88.5,27.5],
  [89.5,26.5],[91.5,26.0],[92.5,26.5],[94.0,27.5],[95.5,28.0],[97.0,28.5],
  [97.0,27.0],[95.5,26.0],[93.0,24.5],[92.5,22.5],[93.5,22.0],[91.5,23.5],[91.0,23.0],
  [89.5,22.0],[88.5,21.5],[87.5,21.0],[86.5,19.5],[85.5,18.0],
  [84.0,17.5],[83.5,17.0],[82.0,16.0],[80.5,13.5],[80.2,10.0],[79.5,8.5],[77.5,8.0],
  [76.5,9.0],[76.0,11.5],[75.5,13.0],[74.0,15.0],[73.5,17.0],[73.0,18.5],[72.9,20.5],
  [72.5,22.0],[70.5,21.5],[69.0,21.0],[68.5,22.5],[68.0,23.5],
]);

// ─── LOC / LAC boundary lines ─────────────────────────────────
const LOC_POINTS = toSVGPts([
  [74.5,32.2],[74.3,33.0],[74.2,33.8],[74.5,34.3],[75.2,34.9],[76.0,35.4],[77.0,35.6],
]);
const LAC_POINTS = toSVGPts([
  [77.8,35.2],[78.2,34.8],[78.7,34.3],[79.0,33.8],[79.5,33.3],[80.0,33.5],
]);

// ─── State polygons — Survey of India divisions ───────────────
// Each: { id, name (null = no label), lx/ly = label lng/lat, color, stroke, pts:[lng,lat][] }
const STATES = [
  // Pak-administered Kashmir / Gilgit-Baltistan — India's claimed territory, NO label
  { id:'pojk', name:null, lx:73.2, ly:35.0, color:'#1f1400', stroke:'#6b4400',
    pts:[[73.5,32.5],[73.2,33.5],[72.5,34.5],[73.0,35.5],[73.5,36.5],[74.0,37.0],
         [75.0,36.8],[76.0,36.5],[77.0,35.6],[77.0,35.5],[76.0,35.4],[75.2,34.9],
         [74.5,34.3],[74.2,33.8],[74.5,32.2],[73.5,32.5]] },
  // J & K  (IOK)
  { id:'jk', name:'J & K', lx:75.0, ly:33.7, color:'#1a4a8c', stroke:'#3b82f6',
    pts:[[73.5,32.5],[74.5,32.2],[74.2,33.8],[74.5,34.3],[75.2,34.9],[76.0,35.4],
         [77.0,35.5],[78.0,35.2],[78.5,33.0],[78.0,32.0],[77.5,32.0],[76.5,32.0],
         [75.5,32.0],[74.5,32.2],[73.5,32.5]] },
  // Ladakh (UT)
  { id:'la', name:'LADAKH', lx:78.5, ly:33.8, color:'#1a5c3e', stroke:'#22c55e',
    pts:[[77.0,35.5],[77.8,35.2],[78.5,35.0],[79.0,34.5],[79.5,34.0],[80.0,33.5],
         [80.3,32.5],[79.5,31.5],[78.5,31.5],[78.5,32.5],[78.5,33.0],[78.0,35.2],
         [77.0,35.5]] },
  // Himachal Pradesh
  { id:'hp', name:'H.P.', lx:77.0, ly:31.5, color:'#1a3d7a', stroke:'#60a5fa',
    pts:[[75.5,32.0],[76.5,32.0],[77.5,32.0],[78.0,32.0],[78.5,32.5],[79.5,31.5],
         [78.5,31.0],[78.0,30.5],[77.5,30.5],[76.5,30.5],[75.5,30.8],[75.5,32.0]] },
  // Punjab
  { id:'pb', name:'PB', lx:74.2, ly:31.0, color:'#7c4a00', stroke:'#fbbf24',
    pts:[[71.5,31.0],[73.0,32.0],[73.5,32.5],[74.5,32.2],[75.5,32.0],[75.5,30.8],
         [74.5,30.5],[73.5,30.2],[72.5,30.5],[71.5,31.0]] },
  // Haryana
  { id:'hr', name:'HR', lx:76.2, ly:29.5, color:'#7a4000', stroke:'#f97316',
    pts:[[74.5,30.5],[75.5,30.8],[76.5,30.5],[77.5,30.5],[77.5,29.5],[77.0,29.0],
         [77.0,28.5],[76.5,28.5],[75.5,28.5],[74.5,28.5],[74.0,29.0],[74.5,30.5]] },
  // Delhi (tiny)
  { id:'dl', name:'DL', lx:77.15, ly:28.7, color:'#8c1a1a', stroke:'#f87171',
    pts:[[77.0,29.0],[77.5,29.0],[77.5,28.5],[77.0,28.3],[76.8,28.6],[77.0,29.0]] },
  // Uttarakhand
  { id:'uk', name:'U.K.', lx:79.2, ly:30.2, color:'#1a2d8c', stroke:'#818cf8',
    pts:[[77.5,30.5],[78.5,31.0],[79.5,31.5],[80.5,31.5],[80.8,30.5],[80.0,29.5],
         [79.5,29.5],[79.0,29.0],[78.0,29.0],[77.0,29.0],[77.5,29.5],[77.5,30.5]] },
  // Rajasthan
  { id:'rj', name:'RAJASTHAN', lx:73.0, ly:26.5, color:'#8c5200', stroke:'#fcd34d',
    pts:[[68.5,24.5],[70.0,27.0],[70.5,29.0],[71.5,31.0],[73.5,30.2],[74.5,30.5],
         [74.0,29.0],[74.5,28.5],[75.5,28.5],[76.5,28.5],[76.5,27.5],[77.0,26.5],
         [76.0,25.5],[75.5,25.0],[75.0,24.0],[73.0,24.0],[70.0,24.0],[68.5,24.5]] },
  // Uttar Pradesh
  { id:'up', name:'U.P.', lx:80.5, ly:26.5, color:'#7a6600', stroke:'#fde68a',
    pts:[[76.5,28.5],[77.0,28.5],[77.0,29.0],[78.0,29.0],[79.0,29.0],[79.5,29.5],
         [80.5,30.5],[80.8,30.5],[80.5,29.0],[83.5,27.5],[84.5,27.5],[84.0,26.5],
         [83.5,25.5],[82.5,25.5],[81.5,25.0],[80.5,24.5],[79.5,24.5],[78.5,25.0],
         [77.5,25.5],[77.0,26.5],[76.5,27.5],[76.5,28.5]] },
  // Bihar
  { id:'br', name:'BIHAR', lx:85.5, ly:25.8, color:'#1a5c2e', stroke:'#4ade80',
    pts:[[83.5,27.5],[85.0,27.5],[87.0,27.0],[87.5,25.5],[86.5,24.5],[85.5,24.5],
         [84.5,24.5],[84.0,26.5],[83.5,25.5],[83.5,27.5]] },
  // Jharkhand
  { id:'jh', name:'JH', lx:85.2, ly:23.5, color:'#3a1a8c', stroke:'#a78bfa',
    pts:[[83.5,25.5],[84.0,26.5],[84.5,24.5],[85.5,24.5],[86.5,24.5],[87.0,23.5],
         [86.5,22.5],[85.5,22.0],[84.5,22.5],[84.0,22.5],[83.0,22.5],[82.5,23.5],
         [83.0,24.5],[83.5,25.5]] },
  // West Bengal
  { id:'wb', name:'W.B.', lx:87.8, ly:23.5, color:'#8c1a60', stroke:'#f472b6',
    pts:[[87.0,27.0],[88.5,27.0],[89.5,26.5],[89.0,25.0],[88.5,24.0],[88.0,23.0],
         [87.5,22.0],[87.5,21.5],[87.0,22.5],[87.0,23.5],[86.5,24.5],[87.5,25.5],
         [87.0,27.0]] },
  // Sikkim
  { id:'sk', name:'SK', lx:88.5, ly:27.5, color:'#1a3d6b', stroke:'#60a5fa',
    pts:[[88.0,27.5],[88.5,28.0],[89.0,27.5],[88.5,27.0],[88.0,27.5]] },
  // North East India (Assam + 7 sisters)
  { id:'ne', name:'N.EAST', lx:93.5, ly:25.5, color:'#0a4a2a', stroke:'#34d399',
    pts:[[88.5,27.5],[89.5,26.5],[91.5,26.0],[92.5,26.5],[94.0,27.5],[95.5,28.0],
         [97.0,28.5],[97.0,27.0],[95.5,26.0],[93.0,24.5],[92.5,22.5],[93.5,22.0],
         [91.5,23.5],[91.0,23.0],[89.5,22.0],[88.5,21.5],[88.0,23.0],[88.5,24.0],
         [89.0,25.0],[89.5,26.5],[88.5,27.5]] },
  // Odisha
  { id:'or', name:'ODISHA', lx:84.5, ly:20.5, color:'#005a6b', stroke:'#67e8f9',
    pts:[[82.5,23.5],[83.0,22.5],[84.0,22.5],[84.5,22.5],[85.5,22.0],[86.5,22.5],
         [87.0,22.5],[87.5,21.5],[87.5,21.0],[86.5,19.5],[85.5,18.0],[85.0,18.5],
         [84.0,19.0],[83.5,20.0],[82.5,21.0],[82.0,21.0],[82.5,23.5]] },
  // Chhattisgarh
  { id:'cg', name:'C.G.', lx:81.5, ly:22.0, color:'#1a5a1a', stroke:'#86efac',
    pts:[[80.5,24.5],[81.5,25.0],[82.5,25.5],[83.5,25.5],[83.0,24.5],[82.5,23.5],
         [82.0,21.0],[82.5,21.0],[81.5,20.5],[80.5,20.5],[80.0,21.5],[80.5,22.5],
         [80.5,24.5]] },
  // Madhya Pradesh
  { id:'mp', name:'M.P.', lx:78.5, ly:23.5, color:'#3a5c00', stroke:'#a3e635',
    pts:[[75.5,25.5],[77.0,25.5],[77.0,26.5],[78.5,25.0],[79.5,24.5],[80.5,24.5],
         [80.5,22.5],[80.0,21.5],[79.5,20.5],[78.5,20.5],[78.0,21.0],[77.0,21.5],
         [76.5,22.0],[76.0,22.0],[75.5,23.0],[75.0,24.0],[75.5,25.5]] },
  // Gujarat
  { id:'gj', name:'GUJARAT', lx:72.0, ly:22.5, color:'#8c5a00', stroke:'#fbbf24',
    pts:[[68.0,23.5],[68.5,24.5],[70.0,24.0],[73.0,24.0],[75.0,24.0],[75.0,21.0],
         [74.5,20.5],[73.5,19.5],[73.0,18.5],[72.9,20.5],[72.5,22.0],[70.5,21.5],
         [69.0,21.0],[68.5,22.5],[68.0,23.5]] },
  // Maharashtra
  { id:'mh', name:'MAHA.', lx:77.0, ly:19.5, color:'#8c1a1a', stroke:'#f87171',
    pts:[[73.0,18.5],[73.5,19.5],[74.5,20.5],[75.0,21.0],[75.5,23.0],[76.0,22.0],
         [77.0,21.5],[78.0,21.0],[80.5,20.5],[81.5,20.5],[82.0,21.0],[83.5,20.0],
         [84.0,19.0],[83.5,18.5],[82.0,17.5],[80.5,16.5],[80.0,16.0],[79.5,16.0],
         [78.5,17.0],[77.5,17.5],[77.0,17.5],[76.5,17.5],[74.0,17.0],[73.8,15.8],
         [73.0,18.5]] },
  // Goa
  { id:'ga', name:'GA', lx:74.1, ly:15.4, color:'#004a5c', stroke:'#22d3ee',
    pts:[[73.8,15.8],[74.0,15.0],[74.5,15.0],[74.5,16.5],[74.0,17.0],[73.5,16.5],
         [73.8,15.8]] },
  // Telangana
  { id:'tg', name:'TG', lx:79.2, ly:18.2, color:'#5c1a8c', stroke:'#c084fc',
    pts:[[77.5,19.5],[78.5,19.5],[79.5,19.5],[80.5,18.5],[80.0,17.5],[80.5,16.5],
         [80.0,16.0],[79.5,16.0],[78.5,17.0],[77.5,17.5],[77.0,17.5],[77.0,18.5],
         [77.5,19.5]] },
  // Andhra Pradesh
  { id:'ap', name:'A.P.', lx:80.2, ly:15.5, color:'#005c7a', stroke:'#22d3ee',
    pts:[[80.0,16.0],[80.5,16.5],[82.0,17.5],[83.5,18.5],[84.0,19.0],[84.0,17.5],
         [83.5,17.0],[82.0,16.0],[80.5,13.5],[80.2,13.0],[80.5,12.5],[80.5,15.5],
         [80.0,16.0]] },
  // Karnataka
  { id:'ka', name:'KARNATAKA', lx:76.5, ly:14.5, color:'#1a2d8c', stroke:'#60a5fa',
    pts:[[73.8,15.8],[74.0,15.0],[74.5,15.0],[75.0,14.0],[75.5,13.0],[76.5,12.5],
         [77.0,12.5],[77.5,12.0],[78.5,11.5],[79.5,11.5],[80.5,12.5],[80.2,13.0],
         [80.5,13.5],[80.5,15.5],[80.0,16.0],[79.5,16.0],[78.5,17.0],[77.5,17.5],
         [77.0,17.5],[76.5,17.5],[74.0,17.0],[73.5,16.5],[73.8,15.8]] },
  // Tamil Nadu
  { id:'tn', name:'T.N.', lx:78.5, ly:11.0, color:'#8c4a00', stroke:'#fb923c',
    pts:[[79.5,11.5],[80.5,12.5],[80.2,13.0],[80.5,10.0],[80.2,10.0],[79.5,8.5],
         [77.5,8.0],[77.5,9.5],[77.0,10.0],[76.5,10.5],[76.0,11.5],[76.5,12.5],
         [77.0,12.5],[77.5,12.0],[78.5,11.5],[79.5,11.5]] },
  // Kerala
  { id:'kl', name:'KL', lx:76.3, ly:10.5, color:'#00522e', stroke:'#4ade80',
    pts:[[76.5,12.5],[77.0,12.5],[77.5,12.0],[77.5,9.5],[77.5,8.0],[76.5,9.0],
         [76.0,11.5],[76.5,12.5]] },
];

// ─── Extra cities for Kashmir / Ladakh reference ─────────────
const EXTRA_CITIES = [
  { name:'Srinagar',    lat:34.0837, lng:74.7973 },
  { name:'Leh',         lat:34.1526, lng:77.5771 },
  { name:'Kargil',      lat:34.5539, lng:76.1349 },
  { name:'Jammu',       lat:32.7266, lng:74.8570 },
  { name:'Gilgit ★',   lat:35.9221, lng:74.3087 },  // POJK
  { name:'Muzaffarabad ★', lat:34.3700, lng:73.4710 }, // POJK
];
const ALL_CITIES = [...MAJOR_CITIES, ...EXTRA_CITIES];

// ─── Routes ──────────────────────────────────────────────────
const ROUTES = {
  'Delhi → Jaipur':            { from:{lat:28.7041,lng:77.1025}, to:{lat:26.9124,lng:75.7873}, km:268 },
  'Hyderabad → Chennai':       { from:{lat:17.3850,lng:78.4867}, to:{lat:13.0827,lng:80.2707}, km:626 },
  'Delhi → Noida':             { from:{lat:28.7041,lng:77.1025}, to:{lat:28.5355,lng:77.3910}, km:22  },
  'Kolkata → Bhubaneswar':     { from:{lat:22.5726,lng:88.3639}, to:{lat:20.2961,lng:85.8245}, km:440 },
  'Bangalore → Hyderabad':     { from:{lat:12.9716,lng:77.5946}, to:{lat:17.3850,lng:78.4867}, km:568 },
  'Mumbai → Ahmedabad':        { from:{lat:19.0760,lng:72.8777}, to:{lat:23.0225,lng:72.5714}, km:540 },
  'Delhi → Lucknow':           { from:{lat:28.7041,lng:77.1025}, to:{lat:26.8467,lng:80.9462}, km:547 },
  'Chennai → Coimbatore':      { from:{lat:13.0827,lng:80.2707}, to:{lat:11.0026,lng:76.6755}, km:498 },
  'Kolkata → Patna':           { from:{lat:22.5726,lng:88.3639}, to:{lat:25.5941,lng:85.1376}, km:580 },
  'Hyderabad → Visakhapatnam': { from:{lat:17.3850,lng:78.4867}, to:{lat:17.6869,lng:83.2185}, km:625 },
  'Pune → Surat':              { from:{lat:18.5204,lng:73.8567}, to:{lat:21.1458,lng:72.8355}, km:290 },
  'Mumbai → Bangalore':        { from:{lat:19.0760,lng:72.8777}, to:{lat:12.9716,lng:77.5946}, km:981 },
};

function lerpPos(routeKey, progress) {
  const r = ROUTES[routeKey];
  if (!r) return { lat: 20.5, lng: 78.9 };
  return {
    lat: r.from.lat + (r.to.lat - r.from.lat) * progress,
    lng: r.from.lng + (r.to.lng - r.from.lng) * progress,
  };
}

// ─── Vehicle statuses ────────────────────────────────────────
const ST = {
  'in-transit':  { color:'#22c55e', dark:'#15803d', bg:'#dcfce7', label:'In Transit',   icon:'▶', pulse:true  },
  'waiting':     { color:'#f59e0b', dark:'#b45309', bg:'#fef3c7', label:'Waiting',       icon:'⏸', pulse:true  },
  'idle':        { color:'#60a5fa', dark:'#2563eb', bg:'#dbeafe', label:'Idle',          icon:'◉', pulse:false },
  'at-risk':     { color:'#f87171', dark:'#dc2626', bg:'#fee2e2', label:'At Risk',       icon:'⚠', pulse:true  },
  'maintenance': { color:'#a78bfa', dark:'#7c3aed', bg:'#ede9fe', label:'Maintenance',   icon:'🔧', pulse:false },
  'offline':     { color:'#6b7280', dark:'#374151', bg:'#f3f4f6', label:'Offline',       icon:'○', pulse:false },
};

const V_ICON = { 'Auto Rickshaw':'🛺', 'Tempo':'🚐', 'Mini Truck':'🚛', 'Full Truck':'🚚' };

// ─── 18-vehicle live fleet ───────────────────────────────────
const INIT_FLEET = [
  // ── Fleet vehicles ──
  {
    id:'V001', reg:'DL01AB1234', type:'Auto Rickshaw', driver:'Ramesh Yadav', phone:'9871001001',
    booking:null, route:null, progress:null, speed:0, status:'idle', eta:null, delay:0,
    cargo:null, customer:null, fuel:68, alerts:[], lat:19.0760, lng:72.8777, tag:'fleet',
  },
  {
    id:'V002', reg:'DL02CD5678', type:'Auto Rickshaw', driver:'Mohan Lal', phone:'9871002002',
    booking:'LH2607', route:'Delhi → Noida', progress:0.71, speed:34, status:'in-transit',
    eta:'13:20', delay:12, cargo:'Courier packages (180 kg)', customer:'Vikram Singh',
    fuel:52, alerts:['Traffic delay — ETA pushed by 12 min'], tag:'fleet',
  },
  {
    id:'V003', reg:'MH03EF9012', type:'Tempo', driver:'Mohammad Ali', phone:'9821003003',
    booking:'LH2608', route:'Bangalore → Hyderabad', progress:0.33, speed:68, status:'in-transit',
    eta:'17:45', delay:0, cargo:'Furniture & appliances (580 kg)', customer:'Sneha Rao',
    fuel:61, alerts:[], tag:'fleet',
  },
  {
    id:'V004', reg:'MH04GH3456', type:'Tempo', driver:'Unassigned', phone:null,
    booking:null, route:null, progress:null, speed:0, status:'maintenance', eta:null, delay:0,
    cargo:null, customer:null, fuel:45, alerts:['Engine overhaul — est. 2 days'], lat:19.056, lng:72.840, tag:'fleet',
  },
  {
    id:'V005', reg:'KA05IJ7890', type:'Mini Truck', driver:'Venkatesh S.', phone:'9845004004',
    booking:'LH2601', route:'Delhi → Jaipur', progress:0.55, speed:61, status:'in-transit',
    eta:'15:00', delay:0, cargo:'Electronic goods (750 kg)', customer:'Rahul Sharma',
    fuel:74, alerts:[], tag:'fleet',
  },
  {
    id:'V006', reg:'KA06KL1234', type:'Mini Truck', driver:'Anand Kumar', phone:'9845005005',
    booking:'LH2605', route:'Hyderabad → Chennai', progress:0.14, speed:0, status:'waiting',
    eta:'21:30', delay:55, cargo:'Industrial parts (1200 kg)', customer:'Priya Patel',
    fuel:86, alerts:['Waiting at customer site — 55 min behind schedule'], tag:'fleet',
  },
  {
    id:'V007', reg:'TN07MN5678', type:'Mini Truck', driver:'Biswajit Roy', phone:'9831006006',
    booking:null, route:null, progress:null, speed:0, status:'idle', eta:null, delay:0,
    cargo:null, customer:null, fuel:92, alerts:[], lat:13.0827, lng:80.2707, tag:'fleet',
  },
  {
    id:'V008', reg:'DL08OP9012', type:'Full Truck', driver:'Deepak Singh', phone:'9811007007',
    booking:null, route:null, progress:null, speed:0, status:'idle', eta:null, delay:0,
    cargo:null, customer:null, fuel:80, alerts:[], lat:28.6800, lng:77.1000, tag:'fleet',
  },
  {
    id:'V009', reg:'MH09QR3456', type:'Full Truck', driver:'Unassigned', phone:null,
    booking:null, route:null, progress:null, speed:0, status:'offline', eta:null, delay:0,
    cargo:null, customer:null, fuel:0, alerts:['RTO permit renewal pending'], lat:19.108, lng:72.890, tag:'fleet',
  },
  {
    id:'V010', reg:'UP10ST7890', type:'Full Truck', driver:'Rajiv Tiwari', phone:'9891008008',
    booking:'LH2606', route:'Kolkata → Bhubaneswar', progress:0.40, speed:25, status:'at-risk',
    eta:'20:15', delay:115, cargo:'Construction material (4500 kg)', customer:'Priya Patel',
    fuel:31, alerts:['Route deviation detected!','Low fuel — 31% remaining','Delay of 1h 55min — SLA breach risk'], tag:'fleet',
  },
  // ── Partner vehicles ──
  {
    id:'PV01', reg:'MH11UV2345', type:'Mini Truck', driver:'Sunil Verma', phone:'9822011011',
    booking:'LH2609', route:'Mumbai → Ahmedabad', progress:0.62, speed:74, status:'in-transit',
    eta:'16:10', delay:0, cargo:'FMCG goods (900 kg)', customer:'Retail Corp',
    fuel:55, alerts:[], tag:'partner',
  },
  {
    id:'PV02', reg:'UP12WX6789', type:'Full Truck', driver:'Arun Sharma', phone:'9935022022',
    booking:'LH2610', route:'Delhi → Lucknow', progress:0.48, speed:65, status:'in-transit',
    eta:'18:30', delay:20, cargo:'Steel rods (4200 kg)', customer:'BuildRight Ltd',
    fuel:48, alerts:['Minor route adjustment — bypass NH27 blockage'], tag:'partner',
  },
  {
    id:'PV03', reg:'TN13YZ0123', type:'Tempo', driver:'Karthik M.', phone:'9841033033',
    booking:'LH2611', route:'Chennai → Coimbatore', progress:0.78, speed:58, status:'in-transit',
    eta:'14:45', delay:0, cargo:'Textile goods (650 kg)', customer:'South Fabrics',
    fuel:40, alerts:[], tag:'partner',
  },
  {
    id:'PV04', reg:'WB14AB4567', type:'Auto Rickshaw', driver:'Dilip Roy', phone:'9831044044',
    booking:'LH2612', route:'Kolkata → Patna', progress:0.25, speed:42, status:'in-transit',
    eta:'22:00', delay:0, cargo:'Parcels (140 kg)', customer:'QuickShip Co',
    fuel:70, alerts:[], tag:'partner',
  },
  {
    id:'PV05', reg:'MH15CD8901', type:'Mini Truck', driver:'Pradeep G.', phone:'9823055055',
    booking:'LH2613', route:'Pune → Surat', progress:0.08, speed:0, status:'waiting',
    eta:'19:00', delay:30, cargo:'Packaged beverages (1100 kg)', customer:'DrinkFast India',
    fuel:88, alerts:['Loading in progress — 30 min wait'], tag:'partner',
  },
  {
    id:'PV06', reg:'TS16EF2345', type:'Tempo', driver:'Farhan Khan', phone:'9940066066',
    booking:'LH2614', route:'Hyderabad → Visakhapatnam', progress:0.52, speed:71, status:'in-transit',
    eta:'17:00', delay:0, cargo:'Pharma supplies (500 kg)', customer:'MedCare Solutions',
    fuel:63, alerts:[], tag:'partner',
  },
  {
    id:'PV07', reg:'KA17GH6789', type:'Full Truck', driver:'Nitin Joshi', phone:'9845077077',
    booking:null, route:null, progress:null, speed:0, status:'idle', eta:null, delay:0,
    cargo:null, customer:null, fuel:77, alerts:[], lat:12.9200, lng:77.6000, tag:'partner',
  },
  {
    id:'PV08', reg:'PB18IJ0123', type:'Mini Truck', driver:'Arvind P.', phone:'9814088088',
    booking:null, route:null, progress:null, speed:0, status:'maintenance', eta:null, delay:0,
    cargo:null, customer:null, fuel:55, alerts:['Scheduled brake service'], lat:30.7333, lng:76.7794, tag:'partner',
  },
  {
    id:'PV09', reg:'GJ19KL4567', type:'Tempo', driver:'Vijay Patel', phone:'9825099099',
    booking:'LH2615', route:'Mumbai → Bangalore', progress:0.21, speed:79, status:'in-transit',
    eta:'23:30', delay:0, cargo:'Office equipment (420 kg)', customer:'TechMove Corp',
    fuel:82, alerts:[], tag:'partner',
  },
];

function getPos(v) {
  if (v.route && ROUTES[v.route]) return lerpPos(v.route, v.progress || 0);
  return { lat: v.lat || 20.5, lng: v.lng || 78.9 };
}

// ─── Main Component ──────────────────────────────────────────
export default function VehicleTracking() {
  const [fleet, setFleet]           = useState(INIT_FLEET);
  const [selected, setSelected]     = useState(null);
  const [filterStatus, setStatus]   = useState('all');
  const [filterType, setType]       = useState('all');
  const [filterTag, setTag]         = useState('all');
  const [riskOnly, setRiskOnly]     = useState(false);
  const [mapTip, setMapTip]         = useState(null); // { x, y, v }
  const [, setTick]                 = useState(0);
  const timerRef = useRef(null);

  // Live simulation
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setFleet(prev => prev.map(v => {
        if (v.status === 'in-transit' && v.route) {
          const delta = 0.004 + Math.random() * 0.004;
          const newProgress = Math.min(0.99, (v.progress || 0) + delta);
          const speedDelta = (Math.random() - 0.5) * 8;
          const newSpeed = Math.max(20, Math.min(90, v.speed + speedDelta));
          return { ...v, progress: newProgress, speed: Math.round(newSpeed) };
        }
        return v;
      }));
      setTick(t => t + 1);
    }, 2500);
    return () => clearInterval(timerRef.current);
  }, []);

  // Update selected vehicle ref
  useEffect(() => {
    if (selected) setSelected(s => fleet.find(v => v.id === s?.id) || null);
  }, [fleet]);

  const filtered = fleet.filter(v => {
    if (filterStatus !== 'all' && v.status !== filterStatus) return false;
    if (filterType   !== 'all' && v.type   !== filterType)   return false;
    if (filterTag    !== 'all' && v.tag    !== filterTag)     return false;
    if (riskOnly && !v.alerts.length && !['at-risk','waiting'].includes(v.status)) return false;
    return true;
  });

  const counts = fleet.reduce((acc, v) => {
    acc[v.status] = (acc[v.status] || 0) + 1; return acc;
  }, {});
  const allAlerts = fleet.flatMap(v => v.alerts.map(a => ({ v, msg: a })));

  const hasFilters = filterStatus !== 'all' || filterType !== 'all' || filterTag !== 'all' || riskOnly;

  return (
    <div className="vt2-shell">

      {/* ── KPI strip ── */}
      <div className="vt2-kpi-strip">
        {[
          { key:'total',       label:'Total Fleet',  val: fleet.length,            color:'#FF6B35', icon:'🚚' },
          { key:'in-transit',  label:'In Transit',   val: counts['in-transit']||0, color:'#22c55e', icon:'▶' },
          { key:'waiting',     label:'Waiting',      val: counts['waiting']||0,    color:'#f59e0b', icon:'⏸' },
          { key:'idle',        label:'Idle',         val: counts['idle']||0,       color:'#60a5fa', icon:'◉' },
          { key:'at-risk',     label:'At Risk',      val: counts['at-risk']||0,    color:'#f87171', icon:'⚠' },
          { key:'maintenance', label:'Maintenance',  val: counts['maintenance']||0,color:'#a78bfa', icon:'🔧' },
          { key:'offline',     label:'Offline',      val: counts['offline']||0,    color:'#6b7280', icon:'○' },
        ].map(({ key, label, val, color, icon }) => (
          <div
            key={key}
            className={`vt2-kpi${filterStatus === key ? ' active' : ''}`}
            style={{ '--kc': color }}
            onClick={() => setStatus(s => s === key && key !== 'total' ? 'all' : key === 'total' ? 'all' : key)}
          >
            <div className="vt2-kpi-top">
              {key === 'at-risk' && val > 0 && <span className="vt2-kpi-pulse" style={{background:color}}/>}
              <span className="vt2-kpi-num" style={{color}}>{val}</span>
              <span className="vt2-kpi-icon">{icon}</span>
            </div>
            <div className="vt2-kpi-label">{label}</div>
          </div>
        ))}
        <div className="vt2-live-pill">
          <span className="vt2-live-dot"/>
          <span>LIVE</span>
        </div>
      </div>

      {/* ── Filter row ── */}
      <div className="vt2-filter-row">
        <div className="vt2-filter-set">
          <span className="vt2-filter-lbl">Status</span>
          <div className="vt2-filter-chips">
            {['all','in-transit','waiting','idle','at-risk','maintenance','offline'].map(s => (
              <button key={s}
                className={`vt2-chip${filterStatus === s ? ' on' : ''}`}
                style={filterStatus === s && s !== 'all' ? { background: ST[s]?.color, color:'#fff', borderColor: ST[s]?.color } : {}}
                onClick={() => setStatus(s)}
              >
                {s === 'all' ? 'All' : ST[s]?.label}
              </button>
            ))}
          </div>
        </div>

        <div className="vt2-filter-set">
          <span className="vt2-filter-lbl">Type</span>
          <div className="vt2-filter-chips">
            {['all','Auto Rickshaw','Tempo','Mini Truck','Full Truck'].map(t => (
              <button key={t}
                className={`vt2-chip${filterType === t ? ' on' : ''}`}
                onClick={() => setType(t)}
              >
                {t === 'all' ? 'All' : `${V_ICON[t]} ${t}`}
              </button>
            ))}
          </div>
        </div>

        <div className="vt2-filter-set">
          <span className="vt2-filter-lbl">Fleet</span>
          <div className="vt2-filter-chips">
            {[['all','All'],['fleet','Own Fleet'],['partner','Partners']].map(([v,l]) => (
              <button key={v} className={`vt2-chip${filterTag === v ? ' on' : ''}`} onClick={() => setTag(v)}>{l}</button>
            ))}
          </div>
        </div>

        <label className="vt2-risk-toggle">
          <input type="checkbox" checked={riskOnly} onChange={e => setRiskOnly(e.target.checked)}/>
          <span className="vt2-toggle-track"><span className="vt2-toggle-thumb"/></span>
          <span>Alerts only</span>
        </label>

        {hasFilters && (
          <button className="vt2-clear-btn" onClick={() => { setStatus('all'); setType('all'); setTag('all'); setRiskOnly(false); }}>
            ✕ Clear
          </button>
        )}

        <span className="vt2-count-pill">{filtered.length}/{fleet.length} vehicles</span>
      </div>

      {/* ── Body ── */}
      <div className="vt2-body">

        {/* MAP */}
        <div className="vt2-map-panel">
          <div className="vt2-map-topbar">
            <span className="vt2-map-title">🗺 Live Fleet Map — India</span>
            <span className="vt2-map-sub">Click a vehicle marker to inspect • Auto-updates every 2.5s</span>
          </div>

          <div className="vt2-map-wrap" onClick={() => { setSelected(null); setMapTip(null); }}>
            <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="vt2-svg" style={{width:'100%',height:'100%'}}>

              {/* Ocean background */}
              <rect x={0} y={0} width={MAP_W} height={MAP_H} fill="#0a1628"/>

              {/* Latitude/Longitude grid */}
              {[10,15,20,25,30,35].map(lat => {
                const {y} = toSVG(lat,MIN_LNG);
                return <line key={`lat${lat}`} x1={0} y1={y} x2={MAP_W} y2={y} stroke="#1a2f50" strokeWidth="0.6" strokeDasharray="4 6"/>;
              })}
              {[70,75,80,85,90,95].map(lng => {
                const {x} = toSVG(MIN_LAT,lng);
                return <line key={`lng${lng}`} x1={x} y1={0} x2={x} y2={MAP_H} stroke="#1a2f50" strokeWidth="0.6" strokeDasharray="4 6"/>;
              })}

              {/* Base India fill — prevents ocean gaps between state polygons */}
              <polygon points={INDIA_POINTS} fill="#0d1f3c" stroke="none"/>

              {/* State polygons — composite index style */}
              {STATES.map(s => (
                <polygon key={s.id}
                  points={toSVGPts(s.pts)}
                  fill={s.color}
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="0.8"
                  opacity="0.92"
                />
              ))}

              {/* India outer border on top of states */}
              <polygon points={INDIA_POINTS} fill="none" stroke="#1d4f8e" strokeWidth="1.8"/>

              {/* LOC — Line of Control */}
              <polyline points={LOC_POINTS} fill="none" stroke="#f59e0b"
                strokeWidth="1.6" strokeDasharray="5 3" opacity="0.9"/>
              {/* LAC — Line of Actual Control */}
              <polyline points={LAC_POINTS} fill="none" stroke="#ef4444"
                strokeWidth="1.6" strokeDasharray="5 3" opacity="0.9"/>

              {/* State name labels */}
              {STATES.filter(s => s.name).map(s => {
                const p = toSVG(s.ly, s.lx);
                return (
                  <text key={s.id} x={p.x} y={p.y}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={s.name.length > 6 ? 6 : 7}
                    fontWeight="700" fontFamily="sans-serif"
                    fill="#e2e8f0" opacity="0.85"
                    stroke={s.color} strokeWidth="2.5" paintOrder="stroke"
                    style={{pointerEvents:'none', letterSpacing:'0.04em'}}
                  >
                    {s.name}
                  </text>
                );
              })}

              {/* LOC / LAC legend */}
              {(() => {
                const tx = MAP_W - 120, ty = 8;
                return (
                  <g style={{pointerEvents:'none'}}>
                    <rect x={tx-4} y={ty} width={124} height={36} rx={5}
                      fill="#050e1d" opacity="0.9" stroke="#1d4f8e" strokeWidth="0.8"/>
                    <line x1={tx+2}  y1={ty+12} x2={tx+22} y2={ty+12}
                      stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3"/>
                    <text x={tx+26} y={ty+15} fontSize="7" fill="#fbbf24" fontFamily="sans-serif" fontWeight="600">LOC  (J&amp;K)</text>
                    <line x1={tx+2}  y1={ty+25} x2={tx+22} y2={ty+25}
                      stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3"/>
                    <text x={tx+26} y={ty+28} fontSize="7" fill="#fca5a5" fontFamily="sans-serif" fontWeight="600">LAC  (Ladakh)</text>
                  </g>
                );
              })()}

              {/* Route lines (dashed + progress fill) */}
              {fleet.map(v => {
                if (!v.route || !ROUTES[v.route]) return null;
                const r  = ROUTES[v.route];
                const f  = toSVG(r.from.lat, r.from.lng);
                const t  = toSVG(r.to.lat,   r.to.lng);
                const st = ST[v.status];
                const dim = !filtered.includes(v);
                const cx = f.x + (t.x - f.x) * (v.progress||0);
                const cy = f.y + (t.y - f.y) * (v.progress||0);
                return (
                  <g key={`rt-${v.id}`} opacity={dim ? 0.12 : 1}>
                    <line x1={f.x} y1={f.y} x2={t.x} y2={t.y} stroke={st.color} strokeWidth="1" strokeDasharray="5 4" opacity="0.35"/>
                    <line x1={f.x} y1={f.y} x2={cx}  y2={cy}  stroke={st.color} strokeWidth="2.5" opacity="0.75"/>
                    <circle cx={f.x} cy={f.y} r="2.5" fill="#4b6fa5"/>
                    <circle cx={t.x} cy={t.y} r="2.5" fill="#4b6fa5"/>
                  </g>
                );
              })}

              {/* City reference dots */}
              {ALL_CITIES.map(c => {
                const p    = toSVG(c.lat, c.lng);
                const pojk = c.name.includes('★');
                return (
                  <g key={c.name}>
                    <circle cx={p.x} cy={p.y} r={pojk ? 2.5 : 2}
                      fill={pojk ? '#78350f' : '#2d5a8e'}
                      stroke={pojk ? '#f59e0b' : '#3d7ab5'} strokeWidth="0.8"/>
                    <text x={p.x+4} y={p.y+3} fontSize="6.5"
                      fill={pojk ? '#fbbf24' : '#4a7fb5'}
                      fontFamily="sans-serif" style={{pointerEvents:'none'}}>
                      {c.name.replace(' ★','')}
                    </text>
                  </g>
                );
              })}

              {/* Vehicle markers */}
              {filtered.map(v => {
                const pos  = getPos(v);
                const p    = toSVG(pos.lat, pos.lng);
                const st   = ST[v.status];
                const isSel = selected?.id === v.id;
                return (
                  <g key={v.id} style={{cursor:'pointer'}}
                    onClick={ev => { ev.stopPropagation(); setSelected(v.id === selected?.id ? null : v); }}
                    onMouseEnter={() => setMapTip({ x: p.x, y: p.y, v })}
                    onMouseLeave={() => setMapTip(null)}
                    transform={`translate(${p.x},${p.y})`}
                  >
                    {/* Pulse ring */}
                    {st.pulse && <circle r="16" fill={st.color} opacity="0.12" className="vt2-pulse"/>}
                    {st.pulse && <circle r="11" fill={st.color} opacity="0.2"  className="vt2-pulse2"/>}
                    {/* Selection ring */}
                    {isSel && <circle r="17" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.7"/>}
                    {/* Marker body */}
                    <circle r="9" fill={st.color} stroke="#0a1628" strokeWidth="1.5"/>
                    {/* Vehicle emoji (small) */}
                    <text textAnchor="middle" dominantBaseline="central" fontSize="8" style={{pointerEvents:'none',userSelect:'none'}}>
                      {V_ICON[v.type]}
                    </text>
                    {/* Reg tail label */}
                    <text x={0} y={17} textAnchor="middle" fontSize="6.5" fill={st.color}
                      fontWeight="700" fontFamily="monospace"
                      stroke="#0a1628" strokeWidth="3.5" paintOrder="stroke"
                      style={{pointerEvents:'none'}}
                    >
                      {v.reg.slice(-4)}
                    </text>
                    {/* Alert badge */}
                    {v.alerts.length > 0 && (
                      <>
                        <circle cx={8} cy={-8} r="5.5" fill="#ef4444" stroke="#0a1628" strokeWidth="1"/>
                        <text x={8} y={-5} textAnchor="middle" fontSize="7" fill="#fff" fontWeight="900" style={{pointerEvents:'none'}}>!</text>
                      </>
                    )}
                  </g>
                );
              })}

              {/* Map tooltip */}
              {mapTip && (() => {
                const { x, y, v } = mapTip;
                const st = ST[v.status];
                const tx = Math.min(x + 12, MAP_W - 130);
                const ty = Math.max(y - 55, 5);
                return (
                  <g style={{pointerEvents:'none'}}>
                    <rect x={tx} y={ty} width={125} height={50} rx={5} fill="#0f1f3d" stroke={st.color} strokeWidth="1" opacity="0.97"/>
                    <text x={tx+8} y={ty+14} fontSize="8.5" fill="#fff" fontWeight="700" fontFamily="sans-serif">{v.reg}</text>
                    <text x={tx+8} y={ty+25} fontSize="7.5" fill={st.color} fontFamily="sans-serif">{st.label} · {v.type}</text>
                    <text x={tx+8} y={ty+36} fontSize="7.5" fill="#94a3b8" fontFamily="sans-serif">👤 {v.driver}</text>
                    {v.speed > 0 && <text x={tx+8} y={ty+46} fontSize="7.5" fill="#94a3b8" fontFamily="sans-serif">💨 {v.speed} km/h  ⛽ {v.fuel}%</text>}
                  </g>
                );
              })()}

              {/* Legend */}
              <g transform={`translate(6,${MAP_H-115})`}>
                <rect x={0} y={0} width={105} height={110} rx={6} fill="#050e1d" opacity="0.92" stroke="#1d4f8e" strokeWidth="0.8"/>
                <text x={8} y={14} fontSize="7.5" fill="#60a5fa" fontWeight="700" fontFamily="sans-serif" letterSpacing="1">LEGEND</text>
                {Object.entries(ST).map(([k,s],i) => (
                  <g key={k} transform={`translate(8,${22+i*14})`}>
                    <circle r="4.5" cx={4.5} cy={0} fill={s.color} opacity="0.9"/>
                    <text x={14} y={4} fontSize="7.5" fill="#cbd5e1" fontFamily="sans-serif">{s.label}</text>
                  </g>
                ))}
              </g>
            </svg>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="vt2-right">

          {/* Alerts */}
          {allAlerts.length > 0 && (
            <div className="vt2-alerts-section">
              <div className="vt2-section-hd">
                <span className="vt2-section-title">Fleet Alerts</span>
                <span className="vt2-alert-count-badge">{allAlerts.length}</span>
              </div>
              <div className="vt2-alerts-scroll">
                {allAlerts.map(({ v, msg }, i) => {
                  const isCrit = v.status === 'at-risk';
                  return (
                    <div key={`${v.id}-${i}`}
                      className={`vt2-alert-card ${isCrit ? 'crit' : 'warn'}`}
                      onClick={() => setSelected(v)}
                    >
                      <div className="vt2-alert-card-icon">{isCrit ? '🔴' : '🟡'}</div>
                      <div className="vt2-alert-card-body">
                        <div className="vt2-alert-card-top">
                          <span className="vt2-alert-reg">{v.reg}</span>
                          <span className="vt2-alert-type">{V_ICON[v.type]} {v.type}</span>
                        </div>
                        <div className="vt2-alert-msg">{msg}</div>
                        <div className="vt2-alert-meta">
                          <span>👤 {v.driver}</span>
                          {v.route && <span>📍 {v.route}</span>}
                        </div>
                      </div>
                      <div className={`vt2-alert-sev ${isCrit ? 'crit' : 'warn'}`}>{isCrit ? 'CRITICAL' : 'WARN'}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selected vehicle detail */}
          {selected && (
            <VehicleDetail v={selected} onClose={() => setSelected(null)}/>
          )}

          {/* Vehicle list */}
          <div className="vt2-vlist-section">
            <div className="vt2-section-hd">
              <span className="vt2-section-title">Vehicle List</span>
              <span className="vt2-section-sub">{filtered.length} shown</span>
            </div>
            <div className="vt2-vlist-scroll">
              {filtered.map(v => {
                const st    = ST[v.status];
                const isSel = selected?.id === v.id;
                return (
                  <div key={v.id}
                    className={`vt2-vcard ${isSel ? 'sel' : ''}`}
                    style={{ '--bc': st.color }}
                    onClick={() => setSelected(v.id === selected?.id ? null : v)}
                  >
                    <div className="vt2-vcard-row1">
                      <span className="vt2-vcard-vehicleicon">{V_ICON[v.type]}</span>
                      <div className="vt2-vcard-ident">
                        <span className="vt2-vcard-reg">{v.reg}</span>
                        <span className="vt2-vcard-vtype">{v.type}</span>
                      </div>
                      <div className="vt2-vcard-mid">
                        <span className="vt2-vcard-driver">👤 {v.driver}</span>
                        {v.speed > 0 && <span className="vt2-vcard-speed">💨 {v.speed} km/h</span>}
                      </div>
                      <span className="vt2-status-pill" style={{background:st.bg,color:st.color}}>
                        {st.label}
                      </span>
                    </div>

                    {v.route && (
                      <div className="vt2-vcard-route-row">
                        <span className="vt2-vcard-routelabel">📍 {v.route}</span>
                        {v.progress !== null && (
                          <span className="vt2-vcard-pct">{Math.round(v.progress * 100)}%</span>
                        )}
                      </div>
                    )}

                    {v.progress !== null && (
                      <div className="vt2-pbar-bg">
                        <div className="vt2-pbar-fill" style={{width:`${v.progress*100}%`, background: st.color}}/>
                      </div>
                    )}

                    <div className="vt2-vcard-row3">
                      {v.fuel !== null && (
                        <span className={`vt2-fuel ${v.fuel < 35 ? 'low' : v.fuel < 55 ? 'med' : ''}`}>
                          ⛽ {v.fuel}%
                        </span>
                      )}
                      {v.eta  && <span className="vt2-eta">🕐 ETA {v.eta}</span>}
                      {v.delay > 0 && (
                        <span className="vt2-delay-tag">
                          ⚠ +{v.delay >= 60 ? `${Math.floor(v.delay/60)}h ${v.delay%60}m` : `${v.delay}m`}
                        </span>
                      )}
                      {v.tag === 'partner' && <span className="vt2-partner-tag">PARTNER</span>}
                    </div>

                    {v.alerts.length > 0 && (
                      <div className="vt2-vcard-alertstrip">
                        {v.alerts.map((a, i) => (
                          <span key={i} className={`vt2-astrip ${v.status === 'at-risk' ? 'crit' : 'warn'}`}>{a}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Vehicle Detail Drawer ───────────────────────────────────
function VehicleDetail({ v, onClose }) {
  const st  = ST[v.status];
  const pos = getPos(v);
  return (
    <div className="vt2-detail" style={{'--dc': st.color}}>
      <div className="vt2-detail-hd">
        <div className="vt2-detail-left">
          <span className="vt2-detail-vicon">{V_ICON[v.type]}</span>
          <div>
            <div className="vt2-detail-reg">{v.reg}</div>
            <div className="vt2-detail-sub">{v.type} · {v.tag === 'partner' ? 'Partner Vehicle' : 'Own Fleet'}</div>
          </div>
        </div>
        <span className="vt2-status-pill lg" style={{background:st.bg, color:st.color}}>{st.label}</span>
        <button className="vt2-close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="vt2-detail-grid">
        <Cell label="Driver"    val={`👤 ${v.driver}`}/>
        {v.phone   && <Cell label="Phone"     val={`📞 ${v.phone}`}/>}
        <Cell label="Speed"     val={v.speed > 0 ? `💨 ${v.speed} km/h` : '— Stationary'} hi={v.speed>0}/>
        <Cell label="Fuel"
          val={`⛽ ${v.fuel}%`}
          color={v.fuel < 35 ? '#ef4444' : v.fuel < 55 ? '#f59e0b' : '#22c55e'}
        />
        <Cell label="Latitude"  val={`${pos.lat.toFixed(4)}°N`} mono/>
        <Cell label="Longitude" val={`${pos.lng.toFixed(4)}°E`} mono/>
        {v.booking && <Cell label="Booking ID" val={v.booking} color="#FF6B35" mono/>}
        {v.customer && <Cell label="Customer"  val={v.customer}/>}
        {v.eta     && <Cell label="ETA"        val={`🕐 ${v.eta}`}/>}
        {v.delay > 0 && (
          <Cell label="Delay" color="#ef4444"
            val={`⚠ ${v.delay >= 60 ? `${Math.floor(v.delay/60)}h ${v.delay%60}m late` : `${v.delay} min late`}`}
          />
        )}
        {v.cargo   && <Cell label="Cargo"      val={`📦 ${v.cargo}`} full/>}
        {v.route   && <Cell label="Route"      val={`📍 ${v.route}`} full/>}
        {v.progress !== null && (
          <div className="vt2-dc-full">
            <div className="vt2-dc-label">Journey Progress — {Math.round(v.progress*100)}%</div>
            <div className="vt2-pbar-bg lg">
              <div className="vt2-pbar-fill" style={{width:`${v.progress*100}%`,background:st.color,transition:'width 1s ease'}}/>
            </div>
          </div>
        )}
      </div>

      {v.alerts.length > 0 && (
        <div className="vt2-detail-alerts">
          {v.alerts.map((a,i) => (
            <div key={i} className={`vt2-detail-alert-row ${v.status === 'at-risk' ? 'crit' : 'warn'}`}>
              <span>{v.status === 'at-risk' ? '🔴' : '🟡'}</span>
              <span>{a}</span>
            </div>
          ))}
        </div>
      )}

      <div className="vt2-detail-footer">
        <span>🔄 Updated at {new Date().toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit',second:'2-digit'})}</span>
        {v.booking && <span className="vt2-detail-contact-btn">📞 Call Driver</span>}
      </div>
    </div>
  );
}

function Cell({ label, val, color, mono, full }) {
  return (
    <div className={`vt2-dc-cell ${full ? 'full' : ''}`}>
      <span className="vt2-dc-label">{label}</span>
      <span className="vt2-dc-val" style={{ color: color || undefined, fontFamily: mono ? 'monospace' : undefined }}>
        {val}
      </span>
    </div>
  );
}
