import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Printer, ShieldCheck } from 'lucide-react';
import Button from './Button';

const QRModal = ({ isOpen, onClose, tokenData }) => {
  if (!isOpen || !tokenData) return null;

  const qrPayload = JSON.stringify({
    tokenId: tokenData.id,
    tokenNumber: tokenData.tokenNumber,
    hospital: tokenData.hospitalName,
    department: tokenData.department,
    patient: tokenData.patientName,
    date: tokenData.bookedDate,
    timestamp: tokenData.bookedAt
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="modal-content bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-2">
            <ShieldCheck className="w-4 h-4" /> Verified Digital OPD Pass
          </div>
          <h3 className="text-xl font-bold text-slate-900">{tokenData.hospitalName}</h3>
          <p className="text-xs text-slate-500">{tokenData.department} • {tokenData.doctor}</p>
        </div>

        {/* Token Hero Display */}
        <div className="bg-gradient-to-br from-sky-50 to-indigo-50 border-2 border-dashed border-sky-300 rounded-2xl p-5 text-center mb-5">
          <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">Token Number</span>
          <div className="text-4xl font-extrabold text-sky-700 my-1 font-mono tracking-tight">
            {tokenData.tokenNumber}
          </div>
          <p className="text-xs text-slate-600">
            Patient: <span className="font-semibold">{tokenData.patientName}</span> ({tokenData.patientAge}y, {tokenData.patientGender})
          </p>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center mb-5">
          <QRCodeSVG
            value={qrPayload}
            size={180}
            level="H"
            includeMargin={true}
            className="rounded-lg"
          />
          <p className="text-[11px] text-slate-500 mt-2 text-center">
            Scan this QR code at the hospital OPD kiosk or entrance gate
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="md" className="flex-1" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-1.5" /> Print Ticket
          </Button>
          <Button variant="primary" size="md" className="flex-1" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;
