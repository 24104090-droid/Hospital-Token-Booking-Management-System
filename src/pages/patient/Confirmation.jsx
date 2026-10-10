import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import {
  CheckCircle2,
  Printer,
  CalendarCheck,
  MapPin,
  Clock,
  Ticket,
  ShieldCheck,
  Share2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Button from '../../components/Button';
import { useBooking } from '../../context/BookingContext';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { latestConfirmedToken } = useBooking();

  const token = location.state?.token || latestConfirmedToken;

  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti error', e);
    }
  }, []);

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <h2 className="text-xl font-bold text-slate-800 mb-2">No Active Token Found</h2>
        <p className="text-xs text-slate-500 mb-6">
          Please book an OPD token or check your active appointments list.
        </p>
        <Button variant="primary" onClick={() => navigate('/appointments')}>
          View My Tokens
        </Button>
      </div>
    );
  }

  const qrPayload = JSON.stringify({
    id: token.id,
    token: token.tokenNumber,
    hospital: token.hospitalName,
    patient: token.patientName,
    date: token.bookedDate
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Top Banner */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-md">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
          Token Confirmed & Registered
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          Your OPD Pass is Ready!
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Please present this digital pass or QR code at the hospital reception.
        </p>
      </div>

      {/* Digital Token Ticket Pass */}
      <div className="bg-white rounded-3xl border-2 border-dashed border-sky-300 p-6 sm:p-8 shadow-xl relative overflow-hidden mb-6 token-pass">
        {/* Ticket Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              HOSPITAL OPD PASS
            </span>
            <h3 className="text-lg font-black text-slate-900">{token.hospitalName}</h3>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Verified
            </span>
          </div>
        </div>

        {/* Big Hero Token Number */}
        <div className="bg-gradient-to-br from-sky-50 via-indigo-50/40 to-slate-50 border border-sky-200 rounded-2xl p-6 text-center mb-6">
          <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">
            YOUR OPD TOKEN NUMBER
          </span>
          <div className="text-5xl font-black text-sky-700 my-2 font-mono tracking-wider">
            {token.tokenNumber}
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-600 font-medium">
            <span>Room: <strong>{token.room}</strong></span>
            <span>•</span>
            <span>Doctor: <strong>{token.doctor}</strong></span>
          </div>
        </div>

        {/* Live Queue Status Strip */}
        <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center mb-6">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Serving</span>
            <span className="text-sm font-extrabold text-slate-800">{token.currentTokenServing}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Tokens Ahead</span>
            <span className="text-sm font-extrabold text-amber-600">{token.tokensAhead} Patients</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Est. Consultation</span>
            <span className="text-sm font-extrabold text-emerald-600">~{token.estimatedWaitMins} mins</span>
          </div>
        </div>

        {/* Patient & Booking Details */}
        <div className="grid grid-cols-2 gap-4 text-xs text-slate-700 pb-6 border-b border-slate-100 mb-6">
          <div>
            <span className="text-slate-400 block text-[10px]">Patient Name</span>
            <span className="font-bold">{token.patientName} ({token.patientAge}y, {token.patientGender})</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Department</span>
            <span className="font-bold text-sky-700">{token.department}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Date & Time Slot</span>
            <span className="font-bold">{token.bookedDate} • {token.timeSlot}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Pass ID</span>
            <span className="font-mono text-slate-500 font-bold">{token.id}</span>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
              <QRCodeSVG value={qrPayload} size={85} level="M" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Fast-Track OPD Gate Scan</span>
              <p className="text-[11px] text-slate-500">
                Scan at hospital entrance kiosk to auto check-in.
              </p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={handlePrint} className="no-print w-full sm:w-auto">
            <Printer className="w-4 h-4 mr-1.5" /> Print Ticket
          </Button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row gap-3 no-print">
        <Link to="/appointments" className="flex-1">
          <Button variant="primary" size="lg" className="w-full">
            <CalendarCheck className="w-4 h-4 mr-2" />
            <span>Track in My Appointments</span>
          </Button>
        </Link>
        <Link to="/dashboard" className="flex-1">
          <Button variant="outline" size="lg" className="w-full">
            <span>Back to Dashboard</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Confirmation;
