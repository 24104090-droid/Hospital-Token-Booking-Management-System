import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../common/Card';
import Modal from '../common/Modal';
import Button from '../common/Button';
import QueueProgress from './QueueProgress';
import QueueAlertModal from './QueueAlertModal';
import TokenSwapDelayModal from './TokenSwapDelayModal';
import { 
  FaHospital, 
  FaCalendarAlt, 
  FaClock, 
  FaQrcode, 
  FaUserMd, 
  FaTimes, 
  FaMapMarkerAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaBell,
  FaTv,
  FaExternalLinkAlt,
  FaTrashAlt,
  FaExchangeAlt
} from 'react-icons/fa';

const TokenStatus = ({ appointment, onCancel, onDelete }) => {
  const navigate = useNavigate();
  const { isTamil } = useLanguage();
  const [showQR, setShowQR] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);

  if (!appointment) return null;

  const liveTrackingUrl = `${window.location.origin}/track/${appointment.id}`;

  return (
    <Card className="p-5 shadow-sm border border-slate-200 hover:border-sky-300 transition-all bg-white rounded-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-700 flex flex-col items-center justify-center font-mono font-black border border-sky-200 flex-shrink-0">
            <span className="text-[9px] font-bold uppercase text-slate-400">TOKEN</span>
            <span className="text-2xl text-slate-900 leading-none mt-0.5">#{appointment.tokenNumber}</span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`badge text-[9px] font-extrabold ${
                appointment.status === 'confirmed' ? 'badge-primary' :
                appointment.status === 'serving' ? 'badge-warning' :
                appointment.status === 'completed' ? 'badge-success' : 'badge-danger'
              }`}>
                {appointment.status?.toUpperCase()}
              </span>
              {appointment.isDelayed && (
                <span className="badge bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-black">
                  ⏱️ +{appointment.delayMinutes || 15}M DELAYED
                </span>
              )}
              {appointment.isSwapped && (
                <span className="badge bg-purple-100 text-purple-900 border border-purple-300 text-[9px] font-black">
                  🔄 SWAPPED
                </span>
              )}
              <span className="text-xs text-slate-400 font-mono">Ref: {appointment.id}</span>
            </div>
            <h3 className="font-extrabold text-base text-slate-900 leading-snug">{appointment.hospitalName}</h3>
            <p className="text-xs text-slate-500">{appointment.hospitalAddress}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => navigate(`/track/${appointment.id}`)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs font-black transition-all cursor-pointer shadow-sm hover:scale-102"
            title="View Live OPD Token Queue Status"
          >
            <FaTv size={12} className="animate-pulse" />
            <span>{isTamil ? 'நேரலை நிலை' : 'Live Status'}</span>
          </button>

          {(appointment.status === 'confirmed' || appointment.status === 'serving') && (
            <button
              onClick={() => setShowSwapModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-black transition-colors border border-amber-200 cursor-pointer shadow-2xs hover:scale-102"
              title={isTamil ? 'டிராஃபிக் அல்லது பஸ் தாமதம்? 15 நிமிட அவகாசம் அல்லது டோக்கன் இடமாற்றம்' : 'Traffic or bus delay? Request 15-minute buffer delay or swap token'}
            >
              <FaExchangeAlt size={11} className="text-amber-600" />
              <span>{isTamil ? '15m தாமதம் / இடமாற்றம்' : '15m Delay / Swap'}</span>
            </button>
          )}

          <button
            onClick={() => setShowAlertModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black transition-colors border border-emerald-200 cursor-pointer shadow-2xs"
            title="Set WhatsApp and Push Queue Alerts"
          >
            <FaBell size={12} className="text-emerald-600 animate-pulse" />
            <span>Queue Alert</span>
          </button>

          <button
            onClick={() => setShowQR(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <FaQrcode size={13} />
            <span>Show QR</span>
          </button>

          {appointment.status === 'confirmed' && onCancel && (
            <button
              onClick={() => onCancel(appointment.id)}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
              title={isTamil ? 'டோக்கனை ரத்து செய்' : 'Cancel Token'}
            >
              <FaTimes size={15} />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(appointment.id)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title={isTamil ? 'டோக்கனை நீக்கு' : 'Delete Pass'}
            >
              <FaTrashAlt size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Doctor & Slot Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 text-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Doctor & Room</span>
          <strong className="text-slate-900 block mt-0.5">{appointment.doctorName}</strong>
          <span className="text-[10px] text-sky-700">{appointment.room}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Department</span>
          <strong className="text-slate-900 block mt-0.5">{appointment.department}</strong>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Slot & Date</span>
          <strong className="text-slate-900 block mt-0.5">{appointment.timeSlot}</strong>
          <span className="text-[10px] text-slate-500">{appointment.date}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Patient</span>
          <strong className="text-slate-900 block mt-0.5">{appointment.patientName}</strong>
          <span className="text-[10px] text-slate-500">{appointment.patientAge}y · {appointment.patientGender}</span>
        </div>
      </div>

      {/* Progress Widget (if active) */}
      {(appointment.status === 'confirmed' || appointment.status === 'serving') && (
        <QueueProgress
          currentServing={appointment.currentServing || 8}
          myToken={appointment.tokenNumber}
          estimatedWaitMinutes={appointment.estimatedWaitMinutes || 12}
        />
      )}

      {/* QR Code Modal */}
      <Modal isOpen={showQR} onClose={() => setShowQR(false)} title={`OPD Token Pass #${appointment.tokenNumber}`}>
        <div className="flex flex-col items-center text-center p-4">
          <div 
            onClick={() => {
              setShowQR(false);
              navigate(`/track/${appointment.id}`);
            }}
            className="p-4 bg-slate-50 hover:bg-sky-50 rounded-2xl border-2 border-sky-100 hover:border-sky-400 mb-3 inline-block transition-all cursor-pointer group shadow-sm relative"
            title="Click to open Live OPD Queue Tracker"
          >
            <QRCodeCanvas
              value={liveTrackingUrl}
              size={190}
              bgColor="#f8fafc"
              fgColor="#0f172a"
              level="H"
            />
            <div className="absolute inset-x-2 -bottom-2 bg-sky-600 text-white text-[9px] font-black py-0.5 px-2 rounded-full shadow-xs flex items-center justify-center gap-1 group-hover:scale-105 transition-transform">
              <FaTv size={9} />
              <span>{isTamil ? 'கிளிக் செய்து நேரலை நிலை காண்க' : 'Click to View Live Status'}</span>
            </div>
          </div>

          <h4 className="font-extrabold text-slate-900 text-lg mt-2">{appointment.hospitalName}</h4>
          <p className="text-xs text-slate-500 mt-1">Doctor: {appointment.doctorName} • {appointment.room}</p>
          <div className="mt-2 font-mono font-bold text-sm text-sky-700 bg-sky-50 px-3.5 py-1 rounded-xl border border-sky-100">
            Pass ID: {appointment.id}
          </div>

          <div className="w-full mt-4 space-y-2">
            <button
              type="button"
              onClick={() => {
                setShowQR(false);
                navigate(`/track/${appointment.id}`);
              }}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaTv />
              <span>{isTamil ? '⚡ நேரடி வரிசை நிலையை காண்க (Live Tracker)' : '⚡ Open Live OPD Queue Tracker →'}</span>
            </button>

            <p className="text-[11px] text-slate-400 px-2 leading-relaxed">
              {isTamil 
                ? '📲 உங்கள் மொபைல் போன் கேமராவில் இந்த QR குறியீட்டை ஸ்கேன் செய்தால் மருத்துவமனையின் தற்போதைய நேரலை வரிசை நிலை திரையில் தோன்றும்.'
                : '📲 Point your phone camera at this QR code to view live OPD counter announcements & wait times.'}
            </p>
          </div>
        </div>
      </Modal>

      {/* WhatsApp & Queue Push Alert Modal */}
      <QueueAlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        tokenData={appointment}
      />

      {/* Smart Token Swap / 15-Min Buffer Delay Modal */}
      <TokenSwapDelayModal
        isOpen={showSwapModal}
        onClose={() => setShowSwapModal(false)}
        appointment={appointment}
      />
    </Card>
  );
};

export default TokenStatus;
