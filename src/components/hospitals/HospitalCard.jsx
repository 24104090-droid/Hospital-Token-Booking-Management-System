import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/HospitalContext';
import { useBooking } from '../../context/BookingContext';
import { useLocation } from '../../context/LocationContext';
import { getDoctorsByHospital } from '../../data/doctors';
import { 
  FaHospital, 
  FaStar, 
  FaMapMarkerAlt, 
  FaClock, 
  FaTicketAlt, 
  FaHeart, 
  FaRegHeart, 
  FaBed, 
  FaUserMd, 
  FaPhoneAlt, 
  FaChevronDown, 
  FaChevronUp, 
  FaCheck,
  FaArrowRight,
  FaShieldAlt,
  FaAmbulance,
  FaDirections
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const HospitalCard = ({ hospital, onSelect, onBook }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, isInCompare, toggleCompare } = useHospital();
  const { updateBookingData } = useBooking();
  const { getDistanceTo, getETATo, openNavigation, isLiveGPS } = useLocation();
  const [showDoctors, setShowDoctors] = useState(false);

  if (!hospital) return null;

  const hospitalDoctors = getDoctorsByHospital(hospital.id);
  const isGovt = hospital.type === 'Government';
  const fav = isFavorite(hospital.id);
  const inComp = isInCompare(hospital.id);

  // Dynamic crowd level computation
  const waitTime = hospital.currentWaitTime || (isGovt ? 14 : 12);
  const crowdLevel = 
    waitTime <= 10 ? { label: 'Low Crowd', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' } :
    waitTime <= 25 ? { label: 'Moderate Queue', color: 'bg-amber-100 text-amber-800 border-amber-300' } :
    { label: 'High Volume', color: 'bg-rose-100 text-rose-800 border-rose-300' };

  // Dynamic distance & ETA calculation based on user GPS or selected area
  const distanceKm = hospital.location?.lat 
    ? getDistanceTo(hospital.location.lat, hospital.location.lng) 
    : (hospital.distance || 2.5);
  const driveETA = hospital.location?.lat 
    ? getETATo(hospital.location.lat, hospital.location.lng) 
    : '10 mins';

  const handleBookHospital = (e) => {
    e?.stopPropagation();
    updateBookingData({
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      hospitalAddress: hospital.address,
      consultationFee: hospital.consultationFee
    });
    if (onBook) {
      onBook(hospital);
    } else {
      navigate(`/book?hospitalId=${hospital.id}`);
    }
  };

  const handleBookWithDoctor = (doc, e) => {
    e?.stopPropagation();
    updateBookingData({
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      hospitalAddress: hospital.address,
      doctorId: doc.id,
      doctorName: doc.name,
      doctorRoom: doc.room,
      specialty: doc.specialty,
      consultationFee: doc.consultationFee
    });
    navigate(`/book?hospitalId=${hospital.id}&doctorId=${doc.id}`);
    toast.success(`Selected ${doc.name} at ${hospital.name}`);
  };

  return (
    <div className="w-full h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-sky-300 dark:hover:border-sky-500 transition-all duration-200 flex flex-col justify-between overflow-hidden text-left group">
      <div className="flex-1 flex flex-col">
        {/* Card Header Media & Badges */}
        <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
          <img
            src={hospital.image}
            alt={hospital.name}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
            {/* Government vs Private badge */}
            <span className={`badge py-1.5 px-3.5 text-xs font-black tracking-wider shadow-md ${
              isGovt
                ? 'bg-emerald-600 text-white border-none'
                : 'bg-indigo-600 text-white border-none'
            }`}>
              {isGovt ? '🏛️ GOVT HOSPITAL (FREE OPD)' : '🏢 PRIVATE MULTI-SPECIALTY'}
            </span>

            {/* Favorite & Compare Action Pills */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCompare(hospital);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md transition-all cursor-pointer ${
                  inComp
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-black/40 hover:bg-black/60 text-white'
                }`}
                title="Compare hospital side-by-side"
              >
                {inComp ? '✓ Compared' : '+ Compare'}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(hospital.id);
                }}
                className="p-2 rounded-xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all cursor-pointer"
                title="Save to favorites"
              >
                {fav ? <FaHeart className="text-rose-500" size={15} /> : <FaRegHeart size={15} />}
              </button>
            </div>
          </div>

          {/* Bottom Overlay Info */}
          <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white text-sm">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 font-black bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg text-xs">
                <FaStar size={11} /> {hospital.rating}
              </span>
              <span className="text-slate-200 text-xs font-bold">({hospital.reviews} reviews)</span>
            </div>

            <span className="text-xs font-bold text-sky-200 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
              <FaMapMarkerAlt size={12} className="text-sky-400" />
              <span>{distanceKm} km • ~{driveETA}</span>
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Title & Area */}
          <div>
            <h3 className="font-black text-xl sm:text-2xl text-slate-900 dark:text-white leading-snug group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">
              {hospital.name}
            </h3>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="text-slate-500 dark:text-slate-400 font-medium">{hospital.address}</span>
            </p>
          </div>

          {/* Live Metrics Grid (4 items) */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/60">
            {/* Tokens Left */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                <FaTicketAlt />
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold text-slate-400 block tracking-wider">Available</span>
                <span className="text-sm sm:text-base font-black text-teal-700">
                  {hospital.tokensAvailable || 18} Tokens
                </span>
              </div>
            </div>

            {/* Wait Time */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                <FaClock />
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold text-slate-400 block tracking-wider">Live Wait</span>
                <span className="text-sm sm:text-base font-black text-amber-700">
                  ~{waitTime} Mins
                </span>
              </div>
            </div>

            {/* ICU Beds */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                <FaBed />
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold text-slate-400 block tracking-wider">ICU Beds</span>
                <span className="text-sm sm:text-base font-black text-sky-800">
                  {hospital.icuBedsAvailable} Vacant
                </span>
              </div>
            </div>

            {/* Consultation Fee */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm flex-shrink-0">
                ₹
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold text-slate-400 block tracking-wider">OPD Fee</span>
                <span className="text-sm sm:text-base font-black text-emerald-700">
                  {hospital.consultationFee === 0 ? '₹0 Free' : `₹${hospital.consultationFee}`}
                </span>
              </div>
            </div>
          </div>

          {/* Crowd & Open Status Bar */}
          <div className="flex items-center justify-between pt-1">
            <span className={`badge font-black text-xs py-1 px-3 border ${crowdLevel.color}`}>
              ● {crowdLevel.label}
            </span>

            <span className="text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Open 24/7 Casualty</span>
            </span>
          </div>

          {/* Embedded Doctors Chamber Dropdown */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowDoctors(!showDoctors);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-black transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FaUserMd size={16} className="text-sky-600 dark:text-sky-400" />
                <span>On-Duty Specialists ({hospitalDoctors.length} Doctors)</span>
              </div>
              {showDoctors ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </button>

            {/* Inline Expanded Doctor Chamber List */}
            {showDoctors && (
              <div className="mt-2.5 space-y-2.5 max-h-56 overflow-y-auto pr-1 animate-fadeIn">
                {hospitalDoctors.length === 0 ? (
                  <p className="text-sm text-slate-400 p-2 text-center">General duty medical officers on rotation.</p>
                ) : (
                  hospitalDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 text-sm"
                    >
                      <div className="truncate">
                        <div className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">{doc.name}</div>
                        <div className="text-xs text-sky-700 dark:text-sky-400 font-bold mt-0.5">{doc.specialty} • {doc.room}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{doc.timing}</div>
                      </div>

                      <button
                        onClick={(e) => handleBookWithDoctor(doc, e)}
                        className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-black text-xs transition-all flex-shrink-0 cursor-pointer shadow-xs"
                      >
                        Book
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-5 sm:p-6 pt-0 flex items-center gap-2.5 mt-auto">
        <button
          onClick={handleBookHospital}
          className="flex-1 py-4 px-5 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-black text-base shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.01] active:scale-95"
        >
          <FaTicketAlt size={16} />
          <span>Book OPD Token</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (hospital.location?.lat && hospital.location?.lng) {
              openNavigation(hospital.location.lat, hospital.location.lng);
            }
          }}
          className="py-3.5 px-4 rounded-2xl border border-sky-200 dark:border-sky-800 hover:border-sky-400 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-700 dark:text-sky-300 text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
          title="Turn-by-turn navigation in Google Maps"
        >
          <FaDirections size={16} className="text-sky-600 dark:text-sky-400" />
          <span className="hidden sm:inline">Route</span>
        </button>

        <button
          onClick={() => navigate(`/hospital/${hospital.id}`)}
          className="p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 hover:border-sky-500 bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-sky-700 dark:hover:text-sky-400 text-sm font-bold transition-all cursor-pointer"
          title="View full hospital profile & guidelines"
        >
          <FaArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default HospitalCard;
