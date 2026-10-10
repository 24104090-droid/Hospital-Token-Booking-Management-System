import React, { useState, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../common/Card';
import TokenStatus from '../queue/TokenStatus';
import OfflineSMSBookingModal from '../booking/OfflineSMSBookingModal';
import { FaHistory, FaCalendarCheck, FaTrashAlt, FaSms, FaExchangeAlt, FaShieldAlt } from 'react-icons/fa';

const isKarthik = (name) => {
  if (!name) return false;
  const n = String(name).toLowerCase().trim();
  return n.includes('karthik raja') || n === 'karthik' || n.includes('karthikraja');
};

const History = () => {
  const { appointments, cancelAppointment, deleteAppointment, clearKarthikBookings } = useBooking();
  const { isTamil } = useLanguage();
  const [smsModalOpen, setSmsModalOpen] = useState(false);

  // Automatically purge any remaining Karthik Raja bookings from storage on load
  useEffect(() => {
    if (appointments && appointments.some(a => isKarthik(a.patientName))) {
      if (clearKarthikBookings) {
        clearKarthikBookings();
      }
    }
  }, [appointments, clearKarthikBookings]);

  // Clean displayed appointments
  const displayedAppointments = (appointments || []).filter(item => !isKarthik(item.patientName));

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <FaHistory className="text-sky-600" /> 
            <span>{isTamil ? 'டோக்கன் & வருகை விவரங்கள்' : 'Token & OPD Visit History'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isTamil 
              ? 'TVL SmartCare மூலம் முன்பதிவு செய்யப்பட்ட தற்போதைய மற்றும் கடந்த கால டோக்கன்கள்'
              : 'All current and past token passes booked through TVL SmartCare'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSmsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-black transition-all cursor-pointer shadow-2xs"
            title="Book OPD token via offline SMS"
          >
            <FaSms className="text-teal-600" />
            <span>{isTamil ? '📴 SMS பதிவு' : 'Offline SMS'}</span>
          </button>
          <span className="badge badge-primary font-bold text-xs">
            {displayedAppointments.length} {isTamil ? 'டோக்கன்கள்' : 'Total Passes'}
          </span>
        </div>
      </div>

      {/* Helpful Smart Tips Strip */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2.5 text-amber-900">
          <FaExchangeAlt className="text-amber-600 flex-shrink-0" />
          <span>
            {isTamil
              ? '💡 டிராஃபிக் அல்லது பஸ் தாமதமா? டோக்கனில் உள்ள "15m தாமதம் / இடமாற்றம்" பட்டனை அழுத்தி ரத்து செய்யாமல் அவகாசம் பெறலாம்.'
              : '💡 Running late? Click "15m Delay / Swap" on your token to push back your time or swap with waiting patients without cancelling!'}
          </span>
        </div>
      </div>

      {displayedAppointments.length === 0 ? (
        <Card className="p-12 text-center text-slate-400">
          <FaCalendarCheck size={36} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm font-semibold">
            {isTamil ? 'டோக்கன் பதிவுகள் எதுவும் இல்லை' : 'No appointment history found'}
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {displayedAppointments.map((item) => (
            <TokenStatus
              key={item.id}
              appointment={item}
              onCancel={cancelAppointment}
              onDelete={deleteAppointment}
            />
          ))}
        </div>
      )}

      {/* Offline SMS Booking Modal */}
      <OfflineSMSBookingModal
        isOpen={smsModalOpen}
        onClose={() => setSmsModalOpen(false)}
      />
    </div>
  );
};

export default History;
