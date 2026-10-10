import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/HospitalContext';
import { useBooking } from '../../context/BookingContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { FaStar, FaMapMarkerAlt, FaClock, FaCheckCircle, FaAward, FaArrowRight, FaTicketAlt } from 'react-icons/fa';

const HospitalRecommendation = () => {
  const navigate = useNavigate();
  const { getRecommendations } = useHospital();
  const { bookingData, updateBookingData } = useBooking();

  const specialty = bookingData?.specialty || 'General Medicine';
  const recommended = getRecommendations(specialty);

  const handleSelect = (hosp) => {
    updateBookingData({
      hospitalId: hosp.id,
      hospitalName: hosp.name,
      hospitalAddress: hosp.address,
      consultationFee: hosp.consultationFee
    });
    navigate(`/book?hospitalId=${hosp.id}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-r from-sky-900 to-teal-900 text-white p-6 sm:p-8 rounded-3xl shadow-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/20 text-sky-300 rounded-full text-xs font-bold uppercase mb-2">
          <FaAward /> OPD Smart Routing Recommendation
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">
          Top Hospital Recommendations for {specialty}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Ranked by verified doctor availability, shortest queue wait times, patient satisfaction, and distance in Tirunelveli.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {recommended.slice(0, 5).map((hospital, index) => (
          <Card key={hospital.id} className="p-5 hover:border-sky-400 transition-all shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center font-black text-xs flex-shrink-0 ${
                  index === 0 ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 text-slate-700'
                }`}>
                  <span className="text-[9px] font-normal">RANK</span>
                  <span>#{index + 1}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge text-[9px] font-extrabold ${hospital.type === 'Government' ? 'badge-success' : 'badge-primary'}`}>
                      {hospital.type?.toUpperCase()}
                    </span>
                    <span className="badge badge-success text-[9px] font-black">
                      {hospital.matchScore || 94}% MATCH SCORE
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 hover:text-sky-600 transition-colors">
                    {hospital.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 font-medium">
                      <FaMapMarkerAlt className="text-rose-500" size={10} /> {hospital.area} • {hospital.distance} km
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <FaStar className="text-amber-500" size={11} /> {hospital.rating} ({hospital.reviews})
                    </span>
                    <span>•</span>
                    <span className="text-slate-700 font-semibold">
                      Fee: {hospital.consultationFee === 0 ? 'FREE' : `₹${hospital.consultationFee}`}
                    </span>
                  </div>

                  {hospital.matchReason && (
                    <p className="text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md mt-2 inline-block font-medium">
                      💡 {hospital.matchReason}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <Button
                  onClick={() => handleSelect(hospital)}
                  size="md"
                  className="font-bold text-xs"
                  icon={FaArrowRight}
                >
                  Select & Book Token
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HospitalRecommendation;
