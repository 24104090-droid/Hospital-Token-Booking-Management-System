import React, { useState, useEffect, useContext } from 'react';
import {
  MessageSquareHeart,
  Star,
  Building2,
  CheckCircle2,
  Sparkles,
  Send,
  ThumbsUp
} from 'lucide-react';
import { feedbackService } from '../../services/feedbackService';
import { mockHospitals } from '../../data/mockHospitals';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import LoadingSpinner from '../../components/LoadingSpinner';

const Feedback = () => {
  const { patient } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [hospitalId, setHospitalId] = useState('h1');
  const [doctorName, setDoctorName] = useState('Dr. S. Sundararajan, MD');
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState(['Quick Service', 'Helpful Doctor']);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const tagOptions = [
    'Quick Service',
    'Short Waiting Time',
    'Helpful Doctor',
    'Clean OPD',
    'Smooth Token Counter',
    'Clear Instructions'
  ];

  const fetchList = async () => {
    try {
      const data = await feedbackService.getFeedbacks();
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    const selectedHosp = mockHospitals.find(h => h.id === hospitalId);
    try {
      await feedbackService.submitFeedback({
        hospitalId,
        hospitalName: selectedHosp ? selectedHosp.name : 'Tirunelveli Medical College Hospital (TVMCH)',
        doctorName: doctorName || 'OPD Specialist',
        patientName: patient?.name || 'Ramesh Kumar',
        rating,
        comment,
        tags: selectedTags
      });

      setSuccessMsg('Thank you! Your feedback has been submitted to improve OPD queue efficiency.');
      setComment('');
      await fetchList();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <MessageSquareHeart className="w-3.5 h-3.5" /> Patient Experience & Quality Desk
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Hospital & Doctor Feedback
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Share your OPD consultation experience to help maintain healthcare standards in Tirunelveli.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Feedback Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm sticky top-24">
            <h3 className="text-base font-bold text-slate-900 mb-4">Rate Your OPD Visit</h3>

            {successMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 mb-4 font-semibold">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Hospital"
                value={hospitalId}
                onChange={(e) => setHospitalId(e.target.value)}
                options={mockHospitals.map(h => ({ value: h.id, label: h.name }))}
                required
              />

              <Input
                label="Doctor Name"
                placeholder="Dr. S. Sundararajan, MD"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
              />

              {/* Star Rating Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">{rating} / 5</span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Highlights
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {tagOptions.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-sky-600 text-white border-sky-600 font-semibold'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                  Comments & Feedback
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe your consultation, waiting experience, and staff politeness..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full text-xs p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>

              <Button type="submit" variant="primary" size="md" className="w-full" disabled={submitting}>
                <Send className="w-4 h-4 mr-1.5" />
                {submitting ? 'Submitting...' : 'Post Review'}
              </Button>
            </form>
          </div>
        </div>

        {/* Right Public Reviews Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-slate-900">Recent Patient Experiences</h3>
            <span className="text-xs text-slate-500">{feedbacks.length} verified ratings</span>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading patient reviews..." />
          ) : (
            feedbacks.map((fb) => (
              <div
                key={fb.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{fb.hospitalName}</h4>
                    <p className="text-xs text-slate-500">
                      Doctor: <strong className="text-slate-700">{fb.doctorName}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-extrabold text-amber-900">{fb.rating}.0</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed my-3 italic">
                  "{fb.comment}"
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <div className="flex flex-wrap gap-1.5">
                    {fb.tags && fb.tags.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span>Reviewed by {fb.patientName} on {fb.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
