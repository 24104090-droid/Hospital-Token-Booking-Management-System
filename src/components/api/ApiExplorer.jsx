import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hospitals } from '../../data/hospitals';
import { doctors } from '../../data/doctors';
import { healthProblems } from '../../data/problems';
import { FaCode, FaKey, FaCopy, FaCheck, FaPlay, FaLock, FaServer, FaShieldAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ApiExplorer = () => {
  const { jwtToken, user } = useAuth();
  const [apiKey, setApiKey] = useState('tvl_live_9a8b7c6d5e4f3a2b1c');
  const [activeTab, setActiveTab] = useState('endpoints');
  const [selectedEndpoint, setSelectedEndpoint] = useState('get_hospitals');
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const endpoints = [
    {
      id: 'get_hospitals',
      method: 'GET',
      path: '/api/v1/hospitals',
      title: 'List Tirunelveli Hospitals & Queues',
      desc: 'Returns verified public and private hospitals in Tirunelveli with live queue wait times and ICU counts.',
      authRequired: true,
      params: { area: 'Palayamkottai', type: 'all' },
      execute: () => {
        return {
          status: 200,
          timestamp: new Date().toISOString(),
          district: 'Tirunelveli',
          total_hospitals: hospitals.length,
          data: hospitals.map(h => ({
            id: h.id,
            name: h.name,
            type: h.type,
            area: h.address,
            rating: h.rating,
            tokens_available: h.tokensAvailable,
            current_wait_minutes: h.currentWaitTime,
            icu_beds_available: h.icuBedsAvailable,
            consultation_fee: h.consultationFee
          }))
        };
      }
    },
    {
      id: 'get_live_queue',
      method: 'GET',
      path: '/api/v1/hospitals/tvmch/queue',
      title: 'Get Live OPD Counter Queue Velocity',
      desc: 'Returns current serving token number, patient velocity, and doctor chamber allocation.',
      authRequired: true,
      params: { hospital_id: 'tvmch', department: 'General Medicine' },
      execute: () => {
        return {
          status: 200,
          timestamp: new Date().toISOString(),
          hospital: 'Tirunelveli Medical College Hospital (TVMCH)',
          opd_block: 'Block A - High Grounds',
          current_serving_token: 9,
          last_issued_token: 28,
          active_doctors_on_duty: 4,
          estimated_wait_time_minutes: 15,
          emergency_desk_active: true
        };
      }
    },
    {
      id: 'get_emergency_beds',
      method: 'GET',
      path: '/api/v1/emergency/beds',
      title: 'Emergency 108 & ICU Vacancy Matrix',
      desc: 'Live district-wide hospital ICU bed vacancy tracker for trauma dispatch and ambulance routing.',
      authRequired: true,
      params: { min_icu_beds: 1 },
      execute: () => {
        return {
          status: 200,
          timestamp: new Date().toISOString(),
          district_hotline: '108',
          emergency_trauma_centers: [
            { hospital: 'TVMCH High Grounds', icu_available: 14, oxygen_beds: 45, casualty_phone: '0462-2572735' },
            { hospital: 'Shifa Hospital Vannarpettai', icu_available: 8, oxygen_beds: 20, casualty_phone: '0462-2501000' },
            { hospital: 'Kauvery Hospital Palayamkottai', icu_available: 6, oxygen_beds: 18, casualty_phone: '0462-4005000' }
          ]
        };
      }
    },
    {
      id: 'post_book_token',
      method: 'POST',
      path: '/api/v1/tokens/book',
      title: 'Programmatic Token Reservation',
      desc: 'Reserve a digital OPD token pass for a patient via REST API.',
      authRequired: true,
      params: {
        hospital_id: 'tvmch',
        doctor_id: 'doc_tvmch_01',
        patient_name: user?.name || 'Karthik Raja',
        problem: 'Fever & Chills',
        time_slot: '10:00 AM - 10:30 AM'
      },
      execute: () => {
        const num = Math.floor(15 + Math.random() * 20);
        return {
          status: 201,
          token_id: `TVL-${Date.now().toString().slice(-6)}`,
          token_number: num,
          hospital: 'Tirunelveli Medical College Hospital (TVMCH)',
          doctor: 'Dr. S. Sundararajan, MD',
          room: 'OPD Block A - Room 102',
          date: '2026-09-18',
          time_slot: '10:00 AM - 10:30 AM',
          qr_code_hash: `tvl_pass_qr_${Date.now()}`,
          message: 'Token pass generated and registered in live OPD sequence.'
        };
      }
    }
  ];

  const currentEndpoint = endpoints.find(e => e.id === selectedEndpoint) || endpoints[0];

  const handleExecute = () => {
    setLoading(true);
    setApiResponse(null);
    setTimeout(() => {
      const res = currentEndpoint.execute();
      setApiResponse(res);
      setLoading(false);
      toast.success(`${currentEndpoint.method} ${currentEndpoint.path} executed with status ${res.status}`);
    }, 450);
  };

  const handleGenerateKey = () => {
    const newKey = 'tvl_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    toast.success('Generated new TVL SmartCare Developer API Key!');
  };

  const curlCommand = `curl -X ${currentEndpoint.method} "https://api.tvlsmartcare.tn.gov.in${currentEndpoint.path}" \\
  -H "Authorization: Bearer ${jwtToken || 'YOUR_JWT_TOKEN'}" \\
  -H "X-API-KEY: ${apiKey}" \\
  -H "Content-Type: application/json"${currentEndpoint.method === 'POST' ? ` \\\n  -d '${JSON.stringify(currentEndpoint.params)}'` : ''}`;

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto text-left">
      {/* Header */}
      <div className="gradient-hero p-6 sm:p-8 rounded-3xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full text-xs font-black uppercase text-teal-200 mb-2">
              <FaCode /> Developer API Hub & Public Health Gateway
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Tirunelveli Health System REST API
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-xl">
              Open healthcare APIs for token generation, queue metrics, hospital bed occupancy, and ambulance triage integration.
            </p>
          </div>

          <div className="bg-slate-950/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 w-full md:w-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Your Active Developer API Key
            </span>
            <div className="flex items-center gap-2">
              <code className="font-mono text-xs text-emerald-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
                {apiKey}
              </code>
              <button
                onClick={handleGenerateKey}
                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all"
                title="Regenerate API Key"
              >
                Roll
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Explorer Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Endpoints Sidebar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h3 className="font-black text-xs uppercase tracking-wider text-slate-400 mb-2">
            Available Endpoints (v1)
          </h3>

          <div className="space-y-2">
            {endpoints.map((ep) => {
              const isSel = ep.id === selectedEndpoint;
              return (
                <button
                  key={ep.id}
                  onClick={() => {
                    setSelectedEndpoint(ep.id);
                    setApiResponse(null);
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSel
                      ? 'bg-sky-50 border-sky-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black ${
                      ep.method === 'GET' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-800 truncate">
                      {ep.path}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-semibold">{ep.title}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Request / Response Console */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-black ${
                    currentEndpoint.method === 'GET' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {currentEndpoint.method}
                  </span>
                  <code className="font-mono text-sm font-bold text-slate-900">
                    {currentEndpoint.path}
                  </code>
                </div>
                <p className="text-xs text-slate-500">{currentEndpoint.desc}</p>
              </div>

              <button
                onClick={handleExecute}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer flex-shrink-0"
              >
                <FaPlay size={10} />
                <span>{loading ? 'Executing...' : 'Try It Out'}</span>
              </button>
            </div>

            {/* cURL Command Box */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Copyable cURL Command (Authenticated with JWT Bearer)
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(curlCommand);
                    setCopiedCurl(true);
                    toast.success('cURL snippet copied!');
                    setTimeout(() => setCopiedCurl(false), 2000);
                  }}
                  className="text-xs text-sky-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  {copiedCurl ? <FaCheck /> : <FaCopy />}
                  <span>{copiedCurl ? 'Copied' : 'Copy cURL'}</span>
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-200 p-3.5 rounded-2xl font-mono text-[11px] overflow-x-auto border border-slate-800">
                {curlCommand}
              </pre>
            </div>

            {/* Parameters preview if POST */}
            {currentEndpoint.method === 'POST' && (
              <div className="mt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Request Payload (JSON)
                </span>
                <pre className="bg-slate-50 text-slate-800 p-3 rounded-xl font-mono text-xs border border-slate-200 overflow-x-auto">
                  {JSON.stringify(currentEndpoint.params, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Live Response Box */}
          {apiResponse && (
            <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 shadow-xl animate-fadeIn text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    HTTP {apiResponse.status} OK
                  </span>
                  <span className="text-[11px] text-slate-400">
                    • Response Time: ~45ms
                  </span>
                </div>
                <span className="badge bg-slate-800 text-slate-300 font-mono text-[10px]">
                  application/json
                </span>
              </div>

              <pre className="font-mono text-xs text-emerald-300 overflow-x-auto max-h-96">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiExplorer;
