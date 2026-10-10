import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export const BookToken = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { hospitals, selectedSpecialty, selectedHealthProblem, bookToken } = useQueue();
  const { user } = useAuth();

  const hospitalIdParam = searchParams.get('hospitalId');
  const deptParam = searchParams.get('dept');

  const [selectedHospitalId, setSelectedHospitalId] = useState(
    hospitalIdParam ? parseInt(hospitalIdParam) : hospitals[0]?.id || 1
  );

  const activeHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];

  const [selectedDepartment, setSelectedDepartment] = useState(
    deptParam || selectedSpecialty || activeHospital?.departments[0] || 'General Medicine'
  );

  const [timeSlot, setTimeSlot] = useState('Morning Slot (09:00 AM - 12:00 PM)');
  const [patientName, setPatientName] = useState(user?.name || 'Ramesh Kumar');
  const [patientAge, setPatientAge] = useState(user?.age || 32);
  const [patientGender, setPatientGender] = useState(user?.gender || 'Male');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '+91 98765 43210');
  const [symptomsNote, setSymptomsNote] = useState(selectedHealthProblem || '');
  const [isPriority, setIsPriority] = useState(false);
  const [priorityReason, setPriorityReason] = useState('Senior Citizen (60+)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activeHospital && !activeHospital.departments.includes(selectedDepartment)) {
      setSelectedDepartment(activeHospital.departments[0]);
    }
  }, [selectedHospitalId]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) {
      alert('Please fill in patient name and phone number.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newAppointment = bookToken({
        hospitalId: activeHospital.id,
        disease: symptomsNote || selectedHealthProblem || 'General Health Consultation',
        department: selectedDepartment,
        patientName,
        patientAge,
        patientGender,
        patientPhone,
        symptomsNote,
        timeSlot,
        isPriority,
        priorityReason: isPriority ? priorityReason : ''
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.error(err);
      }

      setIsSubmitting(false);
      navigate(`/confirmation?id=${newAppointment.id}`);
    }, 400);
  };

  return (
    <div className="container" style={{ maxWidth: '820px', marginTop: '2rem' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/hospitals" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
          <i className="fas fa-arrow-left"></i> Back to Hospital Selection
        </Link>
      </div>

      <div className="card" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
          <div className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>
            <i className="fas fa-ticket-simple"></i> Direct OPD Token Reservation
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', margin: 0 }}>
            Book OPD Token Pass
          </h2>
          <p className="text-muted" style={{ fontSize: '0.92rem', marginTop: '0.35rem' }}>
            Secure your turn in advance. Receive real-time SMS & digital pass to monitor queue live.
          </p>
        </div>

        <form onSubmit={handleBookingSubmit}>
          {/* Section 1: Hospital & Specialty Selection */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
              1. Hospital & Medical Department
            </h4>

            <div className="grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Select Hospital</label>
                <select
                  className="form-select"
                  value={selectedHospitalId}
                  onChange={(e) => setSelectedHospitalId(parseInt(e.target.value))}
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">OPD Department</label>
                <select
                  className="form-select"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  {activeHospital?.departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Queue Telemetry for this hospital */}
            <div style={{ background: '#f0f9ff', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #bae6fd' }}>
              <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
                <div className="flex">
                  <div className="pulse-dot"></div>
                  <span style={{ fontSize: '0.88rem', color: '#0369a1', fontWeight: 600 }}>
                    Current Active Token: <strong>#{activeHospital.currentToken}</strong>
                  </span>
                </div>
                <div className="flex" style={{ fontSize: '0.88rem', color: '#0369a1' }}>
                  <span>Estimated Wait: <strong>~{activeHospital.waitingTime} mins</strong></span>
                  <span>•</span>
                  <span>Available Tokens: <strong>{activeHospital.availableTokens}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Preferred OPD Slot */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
              2. OPD Consultation Timing
            </h4>

            <div className="grid-3" style={{ gap: '0.75rem' }}>
              {[
                { slot: 'Morning Slot (09:00 AM - 12:00 PM)', label: 'Morning Session', time: '09:00 AM - 12:00 PM' },
                { slot: 'Afternoon Slot (01:30 PM - 04:30 PM)', label: 'Afternoon Session', time: '01:30 PM - 04:30 PM' },
                { slot: 'Evening Slot (05:00 PM - 07:30 PM)', label: 'Evening Session', time: '05:00 PM - 07:30 PM' }
              ].map((s) => {
                const isSelected = timeSlot === s.slot;
                return (
                  <div
                    key={s.slot}
                    onClick={() => setTimeSlot(s.slot)}
                    style={{
                      cursor: 'pointer',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                      background: isSelected ? '#f0f9ff' : 'white',
                      transition: '0.2s'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {s.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Patient Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
              3. Patient Details
            </h4>

            <div className="grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name of Patient *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number (for SMS token updates) *</label>
                <input
                  type="tel"
                  required
                  className="form-control"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="32"
                  min="1"
                  max="120"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other / Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Symptoms / Reason for Visit (Optional)</label>
              <textarea
                className="form-control"
                rows="2"
                value={symptomsNote}
                onChange={(e) => setSymptomsNote(e.target.value)}
                placeholder="Briefly describe health concern (e.g. High fever for 2 days, headache)..."
                style={{ borderRadius: '12px', resize: 'vertical' }}
              ></textarea>
            </div>

            {/* Priority Assistance Checkbox */}
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.92rem' }}>
                <input
                  type="checkbox"
                  checked={isPriority}
                  onChange={(e) => setIsPriority(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
                <span>Request Priority OPD Fast-Track (Senior Citizens, Pregnant Women, Differently-Abled)</span>
              </label>

              {isPriority && (
                <div style={{ marginTop: '0.75rem', paddingLeft: '1.75rem' }}>
                  <select
                    className="form-select"
                    value={priorityReason}
                    onChange={(e) => setPriorityReason(e.target.value)}
                    style={{ fontSize: '0.88rem' }}
                  >
                    <option value="Senior Citizen (60+)">Senior Citizen (60+ yrs)</option>
                    <option value="Pregnant Mother">Pregnant Mother</option>
                    <option value="Differently Abled / Mobility Impairment">Differently Abled / Mobility Impairment</option>
                    <option value="Pediatric Infant (Under 2 yrs)">Pediatric Infant (Under 2 yrs)</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Submit Action */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', textAlign: 'center' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-lg"
              style={{ minWidth: '280px', padding: '1rem 2.5rem', fontSize: '1.1rem' }}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Generating Token...
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle"></i> Confirm & Generate Token Pass
                </>
              )}
            </button>
            <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.75rem' }}>
              Instant digital token generated. Zero physical waiting required.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
