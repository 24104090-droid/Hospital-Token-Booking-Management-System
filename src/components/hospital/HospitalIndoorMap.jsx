import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import { useLanguage } from '../../context/LanguageContext';
import { 
  FaMapMarkedAlt, 
  FaHospital, 
  FaWalking, 
  FaCompass, 
  FaDoorOpen, 
  FaUserMd, 
  FaPills, 
  FaTint, 
  FaVial, 
  FaAmbulance, 
  FaArrowRight, 
  FaCheckCircle,
  FaRoute
} from 'react-icons/fa';

const hospitalMaps = {
  h1: {
    name: 'Tirunelveli Medical College Hospital (TVMCH)',
    floors: [
      {
        id: 'ground',
        name: 'Ground Floor (தரைத்தளம்)',
        rooms: [
          { id: 'entrance', name: 'Main OPD Entrance', code: 'GATE-1', x: 250, y: 350, w: 100, h: 40, color: '#0284c7', type: 'entry' },
          { id: 'triage', name: 'Triage & Token Kiosk', code: 'TR-01', x: 240, y: 250, w: 120, h: 60, color: '#0d9488', type: 'service' },
          { id: 'opd101', name: 'OPD 101 - Pediatrics', code: 'RM-101', x: 60, y: 150, w: 120, h: 80, color: '#6366f1', type: 'doctor', doctor: 'Dr. Arumugaperumal', wait: '10m' },
          { id: 'opd102', name: 'OPD 102 - General Medicine', code: 'RM-102', x: 60, y: 50, w: 120, h: 80, color: '#3b82f6', type: 'doctor', doctor: 'Dr. S. Sundararajan', wait: '15m' },
          { id: 'pharmacy', name: 'Govt Free Pharmacy Counter', code: 'PH-01', x: 420, y: 150, w: 130, h: 80, color: '#10b981', type: 'pharmacy', wait: '5m' },
          { id: 'bloodbank', name: 'District Blood Bank & Storage', code: 'BB-01', x: 420, y: 50, w: 130, h: 80, color: '#e11d48', type: 'blood', wait: 'Immediate' },
          { id: 'emergency', name: '24/7 Casualty & Trauma Bay', code: 'EM-01', x: 240, y: 50, w: 120, h: 80, color: '#dc2626', type: 'emergency', wait: '0m' }
        ],
        pathWays: {
          opd102: 'M 300 350 L 300 280 L 120 280 L 120 130',
          opd101: 'M 300 350 L 300 280 L 120 280 L 120 230',
          pharmacy: 'M 300 350 L 300 280 L 485 280 L 485 230',
          bloodbank: 'M 300 350 L 300 280 L 485 280 L 485 130',
          emergency: 'M 300 350 L 300 130',
          triage: 'M 300 350 L 300 310'
        },
        steps: {
          opd102: [
            'Enter through TVMCH Main Gate 1',
            'Cross the reception lobby and turn left into the North corridor',
            'Pass OPD Room 101 on your left',
            'Arrive at Room 102: General Medicine Chamber (Dr. Sundararajan)'
          ],
          opd102_ta: [
            'TVMCH பிரதான வாசல் 1 வழியாக நுழையவும்',
            'வரவேற்பு பகுதியை கடந்து இடதுபுற வடக்குப் பாதையில் திரும்பவும்',
            'குழந்தைகள் நல அறை 101-ஐ கடந்து செல்லவும்',
            'அறை 102: பொது மருத்துவ அறைக்கு வந்தடைவீர்கள்'
          ],
          pharmacy: [
            'Enter through Main Gate 1',
            'Turn right after the Token Triage counter',
            'Follow the green signs to Govt Free OPD Pharmacy Dispenser'
          ],
          pharmacy_ta: [
            'பிரதான வாசல் 1 வழியாக நுழையவும்',
            'டோக்கன் சேவை மேசைக்கு பின் வலதுபுறம் திரும்பவும்',
            'இலவச அரசு மருந்தக கவுண்டரை அடைவீர்கள்'
          ],
          bloodbank: [
            'Enter through Main Gate 1',
            'Walk straight past reception, turn right at east corridor',
            'Blood Bank is situated adjacent to Hematology lab'
          ],
          bloodbank_ta: [
            'பிரதான வாசல் 1 வழியாக நுழையவும்',
            'நேராக சென்று கிழக்கு பாதையில் வலதுபுறம் திரும்பவும்',
            'மாவட்ட இரத்த வங்கி பிரிவை அடைவீர்கள்'
          ]
        }
      },
      {
        id: 'first',
        name: 'First Floor (முதல் தளம் - லிஃப்ட் / படிக்கட்டுகள்)',
        rooms: [
          { id: 'stairs', name: 'Stairs & Elevator Core', code: 'LIFT-1', x: 250, y: 350, w: 100, h: 40, color: '#64748b', type: 'entry' },
          { id: 'cardio201', name: 'Cardiology Super-Specialty', code: 'RM-201', x: 60, y: 80, w: 130, h: 90, color: '#0284c7', type: 'doctor', doctor: 'Dr. P. Muthukumar', wait: '20m' },
          { id: 'obgyn202', name: 'Obstetrics & Gynecology OPD', code: 'RM-202', x: 60, y: 210, w: 130, h: 90, color: '#ec4899', type: 'doctor', doctor: 'Dr. M. Kalaiselvi', wait: '15m' },
          { id: 'lab', name: 'Central Diagnostic & Pathology Lab', code: 'LAB-01', x: 410, y: 80, w: 140, h: 90, color: '#8b5cf6', type: 'service', wait: '10m' },
          { id: 'ecg', name: 'Echo & ECG Room', code: 'DIAG-02', x: 410, y: 210, w: 140, h: 90, color: '#14b8a6', type: 'service', wait: '5m' }
        ],
        pathWays: {
          cardio201: 'M 300 350 L 300 250 L 125 250 L 125 170',
          obgyn202: 'M 300 350 L 300 250 L 125 250 L 125 300',
          lab: 'M 300 350 L 300 250 L 480 250 L 480 170',
          ecg: 'M 300 350 L 300 250 L 480 250 L 480 300'
        },
        steps: {
          cardio201: [
            'Take Lift 1 or Central Stairs to 1st Floor',
            'Turn left toward the Super-Specialty Cardiology wing',
            'Room 201 is the second chamber on your right'
          ],
          cardio201_ta: [
            'லிஃப்ட் அல்லது படிக்கட்டுகள் மூலம் 1வது தளத்திற்கு செல்லவும்',
            'இடதுபுறம் திரும்பி இருதய சிகிச்சை பிரிவை நோக்கி நடக்கவும்',
            'அறை 201: டாக்டர் முத்துகுமார் அறைக்கு வந்தடைவீர்கள்'
          ]
        }
      }
    ]
  }
};

const HospitalIndoorMap = ({ hospitalId = 'h1' }) => {
  const navigate = useNavigate();
  const { isTamil } = useLanguage();
  const mapData = hospitalMaps[hospitalId] || hospitalMaps.h1;

  const [activeFloorId, setActiveFloorId] = useState('ground');
  const [selectedRoomId, setSelectedRoomId] = useState('opd102');

  const currentFloor = mapData.floors.find(f => f.id === activeFloorId) || mapData.floors[0];
  const selectedRoom = currentFloor.rooms.find(r => r.id === selectedRoomId) || currentFloor.rooms[0];
  const pathD = currentFloor.pathWays?.[selectedRoomId] || '';

  const stepsList = (isTamil && currentFloor.steps?.[`${selectedRoomId}_ta`]) 
    ? currentFloor.steps[`${selectedRoomId}_ta`]
    : currentFloor.steps?.[selectedRoomId] || [
        `Proceed from ${currentFloor.rooms[0]?.name}`,
        `Follow corridor signage toward ${selectedRoom?.code}`,
        `Arrive at ${selectedRoom?.name}`
      ];

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-teal-950 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-sky-400/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[11px] font-black uppercase">
            <FaCompass className="animate-spin text-sky-400" />
            <span>{isTamil ? 'உள்ளரங்கு வழிசெலுத்தல் வரைபடம்' : 'Hospital Indoor Wayfinder'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-2">
            {mapData.name}
          </h2>
          <p className="text-xs text-sky-200 mt-0.5">
            {isTamil 
              ? 'OPD அறைகள், மருந்தகம் மற்றும் ஆய்வகங்களுக்கு படிப்படியான வழிகாட்டுதல்.' 
              : 'Interactive floor map with turn-by-turn route navigation to OPD chambers and services.'}
          </p>
        </div>

        {/* Floor Switcher */}
        <div className="flex items-center bg-white/10 p-1.5 rounded-2xl border border-white/15 gap-1.5">
          {mapData.floors.map(floor => (
            <button
              key={floor.id}
              type="button"
              onClick={() => {
                setActiveFloorId(floor.id);
                setSelectedRoomId(floor.rooms[1]?.id || floor.rooms[0]?.id);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeFloorId === floor.id
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {floor.name.split('(')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Map + Directions & Chamber Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: SVG Indoor Map Canvas */}
        <Card className="lg:col-span-2 p-4 sm:p-6 bg-slate-900 border-2 border-slate-800 rounded-3xl overflow-hidden shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-sky-400 flex items-center gap-2">
              <FaMapMarkedAlt />
              <span>{currentFloor.name}</span>
            </span>

            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping inline-block"></span>
              <span>Walking Path Active</span>
            </div>
          </div>

          {/* SVG Map Render */}
          <div className="w-full overflow-x-auto pb-2 flex justify-center">
            <svg
              viewBox="0 0 600 420"
              className="w-full max-w-[580px] h-auto bg-slate-950 rounded-2xl border border-slate-800 shadow-inner select-none"
            >
              {/* Floor grid / corridor markings */}
              <rect x="230" y="20" width="140" height="380" fill="#0f172a" rx="10" />
              <rect x="20" y="240" width="560" height="70" fill="#0f172a" rx="10" />

              {/* Walking Route Path */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="5"
                  strokeDasharray="8,6"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              )}

              {/* Rooms */}
              {currentFloor.rooms.map((room) => {
                const isSelected = selectedRoomId === room.id;
                return (
                  <g
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className="cursor-pointer transition-transform hover:scale-[1.02]"
                  >
                    <rect
                      x={room.x}
                      y={room.y}
                      width={room.w}
                      height={room.h}
                      rx="12"
                      fill={room.color}
                      fillOpacity={isSelected ? 1 : 0.75}
                      stroke={isSelected ? '#ffffff' : '#38bdf8'}
                      strokeWidth={isSelected ? 3 : 1}
                      className="transition-all"
                    />
                    <text
                      x={room.x + room.w / 2}
                      y={room.y + room.h / 2 - 6}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {room.code}
                    </text>
                    <text
                      x={room.x + room.w / 2}
                      y={room.y + room.h / 2 + 10}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      opacity="0.9"
                    >
                      {room.name.length > 16 ? room.name.slice(0, 15) + '...' : room.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-4 mt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block"></span> Doctors OPD</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span> Pharmacy</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-600 inline-block"></span> Blood Bank</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-600 inline-block"></span> 24/7 Emergency</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-teal-500 inline-block"></span> Triage Desk</span>
          </div>
        </Card>

        {/* Right 1 Col: Turn-by-Turn Directions & Room Actions */}
        <div className="flex flex-col gap-4">
          {/* Active Chamber Card */}
          {selectedRoom && (
            <Card className="p-5 border-2 border-sky-300 bg-sky-50/50 rounded-3xl space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="badge badge-primary text-[10px] font-black">
                    {selectedRoom.code}
                  </span>
                  <h3 className="font-black text-base text-slate-900 mt-1">
                    {selectedRoom.name}
                  </h3>
                </div>
                {selectedRoom.wait && (
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Queue Wait</span>
                    <span className="text-xs font-black text-emerald-700">~{selectedRoom.wait}</span>
                  </div>
                )}
              </div>

              {selectedRoom.doctor && (
                <div className="bg-white p-3 rounded-2xl border border-sky-100 flex items-center gap-2.5">
                  <FaUserMd className="text-sky-600 text-lg flex-shrink-0" />
                  <div>
                    <strong className="text-xs text-slate-900 block">{selectedRoom.doctor}</strong>
                    <span className="text-[10px] text-slate-500">OPD Chamber Duty Physician</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => navigate(`/book?hospitalId=${hospitalId}&department=General%20Medicine`)}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all hover:scale-[1.01]"
              >
                <span>{isTamil ? 'இந்த அறைக்கு டோக்கன் பெறுக' : 'Book OPD Pass for this Chamber'}</span>
                <FaArrowRight size={11} />
              </button>
            </Card>
          )}

          {/* Turn-by-turn walking steps */}
          <Card className="p-5 border border-slate-200 bg-white rounded-3xl space-y-3 flex-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <FaWalking className="text-sky-600" />
              <span>{isTamil ? 'படிப்படியான வழிசெலுத்தல்' : 'Turn-by-Turn Route Guidance'}</span>
            </h4>

            <div className="space-y-2.5 pt-1">
              {stepsList.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-black text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="leading-snug">{step}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HospitalIndoorMap;
