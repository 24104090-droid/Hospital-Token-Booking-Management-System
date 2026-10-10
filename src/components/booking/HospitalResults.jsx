import React, { useState } from 'react';
import { getDepartmentHospitals } from '../../data/hospitals';
import { getDoctorsByHospitalAndSpecialty } from '../../data/doctors';
import { getSpecialtyForProblem } from '../../data/problems';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { 
  FaHospital, 
  FaMapMarkerAlt, 
  FaStar, 
  FaClock, 
  FaTicketAlt, 
  FaArrowLeft, 
  FaArrowRight, 
  FaCheckCircle,
  FaShieldAlt,
  FaFilter,
  FaUserMd,
  FaLandmark,
  FaBuilding
} from 'react-icons/fa';

const HospitalResults = ({ specialty, selectedDate, selectedHospital, onSelectHospital, onNext, onBack }) => {
  const { isTamil } = useLanguage();
  const [filterType, setFilterType] = useState('all'); // 'all', 'government', 'private'
  
  // Resolve canonical specialty (e.g. 'Skin Allergy' -> 'Dermatology', 'Chest Pain' -> 'Cardiology')
  const canonicalSpecialty = specialty ? (getSpecialtyForProblem(specialty) || specialty) : 'General Medicine';

  // Strict department filter: ONLY hospitals that have this specialty department
  const hospitalList = getDepartmentHospitals(canonicalSpecialty, selectedDate);

  const filteredHospitals = hospitalList.filter(h => {
    if (filterType === 'all') return true;
    return h.type.toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="text-center">
        <span className="badge badge-primary uppercase tracking-wider mb-2 inline-flex items-center gap-1.5">
          <FaHospital /> {isTamil ? `படி 3: ${canonicalSpecialty} மருத்துவமனை தேர்வு` : `Step 3: Select Hospital for ${canonicalSpecialty}`}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          {isTamil ? `${canonicalSpecialty} துறை உள்ள மருத்துவமனைகள்` : `Hospitals with ${canonicalSpecialty} Department`}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
          {isTamil 
            ? `${selectedDate || 'இன்று'} அன்று திருநெல்வேலியில் ${canonicalSpecialty} சிகிச்சை மற்றும் OPD வசதி உள்ள மருத்துவமனைகள் மட்டும் காண்பிக்கப்படுகின்றன.`
            : `Showing only verified Tirunelveli hospitals offering certified ${canonicalSpecialty} consultation and OPD slots on ${selectedDate}.`}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 bg-slate-100 p-1.5 rounded-2xl max-w-lg mx-auto w-full border border-slate-200">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
            filterType === 'all'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isTamil ? 'அனைத்தும்' : 'All'} ({hospitalList.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterType('government')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            filterType === 'government'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-emerald-800 hover:bg-emerald-50'
          }`}
        >
          <FaLandmark size={11} />
          <span>Govt Free OPD</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterType('private')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            filterType === 'private'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-indigo-800 hover:bg-indigo-50'
          }`}
        >
          <FaBuilding size={11} />
          <span>Private Hospitals</span>
        </button>
      </div>

      {/* Hospital Cards Grid */}
      {filteredHospitals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div className="text-3xl mb-2">🏥</div>
          <h3 className="font-extrabold text-base text-slate-900">
            {isTamil 
              ? `${canonicalSpecialty} துறைக்கான மருத்துவமனைகள் ஏதும் கிடைக்கவில்லை`
              : `No ${filterType !== 'all' ? filterType : ''} Hospitals found for ${canonicalSpecialty}`}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isTamil 
              ? 'அனைத்து மருத்துவமனைகளையும் காண கீழே உள்ள பொத்தானை கிளிக் செய்யவும்.'
              : `Try switching to "All" to view all available hospitals offering ${canonicalSpecialty}.`}
          </p>
          <button
            onClick={() => setFilterType('all')}
            className="mt-3 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold"
          >
            {isTamil ? `அனைத்து ${hospitalList.length} மருத்துவமனைகளையும் காட்டு` : `Show All ${hospitalList.length} Hospitals`}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHospitals.map((hospital) => {
            const isSelected = selectedHospital?.id === hospital.id;
            const isGovt = hospital.type.toLowerCase() === 'government';
            const matchedDocs = getDoctorsByHospitalAndSpecialty(hospital.id, canonicalSpecialty);

            return (
              <Card
                key={hospital.id}
                onClick={() => onSelectHospital(hospital)}
                className={`cursor-pointer transition-all border-2 relative p-5 ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/40 ring-2 ring-sky-300 shadow-lg'
                    : 'border-slate-200 hover:border-sky-300 hover:shadow-md bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`badge text-[9px] font-black ${
                        isGovt ? 'badge-success' : 'badge-primary'
                      }`}>
                        {hospital.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                        <FaMapMarkerAlt className="text-rose-500" size={10} /> {hospital.area} • {hospital.distance} km
                      </span>
                    </div>

                    <h3 className="font-black text-base text-slate-900 mt-1.5 leading-snug">
                      {hospital.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{hospital.address}</p>
                  </div>

                  <div className="text-right flex flex-col items-end flex-shrink-0">
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-amber-800 text-xs font-black">
                      <FaStar className="text-amber-500" size={11} />
                      <span>{hospital.rating}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5">({hospital.reviews})</span>
                  </div>
                </div>

                {/* Live Token Status Box */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 mt-3 text-center">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Consultation</span>
                    <span className="text-xs font-black text-slate-900">
                      {hospital.consultationFee === 0 ? 'FREE (₹0)' : `₹${hospital.consultationFee}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Tokens Left</span>
                    <span className="text-xs font-black text-emerald-600">
                      {hospital.tokensAvailable} Slots
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Avg Wait</span>
                    <span className="text-xs font-black text-amber-700">
                      ~{hospital.waitingTime}m
                    </span>
                  </div>
                </div>

                {/* On-Duty Specialists Info */}
                {matchedDocs.length > 0 && (
                  <div className="mt-3 p-2.5 rounded-xl bg-sky-50/70 border border-sky-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FaUserMd className="text-sky-600" />
                      <span className="font-bold text-slate-800 truncate">
                        {matchedDocs[0].name}
                      </span>
                    </div>
                    <span className="text-[10px] text-sky-700 font-bold flex-shrink-0">
                      {matchedDocs[0].room}
                    </span>
                  </div>
                )}

                {/* Action Button */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
                    <FaClock size={11} /> Next: {hospital.nextSlot}
                  </span>

                  <button
                    type="button"
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-colors ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-sky-50 hover:text-sky-600'
                    }`}
                  >
                    {isSelected ? '✓ Selected' : 'Select Hospital'}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        {onBack && (
          <Button onClick={onBack} variant="outline" size="md" icon={FaArrowLeft}>
            Back to Date
          </Button>
        )}
        {onNext && (
          <Button 
            onClick={onNext} 
            disabled={!selectedHospital} 
            size="lg" 
            className="font-black text-xs ml-auto" 
            icon={FaArrowRight}
          >
            Proceed to Doctor Selection
          </Button>
        )}
      </div>
    </div>
  );
};

export default HospitalResults;
