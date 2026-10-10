import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useLocation } from '../../context/LocationContext';
import { useLanguage } from '../../context/LanguageContext';
import { FaTint, FaMapMarkerAlt, FaPhoneAlt, FaDirections, FaCrosshairs, FaClock } from 'react-icons/fa';

const BloodBankMap = ({ bloodBanks = [], height = '480px' }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const radiusCircleRef = useRef(null);
  const userMarkerRef = useRef(null);

  const { coords, isLiveGPS, radiusFilter, getDistanceTo, getETATo, openNavigation } = useLocation();
  const { isTamil } = useLanguage();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [coords.lat, coords.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }
  }, []);

  // User Marker & Radius
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);
    if (radiusCircleRef.current) map.removeLayer(radiusCircleRef.current);

    const userIcon = L.divIcon({
      className: 'custom-user-pin',
      html: `
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 32px; height: 32px; background: rgba(225, 29, 72, 0.25); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 18px; height: 18px; background: #e11d48; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 4px 10px rgba(225, 29, 72, 0.6); z-index: 2;"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    userMarkerRef.current = L.marker([coords.lat, coords.lng], { icon: userIcon, zIndexOffset: 1000 })
      .addTo(map)
      .bindPopup(`
        <div style="padding: 10px 14px; text-align: center;">
          <div style="font-weight: 800; font-size: 13px; color: #e11d48;">📍 ${isLiveGPS ? 'Your Live Location' : 'Selected Location'}</div>
        </div>
      `);

    if (radiusFilter && radiusFilter !== 'all') {
      const radiusMeters = Number(radiusFilter) * 1000;
      radiusCircleRef.current = L.circle([coords.lat, coords.lng], {
        radius: radiusMeters,
        color: '#e11d48',
        weight: 2,
        dashArray: '6, 8',
        fillColor: '#f43f5e',
        fillOpacity: 0.1
      }).addTo(map);
    }
  }, [coords, isLiveGPS, radiusFilter]);

  // Blood Bank Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();
    const bounds = L.latLngBounds([[coords.lat, coords.lng]]);

    bloodBanks.forEach((bank) => {
      if (!bank.location?.lat || !bank.location?.lng) return;

      const distance = getDistanceTo(bank.location.lat, bank.location.lng);
      const eta = getETATo(bank.location.lat, bank.location.lng);
      const totalUnits = Object.values(bank.stock || {}).reduce((a, b) => a + b, 0);

      const customPinHtml = `
        <div style="position: relative; cursor: pointer;" class="bloodbank-marker-pin">
          <div style="
            background: linear-gradient(135deg, #e11d48, #be123c);
            color: white;
            border: 2px solid white;
            border-radius: 14px;
            padding: 4px 8px;
            font-size: 11px;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 5px;
            box-shadow: 0 4px 14px rgba(225, 29, 72, 0.4);
            white-space: nowrap;
          ">
            <span>🩸</span>
            <span style="max-width: 90px; overflow: hidden; text-overflow: ellipsis;">${bank.name.split(' ')[0]}</span>
            <span style="background: white; color: #be123c; padding: 1px 5px; border-radius: 8px; font-size: 10px;">${totalUnits}u</span>
          </div>
          <div style="
            width: 0; 
            height: 0; 
            border-left: 6px solid transparent; 
            border-right: 6px solid transparent; 
            border-top: 7px solid #be123c; 
            margin: -1px auto 0;
          "></div>
        </div>
      `;

      const icon = L.divIcon({
        className: 'custom-bb-pin',
        html: customPinHtml,
        iconSize: [120, 36],
        iconAnchor: [60, 36],
        popupAnchor: [0, -36]
      });

      const marker = L.marker([bank.location.lat, bank.location.lng], { icon });

      const popupContent = document.createElement('div');
      popupContent.style.width = '270px';
      popupContent.style.fontFamily = 'inherit';
      popupContent.innerHTML = `
        <div style="padding: 14px; text-align: left;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
            <span style="background: #ffe4e6; color: #e11d48; font-weight: 800; font-size: 9px; padding: 2px 7px; border-radius: 8px;">
              ${bank.type}
            </span>
            <span style="font-size: 11px; font-weight: 700; color: #059669;">● 24/7 Available</span>
          </div>

          <div style="font-weight: 800; font-size: 13px; color: #0f172a; line-height: 1.3;">
            ${bank.name}
          </div>

          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">
            📍 <strong style="color: #e11d48;">${distance} km away</strong> (${eta})
          </div>

          <div style="font-size: 11px; color: #334155; margin-top: 4px;">
            ${bank.address}
          </div>

          <div style="margin: 10px 0; background: #fff1f2; border: 1px solid #fecdd3; padding: 8px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 11px; font-weight: 700; color: #be123c;">Total Units Online:</span>
            <span style="font-size: 14px; font-weight: 900; color: #9f1239;">${totalUnits} Units</span>
          </div>

          <div style="display: flex; gap: 8px; margin-top: 10px;">
            <a href="tel:${bank.phone}" style="
              flex: 1;
              padding: 7px 10px;
              background: #f1f5f9;
              color: #0f172a;
              border: 1px solid #cbd5e1;
              border-radius: 10px;
              font-size: 11px;
              font-weight: 800;
              text-decoration: none;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 4px;
            ">
              📞 Call Center
            </a>

            <button id="bb-nav-btn-${bank.id}" style="
              flex: 1.2;
              padding: 7px 10px;
              background: #e11d48;
              color: white;
              border: none;
              border-radius: 10px;
              font-size: 11px;
              font-weight: 800;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 4px;
            ">
              🧭 Directions
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 300, minWidth: 260 });

      marker.on('popupopen', () => {
        const navBtn = document.getElementById(`bb-nav-btn-${bank.id}`);
        if (navBtn) {
          navBtn.onclick = (e) => {
            e.stopPropagation();
            openNavigation(bank.location.lat, bank.location.lng);
          };
        }
      });

      marker.addTo(markersLayer);
      bounds.extend([bank.location.lat, bank.location.lng]);
    });

    if (bloodBanks.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [bloodBanks, coords]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([coords.lat, coords.lng], 14, { duration: 1 });
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-rose-200 shadow-md bg-slate-100">
      <div ref={mapContainerRef} style={{ height }} className="w-full z-10" />

      <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none flex items-center justify-between gap-2">
        <div className="pointer-events-auto bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-rose-200 shadow-md flex items-center gap-2 text-xs font-black text-rose-900">
          <FaTint className="text-rose-600 animate-pulse" />
          <span>{bloodBanks.length} {isTamil ? 'இரத்த வங்கிகள் வரைபடத்தில்' : 'Blood Banks on Map'}</span>
        </div>

        <button
          type="button"
          onClick={handleRecenter}
          className="pointer-events-auto p-2.5 bg-white/90 hover:bg-white text-rose-700 hover:text-rose-900 rounded-2xl border border-rose-200 shadow-md backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black"
        >
          <FaCrosshairs />
          <span className="hidden sm:inline">My Location</span>
        </button>
      </div>
    </div>
  );
};

export default BloodBankMap;
