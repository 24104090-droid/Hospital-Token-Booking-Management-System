import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/HospitalContext';
import { useBooking } from '../../context/BookingContext';
import { getDoctorsByHospital } from '../../data/doctors';
import Card from '../common/Card';
import Button from '../common/Button';
import { 
  FaMapMarkerAlt, 
  FaStar, 
  FaClock, 
  FaTicketAlt, 
  FaPhoneAlt, 
  FaAmbulance, 
  FaUserMd, 
  FaShieldAlt, 
  FaCheck, 
  FaArrowLeft,
  FaCalendarCheck,
  FaBed,
  FaCompass
} from 'react-icons/fa';

const HospitalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getHospitalById, hospitals } = useHospital();
  const { updateBookingData } = useBooking();

  const hospital = getHospitalById(id) || hospitals[0];
  const hospitalDoctors = getDoctorsByHospital(hospital?.id);

  if (!hospital) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-slate-800">Hospital not found</h2>
        <Button onClick={() => navigate('/hospitals')} className="mt-4">Back to Hospitals</Button>
      </div>
    );
  }

  const handleBookToken = (dept = 'General Medicine') => {
    updateBookingData({
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      hospitalAddress: hospital.address,
      specialty: dept,
      consultationFee: hospital.consultationFee
    });
    navigate(`/book?hospitalId=${hospital.id}&department=${encodeURIComponent(dept)}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Back Link */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900"
        >
          <FaArrowLeft /> Back to Directory
        </button>
      </div>

      {/* Hospital Hero Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`badge text-[9px] font-extrabold ${hospital.type === 'Government' ? 'badge-success' : 'badge-primary'}`}>
                {hospital.type?.toUpperCase()} HOSPITAL
              </span>
              <span className="badge badge-success text-[9px]">VERIFIED NABH / GOVT</span>
              {hospital.emergencyAvailable && (
                <span className="badge badge-danger text-[9px] flex items-center gap-1">
                  <FaAmbulance size={10} /> 24/7 CASUALTY
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{hospital.name}</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
              <FaMapMarkerAlt className="text-rose-500" /> {hospital.address}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Button
              onClick={() => handleBookToken()}
              size="md"
              className="flex-1 md:flex-none font-bold text-xs"
              icon={FaCalendarCheck}
            >
              Book OPD Token Pass
            </Button>
            <Button
              onClick={() => navigate(`/hospital/${hospital.id}/map`)}
              variant="outline"
              size="md"
              className="flex-1 md:flex-none font-bold text-xs border-sky-300 text-sky-700 hover:bg-sky-50"
              icon={FaCompass}
            >
              Indoor Floor Map
            </Button>
            <Button
              onClick={() => navigate('/emergency')}
              variant="danger"
              size="md"
              className="flex-1 md:flex-none font-bold text-xs"
              icon={FaAmbulance}
            >
              Emergency 108
            </Button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="bg-slate-50 p-4 rounded-2xl">
            <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium mb-1">
              <FaTicketAlt className="text-sky-500" /> Consultation Fee
            </div>
            <div className="text-xl font-black text-slate-900">
              {hospital.consultationFee === 0 ? 'FREE (Govt OPD)' : `₹${hospital.consultationFee}`}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl">
            <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium mb-1">
              <FaBed className="text-teal-600" /> ICU & Ward Beds
            </div>
            <div className="text-xl font-black text-emerald-700">
              {hospital.icuBedsAvailable || 10} ICU / {hospital.generalBedsAvailable || 40} Gen
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl">
            <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium mb-1">
              <FaStar className="text-amber-500" /> Rating & Reviews
            </div>
            <div className="text-xl font-black text-slate-900">
              {hospital.rating} <span className="text-xs text-slate-400 font-normal">({hospital.reviews} reviews)</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl">
            <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium mb-1">
              <FaPhoneAlt className="text-sky-500" /> OPD Helpdesk
            </div>
            <div className="text-base font-black text-slate-900">{hospital.phone}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Departments & Doctors */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Departments & Specialties */}
          <Card>
            <h2 className="text-base font-extrabold text-slate-900 mb-3">Available Medical Departments</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(hospital.departments || []).map((dept) => (
                <div
                  key={dept}
                  onClick={() => handleBookToken(dept)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50 transition-all cursor-pointer flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-slate-800">{dept}</span>
                  <span className="text-sky-600 text-xs font-bold">Book →</span>
                </div>
              ))}
            </div>
          </Card>

          {/* On-Duty Doctors */}
          <Card>
            <h2 className="text-base font-extrabold text-slate-900 mb-3">Active On-Duty Doctors</h2>
            {hospitalDoctors.length > 0 ? (
              <div className="flex flex-col gap-3">
                {hospitalDoctors.map((doc) => (
                  <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={doc.image}
                        alt={doc.name}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';
                        }}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900">{doc.name}</div>
                        <div className="text-xs text-slate-500">{doc.specialty} • {doc.room} ({doc.timing})</div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        updateBookingData({
                          hospitalId: hospital.id,
                          hospitalName: hospital.name,
                          hospitalAddress: hospital.address,
                          specialty: doc.specialty,
                          consultationFee: hospital.consultationFee,
                          doctorId: doc.id,
                          doctorName: doc.name,
                          doctorRoom: doc.room
                        });
                        navigate(`/book?hospitalId=${hospital.id}&department=${encodeURIComponent(doc.specialty)}&doctorId=${doc.id}`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold"
                    >
                      Book Doctor
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">General OPD duty doctors active on rotational schedule.</p>
            )}
          </Card>
        </div>

        {/* Right 1 Col: Facilities & Timing */}
        <div className="flex flex-col gap-6">
          <Card>
            <h2 className="text-base font-extrabold text-slate-900 mb-3">Hospital Facilities</h2>
            <div className="flex flex-col gap-2">
              {(hospital.facilities || []).map((facility) => (
                <div key={facility} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <FaCheck className="text-emerald-500" />
                  <span>{facility}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-extrabold text-slate-900 mb-3">OPD Guidelines & Schemes</h2>
            <div className="flex flex-col gap-3 text-xs text-slate-600 leading-relaxed">
              <div>
                <strong>Operating Hours:</strong> {hospital.openHours}
              </div>
              <div>
                <strong>Government Schemes:</strong> Chief Minister’s Comprehensive Health Insurance (CMCHIS) & PM-JAY accepted.
              </div>
              <div>
                <strong>Emergency Direct Line:</strong> {hospital.emergencyPhone}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HospitalDetails;
