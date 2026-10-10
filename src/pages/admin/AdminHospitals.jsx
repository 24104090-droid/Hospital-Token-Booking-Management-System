import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Edit3,
  Check,
  X,
  Search,
  Bed,
  Ticket,
  Plus,
  ShieldCheck,
  Clock,
  Users,
  Volume2,
  ArrowUpDown,
  Filter,
  Layers,
  MapPin,
  Phone,
  AlertCircle,
  Download,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Tag,
  Stethoscope,
  IndianRupee,
  Activity,
  HeartPulse
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { speakTokenAnnouncement } from '../../utils/hospitalAudio';
import toast from 'react-hot-toast';

const ALL_DEPARTMENTS = [
  'General Medicine',
  'Cardiology',
  'Pediatrics',
  'Obstetrics & Gynecology',
  'Orthopedics',
  'Dermatology',
  'Ophthalmology',
  'ENT',
  'Neurology',
  'Emergency Medicine',
  'Nephrology',
  'Pulmonology',
  'Dentistry',
  'Oncology'
];

const AdminHospitals = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('Tirunelveli');
  const [hospitals, setHospitals] = useState(() => adminService.getHospitalsSync('Tirunelveli'));
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [queueFilter, setQueueFilter] = useState('All');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Modal states
  const [editingHospital, setEditingHospital] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHospitalForm, setNewHospitalForm] = useState({
    name: '',
    type: 'Government',
    district: 'Tirunelveli',
    area: '',
    address: '',
    phone: '',
    emergencyPhone: '108',
    consultationFee: 0,
    emergencyFee: 0,
    availableTokens: 30,
    todayTokensMax: 50,
    icuAvailable: 10,
    generalBedsAvailable: 40,
    departments: ['General Medicine', 'Emergency Medicine'],
    openStatus: true,
    opdHours: '08:00 AM - 02:00 PM'
  });

  const [expandedDeptId, setExpandedDeptId] = useState(null);

  const fetchHospitals = async () => {
    try {
      const data = await adminService.getHospitals(selectedDistrict);
      if (data && data.length > 0) setHospitals(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load hospitals');
    }
  };

  useEffect(() => {
    const syncHosps = adminService.getHospitalsSync(selectedDistrict);
    if (syncHosps && syncHosps.length > 0) setHospitals(syncHosps);
    fetchHospitals();
  }, [selectedDistrict]);

  // Handle Edit Hospital
  const handleStartEdit = (hosp) => {
    setEditingHospital(hosp);
    setEditForm({
      name: hosp.name,
      type: hosp.type,
      district: hosp.district || 'Tirunelveli',
      consultationFee: hosp.consultationFee ?? (hosp.type === 'Government' ? 0 : 250),
      emergencyFee: hosp.emergencyFee ?? 0,
      availableTokens: hosp.availableTokens || 30,
      todayTokensMax: hosp.todayTokensMax || 60,
      icuAvailable: hosp.icuAvailable || 10,
      generalBedsAvailable: hosp.generalBedsAvailable || 30,
      waitingTime: hosp.waitingTime || 15,
      openStatus: hosp.openStatus,
      opdHours: hosp.opdHours || '08:00 AM - 01:00 PM',
      departments: hosp.departments || []
    });
  };

  const handleSaveEdit = async () => {
    if (!editingHospital) return;
    try {
      await adminService.updateHospital(editingHospital.id, editForm);
      toast.success(`Updated "${editForm.name}" details successfully!`);
      setEditingHospital(null);
      await fetchHospitals();
    } catch (err) {
      toast.error('Failed to update hospital');
    }
  };

  // Handle Register New Hospital
  const handleCreateHospital = async (e) => {
    e.preventDefault();
    if (!newHospitalForm.name.trim()) {
      toast.error('Hospital name is required');
      return;
    }
    try {
      await adminService.addHospital(newHospitalForm);
      toast.success(`Hospital "${newHospitalForm.name}" added to district network!`);
      setShowAddModal(false);
      setNewHospitalForm({
        name: '',
        type: 'Government',
        district: selectedDistrict,
        area: '',
        address: '',
        phone: '',
        emergencyPhone: '108',
        consultationFee: 0,
        emergencyFee: 0,
        availableTokens: 30,
        todayTokensMax: 50,
        icuAvailable: 10,
        generalBedsAvailable: 40,
        departments: ['General Medicine', 'Emergency Medicine'],
        openStatus: true,
        opdHours: '08:00 AM - 02:00 PM'
      });
      await fetchHospitals();
    } catch (err) {
      toast.error('Failed to create hospital');
    }
  };

  // Broadcast Audio Announcement
  const handleBroadcastAnnouncement = (hosp) => {
    const nextTokenNum = (hosp.currentServingToken || 20) + 1;
    speakTokenAnnouncement({
      tokenNumber: nextTokenNum,
      doctorName: hosp.doctors?.[0]?.name || 'On-Duty Chief Physician',
      room: hosp.doctors?.[0]?.room || 'OPD Room 1',
      hospitalName: hosp.name
    });
    toast.success(`📢 Broadcasting: Token #${nextTokenNum} called at ${hosp.name}`, {
      icon: '🔔'
    });
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'Hospital,Type,District,Departments,ConsultationFee,TokensIssued,ServingToken,WaitingCount,AvgWaitMins,ICUBeds,OPDStatus\n';
    const rows = filteredHospitals.map(h => 
      `"${h.name}","${h.type}","${h.district || 'Tirunelveli'}","${(h.departments || []).join('; ')}",${h.consultationFee || 0},${h.tokensIssued || 0},"${h.currentToken || h.currentServingToken || 0}",${h.waitingCount || 0},${h.waitingTime || 0},${h.icuAvailable || 0},"${h.openStatus ? 'Open' : 'Closed'}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `district-hospitals-${selectedDistrict.toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Hospital directory exported to CSV');
  };

  // Filtered Hospitals
  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      // Search
      const q = search.toLowerCase();
      const matchSearch =
        !search.trim() ||
        h.name.toLowerCase().includes(q) ||
        (h.area && h.area.toLowerCase().includes(q)) ||
        (h.address && h.address.toLowerCase().includes(q)) ||
        (h.departments && h.departments.some(d => d.toLowerCase().includes(q)));

      // Type Filter
      const matchType = typeFilter === 'All' || h.type === typeFilter;

      // Department Filter
      const matchDept = departmentFilter === 'All' || (h.departments && h.departments.includes(departmentFilter));

      // Queue Load Filter
      let matchQueue = true;
      if (queueFilter === 'Normal') matchQueue = h.waitingTime < 15 && h.openStatus;
      if (queueFilter === 'Moderate') matchQueue = h.waitingTime >= 15 && h.waitingTime <= 25 && h.openStatus;
      if (queueFilter === 'Rush') matchQueue = h.waitingTime > 25 && h.openStatus;
      if (queueFilter === 'Closed') matchQueue = !h.openStatus;

      return matchSearch && matchType && matchDept && matchQueue;
    });
  }, [hospitals, search, typeFilter, departmentFilter, queueFilter]);

  // Robust Direct Aggregate District Stats Calculation
  const activeHospPool = filteredHospitals.length > 0 ? filteredHospitals : (hospitals.length > 0 ? hospitals : adminService.getHospitalsSync(selectedDistrict));
  const totalFacilities = activeHospPool.length;
  const govtCount = activeHospPool.filter(h => h.type === 'Government').length;
  const privCount = activeHospPool.filter(h => h.type === 'Private').length;
  const totalTokens = activeHospPool.reduce((acc, h) => acc + (Number(h.tokensIssued) || Number(h.availableTokens) || 35), 0);
  const totalWaiting = activeHospPool.reduce((acc, h) => acc + (Number(h.waitingCount) || 10), 0);
  const totalIcu = activeHospPool.reduce((acc, h) => acc + (Number(h.icuAvailable) || 14), 0);
  const avgWait = totalFacilities > 0 
    ? Math.round(activeHospPool.reduce((acc, h) => acc + (Number(h.waitingTime) || 12), 0) / totalFacilities) 
    : 12;

  const districtStats = {
    total: totalFacilities,
    govtCount,
    privCount,
    totalTokens,
    totalWaiting,
    totalIcu,
    avgWait
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with District Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 border border-sky-400/30">
              Fig 8.7.4 Hospital Management
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live OPD Dispatch Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            District Hospital & OPD Capacity Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Review all healthcare facilities across <strong>{selectedDistrict} District</strong> with medical departments, consultation fees, and real-time OPD queue statuses.
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
              <option value="All" className="bg-slate-900 text-white">All Districts (Combined)</option>
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register Hospital</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
            title="Export hospital report to CSV"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* District KPI Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 block">{districtStats.total} Facilities</span>
            <span className="text-[11px] text-slate-500 font-semibold">
              {districtStats.govtCount} Govt • {districtStats.privCount} Private
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 block">{districtStats.totalTokens} Tokens</span>
            <span className="text-[11px] text-amber-700 font-semibold">Issued District-wide</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 block">{districtStats.totalWaiting} Patients</span>
            <span className="text-[11px] text-purple-700 font-semibold">Waiting in OPD Halls</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center font-bold">
            <Bed className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 block">{districtStats.totalIcu} ICU Beds</span>
            <span className="text-[11px] text-rose-700 font-semibold">Ready for Critical Care</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5 col-span-2 sm:col-span-1">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 block">~{districtStats.avgWait} mins</span>
            <span className="text-[11px] text-emerald-700 font-semibold">Avg OPD Turnaround</span>
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
              placeholder="Search hospitals by name, area, address, or medical department..."
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
                Summary Table
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-sky-600" /> Filters:
          </span>

          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl">
            {['All', 'Government', 'Private'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  typeFilter === t
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl font-bold text-[11px] text-slate-700 outline-none cursor-pointer"
          >
            <option value="All">All Departments</option>
            {ALL_DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Queue Status Filter */}
          <select
            value={queueFilter}
            onChange={(e) => setQueueFilter(e.target.value)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl font-bold text-[11px] text-slate-700 outline-none cursor-pointer"
          >
            <option value="All">All Queue Loads</option>
            <option value="Normal">🟢 Low / Normal Load (&lt; 15m)</option>
            <option value="Moderate">🟡 Moderate Load (15-25m)</option>
            <option value="Rush">🔴 Peak Rush (&gt; 25m)</option>
            <option value="Closed">⚪ Closed OPD</option>
          </select>

          {(search || typeFilter !== 'All' || departmentFilter !== 'All' || queueFilter !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setTypeFilter('All');
                setDepartmentFilter('All');
                setQueueFilter('All');
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
          <p className="text-xs font-bold text-slate-500">Loading district hospital management directory...</p>
        </div>
      ) : filteredHospitals.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Hospitals Match Filter</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, department selection, or district filter.
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        /* Detailed Cards View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredHospitals.map((hosp) => {
            const isGovt = hosp.type === 'Government';
            const isDeptExpanded = expandedDeptId === hosp.id;
            const depts = hosp.departments || [];
            const displayDepts = isDeptExpanded ? depts : depts.slice(0, 6);

            return (
              <div
                key={hosp.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Hospital Header Strip */}
                <div className="p-5 sm:p-6 pb-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                            isGovt
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-sky-50 text-sky-800 border-sky-300'
                          }`}
                        >
                          {hosp.type}
                        </span>

                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{hosp.area || hosp.district || 'Tirunelveli'}</span>
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                            hosp.openStatus
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              hosp.openStatus ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                            }`}
                          />
                          <span>{hosp.openStatus ? 'OPD Open' : 'OPD Closed'}</span>
                        </span>
                      </div>

                      <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                        {hosp.name}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{hosp.address}</p>
                    </div>

                    <button
                      onClick={() => handleStartEdit(hosp)}
                      className="p-2 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors flex-shrink-0 cursor-pointer"
                      title="Edit Hospital Settings & Quotas"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Contact & Hours */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 py-2 border-y border-slate-100 my-3">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{hosp.phone}</span>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{hosp.opdHours || '08:00 AM - 01:00 PM'}</span>
                    </span>
                  </div>

                  {/* Fig 8.7.4: Review Departments */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
                        <span>Medical Departments ({depts.length})</span>
                      </span>
                      {depts.length > 6 && (
                        <button
                          onClick={() => setExpandedDeptId(isDeptExpanded ? null : hosp.id)}
                          className="text-sky-600 hover:underline text-[11px] font-bold flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>{isDeptExpanded ? 'Collapse' : `+${depts.length - 6} More`}</span>
                          {isDeptExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {displayDepts.map((dept, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-lg border border-slate-200"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Fig 8.7.4: Review Fees & Queue Status */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    {/* Consultation Fee */}
                    <div className="p-2 bg-white rounded-xl border border-slate-200/60 shadow-2xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Consultation Fee
                      </span>
                      <div className="flex items-baseline gap-1">
                        {hosp.consultationFee === 0 || isGovt ? (
                          <span className="text-xs sm:text-sm font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            FREE (₹0)
                          </span>
                        ) : (
                          <span className="text-sm font-black text-slate-900">
                            ₹{hosp.consultationFee}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 font-medium block mt-0.5">
                        {isGovt ? 'TN CMCHIS Scheme' : 'OPD Registration'}
                      </span>
                    </div>

                    {/* Queue Status: Serving Token */}
                    <div className="p-2 bg-white rounded-xl border border-slate-200/60 shadow-2xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Now Serving
                      </span>
                      <span className="text-sm font-black text-sky-700 block">
                        {hosp.currentToken || `Token #${hosp.currentServingToken || 24}`}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium block mt-0.5">
                        Issued: {hosp.tokensIssued || 38}/{hosp.todayTokensMax || 60}
                      </span>
                    </div>

                    {/* Queue Status: Waiting Count */}
                    <div className="p-2 bg-white rounded-xl border border-slate-200/60 shadow-2xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        In Queue Waiting
                      </span>
                      <span className="text-sm font-black text-amber-700 block">
                        {hosp.waitingCount || Math.max(2, (hosp.tokensIssued || 30) - (hosp.currentServingToken || 18))} Patients
                      </span>
                      <span className="text-[9px] text-amber-600 font-bold block mt-0.5">
                        ~{hosp.waitingTime || 15}m wait
                      </span>
                    </div>

                    {/* Queue Status: ICU & Bed Capacity */}
                    <div className="p-2 bg-white rounded-xl border border-slate-200/60 shadow-2xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        ICU Beds Free
                      </span>
                      <span className="text-sm font-black text-rose-700 block">
                        {hosp.icuAvailable || 8} Beds
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium block mt-0.5">
                        {hosp.generalBedsAvailable || 30} Gen Beds
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="px-5 sm:px-6 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium text-[11px]">OPD Load:</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                        (hosp.waitingTime || 15) > 20
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {(hosp.waitingTime || 15) > 20 ? '● Busy / High Influx' : '● Normal / Steady'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBroadcastAnnouncement(hosp)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[11px] flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95"
                      title="Broadcast bilingual chime for this hospital"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                      <span>Broadcast PA</span>
                    </button>

                    <button
                      onClick={() => handleStartEdit(hosp)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] shadow-2xs cursor-pointer transition-all active:scale-95"
                    >
                      Edit Quotas & Fees
                    </button>
                  </div>
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
                <th className="p-4">Hospital Name & District</th>
                <th className="p-4">Type</th>
                <th className="p-4">Departments</th>
                <th className="p-4">Consultation Fee</th>
                <th className="p-4">Queue Status</th>
                <th className="p-4">Waiting & Avg Wait</th>
                <th className="p-4">ICU Beds</th>
                <th className="p-4">OPD Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredHospitals.map((hosp) => {
                const isGovt = hosp.type === 'Government';
                return (
                  <tr key={hosp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-slate-900 block leading-tight">{hosp.name}</span>
                      <span className="text-slate-400 text-[11px]">{hosp.area || hosp.district} • {hosp.phone}</span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                          isGovt ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {hosp.type}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(hosp.departments || []).slice(0, 3).map((dept, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                            {dept}
                          </span>
                        ))}
                        {(hosp.departments?.length || 0) > 3 && (
                          <span className="text-[10px] text-sky-600 font-bold">
                            +{(hosp.departments?.length || 0) - 3} more
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      {hosp.consultationFee === 0 || isGovt ? (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                          Free (₹0)
                        </span>
                      ) : (
                        <span className="font-black text-slate-900">₹{hosp.consultationFee}</span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-sky-700 block">
                        {hosp.currentToken || `Token #${hosp.currentServingToken || 24}`}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {hosp.tokensIssued || 38}/{hosp.todayTokensMax || 60} Issued
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-amber-700 block">
                        {hosp.waitingCount || 12} waiting
                      </span>
                      <span className="text-[10px] text-slate-500">
                        ~{hosp.waitingTime || 15} mins
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-rose-700">{hosp.icuAvailable || 8} Beds</span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          hosp.openStatus ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {hosp.openStatus ? 'Open' : 'Closed'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleBroadcastAnnouncement(hosp)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                          title="Broadcast Audio Chime"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleStartEdit(hosp)}
                          className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg"
                          title="Edit Hospital Quotas & Fees"
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

      {/* Edit Hospital Modal */}
      {editingHospital && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-left relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block">
                  Configuration Editor
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Edit {editForm.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingHospital(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {/* Type and Open Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Facility Type</label>
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="Government">Government (TN Health)</option>
                    <option value="Private">Private / Trust</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">OPD Operation Status</label>
                  <select
                    value={editForm.openStatus ? 'true' : 'false'}
                    onChange={(e) => setEditForm({ ...editForm, openStatus: e.target.value === 'true' })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="true">🟢 Open (Issuing Tokens)</option>
                    <option value="false">🔴 Closed (OPD Suspended)</option>
                  </select>
                </div>
              </div>

              {/* Consultation & Emergency Fees */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Consultation / OPD Fee (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      value={editForm.consultationFee}
                      onChange={(e) => setEditForm({ ...editForm, consultationFee: Number(e.target.value) })}
                      className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900"
                      placeholder="0 for Government"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Set to 0 for Free Govt OPD</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Emergency Triage Fee (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      value={editForm.emergencyFee}
                      onChange={(e) => setEditForm({ ...editForm, emergencyFee: Number(e.target.value) })}
                      className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Token Quotas & Beds */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Daily Token Max</label>
                  <input
                    type="number"
                    value={editForm.todayTokensMax}
                    onChange={(e) => setEditForm({ ...editForm, todayTokensMax: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tokens Available</label>
                  <input
                    type="number"
                    value={editForm.availableTokens}
                    onChange={(e) => setEditForm({ ...editForm, availableTokens: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">ICU Beds Free</label>
                  <input
                    type="number"
                    value={editForm.icuAvailable}
                    onChange={(e) => setEditForm({ ...editForm, icuAvailable: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-rose-700"
                  />
                </div>
              </div>

              {/* Operating Hours */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">OPD Operating Hours</label>
                <input
                  type="text"
                  value={editForm.opdHours}
                  onChange={(e) => setEditForm({ ...editForm, opdHours: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  placeholder="e.g. 08:00 AM - 01:00 PM & 03:00 PM - 07:00 PM"
                />
              </div>

              {/* Departments Checklist */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Active Clinical Departments
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 max-h-40 overflow-y-auto">
                  {ALL_DEPARTMENTS.map((dept) => {
                    const isChecked = editForm.departments?.includes(dept);
                    return (
                      <label key={dept} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const cur = editForm.departments || [];
                            const updated = e.target.checked
                              ? [...cur, dept]
                              : cur.filter(d => d !== dept);
                            setEditForm({ ...editForm, departments: updated });
                          }}
                          className="rounded text-sky-600 focus:ring-sky-500"
                        />
                        <span className="truncate">{dept}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-5 border-t border-slate-100 mt-5">
              <button
                type="button"
                onClick={() => setEditingHospital(null)}
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
                <span>Save Hospital Configuration</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register New Hospital Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-left relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block">
                  New Healthcare Facility
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Register Hospital in {selectedDistrict}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHospital} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Hospital / Clinic Name *</label>
                <input
                  type="text"
                  required
                  value={newHospitalForm.name}
                  onChange={(e) => setNewHospitalForm({ ...newHospitalForm, name: e.target.value })}
                  placeholder="e.g. Government Taluk Hospital / City Care Hospital"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Facility Type</label>
                  <select
                    value={newHospitalForm.type}
                    onChange={(e) => setNewHospitalForm({ ...newHospitalForm, type: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="Government">Government (TN Health)</option>
                    <option value="Private">Private Facility</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">District</label>
                  <input
                    type="text"
                    value={newHospitalForm.district}
                    onChange={(e) => setNewHospitalForm({ ...newHospitalForm, district: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Area / Locality</label>
                  <input
                    type="text"
                    value={newHospitalForm.area}
                    onChange={(e) => setNewHospitalForm({ ...newHospitalForm, area: e.target.value })}
                    placeholder="e.g. High Grounds / Palayamkottai"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newHospitalForm.phone}
                    onChange={(e) => setNewHospitalForm({ ...newHospitalForm, phone: e.target.value })}
                    placeholder="+91 462 250 1100"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={newHospitalForm.consultationFee}
                    onChange={(e) => setNewHospitalForm({ ...newHospitalForm, consultationFee: Number(e.target.value) })}
                    placeholder="0 for Govt"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">ICU Beds Available</label>
                  <input
                    type="number"
                    value={newHospitalForm.icuAvailable}
                    onChange={(e) => setNewHospitalForm({ ...newHospitalForm, icuAvailable: Number(e.target.value) })}
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
                  Add Hospital Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHospitals;
