import React, { useState, useEffect, useMemo } from 'react';
import {
  UserRoundCheck,
  Stethoscope,
  Building2,
  CheckCircle2,
  XCircle,
  Search,
  Edit3,
  Check,
  X,
  Plus,
  MapPin,
  Clock,
  Ticket,
  Users,
  Volume2,
  IndianRupee,
  Filter,
  Star,
  Download,
  AlertCircle,
  Activity,
  DoorOpen
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { speakTokenAnnouncement } from '../../utils/hospitalAudio';
import toast from 'react-hot-toast';

const DEPARTMENTS = [
  'General Medicine',
  'Cardiology',
  'Pediatrics',
  'Obstetrics & Gynecology',
  'Orthopedics',
  'Dermatology',
  'Ophthalmology',
  'ENT',
  'Neurology',
  'Emergency Medicine'
];

const AdminDoctors = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('Tirunelveli');
  const [selectedHospital, setSelectedHospital] = useState('All');
  const [doctors, setDoctors] = useState(() => adminService.getDoctorsSync('Tirunelveli', 'All'));
  const [hospitals, setHospitals] = useState(() => adminService.getHospitalsSync('Tirunelveli'));
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [dutyFilter, setDutyFilter] = useState('All');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Modals
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDoctorForm, setNewDoctorForm] = useState({
    name: '',
    qualification: 'MBBS, MD',
    department: 'General Medicine',
    specialty: 'General Medicine',
    hospitalId: 'h1',
    hospitalName: 'Tirunelveli Government Medical College Hospital (TVMCH)',
    district: 'Tirunelveli',
    room: 'OPD Room 1',
    experience: '10 yrs',
    consultationFee: 0,
    todayTokensMax: 50,
    timing: '09:00 AM - 01:00 PM',
    availableToday: true,
    dutyStatus: 'On Duty'
  });

  const fetchData = async () => {
    try {
      const [docsData, hospsData] = await Promise.all([
        adminService.getDoctors(selectedDistrict, selectedHospital),
        adminService.getHospitals(selectedDistrict)
      ]);
      if (docsData && docsData.length > 0) setDoctors(docsData);
      if (hospsData && hospsData.length > 0) setHospitals(hospsData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load doctor roster');
    }
  };

  useEffect(() => {
    const syncDocs = adminService.getDoctorsSync(selectedDistrict, selectedHospital);
    const syncHosps = adminService.getHospitalsSync(selectedDistrict);
    if (syncDocs && syncDocs.length > 0) setDoctors(syncDocs);
    if (syncHosps && syncHosps.length > 0) setHospitals(syncHosps);
    fetchData();
  }, [selectedDistrict, selectedHospital]);

  // Handle Duty Toggle
  const handleToggleDuty = async (doc) => {
    const nextStatus = !doc.availableToday;
    const nextDutyStatus = nextStatus ? 'On Duty' : 'Off Duty';
    try {
      await adminService.updateDoctorStatus(doc.id, {
        availableToday: nextStatus,
        dutyStatus: nextDutyStatus
      });
      toast.success(`${doc.name} status updated to ${nextDutyStatus}`);
      await fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  // Call Next Patient for Doctor
  const handleCallNextPatient = async (doc) => {
    try {
      const res = await adminService.callDoctorNextToken(doc.id);
      if (res.success) {
        speakTokenAnnouncement({
          tokenNumber: res.calledToken,
          doctorName: doc.name,
          room: doc.room,
          hospitalName: doc.hospitalName
        });
        toast.success(`📢 Token #${res.calledToken} called for ${doc.name} in ${doc.room}!`, {
          icon: '🔔'
        });
        await fetchData();
      }
    } catch (err) {
      toast.error('Failed to call next token');
    }
  };

  // Start Edit
  const handleStartEdit = (doc) => {
    setEditingDoctor(doc);
    setEditForm({
      name: doc.name,
      room: doc.room || 'Room 1',
      consultationFee: doc.consultationFee ?? (doc.hospitalName?.includes('Government') ? 0 : 300),
      todayTokensMax: doc.todayTokensMax || 40,
      department: doc.department || doc.specialty || 'General Medicine',
      timing: doc.timing || '09:00 AM - 02:00 PM',
      dutyStatus: doc.dutyStatus || (doc.availableToday ? 'On Duty' : 'Off Duty')
    });
  };

  // Save Edit
  const handleSaveEdit = async () => {
    if (!editingDoctor) return;
    try {
      await adminService.updateDoctorStatus(editingDoctor.id, {
        room: editForm.room,
        consultationFee: Number(editForm.consultationFee),
        todayTokensMax: Number(editForm.todayTokensMax),
        department: editForm.department,
        specialty: editForm.department,
        timing: editForm.timing,
        dutyStatus: editForm.dutyStatus,
        availableToday: editForm.dutyStatus !== 'Off Duty'
      });
      toast.success(`Updated settings for ${editingDoctor.name}`);
      setEditingDoctor(null);
      await fetchData();
    } catch (err) {
      toast.error('Failed to update doctor');
    }
  };

  // Create Doctor
  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    if (!newDoctorForm.name.trim()) {
      toast.error('Doctor name is required');
      return;
    }
    try {
      const matchingHosp = hospitals.find(h => h.id === newDoctorForm.hospitalId);
      const isGovt = matchingHosp?.type === 'Government';

      await adminService.addDoctor({
        ...newDoctorForm,
        hospitalName: matchingHosp?.name || newDoctorForm.hospitalName,
        consultationFee: isGovt ? 0 : Number(newDoctorForm.consultationFee),
        specialty: newDoctorForm.department,
        tokensIssued: 1,
        waitingCount: 1
      });
      toast.success(`Registered ${newDoctorForm.name} to hospital roster!`);
      setShowAddModal(false);
      setNewDoctorForm({
        name: '',
        qualification: 'MBBS, MD',
        department: 'General Medicine',
        specialty: 'General Medicine',
        hospitalId: 'h1',
        hospitalName: 'Tirunelveli Government Medical College Hospital (TVMCH)',
        district: selectedDistrict,
        room: 'OPD Room 1',
        experience: '10 yrs',
        consultationFee: 0,
        todayTokensMax: 50,
        timing: '09:00 AM - 01:00 PM',
        availableToday: true,
        dutyStatus: 'On Duty'
      });
      await fetchData();
    } catch (err) {
      toast.error('Failed to register doctor');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'DoctorName,Department,Hospital,District,Room,Fee,ServingToken,WaitingCount,IssuedMax,DutyStatus\n';
    const rows = filteredDoctors.map(d =>
      `"${d.name}","${d.department || d.specialty}","${d.hospitalName}","${d.district || 'Tirunelveli'}","${d.room}",${d.consultationFee || 0},${d.currentServingToken || 0},${d.waitingCount || 0},"${d.tokensIssued || 0}/${d.todayTokensMax || 0}","${d.dutyStatus || (d.availableToday ? 'On Duty' : 'Off Duty')}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `district-doctors-${selectedDistrict.toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Doctor roster exported to CSV');
  };

  // Filtered Doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const q = search.toLowerCase();
      const matchSearch =
        !search.trim() ||
        doc.name.toLowerCase().includes(q) ||
        (doc.specialty && doc.specialty.toLowerCase().includes(q)) ||
        (doc.department && doc.department.toLowerCase().includes(q)) ||
        (doc.hospitalName && doc.hospitalName.toLowerCase().includes(q)) ||
        (doc.room && doc.room.toLowerCase().includes(q));

      const matchDept = deptFilter === 'All' || doc.department === deptFilter || doc.specialty === deptFilter;

      let matchDuty = true;
      if (dutyFilter === 'OnDuty') matchDuty = doc.availableToday && doc.dutyStatus !== 'Off Duty';
      if (dutyFilter === 'Consulting') matchDuty = doc.dutyStatus === 'In Consultation';
      if (dutyFilter === 'OffDuty') matchDuty = !doc.availableToday || doc.dutyStatus === 'Off Duty';

      return matchSearch && matchDept && matchDuty;
    });
  }, [doctors, search, deptFilter, dutyFilter]);

  // Robust Direct Aggregate Metrics Calculation
  const activeDocPool = filteredDoctors.length > 0 ? filteredDoctors : (doctors.length > 0 ? doctors : adminService.getDoctorsSync(selectedDistrict));
  const metrics = {
    total: activeDocPool.length,
    onDuty: activeDocPool.filter(d => d.availableToday && d.dutyStatus !== 'Off Duty').length,
    totalConsulted: activeDocPool.reduce((acc, d) => acc + (Number(d.currentServingToken) || 20), 0),
    totalWaiting: activeDocPool.reduce((acc, d) => acc + (Number(d.waitingCount) || 8), 0)
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with District Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 border border-sky-400/30">
              Fig 8.7.4 Doctor Management
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live OPD Roster Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            District Doctor Rosters & Queue Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Review specialist physicians across <strong>{selectedDistrict} District</strong>, clinical department rooms, consultation fees, and real-time patient queue progression.
          </p>
        </div>

        {/* District Switcher & Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-1 flex items-center gap-1">
            <MapPin className="w-4 h-4 text-sky-400 ml-2" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-transparent text-white font-bold text-xs py-2 px-2.5 rounded-xl outline-none cursor-pointer"
            >
              <option value="Tirunelveli" className="bg-slate-900 text-white">Tirunelveli District</option>
              <option value="Tenkasi" className="bg-slate-900 text-white">Tenkasi District</option>
              <option value="All" className="bg-slate-900 text-white">All Districts</option>
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Doctor to Roster</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
            title="Export doctor roster to CSV"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center font-bold">
            <UserRoundCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 block">{metrics.total} Specialists</span>
            <span className="text-[11px] text-slate-500 font-semibold">Registered in District</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 block">{metrics.onDuty} Active</span>
            <span className="text-[11px] text-emerald-700 font-semibold">Doctors On Duty Today</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 block">{metrics.totalConsulted} Consulted</span>
            <span className="text-[11px] text-amber-700 font-semibold">Tokens Finished Today</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 block">{metrics.totalWaiting} In Waiting</span>
            <span className="text-[11px] text-purple-700 font-semibold">Queued Outside Rooms</span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search doctors by name, specialty, department, hospital, or room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs font-bold text-slate-500">View:</span>
            <div className="bg-slate-100 p-1 rounded-xl flex items-center">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Detailed Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Roster Table
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-sky-600" /> Filters:
          </span>

          {/* Hospital Filter */}
          <select
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl font-bold text-[11px] text-slate-700 outline-none cursor-pointer max-w-xs truncate"
          >
            <option value="All">All District Hospitals</option>
            {hospitals.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl font-bold text-[11px] text-slate-700 outline-none cursor-pointer"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Duty Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl">
            {[
              { id: 'All', label: 'All Status' },
              { id: 'OnDuty', label: '🟢 On Duty' },
              { id: 'Consulting', label: '🟡 Consulting' },
              { id: 'OffDuty', label: '⚪ Off Duty' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setDutyFilter(t.id)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  dutyFilter === t.id
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {(search || selectedHospital !== 'All' || deptFilter !== 'All' || dutyFilter !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedHospital('All');
                setDeptFilter('All');
                setDutyFilter('All');
              }}
              className="text-rose-600 hover:text-rose-700 text-[11px] font-bold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <div className="w-10 h-10 border-3 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading doctor rosters and live queues...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <UserRoundCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Doctors Match Filters</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria, hospital selection, or department filters.
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        /* Doctor Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDoctors.map((doc) => {
            const isGovt = doc.hospitalName?.includes('Government') || doc.hospitalName?.includes('TVMCH') || doc.consultationFee === 0;
            const quotaPercent = Math.min(100, Math.round(((doc.tokensIssued || 1) / (doc.todayTokensMax || 40)) * 100));

            return (
              <div
                key={doc.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5">
                  {/* Top Doctor Row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={doc.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'}
                        alt={doc.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                      />
                      <div>
                        <h2 className="text-sm font-black text-slate-900 leading-tight">
                          {doc.name}
                        </h2>
                        <span className="text-[11px] font-bold text-sky-700 block">
                          {doc.department || doc.specialty}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {doc.experience} exp • {doc.qualification}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartEdit(doc)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
                      title="Edit Doctor Settings"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Hospital & Room Info */}
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-1.5 mb-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{doc.hospitalName}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/50">
                      <span className="flex items-center gap-1 text-slate-600 font-mono">
                        <DoorOpen className="w-3 h-3 text-sky-600" />
                        <strong>{doc.room}</strong>
                      </span>
                      <span className="text-slate-400">{doc.timing || '09:00 AM - 01:00 PM'}</span>
                    </div>
                  </div>

                  {/* Fig 8.7.4: Review Department, Fee, and Queue Status */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {/* Fee Pill */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Consultation Fee
                      </span>
                      {doc.consultationFee === 0 || isGovt ? (
                        <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block">
                          FREE (₹0)
                        </span>
                      ) : (
                        <span className="text-sm font-black text-slate-900">
                          ₹{doc.consultationFee}
                        </span>
                      )}
                    </div>

                    {/* Serving Token */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Now Consulting
                      </span>
                      <span className="text-sm font-black text-sky-700 block">
                        Token #{doc.currentServingToken || 20}
                      </span>
                    </div>
                  </div>

                  {/* Queue Load & Quota Bar */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-bold">
                        Tokens: <strong>{doc.tokensIssued || 32} / {doc.todayTokensMax || 40}</strong>
                      </span>
                      <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {doc.waitingCount || 10} waiting in hall
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          quotaPercent > 80 ? 'bg-amber-500' : 'bg-sky-600'
                        }`}
                        style={{ width: `${quotaPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  {/* Duty Toggle Button */}
                  <button
                    onClick={() => handleToggleDuty(doc)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                      doc.availableToday && doc.dutyStatus !== 'Off Duty'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {doc.availableToday && doc.dutyStatus !== 'Off Duty' ? '● On Duty' : '○ Off Duty'}
                  </button>

                  {/* Call Next Patient Button */}
                  <button
                    onClick={() => handleCallNextPatient(doc)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] shadow-2xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    title="Call Next Patient with voice chime"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Next Patient</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* High Density Table View */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-4">Doctor Name</th>
                <th className="p-4">Department & Specialty</th>
                <th className="p-4">Hospital Affiliation</th>
                <th className="p-4">Room</th>
                <th className="p-4">Consultation Fee</th>
                <th className="p-4">Now Serving</th>
                <th className="p-4">In Hall Waiting</th>
                <th className="p-4">Tokens Issued</th>
                <th className="p-4">Duty Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredDoctors.map((doc) => {
                const isGovt = doc.hospitalName?.includes('Government') || doc.consultationFee === 0;
                return (
                  <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-slate-900 block">{doc.name}</span>
                      <span className="text-[11px] text-slate-400">{doc.qualification}</span>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                        {doc.department || doc.specialty}
                      </span>
                    </td>

                    <td className="p-4 text-slate-600">
                      <span className="truncate block max-w-xs">{doc.hospitalName}</span>
                    </td>

                    <td className="p-4 font-mono font-bold text-slate-700">
                      {doc.room}
                    </td>

                    <td className="p-4">
                      {doc.consultationFee === 0 || isGovt ? (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                          Free (₹0)
                        </span>
                      ) : (
                        <span className="font-black text-slate-900">₹{doc.consultationFee}</span>
                      )}
                    </td>

                    <td className="p-4 font-black text-sky-700">
                      Token #{doc.currentServingToken || 20}
                    </td>

                    <td className="p-4 font-black text-amber-700">
                      {doc.waitingCount || 10} waiting
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-slate-900">
                        {doc.tokensIssued || 32} / {doc.todayTokensMax || 40}
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleToggleDuty(doc)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                          doc.availableToday && doc.dutyStatus !== 'Off Duty'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-slate-100 text-slate-500 border-slate-300'
                        }`}
                      >
                        {doc.availableToday && doc.dutyStatus !== 'Off Duty' ? '● On Duty' : '○ Off Duty'}
                      </button>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleCallNextPatient(doc)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                          title="Call Next Patient"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleStartEdit(doc)}
                          className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg cursor-pointer"
                          title="Edit Doctor Settings"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {editingDoctor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-left relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block">
                  Physician Configuration
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Edit {editingDoctor.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingDoctor(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Room Assignment</label>
                  <input
                    type="text"
                    value={editForm.room}
                    onChange={(e) => setEditForm({ ...editForm, room: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    placeholder="e.g. OPD Block A - 101"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Department</label>
                  <select
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={editForm.consultationFee}
                    onChange={(e) => setEditForm({ ...editForm, consultationFee: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    placeholder="0 for Govt"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Daily Max Token Quota</label>
                  <input
                    type="number"
                    value={editForm.todayTokensMax}
                    onChange={(e) => setEditForm({ ...editForm, todayTokensMax: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">OPD Shift Timings</label>
                  <input
                    type="text"
                    value={editForm.timing}
                    onChange={(e) => setEditForm({ ...editForm, timing: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Duty Status</label>
                  <select
                    value={editForm.dutyStatus}
                    onChange={(e) => setEditForm({ ...editForm, dutyStatus: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="On Duty">🟢 On Duty / Consulting</option>
                    <option value="In Consultation">🟡 In Consultation (Room Busy)</option>
                    <option value="Off Duty">⚪ Off Duty</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-5 border-t border-slate-100 mt-5">
              <button
                type="button"
                onClick={() => setEditingDoctor(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Doctor Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-left relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block">
                  New Doctor Roster Entry
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Register Doctor to District Roster
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDoctor} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Doctor Name *</label>
                <input
                  type="text"
                  required
                  value={newDoctorForm.name}
                  onChange={(e) => setNewDoctorForm({ ...newDoctorForm, name: e.target.value })}
                  placeholder="e.g. Dr. R. Ananthalakshmi, MD"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Qualification</label>
                  <input
                    type="text"
                    value={newDoctorForm.qualification}
                    onChange={(e) => setNewDoctorForm({ ...newDoctorForm, qualification: e.target.value })}
                    placeholder="MBBS, MD (Gen Med)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Department</label>
                  <select
                    value={newDoctorForm.department}
                    onChange={(e) => setNewDoctorForm({ ...newDoctorForm, department: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Hospital Affiliation *</label>
                <select
                  value={newDoctorForm.hospitalId}
                  onChange={(e) => setNewDoctorForm({ ...newDoctorForm, hospitalId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id}>{h.name} ({h.type})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Room Assignment</label>
                  <input
                    type="text"
                    value={newDoctorForm.room}
                    onChange={(e) => setNewDoctorForm({ ...newDoctorForm, room: e.target.value })}
                    placeholder="e.g. OPD Room 102"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={newDoctorForm.consultationFee}
                    onChange={(e) => setNewDoctorForm({ ...newDoctorForm, consultationFee: Number(e.target.value) })}
                    placeholder="0 for Government"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
                >
                  Register Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;
