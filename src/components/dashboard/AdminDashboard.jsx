import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import { useBooking } from '../../context/BookingContext';
import Card from '../common/Card';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import PatientBookingHeatmap from '../admin/PatientBookingHeatmap';
import { 
  FaHospital, 
  FaTicketAlt, 
  FaUsers, 
  FaCheckCircle, 
  FaClock, 
  FaBell, 
  FaAmbulance,
  FaSearch,
  FaShieldAlt,
  FaBed,
  FaUserMd,
  FaPhoneAlt,
  FaFire,
  FaMapMarkedAlt,
  FaVolumeUp,
  FaEye,
  FaTimes,
  FaFilter
} from 'react-icons/fa';
import { speakTokenAnnouncement, testHospitalAudio, playHospitalChime } from '../../utils/hospitalAudio';

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'heatmap' ? 'heatmap' : 'queue';
  const [activeTab, setActiveTab] = useState(initialTab);

  const { user } = useAuth();
  const { hospitals } = useHospital();
  const { 
    appointments, 
    updateAppointmentStatus,
    codeRedActive,
    codeRedDetails,
    triggerCodeRed,
    clearCodeRed
  } = useBooking();

  const [currentTokenNumber, setCurrentTokenNumber] = useState(12);
  const [selectedHospitalId, setSelectedHospitalId] = useState('h1');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const currentHospital = hospitals.find(h => h.id === selectedHospitalId) || hospitals[0];

  const handleCallNext = () => {
    const next = currentTokenNumber + 1;
    setCurrentTokenNumber(next);

    // Play Chime + Bilingual PA Announcement
    speakTokenAnnouncement({
      tokenNumber: next,
      room: 'OPD Room 102',
      doctorName: currentHospital?.doctorName || 'Dr. Sundararajan'
    });

    toast.success(`📢 Broadcasting: Token #${next} called to OPD room!`, { icon: '🔔' });
  };

  const handleDisptachAmbulance = () => {
    playHospitalChime();
    toast.success('Ambulance #108 Unit 4 dispatched to caller location!');
  };

  // Call specific patient with voice announcement and set status to serving
  const handleCallPatient = (item) => {
    if (updateAppointmentStatus) {
      updateAppointmentStatus(item.id, 'serving');
    }

    // Play Chime + Bilingual PA Announcement
    speakTokenAnnouncement({
      tokenNumber: item.tokenNumber,
      patientName: item.patientName,
      doctorName: item.doctorName,
      room: item.room || 'Room 102'
    });

    toast.success(`📢 Token #${item.tokenNumber} (${item.patientName}) called to ${item.room || 'Doctor Room'}!`, {
      icon: '🔔',
      duration: 4000
    });
  };

  // Mark patient as consultation completed
  const handleMarkComplete = (item) => {
    if (updateAppointmentStatus) {
      updateAppointmentStatus(item.id, 'completed');
    }
    toast.success(`✅ Token #${item.tokenNumber} (${item.patientName}) consultation completed!`, {
      icon: '🎉'
    });
  };

  // Update status directly from dropdown
  const handleUpdateStatus = (id, newStatus) => {
    if (updateAppointmentStatus) {
      updateAppointmentStatus(id, newStatus);
      toast.success(`Status updated to ${newStatus.toUpperCase()}`);
    }
  };

  // Deduplicate and normalize realistic statuses
  const uniqueAppointments = useMemo(() => {
    const seen = new Set();
    const result = [];
    for (const item of appointments) {
      const key = `${item.hospitalId || 'h1'}-${item.tokenNumber}-${item.patientName}`;
      if (!seen.has(key)) {
        seen.add(key);
        // Normalize status for realistic hospital OPD lifecycle if generic 'confirmed'
        let currentStatus = item.status || 'queued';
        if (currentStatus === 'confirmed') {
          if (item.tokenNumber === 1 || item.type === 'emergency') {
            currentStatus = 'serving';
          } else if (item.tokenNumber <= currentTokenNumber) {
            currentStatus = 'completed';
          } else if (item.tokenNumber === currentTokenNumber + 1) {
            currentStatus = 'waiting';
          } else {
            currentStatus = 'queued';
          }
        }
        result.push({ ...item, status: currentStatus });
      }
    }
    // Sort: Serving first, Waiting next, Queued, Completed, Cancelled
    return result.sort((a, b) => {
      const order = { serving: 1, waiting: 2, queued: 3, completed: 4, cancelled: 5 };
      const diff = (order[a.status] || 3) - (order[b.status] || 3);
      if (diff !== 0) return diff;
      return (Number(a.tokenNumber) || 0) - (Number(b.tokenNumber) || 0);
    });
  }, [appointments, currentTokenNumber]);

  // Exact token search & filters
  const filteredAppointments = useMemo(() => {
    return uniqueAppointments.filter(a => {
      // 1. Hospital Filter
      const matchHosp = selectedHospitalId === 'all' || 
        a.hospitalId === selectedHospitalId || 
        a.hospitalName?.toLowerCase().includes(selectedHospitalId);

      // 2. Department Filter
      const matchDept = departmentFilter === 'All' || a.department === departmentFilter;

      // 3. Status Filter
      const aStatus = String(a.status || 'queued').toLowerCase();
      const matchStatus = statusFilter === 'All' || 
        (statusFilter === 'serving' && (aStatus === 'serving' || aStatus === 'in_consultation')) ||
        (statusFilter === 'waiting' && (aStatus === 'waiting' || aStatus === 'waiting_outside')) ||
        (statusFilter === 'queued' && (aStatus === 'queued' || aStatus === 'in queue' || aStatus === 'confirmed')) ||
        (statusFilter === 'completed' && aStatus === 'completed') ||
        (statusFilter === 'cancelled' && aStatus === 'cancelled');

      // 4. Exact Token # Search vs Text Search
      if (!searchQuery.trim()) {
        return matchHosp && matchDept && matchStatus;
      }

      const rawQuery = searchQuery.trim().toLowerCase();
      // Strip '#', 'token', 'tkn', spaces
      const numMatch = rawQuery.replace(/^(token|tkn|#|\s)+/i, '').trim();
      const isNumeric = /^\d+$/.test(numMatch);

      let matchSearch = false;
      if (isNumeric) {
        // EXACT MATCH: If user searches "25", only Token #25 matches!
        matchSearch = String(a.tokenNumber) === numMatch || a.id?.toLowerCase() === rawQuery;
      } else {
        // Text keyword search across name, ID, doctor, dept, phone
        matchSearch = 
          a.patientName?.toLowerCase().includes(rawQuery) ||
          a.id?.toLowerCase().includes(rawQuery) ||
          a.doctorName?.toLowerCase().includes(rawQuery) ||
          a.department?.toLowerCase().includes(rawQuery) ||
          a.patientPhone?.includes(rawQuery);
      }

      return matchHosp && matchDept && matchStatus && matchSearch;
    });
  }, [uniqueAppointments, selectedHospitalId, departmentFilter, statusFilter, searchQuery]);

  // Helper for status badge rendering
  const renderStatusBadge = (status) => {
    const s = String(status || 'queued').toLowerCase();
    if (s === 'serving' || s === 'in_consultation') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
          <span>🟡 In Room</span>
        </span>
      );
    }
    if (s === 'waiting' || s === 'waiting_outside') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-sky-100 text-sky-800 border border-sky-300">
          <span>🔵 Next in Line</span>
        </span>
      );
    }
    if (s === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
          <span>🟢 Completed</span>
        </span>
      );
    }
    if (s === 'emergency') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
          <span>🔴 Emergency</span>
        </span>
      );
    }
    if (s === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-600 border border-slate-300">
          <span>⚪ Cancelled</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
        <span>🟣 In Queue</span>
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* 🚨 Code Red Emergency Active Strobe Banner */}
      {codeRedActive && (
        <div className="rounded-3xl bg-gradient-to-r from-red-900 via-rose-700 to-red-900 border-4 border-red-500 shadow-2xl p-4 sm:p-5 text-white animate-pulse flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white text-rose-700 flex items-center justify-center text-2xl font-black shadow-lg animate-bounce">
              <FaAmbulance />
            </div>
            <div>
              <div className="text-xs font-black tracking-widest uppercase text-yellow-300">
                🚨 CODE RED EMERGENCY PRIORITY TRIAGE ACTIVE
              </div>
              <div className="text-lg font-black text-white">
                Regular OPD Consultations Temporarily Suspended
              </div>
              <p className="text-xs text-rose-100">
                Reason: {codeRedDetails?.reason || 'Trauma & Cardiac Resuscitation'} · Assigned: {codeRedDetails?.doctor || 'Dr. Sundararajan'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={clearCodeRed}
            className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <FaCheckCircle />
            <span>Stand-Down / Code Green (Resume Queue)</span>
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-widest mb-1">
            <FaShieldAlt /> Tirunelveli District Public Health Admin Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">District OPD & Bed Triage Command</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Logged in as <strong>{user?.name || 'District Health Officer'}</strong> · Monitoring 10 Tirunelveli hospitals in real time
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/opd-display"
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs shadow-lg border border-slate-700 transition-all flex items-center gap-1.5"
            title="Open Waiting Hall Smart TV / Kiosk Display Mode"
          >
            <span>📺 Waiting Hall TV</span>
          </Link>

          {!codeRedActive ? (
            <button
              type="button"
              onClick={() => triggerCodeRed({ room: 'OPD Room 102', reason: 'Cardiac Arrest / Multiple Trauma Triage' })}
              className="px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="Trigger Code Red Trauma Override"
            >
              <span>🚨 Code Red</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={clearCodeRed}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>✅ Clear Code Red</span>
            </button>
          )}

          <button
            type="button"
            onClick={testHospitalAudio}
            className="px-3.5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Click to test Hospital Audio Chime and Voice Announcement"
          >
            <FaVolumeUp size={12} />
            <span>Voice Test (ஒலி சோதனை)</span>
          </button>

          <Button
            onClick={handleCallNext}
            size="md"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold border-none shadow-lg text-xs"
            icon={FaBell}
          >
            Broadcast Token #{currentTokenNumber + 1}
          </Button>

          <Button
            onClick={handleDisptachAmbulance}
            variant="danger"
            size="md"
            className="font-extrabold shadow-lg text-xs"
            icon={FaAmbulance}
          >
            108 Ambulance Unit
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="flex items-center gap-3.5 border-l-4 border-l-sky-500">
          <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-lg">
            <FaTicketAlt />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{appointments.length + 384}</div>
            <div className="text-[11px] text-slate-500 font-medium">Tokens Active Today</div>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5 border-l-4 border-l-amber-500">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-lg">
            <FaClock />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">Token #{currentTokenNumber}</div>
            <div className="text-[11px] text-slate-500 font-medium">Currently in TVMCH OPD</div>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5 border-l-4 border-l-emerald-500">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">
            <FaCheckCircle />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">312 Patients</div>
            <div className="text-[11px] text-slate-500 font-medium">Successfully Consulted</div>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5 border-l-4 border-l-rose-500">
          <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg">
            <FaBed />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">48 ICU Beds</div>
            <div className="text-[11px] text-slate-500 font-medium">Available District-wide</div>
          </div>
        </Card>
      </div>

      {/* Admin Intelligence Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('queue');
              setSearchParams({ tab: 'queue' });
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'queue'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FaTicketAlt />
            <span>Live Token Registry & OPD Triage ({filteredAppointments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('heatmap');
              setSearchParams({ tab: 'heatmap' });
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'heatmap'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
                : 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <FaFire className="text-amber-300 animate-pulse" />
            <span>🔥 Patient Booking Heatmap & Area Analytics</span>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
              NEW
            </span>
          </button>
        </div>

        <div className="text-xs font-bold text-slate-500 hidden md:flex items-center gap-2 pr-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>District Epidemiological & OPD Telemetry</span>
        </div>
      </div>

      {activeTab === 'heatmap' ? (
        <PatientBookingHeatmap />
      ) : (
        <>
          {/* Hospital & Department & Status Selector Filter */}
          <Card padding="p-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <FaFilter size={11} className="text-sky-600" /> Filter:
                </span>
                <select
                  value={selectedHospitalId}
                  onChange={(e) => setSelectedHospitalId(e.target.value)}
                  className="text-xs font-bold rounded-xl border border-slate-300 py-2 px-3 bg-white focus:ring-2 focus:ring-sky-500"
                >
                  <option value="all">All 10 Tirunelveli Hospitals</option>
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id}>{h.name} ({h.area})</option>
                  ))}
                </select>

                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="text-xs font-bold rounded-xl border border-slate-300 py-2 px-3 bg-white focus:ring-2 focus:ring-sky-500"
                >
                  <option value="All">All Departments</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                  <option value="Ophthalmology">Ophthalmology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Emergency Medicine">Emergency Medicine</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs font-bold rounded-xl border border-slate-300 py-2 px-3 bg-white focus:ring-2 focus:ring-sky-500"
                >
                  <option value="All">All Statuses (அனைத்து நிலைகள்)</option>
                  <option value="serving">🟡 In Room / Serving</option>
                  <option value="waiting">🔵 Waiting Outside</option>
                  <option value="queued">🟣 In Queue</option>
                  <option value="completed">🟢 Completed</option>
                  <option value="cancelled">⚪ Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 md:w-64">
                  <input
                    type="text"
                    placeholder="Search exact token # (e.g. 25, #1) or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-xs py-2 pl-8 pr-7 rounded-xl border border-slate-300 w-full focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                  <FaSearch className="absolute left-2.5 top-3 text-slate-400" size={12} />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      title="Clear search"
                    >
                      <FaTimes size={11} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {searchQuery && (
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">
                  Showing results matching: <strong className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">"{searchQuery}"</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[11px] font-bold text-sky-600 hover:underline cursor-pointer"
                >
                  Clear filter (Show all)
                </button>
              </div>
            )}
          </Card>

          {/* Live Queue Table */}
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Today's Token Registry</h2>
                <p className="text-xs text-slate-500">Live patient appointments and triage queues</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-success font-bold text-xs">
                  {filteredAppointments.length} Tokens Found
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase bg-slate-50">
                    <th className="p-3 w-16 text-center">Token #</th>
                    <th className="p-3">Patient</th>
                    <th className="p-3">Hospital & Dept</th>
                    <th className="p-3">Doctor</th>
                    <th className="p-3">Slot</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                        <div className="max-w-xs mx-auto space-y-2">
                          <p className="font-bold text-slate-600">No token found matching current search.</p>
                          {searchQuery && (
                            <button
                              type="button"
                              onClick={() => setSearchQuery('')}
                              className="px-3 py-1.5 rounded-xl bg-sky-100 text-sky-700 font-bold text-xs hover:bg-sky-200 cursor-pointer"
                            >
                              Reset Search
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 text-center">
                          <span className="font-mono font-black text-sky-700 bg-sky-100 px-2.5 py-1 rounded-xl text-xs inline-block shadow-2xs border border-sky-200">
                            #{item.tokenNumber}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{item.patientName}</div>
                          <div className="text-[10px] text-slate-500">{item.patientAge}y · {item.patientGender} · {item.patientPhone}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-800">{item.hospitalName}</div>
                          <div className="text-[10px] text-slate-500">{item.department}</div>
                        </td>
                        <td className="p-3 text-slate-700 font-medium">
                          {item.doctorName}
                        </td>
                        <td className="p-3 font-mono text-slate-600">
                          {item.timeSlot}
                        </td>
                        <td className="p-3">
                          {renderStatusBadge(item.status)}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center gap-1.5 justify-end flex-wrap">
                            {/* Call Patient Button */}
                            <button
                              type="button"
                              onClick={() => handleCallPatient(item)}
                              className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold shadow-2xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                              title="Call patient with audio announcement and set to Serving"
                            >
                              <FaVolumeUp size={11} />
                              <span>Call</span>
                            </button>

                            {/* Mark Complete Button */}
                            <button
                              type="button"
                              onClick={() => handleMarkComplete(item)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-2xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                              title="Mark patient consultation completed"
                            >
                              <FaCheckCircle size={11} />
                              <span>Done</span>
                            </button>

                            {/* View Live Pass / Tracker */}
                            <Link
                              to={`/track/${item.tokenNumber}`}
                              target="_blank"
                              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold border border-slate-300 flex items-center gap-1 transition-all cursor-pointer"
                              title="Open Live Token Tracker and Pass"
                            >
                              <FaEye size={11} />
                              <span>Pass</span>
                            </Link>

                            {/* Status Selector Dropdown */}
                            <select
                              value={item.status || 'queued'}
                              onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                              className="text-[10px] font-bold py-1 px-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 cursor-pointer focus:ring-1 focus:ring-sky-500"
                              title="Manually change patient status"
                            >
                              <option value="serving">🟡 Serving</option>
                              <option value="waiting">🔵 Waiting</option>
                              <option value="queued">🟣 Queued</option>
                              <option value="completed">🟢 Done</option>
                              <option value="cancelled">⚪ Cancel</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
