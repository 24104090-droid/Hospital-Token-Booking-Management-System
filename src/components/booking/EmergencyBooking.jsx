import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';
import { useLocation } from '../../context/LocationContext';
import { hospitals } from '../../data/hospitals';
import { emergencyHotlines } from '../../data/mockData';
import Card from '../common/Card';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import HospitalInteractiveMap from '../map/HospitalInteractiveMap';
import { 
  FaAmbulance, 
  FaPhoneAlt, 
  FaHospital, 
  FaMapMarkerAlt, 
  FaExclamationTriangle, 
  FaShieldAlt, 
  FaHeartbeat,
  FaArrowRight,
  FaCheckCircle,
  FaLandmark,
  FaDirections,
  FaCrosshairs
} from 'react-icons/fa';

const EmergencyBooking = () => {
  const navigate = useNavigate();
  const { bookEmergency } = useBooking();
  const { isTamil } = useLanguage();
  const { coords, locationName, isLiveGPS, loading: gpsLoading, detectLiveLocation, getDistanceTo, getETATo, openNavigation } = useLocation();

  // RULE: Emergency token booking is strictly routed to the Government Hospital (TVMCH)
  const govtEmergencyHospital = hospitals.find(h => h.type === 'Government') || hospitals[0];
  const [selectedHospital, setSelectedHospital] = useState(govtEmergencyHospital);
  const [emergencyType, setEmergencyType] = useState('Chest Pain / Cardiac Emergency');
  const [patientName, setPatientName] = useState('Emergency Patient');
  const [patientPhone, setPatientPhone] = useState('9842154320');
  const [needAmbulance, setNeedAmbulance] = useState(true);
  const [loading, setLoading] = useState(false);

  const emergencyDistance = govtEmergencyHospital.location 
    ? getDistanceTo(govtEmergencyHospital.location.lat, govtEmergencyHospital.location.lng)
    : govtEmergencyHospital.distance;
  const emergencyETA = govtEmergencyHospital.location 
    ? getETATo(govtEmergencyHospital.location.lat, govtEmergencyHospital.location.lng)
    : '6 mins';

  const emergencyConditions = [
    { title: 'Chest Pain / Cardiac Emergency', tamil: 'நெஞ்சு வலி / மாரடைப்பு அவசரம்', desc: 'Acute chest pressure, sweating, radiating arm pain', color: 'border-red-500 bg-red-50/80 text-red-950' },
    { title: 'Road Accident & Severe Trauma', tamil: 'சாலை விபத்து & தீவிர காயம்', desc: 'Collision, head injury, bone fractures, active bleeding', color: 'border-rose-500 bg-rose-50/80 text-rose-950' },
    { title: 'Breathing Failure & Severe Asthma', tamil: 'மூச்சுத்திணறல் & ஆஸ்துமா', desc: 'Gasping for air, cyanosis, severe acute wheezing', color: 'border-orange-500 bg-orange-50/80 text-orange-950' },
    { title: 'Stroke & Sudden Paralysis', tamil: 'பக்கவாதம் & மூளை இரத்தப்போக்கு', desc: 'Facial drooping, arm weakness, slurred speech', color: 'border-purple-500 bg-purple-50/80 text-purple-950' },
    { title: 'Pediatric Emergency & Seizures', tamil: 'குழந்தை அவசர சிகிச்சை & வலிப்பு', desc: 'High fever convulsion, infant unresponsive, severe dehydration', color: 'border-amber-500 bg-amber-50/80 text-amber-950' },
    { title: 'Burns & Chemical Poisoning', tamil: 'தீக்காயம் & விஷக்கடி / நச்சு', desc: 'Chemical trauma, snake bite, severe toxic ingestion', color: 'border-slate-500 bg-slate-100 text-slate-950' }
  ];

  const handleTriggerEmergency = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const emergencyToken = await bookEmergency({
        emergencyType,
        patientName,
        patientPhone,
        hospitalId: selectedHospital.id,
        hospitalName: selectedHospital.name,
        hospitalAddress: selectedHospital.address,
        ambulanceNeeded: needAmbulance
      });

      if (emergencyToken) {
        toast.success('Emergency Token #E-01 dispatched to TVMCH Casualty Desk!');
        navigate('/confirmation');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto text-left">
      {/* Top Banner */}
      <div className="gradient-emergency p-6 sm:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-300 animate-ping"></span>
            <span>24/7 Tirunelveli District Government Emergency Response</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black mb-2">
            Instant Emergency Priority Token (108 Casualty)
          </h1>
          <p className="text-rose-100 text-xs sm:text-sm leading-relaxed mb-4">
            Bypass standard queues for acute trauma, cardiac arrest, stroke, and road accidents. Direct notification dispatched to the Chief Medical Officer at TVMCH Casualty Desk.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:108"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black rounded-xl text-xs shadow-lg no-underline"
            >
              <FaPhoneAlt /> Call 108 Ambulance Direct
            </a>
            <a
              href="tel:04622572735"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl text-xs border border-white/30 no-underline"
            >
              <FaHospital /> TVMCH Casualty: 0462-2572735
            </a>
          </div>
        </div>
      </div>

      {/* Emergency Hotlines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {emergencyHotlines.slice(0, 3).map((item) => (
          <div key={item.name} className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">{item.name}</div>
              <div className="text-base font-black text-rose-600 mt-0.5">{item.number}</div>
            </div>
            <a
              href={`tel:${item.number.split(' ')[0]}`}
              className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            >
              <FaPhoneAlt size={12} />
            </a>
          </div>
        ))}
      </div>

      {/* Emergency Booking Form */}
      <form onSubmit={handleTriggerEmergency} className="flex flex-col gap-6">
        {/* Step 1: Medical Condition */}
        <Card className="p-5">
          <h2 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
            <FaExclamationTriangle className="text-rose-600" /> 1. Select Emergency Medical Condition
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {emergencyConditions.map((cond) => {
              const isSelected = emergencyType === cond.title;
              return (
                <div
                  key={cond.title}
                  onClick={() => setEmergencyType(cond.title)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${cond.color} ${
                    isSelected ? 'ring-2 ring-rose-500 shadow-md font-bold' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="font-extrabold text-xs text-slate-900 flex items-center justify-between">
                    <div>
                      <span>{cond.title}</span>
                      <div className="text-[10px] text-rose-700 font-semibold mt-0.5">{cond.tamil}</div>
                    </div>
                    {isSelected && <FaCheckCircle className="text-rose-600 flex-shrink-0" size={16} />}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">{cond.desc}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Step 2: Target Government Trauma Hospital (Strictly Government Hospital Only) */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <FaLandmark className="text-emerald-700" /> 2. Government Emergency Casualty Center (Auto-Selected)
            </h2>
            <span className="badge bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] font-black">
              GOVERNMENT ONLY
            </span>
          </div>

          {/* Caller GPS status bar */}
          <div className="mb-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isLiveGPS ? 'bg-emerald-500 animate-ping' : 'bg-sky-500'}`}></span>
              <span className="text-slate-600 font-medium">Caller Location:</span>
              <strong className="text-slate-900 font-bold">{locationName}</strong>
            </div>

            <button
              type="button"
              onClick={detectLiveLocation}
              disabled={gpsLoading}
              className="px-2.5 py-1 rounded-xl bg-white border border-sky-200 text-sky-700 hover:bg-sky-50 text-[11px] font-black transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <FaCrosshairs className={gpsLoading ? 'animate-spin' : ''} />
              <span>{gpsLoading ? 'Detecting GPS...' : 'Update GPS'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-md">
                <FaHospital />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge bg-emerald-700 text-white text-[9px] font-black">
                    🏛️ GOVT APEX TRAUMA CARE
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                    📍 {emergencyDistance} km away (~{emergencyETA})
                  </span>
                </div>
                <h3 className="font-black text-base text-slate-900 mt-1">
                  {govtEmergencyHospital.name}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">{govtEmergencyHospital.address}</p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-emerald-200">
              <span className="badge bg-emerald-600 text-white text-[10px] font-black py-1 px-2.5">
                ICU BEDS: {govtEmergencyHospital.icuBedsAvailable} VACANT
              </span>
              <button
                type="button"
                onClick={() => openNavigation(govtEmergencyHospital.location.lat, govtEmergencyHospital.location.lng)}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Launch Google Maps GPS navigation to emergency entrance"
              >
                <FaDirections />
                <span>Navigate to Casualty</span>
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 italic">
            * By Tamil Nadu Government protocol, 108 Emergency Priority passes and caller coordinates are routed directly to the regional teaching hospital casualty ward.
          </p>
        </Card>

        {/* Live Interactive Emergency Route Map */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <FaDirections className="text-red-600" /> Live GPS Route to Nearest Emergency Casualty
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Auto-zoomed route from your location to the nearest 24/7 trauma emergency center
              </p>
            </div>
            <span className="badge bg-red-100 text-red-800 border-red-200 text-[10px] font-black">
              1-CLICK AUTO ROUTE
            </span>
          </div>

          <HospitalInteractiveMap 
            hospitals={hospitals} 
            autoFocusEmergency={true} 
            height="360px" 
          />
        </Card>

        {/* Step 3: Patient Details & Ambulance Dispatch */}
        <Card className="p-5">
          <h2 className="text-sm font-black text-slate-900 mb-3">3. Patient Info & Immediate Dispatch</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Patient Name</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs font-medium"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Emergency Mobile Number</label>
              <input
                type="tel"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs font-medium"
                required
              />
            </div>
          </div>

          <div className="mt-4 p-3.5 bg-rose-50/80 rounded-2xl border border-rose-200 flex items-center justify-between">
            <label className="flex items-center gap-2.5 text-xs font-black text-slate-900 cursor-pointer">
              <input
                type="checkbox"
                checked={needAmbulance}
                onChange={(e) => setNeedAmbulance(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded"
              />
              <span>Request Immediate 108 Ambulance Dispatch to Caller Location</span>
            </label>
            <span className="badge bg-rose-600 text-white font-black text-[10px]">108 ETA ~8 MINS</span>
          </div>

          <Button
            type="submit"
            disabled={loading}
            size="lg"
            variant="danger"
            className="w-full mt-5 font-black text-sm py-4 shadow-xl shadow-rose-900/30 cursor-pointer hover:scale-[1.01]"
            icon={FaAmbulance}
          >
            {loading ? 'Dispatching Emergency Alert...' : '🚨 GENERATE GOVERNMENT PRIORITY EMERGENCY TOKEN #E-01'}
          </Button>
        </Card>
      </form>
    </div>
  );
};

export default EmergencyBooking;
