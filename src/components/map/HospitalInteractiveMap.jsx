import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '../../context/LocationContext';
import { useLanguage } from '../../context/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import toast from 'react-hot-toast';
import { 
  FaHospital, 
  FaMapMarkerAlt, 
  FaDirections, 
  FaTicketAlt, 
  FaStar, 
  FaClock, 
  FaBed, 
  FaCrosshairs, 
  FaExpand, 
  FaBuilding, 
  FaLandmark,
  FaAmbulance,
  FaPhoneAlt,
  FaRoute
} from 'react-icons/fa';

const HospitalInteractiveMap = ({ 
  hospitals = [], 
  selectedHospitalId = null,
  onHospitalSelect = null,
  height = '560px',
  autoFocusEmergency = false 
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const radiusCircleRef = useRef(null);
  const userMarkerRef = useRef(null);
  const emergencyLayerRef = useRef(null);

  const navigate = useNavigate();
  const { coords, isLiveGPS, radiusFilter, getDistanceTo, getETATo, openNavigation, detectLiveLocation } = useLocation();
  const { isTamil } = useLanguage();
  const { updateBookingData } = useBooking();

  const [activeHospital, setActiveHospital] = useState(null);
  const [emergencyRoute, setEmergencyRoute] = useState(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check if map already initialized
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [coords.lat, coords.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // OpenStreetMap Tiles (Fast, standard, completely free)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Custom Zoom Control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Cleanup on unmount
    return () => {
      // Don't fully destroy unless container changes to prevent reload flicker
    };
  }, []);

  // Update user marker & radius circle when coords or radiusFilter changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing user marker
    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
    }
    // Remove existing radius circle
    if (radiusCircleRef.current) {
      map.removeLayer(radiusCircleRef.current);
    }

    // Custom User GPS Pin (Blue radar beacon)
    const userIcon = L.divIcon({
      className: 'custom-user-pin',
      html: `
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 32px; height: 32px; background: rgba(14, 165, 233, 0.35); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 18px; height: 18px; background: #0284c7; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 4px 10px rgba(2, 132, 199, 0.6); z-index: 2;"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    userMarkerRef.current = L.marker([coords.lat, coords.lng], { icon: userIcon, zIndexOffset: 1000 })
      .addTo(map)
      .bindPopup(`
        <div style="padding: 10px 14px; text-align: center; font-family: inherit;">
          <div style="font-weight: 800; font-size: 13px; color: #0284c7;">📍 ${isLiveGPS ? 'Your Live Location' : 'Selected Location'}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">lat: ${coords.lat}, lng: ${coords.lng}</div>
        </div>
      `);

    // Radius Circle if active
    if (radiusFilter && radiusFilter !== 'all') {
      const radiusMeters = Number(radiusFilter) * 1000;
      radiusCircleRef.current = L.circle([coords.lat, coords.lng], {
        radius: radiusMeters,
        color: '#0284c7',
        weight: 2,
        dashArray: '6, 8',
        fillColor: '#38bdf8',
        fillOpacity: 0.1
      }).addTo(map);
    }
  }, [coords, isLiveGPS, radiusFilter]);

  // Update Hospital Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    const bounds = L.latLngBounds([[coords.lat, coords.lng]]);

    hospitals.forEach((hosp) => {
      if (!hosp.location || !hosp.location.lat || !hosp.location.lng) return;

      const isGovt = hosp.type === 'Government';
      const distance = getDistanceTo(hosp.location.lat, hosp.location.lng);
      const eta = getETATo(hosp.location.lat, hosp.location.lng);
      const waitTime = hosp.currentWaitTime || (isGovt ? 14 : 12);
      
      // Pin styling based on hospital type
      const pinBg = isGovt ? '#059669' : '#4f46e5';
      const pinSymbol = isGovt ? '🏛️' : '🏥';
      const crowdBadgeColor = waitTime <= 10 ? '#10b981' : waitTime <= 25 ? '#f59e0b' : '#ef4444';

      const customPinHtml = `
        <div style="position: relative; cursor: pointer; transition: transform 0.2s;" class="hospital-marker-pin" id="pin-${hosp.id}">
          <div style="
            background: ${pinBg};
            color: white;
            border: 2px solid white;
            border-radius: 14px;
            padding: 4px 8px;
            font-size: 11px;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            white-space: nowrap;
          ">
            <span>${pinSymbol}</span>
            <span style="max-width: 100px; overflow: hidden; text-overflow: ellipsis;">${hosp.name.split(' ')[0]}</span>
            <span style="
              width: 8px; 
              height: 8px; 
              border-radius: 50%; 
              background: ${crowdBadgeColor};
              border: 1px solid white;
            "></span>
          </div>
          <div style="
            width: 0; 
            height: 0; 
            border-left: 6px solid transparent; 
            border-right: 6px solid transparent; 
            border-top: 7px solid ${pinBg}; 
            margin: -1px auto 0;
          "></div>
        </div>
      `;

      const hospitalIcon = L.divIcon({
        className: 'custom-hosp-pin',
        html: customPinHtml,
        iconSize: [120, 36],
        iconAnchor: [60, 36],
        popupAnchor: [0, -36]
      });

      const marker = L.marker([hosp.location.lat, hosp.location.lng], { icon: hospitalIcon });

      // Create Custom Interactive Popup
      const popupContent = document.createElement('div');
      popupContent.style.width = '280px';
      popupContent.style.fontFamily = 'inherit';
      popupContent.innerHTML = `
        <div style="overflow: hidden; border-radius: 16px;">
          <div style="position: relative; height: 105px; width: 100%; background: #0f172a;">
            <img src="${hosp.image || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80'}" 
                 style="width: 100%; height: 100%; object-fit: cover; opacity: 0.85;" 
                 alt="${hosp.name}" 
                 onerror="this.src='https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80'" />
            <div style="position: absolute; top: 8px; left: 8px; background: ${isGovt ? '#059669' : '#4f46e5'}; color: white; font-size: 9px; font-weight: 800; padding: 2px 7px; border-radius: 8px;">
              ${isGovt ? '🏛️ GOVT OPD (FREE)' : '🏢 PRIVATE'}
            </div>
            <div style="position: absolute; bottom: 8px; left: 8px; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); color: #fde047; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px;">
              ★ ${hosp.rating}
            </div>
          </div>
          
          <div style="padding: 12px 14px;">
            <div style="font-weight: 800; font-size: 13px; color: #0f172a; line-height: 1.3;">
              ${hosp.name}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
              ${hosp.area} • <strong style="color: #0284c7;">${distance} km away</strong> (~${eta})
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin: 10px 0; background: #f8fafc; padding: 8px; border-radius: 10px; font-size: 10px; font-weight: 700;">
              <div>
                <span style="color: #94a3b8; display: block; font-size: 9px; text-transform: uppercase;">Live Wait</span>
                <span style="color: #d97706;">~${waitTime} mins</span>
              </div>
              <div>
                <span style="color: #94a3b8; display: block; font-size: 9px; text-transform: uppercase;">ICU Beds</span>
                <span style="color: #0284c7;">${hosp.icuBedsAvailable || 0} vacant</span>
              </div>
            </div>

            <div style="display: flex; gap: 8px; margin-top: 10px;">
              <button id="nav-btn-${hosp.id}" style="
                flex: 1;
                padding: 7px 10px;
                background: #f1f5f9;
                color: #0f172a;
                border: 1px solid #cbd5e1;
                border-radius: 10px;
                font-size: 11px;
                font-weight: 800;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
              ">
                🧭 Directions
              </button>
              
              <button id="book-btn-${hosp.id}" style="
                flex: 1.3;
                padding: 7px 10px;
                background: #0284c7;
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 11px;
                font-weight: 800;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
              ">
                🎟️ Book Token
              </button>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 300, minWidth: 280 });

      // Handle popup button clicks
      marker.on('popupopen', () => {
        setActiveHospital(hosp);
        if (onHospitalSelect) onHospitalSelect(hosp);

        const navBtn = document.getElementById(`nav-btn-${hosp.id}`);
        const bookBtn = document.getElementById(`book-btn-${hosp.id}`);

        if (navBtn) {
          navBtn.onclick = (e) => {
            e.stopPropagation();
            openNavigation(hosp.location.lat, hosp.location.lng);
          };
        }

        if (bookBtn) {
          bookBtn.onclick = (e) => {
            e.stopPropagation();
            updateBookingData({
              hospitalId: hosp.id,
              hospitalName: hosp.name,
              hospitalAddress: hosp.address,
              consultationFee: hosp.consultationFee
            });
            navigate(`/book?hospitalId=${hosp.id}`);
          };
        }
      });

      marker.addTo(markersLayer);
      bounds.extend([hosp.location.lat, hosp.location.lng]);
    });

    // Auto-fit if multiple markers exist
    if (hospitals.length > 0 && !selectedHospitalId) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [hospitals, coords]);

  // Recenter map on user location
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([coords.lat, coords.lng], 14, { duration: 1 });
    }
  };

  // Fit all hospitals into view
  const handleFitAll = () => {
    if (mapInstanceRef.current && hospitals.length > 0) {
      const bounds = L.latLngBounds([[coords.lat, coords.lng]]);
      hospitals.forEach((h) => {
        if (h.location?.lat && h.location?.lng) {
          bounds.extend([h.location.lat, h.location.lng]);
        }
      });
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  };

  // 1-Click Nearest Emergency Hospital & Route Engine
  const triggerNearestEmergencyRoute = () => {
    const map = mapInstanceRef.current;
    if (!map || hospitals.length === 0) return;

    // Filter emergency-ready hospitals first (or TVMCH Government trauma Apex)
    const emergencyCandidates = hospitals.filter(h => h.emergencyAvailable || h.type === 'Government');
    const pool = emergencyCandidates.length > 0 ? emergencyCandidates : hospitals;

    let nearestHosp = null;
    let minDistance = Infinity;

    pool.forEach(h => {
      if (h.location?.lat && h.location?.lng) {
        const dist = getDistanceTo(h.location.lat, h.location.lng);
        if (dist < minDistance) {
          minDistance = dist;
          nearestHosp = h;
        }
      }
    });

    if (!nearestHosp) return;

    const eta = getETATo(nearestHosp.location.lat, nearestHosp.location.lng);

    // Clean prior route layer
    if (emergencyLayerRef.current) {
      map.removeLayer(emergencyLayerRef.current);
    }

    const emergencyGroup = L.layerGroup();
    const userLatLng = [coords.lat, coords.lng];
    const hospLatLng = [nearestHosp.location.lat, nearestHosp.location.lng];

    // 1. Soft red glow outer route line
    const glowLine = L.polyline([userLatLng, hospLatLng], {
      color: '#f87171',
      weight: 9,
      opacity: 0.45,
      lineCap: 'round',
      lineJoin: 'round'
    });

    // 2. Bold animated dashed emergency route polyline
    const dashedLine = L.polyline([userLatLng, hospLatLng], {
      color: '#dc2626',
      weight: 4,
      dashArray: '10, 10',
      opacity: 0.95,
      lineCap: 'round'
    });

    // 3. Midpoint Distance & ETA Pill Badge
    const midLat = (coords.lat + nearestHosp.location.lat) / 2;
    const midLng = (coords.lng + nearestHosp.location.lng) / 2;
    const distancePillIcon = L.divIcon({
      className: 'emergency-midpoint-pill',
      html: `
        <div style="
          background: #dc2626;
          color: white;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 900;
          box-shadow: 0 4px 14px rgba(220, 38, 38, 0.6);
          white-space: nowrap;
          border: 2px solid white;
          display: flex;
          align-items: center;
          gap: 6px;
        ">
          <span style="font-size: 12px;">🚨 ${minDistance} km</span>
          <span style="opacity: 0.6;">|</span>
          <span>~${eta}</span>
        </div>
      `,
      iconSize: [110, 26],
      iconAnchor: [55, 13]
    });

    const midMarker = L.marker([midLat, midLng], { icon: distancePillIcon, zIndexOffset: 2500 });

    emergencyGroup.addLayer(glowLine);
    emergencyGroup.addLayer(dashedLine);
    emergencyGroup.addLayer(midMarker);
    emergencyGroup.addTo(map);

    emergencyLayerRef.current = emergencyGroup;

    // 4. Auto-fit bounds to cleanly zoom to both user and nearest hospital
    const routeBounds = L.latLngBounds([userLatLng, hospLatLng]);
    map.fitBounds(routeBounds, { 
      padding: [80, 80], 
      maxZoom: 15,
      animate: true,
      duration: 1.2
    });

    setEmergencyRoute({
      hospital: nearestHosp,
      distance: minDistance,
      eta
    });

    toast.error(
      isTamil 
        ? `🚨 மிக அருகிலுள்ள அவசர பிரிவு: ${nearestHosp.name} (${minDistance} km)! வரைபடத்தில் பாதை காட்டப்பட்டுள்ளது.` 
        : `🚨 Nearest Emergency Casualty: ${nearestHosp.name} (${minDistance} km). Auto-zoomed with route line!`,
      { duration: 4500 }
    );
  };

  const clearEmergencyRoute = () => {
    const map = mapInstanceRef.current;
    if (emergencyLayerRef.current && map) {
      map.removeLayer(emergencyLayerRef.current);
      emergencyLayerRef.current = null;
    }
    setEmergencyRoute(null);
    handleFitAll();
  };

  // Auto-focus emergency route if prop is set
  useEffect(() => {
    if (autoFocusEmergency && hospitals.length > 0) {
      const timer = setTimeout(() => {
        triggerNearestEmergencyRoute();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [autoFocusEmergency, hospitals.length, coords.lat, coords.lng]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        style={{ height }} 
        className="w-full z-10"
      />

      {/* Map Header Floating Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none flex flex-wrap items-center justify-between gap-2">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200 shadow-md flex items-center gap-2 text-xs font-black text-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{hospitals.length} {isTamil ? 'மருத்துவமனைகள் வரைபடத்தில்' : 'Hospitals Shown'}</span>
        </div>

        {/* Action Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* 1-Click Emergency Route Button */}
          <button
            type="button"
            onClick={triggerNearestEmergencyRoute}
            className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-2xl border border-red-300 shadow-lg shadow-rose-900/20 backdrop-blur-md transition-all cursor-pointer flex items-center gap-2 text-xs font-black animate-pulse active:scale-95"
            title="1-Click Nearest Emergency Hospital & Route"
          >
            <FaAmbulance className="text-amber-300 text-sm" />
            <span>{isTamil ? '🚨 அவசர மருத்துவமனை & பாதை' : '🚨 1-Click Nearest Emergency'}</span>
          </button>

          <button
            type="button"
            onClick={handleRecenter}
            className="p-2.5 bg-white/90 hover:bg-white text-sky-700 hover:text-sky-900 rounded-2xl border border-slate-200 shadow-md backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black"
            title="Recenter on My Location"
          >
            <FaCrosshairs />
            <span className="hidden sm:inline">My Location</span>
          </button>

          <button
            type="button"
            onClick={handleFitAll}
            className="p-2.5 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 rounded-2xl border border-slate-200 shadow-md backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black"
            title="Fit all hospitals in view"
          >
            <FaExpand />
            <span className="hidden sm:inline">Fit All</span>
          </button>
        </div>
      </div>

      {/* Floating Emergency Route Active HUD Guidance Card */}
      {emergencyRoute && (
        <div className="absolute top-16 sm:top-auto sm:bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-30 pointer-events-auto bg-slate-900/95 text-white backdrop-blur-xl p-4 sm:p-5 rounded-3xl border-2 border-red-500 shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-red-400">
                {isTamil ? 'மிக அருகிலுள்ள அவசர பிரிவு வழித்தடம்' : 'Nearest Emergency Casualty Route'}
              </span>
            </div>
            <button
              onClick={clearEmergencyRoute}
              className="text-slate-400 hover:text-white text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          <div className="mt-2.5">
            <h4 className="text-sm sm:text-base font-black text-white leading-tight">
              {emergencyRoute.hospital.name}
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-1">
              <span className="text-amber-400 font-black">📍 {emergencyRoute.distance} km away</span>
              <span>•</span>
              <span className="text-emerald-400 font-black">⚡ ETA ~{emergencyRoute.eta}</span>
              <span>•</span>
              <span className="text-rose-300 font-bold">ICU: {emergencyRoute.hospital.icuBedsAvailable || 14} Vacant</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
              {emergencyRoute.hospital.address}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3.5">
            <a
              href="tel:108"
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black shadow-md no-underline cursor-pointer"
            >
              <FaPhoneAlt size={11} /> 108 Ambulance
            </a>
            <button
              onClick={() => openNavigation(emergencyRoute.hospital.location.lat, emergencyRoute.hospital.location.lng)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-black shadow-md cursor-pointer"
            >
              <FaDirections size={12} className="text-sky-600" /> GPS Navigation
            </button>
          </div>
        </div>
      )}

      {/* Map Footer Legend Floating Overlay */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:flex items-center gap-2">
        <div className="pointer-events-auto bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md text-[10px] font-extrabold text-slate-700 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>Govt OPD</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <span>Private</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping"></span>
            <span>You</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalInteractiveMap;
