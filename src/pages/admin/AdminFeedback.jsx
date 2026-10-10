import React, { useState, useEffect, useMemo } from 'react';
import {
  MessageSquare,
  Star,
  Building2,
  ThumbsUp,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Send,
  Flag,
  User,
  Clock,
  MapPin,
  Calendar,
  Check,
  X,
  Plus,
  Download,
  Stethoscope,
  Smile,
  Meh,
  Frown,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { feedbackService } from '../../services/feedbackService';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDistrict, setSelectedDistrict] = useState('Tirunelveli');
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [sentimentFilter, setSentimentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [hospitalFilter, setHospitalFilter] = useState('All');

  // Modals
  const [replyingFeedback, setReplyingFeedback] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFeedbackForm, setNewFeedbackForm] = useState({
    patientName: '',
    tokenNumber: '',
    hospitalId: 'h1',
    hospitalName: 'Tirunelveli Government Medical College Hospital (TVMCH)',
    doctorName: 'Dr. S. Sundararajan, MD',
    department: 'General Medicine',
    rating: 5,
    comment: '',
    tags: ['Prompt Service', 'Helpful Doctor']
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fbList, fbSummary, hospList] = await Promise.all([
        feedbackService.getFeedbacks(selectedDistrict),
        feedbackService.getSummary(),
        adminService.getHospitals(selectedDistrict)
      ]);
      setFeedbacks(fbList);
      setSummary(fbSummary);
      setHospitals(hospList);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load patient reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDistrict]);

  // Handle Mark as Reviewed
  const handleMarkReviewed = async (fb) => {
    try {
      await feedbackService.updateFeedbackStatus(fb.id, 'Reviewed');
      toast.success(`Review from ${fb.patientName} marked as Reviewed!`);
      await fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  // Handle Flag for Escalation
  const handleFlagComplaint = async (fb) => {
    try {
      await feedbackService.updateFeedbackStatus(fb.id, 'Flagged');
      toast.error(`Review from ${fb.patientName} flagged for Hospital Superintendent!`, {
        icon: '🚩'
      });
      await fetchData();
    } catch (err) {
      toast.error('Failed to flag review');
    }
  };

  // Handle Submit Official Response
  const handleSendResponse = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !replyingFeedback) return;
    try {
      await feedbackService.addAdminResponse(replyingFeedback.id, replyText.trim());
      toast.success(`Official response posted for ${replyingFeedback.patientName}!`);
      setReplyingFeedback(null);
      setReplyText('');
      await fetchData();
    } catch (err) {
      toast.error('Failed to send response');
    }
  };

  // Handle Create Test Feedback
  const handleCreateTestFeedback = async (e) => {
    e.preventDefault();
    if (!newFeedbackForm.patientName.trim() || !newFeedbackForm.comment.trim()) {
      toast.error('Patient name and review comment are required');
      return;
    }
    try {
      const hosp = hospitals.find(h => h.id === newFeedbackForm.hospitalId);
      await feedbackService.submitFeedback({
        ...newFeedbackForm,
        hospitalName: hosp?.name || newFeedbackForm.hospitalName,
        district: selectedDistrict,
        tokenNumber: newFeedbackForm.tokenNumber || `TKN-${Math.floor(100 + Math.random() * 900)}`
      });
      toast.success('Patient feedback submitted and added to list!');
      setShowAddModal(false);
      setNewFeedbackForm({
        patientName: '',
        tokenNumber: '',
        hospitalId: 'h1',
        hospitalName: 'Tirunelveli Government Medical College Hospital (TVMCH)',
        doctorName: 'Dr. S. Sundararajan, MD',
        department: 'General Medicine',
        rating: 5,
        comment: '',
        tags: ['Prompt Service', 'Helpful Doctor']
      });
      await fetchData();
    } catch (err) {
      toast.error('Failed to submit test feedback');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'ID,PatientName,TokenNumber,Hospital,Doctor,Department,Rating,Date,Comment,Sentiment,Status,AdminResponse\n';
    const rows = filteredFeedbacks.map(f =>
      `"${f.id}","${f.patientName}","${f.tokenNumber || ''}","${f.hospitalName}","${f.doctorName}","${f.department || ''}",${f.rating},"${f.date}","${f.comment.replace(/"/g, '""')}","${f.sentiment || 'positive'}","${f.adminStatus || 'Pending Review'}","${(f.adminResponse || '').replace(/"/g, '""')}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patient-feedback-${selectedDistrict.toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Patient feedback exported to CSV');
  };

  // Filtered Feedbacks
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((fb) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search.trim() ||
        fb.hospitalName.toLowerCase().includes(q) ||
        fb.doctorName.toLowerCase().includes(q) ||
        fb.patientName.toLowerCase().includes(q) ||
        fb.comment.toLowerCase().includes(q) ||
        (fb.tokenNumber && fb.tokenNumber.toLowerCase().includes(q));

      const matchRating =
        ratingFilter === 'All' ||
        (ratingFilter === '5' && fb.rating === 5) ||
        (ratingFilter === '4' && fb.rating === 4) ||
        (ratingFilter === '3' && fb.rating === 3) ||
        (ratingFilter === '1-2' && fb.rating <= 2);

      const matchSentiment =
        sentimentFilter === 'All' ||
        (fb.sentiment && fb.sentiment.toLowerCase() === sentimentFilter.toLowerCase());

      const matchStatus =
        statusFilter === 'All' ||
        (fb.adminStatus || 'Pending Review') === statusFilter;

      const matchHosp =
        hospitalFilter === 'All' ||
        fb.hospitalId === hospitalFilter ||
        fb.hospitalName.includes(hospitalFilter);

      return matchSearch && matchRating && matchSentiment && matchStatus && matchHosp;
    });
  }, [feedbacks, search, ratingFilter, sentimentFilter, statusFilter, hospitalFilter]);

  // Aggregate Metrics
  const calculatedStats = useMemo(() => {
    const total = feedbacks.length;
    if (total === 0) return { avg: 4.8, total: 0, pending: 0 };
    const avg = (feedbacks.reduce((acc, f) => acc + (f.rating || 5), 0) / total).toFixed(1);
    const pending = feedbacks.filter(f => !f.adminStatus || f.adminStatus === 'Pending Review').length;
    return { avg, total, pending };
  }, [feedbacks]);

  return (
    <div className="space-y-6">
      {/* Top Banner with District Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 border border-sky-400/30">
              Fig 8.7.5 Patient Feedback Review
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              Quality & Patient Satisfaction
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Patient Ratings & Feedback Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Review patient star ratings, consultation comments, and service feedback across <strong>{selectedDistrict}</strong> hospitals to maintain clinical excellence.
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
            <span>Simulate Patient Review</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
            title="Export feedback to CSV"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Satisfaction & Sentiment Overview Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Average Rating Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 border border-amber-200 flex flex-col items-center justify-center font-black">
            <Star className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900">{calculatedStats.avg}</span>
              <span className="text-xs font-bold text-slate-400">/ 5.0</span>
            </div>
            <span className="text-xs text-slate-500 font-semibold block">
              District Patient Satisfaction ({calculatedStats.total} reviews)
            </span>
          </div>
        </div>

        {/* Rating Breakdown Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 block mb-1.5">Rating Breakdown</span>
          <div className="space-y-1 text-[11px] font-bold">
            <div className="flex items-center gap-2">
              <span className="w-6 text-slate-500">5★</span>
              <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: '78%' }} />
              </div>
              <span className="text-slate-400 text-[10px]">78%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 text-slate-500">4★</span>
              <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-300 h-full rounded-full" style={{ width: '16%' }} />
              </div>
              <span className="text-slate-400 text-[10px]">16%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 text-slate-500">3★</span>
              <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-slate-300 h-full rounded-full" style={{ width: '4%' }} />
              </div>
              <span className="text-slate-400 text-[10px]">4%</span>
            </div>
          </div>
        </div>

        {/* Sentiment Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold">
            <ThumbsUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-emerald-700 block leading-tight">
              {summary?.positiveRate || '93%'}
            </span>
            <span className="text-xs text-slate-500 font-semibold block">
              Positive Experience Ratio
            </span>
          </div>
        </div>

        {/* Pending Review Action */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-amber-700 block leading-tight">
              {calculatedStats.pending}
            </span>
            <span className="text-xs text-slate-500 font-semibold block">
              Reviews Awaiting Admin Action
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search feedback by patient name, doctor, hospital, or comment keyword..."
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
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-sky-600" /> Filters:
          </span>

          {/* Rating Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl">
            {[
              { id: 'All', label: 'All Ratings' },
              { id: '5', label: '5 ★' },
              { id: '4', label: '4 ★' },
              { id: '3', label: '3 ★' },
              { id: '1-2', label: '1-2 ★' }
            ].map(r => (
              <button
                key={r.id}
                onClick={() => setRatingFilter(r.id)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  ratingFilter === r.id
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Hospital Filter */}
          <select
            value={hospitalFilter}
            onChange={(e) => setHospitalFilter(e.target.value)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl font-bold text-[11px] text-slate-700 outline-none cursor-pointer max-w-xs truncate"
          >
            <option value="All">All Hospitals</option>
            {hospitals.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>

          {/* Sentiment Filter */}
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl font-bold text-[11px] text-slate-700 outline-none cursor-pointer"
          >
            <option value="All">All Sentiments</option>
            <option value="positive">🟢 Positive Reviews</option>
            <option value="neutral">🟡 Neutral Experience</option>
            <option value="critical">🔴 Critical Feedback</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl font-bold text-[11px] text-slate-700 outline-none cursor-pointer"
          >
            <option value="All">All Review Statuses</option>
            <option value="Pending Review">🟡 Pending Review</option>
            <option value="Reviewed">🟢 Reviewed & Addressed</option>
            <option value="Flagged">🚩 Flagged for Action</option>
          </select>

          {(search || ratingFilter !== 'All' || sentimentFilter !== 'All' || statusFilter !== 'All' || hospitalFilter !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setRatingFilter('All');
                setSentimentFilter('All');
                setStatusFilter('All');
                setHospitalFilter('All');
              }}
              className="text-rose-600 hover:text-rose-700 text-[11px] font-bold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Feedback List */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <div className="w-10 h-10 border-3 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading patient feedback and review logs...</p>
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Patient Feedback Matches Filter</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, star rating, or sentiment filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredFeedbacks.map((fb) => {
            const isPositive = fb.rating >= 4 || fb.sentiment === 'positive';
            const isCritical = fb.rating <= 2 || fb.sentiment === 'critical' || fb.adminStatus === 'Flagged';
            const isPending = !fb.adminStatus || fb.adminStatus === 'Pending Review';

            return (
              <div
                key={fb.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-left relative overflow-hidden"
              >
                <div>
                  {/* Top Row: Hospital & Star Rating */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                          {fb.department || 'General Medicine'}
                        </span>

                        <span className="text-[10px] text-slate-400 font-mono">
                          {fb.tokenNumber || 'Token Pass'}
                        </span>
                      </div>

                      <h2 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                        {fb.hospitalName}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Consultant: <strong>{fb.doctorName}</strong>
                      </p>
                    </div>

                    {/* Star Rating Display */}
                    <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex-shrink-0">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= fb.rating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-slate-200 fill-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-black text-amber-900">{fb.rating}.0</span>
                    </div>
                  </div>

                  {/* Patient Review Text */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 my-3 text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    "{fb.comment}"
                  </div>

                  {/* Tags */}
                  {fb.tags && fb.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {fb.tags.map((t, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Official Hospital Response (if already answered) */}
                  {fb.adminResponse && (
                    <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-3 mb-3 text-xs text-sky-950 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-sky-700 uppercase tracking-wide">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-sky-600" />
                          <span>Official Hospital Response:</span>
                        </span>
                        <span className="text-slate-400 font-normal">{fb.respondedAt || 'Posted'}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-snug">{fb.adminResponse}</p>
                    </div>
                  )}
                </div>

                {/* Footer Strip with Patient Info & Admin Actions */}
                <div className="pt-3 border-t border-slate-100 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400">
                    <span>Patient: <strong className="text-slate-700">{fb.patientName}</strong></span>
                    <span className="mx-1.5">•</span>
                    <span>{fb.date} {fb.time && `• ${fb.time}`}</span>
                  </div>

                  {/* Admin Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    {isPending ? (
                      <button
                        onClick={() => handleMarkReviewed(fb)}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                        title="Mark as reviewed"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Reviewed</span>
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{fb.adminStatus || 'Reviewed'}</span>
                      </span>
                    )}

                    <button
                      onClick={() => {
                        setReplyingFeedback(fb);
                        setReplyText(fb.adminResponse || '');
                      }}
                      className="px-2.5 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer border border-sky-200"
                      title="Post official hospital reply"
                    >
                      <MessageCircle className="w-3 h-3 text-sky-600" />
                      <span>{fb.adminResponse ? 'Edit Reply' : 'Add Reply'}</span>
                    </button>

                    <button
                      onClick={() => handleFlagComplaint(fb)}
                      className="p-1 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Flag review for Superintendent follow-up"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Official Response Modal */}
      {replyingFeedback && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-left relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block">
                  Official Communication
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Respond to {replyingFeedback.patientName}
                </h3>
                <p className="text-xs text-slate-500">{replyingFeedback.hospitalName}</p>
              </div>
              <button
                onClick={() => setReplyingFeedback(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Original Feedback quote */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-600 italic mb-4">
              "{replyingFeedback.comment}"
            </div>

            <form onSubmit={handleSendResponse} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Official Administrator / Hospital Reply
                </label>
                <textarea
                  required
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Thank you for your feedback. We have coordinated with the OPD department..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                />
              </div>

              {/* Template quick fills */}
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="text-slate-400 font-bold self-center">Templates:</span>
                <button
                  type="button"
                  onClick={() => setReplyText('Thank you for your valuable feedback! We are constantly optimizing digital token queues to minimize wait times.')}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  General Gratitude
                </button>
                <button
                  type="button"
                  onClick={() => setReplyText('Action taken: Additional OPD counters and seating have been arranged during morning peak rush hours.')}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Rush Hour Resolution
                </button>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReplyingFeedback(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Official Response</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simulate Patient Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-left relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block">
                  Feedback Simulator
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Simulate Patient Review
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTestFeedback} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Patient Name *</label>
                  <input
                    type="text"
                    required
                    value={newFeedbackForm.patientName}
                    onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, patientName: e.target.value })}
                    placeholder="e.g. Sangeetha R."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Star Rating (1 - 5) *</label>
                  <select
                    value={newFeedbackForm.rating}
                    onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, rating: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-amber-700"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5.0 - Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ (4.0 - Good)</option>
                    <option value={3}>⭐⭐⭐ (3.0 - Average)</option>
                    <option value={2}>⭐⭐ (2.0 - Poor)</option>
                    <option value={1}>⭐ (1.0 - Very Critical)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Hospital Reviewed</label>
                <select
                  value={newFeedbackForm.hospitalId}
                  onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, hospitalId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Doctor Name</label>
                  <input
                    type="text"
                    value={newFeedbackForm.doctorName}
                    onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, doctorName: e.target.value })}
                    placeholder="Dr. S. Sundararajan"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Department</label>
                  <input
                    type="text"
                    value={newFeedbackForm.department}
                    onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, department: e.target.value })}
                    placeholder="General Medicine"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Patient Review Comment *</label>
                <textarea
                  required
                  rows={3}
                  value={newFeedbackForm.comment}
                  onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, comment: e.target.value })}
                  placeholder="The digital token saved my family hours of waiting. The doctor was polite and thorough..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium"
                />
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
                  Submit Patient Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
