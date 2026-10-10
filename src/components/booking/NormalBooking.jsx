import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { useHospitals } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import { FaUser, FaPhone, FaCalendarAlt, FaClock, FaHospital, FaTicketAlt, FaShieldAlt } from 'react-icons/fa';

const NormalBooking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hospitalIdParam = searchParams.get('hospitalId') || 'h1';

  const { user } = useAuth();
  const { allHospitals, getHospital } = useHospitals();
  const { createBooking, selectedProblem, selectedSpecialty, setCurrentBooking } = useBooking();

  const hospital = getHospital(hospitalIdParam) || allHospitals[0];

  const [formData, setFormData] = useState({
    patientName: user?.name || '',
    patientPhone: user?.mobile || '',
    patientAge: user?.age || '32',
    patientGender: user?.gender || 'Male',
    specialty: selectedSpecialty || hospital?.specialty[0] || 'General Medicine',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: 'Morning (09:00 AM - 12:00 PM)',
    doctorName: hospital?.doctors?.[0]?.name || 'Assigned OPD Specialist'
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const bookingData = {
        ...formData,
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        emergency: false
      };
      const token = createBooking(bookingData);
      setCurrentBooking(token);
      setLoading(false);
      navigate('/token-confirmation');
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="text-center">
        <span className="badge badge-primary uppercase mb-1">
          <FaTicketAlt /> Confirmed OPD Token Generation
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Book OPD Token Pass</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Fill in patient information to generate a live QR verification token
        </p>
      </div>

      {/* Selected Hospital Summary Card */}
      <Card className="p-4 bg-sky-50/60 border-sky-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
            <FaHospital size={18} />
          </div>
          <div>
            <div className="font-black text-sm text-slate-900">{hospital.name}</div>
            <div className="text-xs text-slate-500">{hospital.address} • {hospital.distance} away</div>
          </div>
        </div>
      </Card>

      {/* Booking Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Patient Legal Full Name"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            placeholder="e.g. Ramesh Kumar"
            icon={FaUser}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Contact Mobile"
              name="patientPhone"
              value={formData.patientPhone}
              onChange={handleChange}
              placeholder="9876543210"
              icon={FaPhone}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Age</label>
              <input
                type="number"
                name="patientAge"
                value={formData.patientAge}
                onChange={handleChange}
                placeholder="30"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Gender</label>
              <select
                name="patientGender"
                value={formData.patientGender}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Medical Specialty</label>
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white"
              >
                {hospital.specialty.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Consultation Date"
              name="appointmentDate"
              type="date"
              value={formData.appointmentDate}
              onChange={handleChange}
              icon={FaCalendarAlt}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Preferred Time Slot</label>
              <select
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white"
              >
                <option value="Morning (08:30 AM - 11:30 AM)">Morning (08:30 AM - 11:30 AM)</option>
                <option value="Afternoon (12:00 PM - 03:00 PM)">Afternoon (12:00 PM - 03:00 PM)</option>
                <option value="Evening (04:00 PM - 07:00 PM)">Evening (04:00 PM - 07:00 PM)</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 mt-2">
            ℹ️ <strong>Zero Cancellation Penalty:</strong> You will receive real-time queue position updates on your mobile dashboard.
          </div>

          <Button type="submit" fullWidth disabled={loading} size="lg" className="mt-2 font-black">
            {loading ? 'Generating Token...' : 'Confirm & Generate OPD Pass'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default NormalBooking;
