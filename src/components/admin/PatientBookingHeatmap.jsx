import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { 
  FaFire, 
  FaLayerGroup, 
  FaHospital, 
  FaFilter, 
  FaUsers, 
  FaExclamationTriangle, 
  FaChartLine, 
  FaMapMarkerAlt, 
  FaInfoCircle,
  FaShieldAlt,
  FaCheckCircle,
  FaDownload
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Tirunelveli District Geographic Booking Density Data
const TIRUNELVELI_AREA_HOTSPOTS = [
  {
    id: 'area_1',
    name: 'Palayamkottai (High Grounds)',
    ward: 'Ward 34 - Apex Medical Belt',
    pincode: '627002',
    lat: 8.7275,
    lng: 77.7340,
    patientCount: 164,
    level: 'critical', // critical (red), high (orange), moderate (yellow), normal (green)
    topComplaint: 'Acute Viral Fever & Respiratory',
    topHospital: 'TVMCH High Grounds (Govt)',
    ambulanceCalls: 12,
    trendPercent: '+34% from yesterday',
    recommendedAction: 'Deploy +2 OPD triage doctors at TVMCH Block A'
  },
  {
    id: 'area_2',
    name: 'Vannarpettai',
    ward: 'Ward 18 - Central Commercial Belt',
    pincode: '627003',
    lat: 8.7340,
    lng: 77.7050,
    patientCount: 128,
    level: 'high',
    topComplaint: 'Ophthalmology & Orthopedics',
    topHospital: 'Shifa Hospital & Aravind Eye',
    ambulanceCalls: 7,
    trendPercent: '+18% weekly average',
    recommendedAction: 'Maintain stock of eye drops & general trauma kits'
  },
  {
    id: 'area_3',
    name: 'Tirunelveli Junction',
    ward: 'Ward 22 - Transit Zone',
    pincode: '627001',
    lat: 8.7289,
    lng: 77.6920,
    patientCount: 98,
    level: 'high',
    topComplaint: 'General Medicine & Gastro',
    topHospital: 'TVMCH & Galaxy Hospital',
    ambulanceCalls: 5,
    trendPercent: '+12% weekly average',
    recommendedAction: 'Keep mobile ambulance unit on standby at Junction'
  },
  {
    id: 'area_4',
    name: 'Melapalayam',
    ward: 'Ward 45 - Residential Zone',
    pincode: '627005',
    lat: 8.7180,
    lng: 77.7180,
    patientCount: 82,
    level: 'moderate',
    topComplaint: 'Maternal & Pediatric Care',
    topHospital: 'TVMCH MCH Block & Shifa',
    ambulanceCalls: 4,
    trendPercent: '+8% weekly average',
    recommendedAction: 'Ensure ante-natal clinic slots remain available'
  },
  {
    id: 'area_5',
    name: 'Tirunelveli Town (Nellai Town)',
    ward: 'Ward 12 - Heritage Zone',
    pincode: '627006',
    lat: 8.7325,
    lng: 77.6890,
    patientCount: 74,
    level: 'moderate',
    topComplaint: 'Elderly Hypertension & Diabetes',
    topHospital: 'TVMCH & Kauvery Hospital',
    ambulanceCalls: 3,
    trendPercent: '-2% normal baseline',
    recommendedAction: 'Routine OPD allocation sufficient'
  },
  {
    id: 'area_6',
    name: 'Perumalpuram',
    ward: 'Ward 41 - South Suburban',
    pincode: '627007',
    lat: 8.7050,
    lng: 77.7290,
    patientCount: 52,
    level: 'normal',
    topComplaint: 'General Health & Dental',
    topHospital: 'Rose Mary Hospital',
    ambulanceCalls: 2,
    trendPercent: 'Stable',
    recommendedAction: 'No immediate load alert'
  },
  {
    id: 'area_7',
    name: 'Pettai & Thachanallur',
    ward: 'Ward 08 - Industrial Suburbs',
    pincode: '627010',
    lat: 8.7480,
    lng: 77.6750,
    patientCount: 41,
    level: 'normal',
    topComplaint: 'Occupational Ortho & Dermatology',
    topHospital: 'TVMCH Govt OPD',
    ambulanceCalls: 1,
    trendPercent: 'Normal',
    recommendedAction: 'Industrial health monitoring active'
  },
  {
    id: 'area_8',
    name: 'Samathanapuram',
    ward: 'Ward 29 - West Colony',
    pincode: '627002',
    lat: 8.7190,
    lng: 77.7380,
    patientCount: 29,
    level: 'normal',
    topComplaint: 'Routine Seasonal Health',
    topHospital: 'Annai Velankanni Hospital',
    ambulanceCalls: 0,
    trendPercent: 'Normal',
    recommendedAction: 'Low load'
  }
];

const PatientBookingHeatmap = ({ height = '560px' }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const heatmapLayerRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [selectedArea, setSelectedArea] = useState(TIRUNELVELI_AREA_HOTSPOTS[0]);
  const [filterSyndrome, setFilterSyndrome] = useState('all');
  const [viewMode, setViewMode] = useState('heatmap'); // 'heatmap' or 'pins' or 'both'

  const totalPatients = useMemo(() => {
    return TIRUNELVELI_AREA_HOTSPOTS.reduce((sum, a) => sum + a.patientCount, 0);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [8.7289, 77.7120],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // Free OpenStreetMap Standard & Satellite layers (No API Key Required)
      const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      });

      const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: '&copy; Esri, Maxar, Earthstar Geographics'
      });

      streetLayer.addTo(map);

      // Layer switcher control (Street Map vs Satellite)
      L.control.layers({
        '🗺️ Street Map': streetLayer,
        '🛰️ Satellite': satelliteLayer
      }, null, { position: 'topright' }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      heatmapLayerRef.current = L.layerGroup().addTo(map);
      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Invalidate size after layout settles to guarantee complete tile coverage
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }

    return () => {};
  }, []);

  // Render Heatmap Circles & Pins
  useEffect(() => {
    const map = mapInstanceRef.current;
    const heatmapLayer = heatmapLayerRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !heatmapLayer || !markersLayer) return;

    heatmapLayer.clearLayers();
    markersLayer.clearLayers();

    TIRUNELVELI_AREA_HOTSPOTS.forEach((area) => {
      // Color based on patient volume
      let fillColor = '#10b981'; // Green
      let strokeColor = '#059669';
      let haloColor = 'rgba(16, 185, 129, 0.25)';

      if (area.patientCount >= 140) {
        fillColor = '#ef4444'; // Red (Severe)
        strokeColor = '#b91c1c';
        haloColor = 'rgba(239, 68, 68, 0.35)';
      } else if (area.patientCount >= 90) {
        fillColor = '#f97316'; // Orange (High)
        strokeColor = '#c2410c';
        haloColor = 'rgba(249, 115, 22, 0.3)';
      } else if (area.patientCount >= 60) {
        fillColor = '#eab308'; // Yellow (Moderate)
        strokeColor = '#a16207';
        haloColor = 'rgba(234, 179, 8, 0.25)';
      }

      const radiusMeters = 350 + (area.patientCount * 5.5);

      // 1. Heat Radial Gradient Glow (Blur halo)
      if (viewMode === 'heatmap' || viewMode === 'both') {
        // Outer halo
        L.circle([area.lat, area.lng], {
          radius: radiusMeters * 1.5,
          color: 'transparent',
          fillColor: haloColor,
          fillOpacity: 0.3,
          interactive: false
        }).addTo(heatmapLayer);

        // Core heat circle
        L.circle([area.lat, area.lng], {
          radius: radiusMeters,
          color: strokeColor,
          weight: 2,
          fillColor: fillColor,
          fillOpacity: 0.45,
          interactive: true
        })
          .on('click', () => {
            setSelectedArea(area);
            map.flyTo([area.lat, area.lng], 14, { duration: 0.8 });
          })
          .addTo(heatmapLayer);
      }

      // 2. Center Density Pin Badge
      if (viewMode === 'pins' || viewMode === 'both') {
        const pinIcon = L.divIcon({
          className: 'heatmap-pin',
          html: `
            <div style="
              background: ${fillColor};
              color: white;
              padding: 3px 8px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 900;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              border: 2px solid white;
              display: flex;
              align-items: center;
              gap: 4px;
              white-space: nowrap;
              cursor: pointer;
              transform: translate(-50%, -50%);
            ">
              <span>🔥</span>
              <span>${area.patientCount}</span>
            </div>
          `,
          iconSize: [60, 26],
          iconAnchor: [30, 13]
        });

        L.marker([area.lat, area.lng], { icon: pinIcon })
          .on('click', () => {
            setSelectedArea(area);
            map.flyTo([area.lat, area.lng], 14, { duration: 0.8 });
          })
          .addTo(markersLayer);
      }
    });
  }, [viewMode]);

  return (
    <div className="flex flex-col gap-5 w-full text-left">
      {/* 1. Admin KPI Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400">Peak Heatspot</span>
            <FaFire className="text-rose-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1">Palayamkottai</div>
          <div className="text-[11px] font-extrabold text-rose-600">164 Patients (Critical)</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs border-l-4 border-l-sky-500">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400">Total Bookings</span>
            <FaUsers className="text-sky-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1">{totalPatients} Tokens</div>
          <div className="text-[11px] font-bold text-slate-500">Monitored across 8 Wards</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400">Top Syndrome Surge</span>
            <FaExclamationTriangle className="text-amber-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1">Viral Fever (42%)</div>
          <div className="text-[11px] font-bold text-amber-600">Active Surveillance Alert</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400">Primary Hub</span>
            <FaHospital className="text-emerald-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1">TVMCH Apex OPD</div>
          <div className="text-[11px] font-bold text-emerald-600">62% of District Referrals</div>
        </div>
      </div>

      {/* 2. Heatmap Controls Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <FaLayerGroup className="text-sky-600" />
            <span>Heatmap Layer Mode:</span>
          </span>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('heatmap')}
              className={`px-3 py-1 rounded-lg font-bold transition-all text-xs cursor-pointer ${
                viewMode === 'heatmap' ? 'bg-white dark:bg-slate-700 text-sky-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              🔥 Heat Density
            </button>
            <button
              type="button"
              onClick={() => setViewMode('pins')}
              className={`px-3 py-1 rounded-lg font-bold transition-all text-xs cursor-pointer ${
                viewMode === 'pins' ? 'bg-white dark:bg-slate-700 text-sky-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              📍 Ward Numbers
            </button>
            <button
              type="button"
              onClick={() => setViewMode('both')}
              className={`px-3 py-1 rounded-lg font-bold transition-all text-xs cursor-pointer ${
                viewMode === 'both' ? 'bg-white dark:bg-slate-700 text-sky-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              Both Combined
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> 140+ (Critical)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 80-139 (High)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> &lt;80 (Normal)
          </span>
        </div>
      </div>

      {/* 3. Map Viewport + Active Zone Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Map Viewport (2 Columns) */}
        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
          <div ref={mapContainerRef} style={{ height }} className="w-full z-0" />

          {/* Floating instructions badge */}
          <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-sm pointer-events-none">
            💡 Click any colored heat circle to inspect neighborhood ward analytics
          </div>
        </div>

        {/* Selected Area Intelligence Inspector Card (1 Column) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Area Epidemiological Inspector
              </span>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                selectedArea.level === 'critical' ? 'bg-rose-100 text-rose-700' :
                selectedArea.level === 'high' ? 'bg-amber-100 text-amber-700' :
                selectedArea.level === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>
                {selectedArea.level.toUpperCase()} LOAD
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{selectedArea.name}</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {selectedArea.ward} · PIN: {selectedArea.pincode}
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 font-bold block">Patient Bookings Today</span>
                <span className="text-2xl font-black text-rose-600 mt-0.5 block">{selectedArea.patientCount}</span>
                <span className="text-[10px] text-rose-500 font-semibold">{selectedArea.trendPercent}</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 font-bold block">Emergency 108 Dispatches</span>
                <span className="text-2xl font-black text-amber-500 mt-0.5 block">{selectedArea.ambulanceCalls} Calls</span>
                <span className="text-[10px] text-slate-500 font-semibold">Priority 1 Casualty</span>
              </div>
            </div>

            {/* Detailed Analytics Rows */}
            <div className="mt-4 space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Dominant Diagnosis / Concern:</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  🩺 {selectedArea.topComplaint}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Primary Hospital Referral Flow:</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  🏥 {selectedArea.topHospital}
                </span>
              </div>

              <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded-xl">
                <span className="text-sky-700 dark:text-sky-300 font-bold block text-[10px] uppercase">Recommended Administrative Action:</span>
                <span className="font-extrabold text-sky-900 dark:text-sky-200 mt-0.5 block">
                  ⚡ {selectedArea.recommendedAction}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
            <button
              type="button"
              onClick={() => toast.success(`Ward report for ${selectedArea.name} generated & sent to District Collectorate!`)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-950 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-98"
            >
              <FaDownload size={11} />
              <span>Export Ward Health Intelligence PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientBookingHeatmap;
