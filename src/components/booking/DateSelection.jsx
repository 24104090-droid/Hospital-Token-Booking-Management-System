import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { FaCalendarAlt, FaArrowLeft, FaArrowRight, FaClock } from 'react-icons/fa';

const DateSelection = ({ selectedDate, onSelectDate, onNext, onBack }) => {
  // Generate next 7 days
  const getDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const isToday = i === 0;
      const isTomorrow = i === 1;
      const dayName = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short' });
      const formattedDate = d.toISOString().split('T')[0];
      const displayDay = d.getDate();
      const monthName = d.toLocaleDateString('en-IN', { month: 'short' });

      dates.push({
        fullDate: formattedDate,
        dayName,
        displayDay,
        monthName,
        isToday,
        isSunday: d.getDay() === 0
      });
    }
    return dates;
  };

  const datesList = getDates();

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="text-center">
        <span className="badge badge-primary uppercase tracking-wider mb-2 inline-flex items-center gap-1.5">
          <FaCalendarAlt /> Step 2: Appointment Date
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Choose your OPD visit date</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Select today for same-day digital tokens or book up to 7 days in advance
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
        {datesList.map((item) => {
          const isSelected = selectedDate === item.fullDate;
          return (
            <button
              key={item.fullDate}
              type="button"
              onClick={() => onSelectDate(item.fullDate)}
              className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                isSelected
                  ? 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-300'
                  : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 text-slate-800'
              }`}
            >
              <span className={`text-[11px] font-bold uppercase tracking-wider ${isSelected ? 'text-sky-100' : 'text-slate-500'}`}>
                {item.dayName}
              </span>
              <span className="text-2xl font-black my-1">
                {item.displayDay}
              </span>
              <span className={`text-[10px] font-semibold ${isSelected ? 'text-sky-200' : 'text-slate-400'}`}>
                {item.monthName}
              </span>

              {item.isToday && (
                <span className={`mt-1 text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-emerald-400 text-slate-900' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  FAST LIVE
                </span>
              )}
            </button>
          );
        })}
      </div>

      <Card className="p-4 bg-sky-50/60 border-sky-200 flex items-center gap-3 text-xs text-sky-900">
        <FaClock size={20} className="text-sky-600 flex-shrink-0" />
        <div>
          <strong>OPD Consultation Hours:</strong> Morning OPD runs 08:30 AM to 01:30 PM. Afternoon super-specialty OPD runs 02:00 PM to 05:30 PM.
        </div>
      </Card>

      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        {onBack && (
          <Button onClick={onBack} variant="outline" size="md" icon={FaArrowLeft}>
            Back
          </Button>
        )}
        {onNext && (
          <Button onClick={onNext} size="lg" className="font-bold text-xs ml-auto" icon={FaArrowRight}>
            Proceed to Hospitals
          </Button>
        )}
      </div>
    </div>
  );
};

export default DateSelection;
