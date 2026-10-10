import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, PhoneCall, ShieldCheck, Mail, MapPin, ExternalLink } from 'lucide-react';
import { DEFAULT_LOCATION } from '../utils/constants';

const Footer = () => {
  return (
    <footer className="footer bg-slate-900 text-slate-300 pt-12 pb-6 border-t border-slate-800 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Platform Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white font-bold shadow-md">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Medi<span className="text-sky-400">Queue</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Digital Smart Hospital Outpatient Department (OPD) token booking & live queue tracking system. Connecting patients in <strong>{DEFAULT_LOCATION}</strong> with real-time care.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" /> CMCHS & NABH Certified Portals
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Quick Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/dashboard" className="hover:text-sky-400 transition-colors">
                  OPD Symptom Triage
                </Link>
              </li>
              <li>
                <Link to="/hospitals" className="hover:text-sky-400 transition-colors">
                  Tirunelveli Hospital Directory
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-sky-400 transition-colors">
                  Compare Hospital Wait Times
                </Link>
              </li>
              <li>
                <Link to="/recommendation" className="hover:text-sky-400 transition-colors">
                  AI Specialty Recommendation
                </Link>
              </li>
              <li>
                <Link to="/family" className="hover:text-sky-400 transition-colors">
                  Family Member Health Cards
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-amber-400 transition-colors">
                  OPD Staff & Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Govt Medical Colleges & Hospitals */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Regional Health Centers
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Tirunelveli Medical College Hospital (TVMCH)</li>
              <li>District Govt Headquarters Hospital</li>
              <li>Palayamkottai Urban Primary Health Center</li>
              <li>Vannarpettai Multi-Speciality Clinics</li>
              <li>Apollo Specialty Heart Center</li>
            </ul>
          </div>

          {/* Col 4: Emergency Contacts */}
          <div>
            <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" /> 24/7 Emergency Helplines
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <span className="text-[11px] text-slate-400 block">State Ambulance Base</span>
                <a href="tel:108" className="text-sm font-black text-red-400 hover:underline">
                  📞 108 Emergency Ambulance
                </a>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <span className="text-[11px] text-slate-400 block">TVMCH Emergency Desk</span>
                <span className="text-xs font-bold text-slate-200">0462 - 2572720 / 2572722</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800/80 pt-6 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 MediQueue Smart Hospital System. All rights reserved.</span>
          <span>District Health Informatics Network • Tirunelveli Division</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
