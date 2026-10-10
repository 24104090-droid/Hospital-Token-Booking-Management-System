import React from 'react';
import { Link } from 'react-router-dom';
import { FaHospital, FaPhoneAlt, FaAmbulance, FaMapMarkerAlt, FaHeart, FaShieldAlt, FaCode } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800 pt-12 pb-8 mt-auto">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white font-bold shadow-md">
                <FaHospital size={20} />
              </div>
              <span className="font-black text-2xl text-white tracking-tight">
                TVL <span className="text-teal-400">SmartCare</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-5">
              Integrated OPD Token Booking, Real-time Queue Tracking, and Emergency Care Discovery for Tirunelveli District, Tamil Nadu.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-950/70 border border-emerald-800 px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>OPD Triage Live Across 10 Hospitals</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4">Patient Services</h4>
            <ul className="space-y-3 text-xs list-none p-0 m-0">
              <li><Link to="/book" className="text-slate-400 hover:text-white transition-colors no-underline">Book OPD Token</Link></li>
              <li><Link to="/hospitals" className="text-slate-400 hover:text-white transition-colors no-underline">Tirunelveli Hospital Directory</Link></li>
              <li><Link to="/compare" className="text-slate-400 hover:text-white transition-colors no-underline">Compare Hospitals & Facilities</Link></li>
              <li><Link to="/appointments" className="text-slate-400 hover:text-white transition-colors no-underline">Check Live Token Status</Link></li>
              <li><Link to="/api" className="text-slate-400 hover:text-white transition-colors no-underline flex items-center gap-1.5"><FaCode size={12} /> Open Health REST API</Link></li>
              <li><Link to="/emergency" className="text-rose-400 hover:text-rose-300 font-bold no-underline">Emergency 108 Priority OPD</Link></li>
            </ul>
          </div>

          {/* Key Hospitals */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4">Tirunelveli Hospitals</h4>
            <ul className="space-y-3 text-xs list-none p-0 m-0">
              <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-sky-400 flex-shrink-0" size={12} /> <span>TVMCH (High Grounds)</span></li>
              <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-sky-400 flex-shrink-0" size={12} /> <span>Shifa Hospital (Vannarpettai)</span></li>
              <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-sky-400 flex-shrink-0" size={12} /> <span>Aravind Eye Hospital (Vannarpettai)</span></li>
              <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-sky-400 flex-shrink-0" size={12} /> <span>Kauvery Hospital (Palayamkottai)</span></li>
              <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-sky-400 flex-shrink-0" size={12} /> <span>Porunai Hospitals (Melapalayam)</span></li>
            </ul>
          </div>

          {/* Emergency Helplines */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4">Emergency Helplines</h4>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-2 font-bold"><FaAmbulance className="text-rose-400" /> Ambulance:</span>
                <span className="font-black text-rose-400 text-base">108</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-2 font-bold"><FaPhoneAlt className="text-sky-400" /> TVMCH Casualty:</span>
                <span className="font-bold text-sky-400">0462-2572735</span>
              </div>
              <div className="pt-2">
                <Link to="/admin/login" className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 no-underline">
                  <FaShieldAlt size={12} /> Hospital Staff & District Admin Console →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TVL SmartCare. Tirunelveli District Public Health Digital Network.</p>
          <div className="flex items-center gap-1.5">
            <span>Built with care for Tirunelveli Citizens</span>
            <FaHeart className="text-rose-500" size={12} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
