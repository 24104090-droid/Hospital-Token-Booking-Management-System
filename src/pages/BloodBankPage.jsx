import React, { useState } from 'react';
import AppLayout from '../components/common/AppLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import LocationBar from '../components/common/LocationBar';
import BloodBankMap from '../components/map/BloodBankMap';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from '../context/LocationContext';
import { bloodBanks, volunteerDonors, getBloodTotalUnits } from '../data/bloodBanks';
import { 
  FaTint, 
  FaPhoneAlt, 
  FaWhatsapp, 
  FaHospital, 
  FaMapMarkerAlt, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaHeartbeat, 
  FaSearch, 
  FaPlusCircle,
  FaShieldAlt,
  FaClock,
  FaDirections,
  FaThLarge,
  FaMapMarkedAlt
} from 'react-icons/fa';

const BloodBankPage = () => {
  const { isTamil } = useLanguage();
  const { coords, radiusFilter, getDistanceTo, getETATo, openNavigation } = useLocation();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Filter blood banks by Radius and sort by nearest distance
  let displayedBloodBanks = [...bloodBanks];
  if (radiusFilter && radiusFilter !== 'all') {
    const maxRadius = Number(radiusFilter);
    displayedBloodBanks = displayedBloodBanks.filter(b => {
      if (!b.location?.lat || !b.location?.lng) return true;
      return getDistanceTo(b.location.lat, b.location.lng) <= maxRadius;
    });
  }

  displayedBloodBanks.sort((a, b) => {
    const distA = a.location?.lat ? getDistanceTo(a.location.lat, a.location.lng) : 999;
    const distB = b.location?.lat ? getDistanceTo(b.location.lat, b.location.lng) : 999;
    return distA - distB;
  });

  const [requestForm, setRequestForm] = useState({
    patientName: '',
    bloodGroup: 'O+',
    units: 2,
    hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
    contactNumber: '',
    urgency: 'Immediate (Within 2 Hours)'
  });

  const bloodGroups = ['ALL', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const filteredDonors = volunteerDonors.filter(d => {
    const matchesGroup = selectedGroup === 'ALL' || d.bloodGroup === selectedGroup;
    const matchesQuery = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         d.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesQuery;
  });

  const handleSendRequest = (e) => {
    e.preventDefault();
    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubmitted(false);
      setIsRequestModalOpen(false);
      alert(
        isTamil 
          ? `அவசர இரத்த கோரிக்கை பதிவு செய்யப்பட்டது! திருநெல்வேலி மாவட்ட தன்னார்வலர்களுக்கு தகவல் அனுப்பப்பட்டது.`
          : `Emergency blood broadcast sent! Verified Tirunelveli donors for ${requestForm.bloodGroup} have been notified.`
      );
    }, 1200);
  };

  return (
    <AppLayout>
      <div className="w-full max-w-6xl mx-auto space-y-8 text-left">
        {/* District Emergency Blood Header Banner */}
        <div className="bg-gradient-to-r from-rose-950 via-red-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-rose-500/20">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-black uppercase tracking-wider">
                <FaTint className="animate-bounce" />
                <span>{isTamil ? 'திருநெல்வேலி மாவட்ட 24/7 அவசர இரத்த சேவை' : 'Tirunelveli District 24/7 Blood Network'}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                {isTamil ? 'நேரலை இரத்த வங்கி & தன்னார்வ கொடையாளர் தளம்' : 'Emergency Blood Bank & Live Donor Hub'}
              </h1>
              <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
                {isTamil 
                  ? 'TVMCH, ஷிஃபா மற்றும் ரோட்டரி மையங்களின் நேரலை இரத்த இருப்பு மற்றும் அங்கீகரிக்கப்பட்ட கொடையாளர்களின் தொலைபேசி எண்கள்.'
                  : 'Real-time blood component availability across TVMCH, Shifa, and Rotary Central Blood Banks. Instant donor connect for critical surgeries.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
              <a
                href="tel:04622572733"
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-black flex items-center justify-center gap-2 transition-all no-underline"
              >
                <FaPhoneAlt />
                <span>TVMCH Hotline: 0462-2572733</span>
              </a>

              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white text-xs font-black shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 cursor-pointer"
              >
                <FaPlusCircle />
                <span>{isTamil ? 'அவசர இரத்த கோரிக்கை இடுக' : 'Post Urgent Blood Request'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live District Blood Inventory Ticker */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FaTint className="text-rose-600" />
                <span>{isTamil ? 'மாவட்ட வாரியான நேரலை இரத்த இருப்பு (அலகுகள்)' : 'District Live Blood Stock (Units)'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {isTamil ? 'அனைத்து அரசு மற்றும் தனியார் மையங்களின் மொத்த இருப்பு' : 'Live aggregated units across 4 major blood storage centers'}
              </p>
            </div>

            <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              Total: <strong className="text-rose-600 font-black">{getBloodTotalUnits()}</strong> Units Online
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((grp) => {
              const units = getBloodTotalUnits(grp);
              const isSelected = selectedGroup === grp;
              const isLow = units < 15;

              return (
                <button
                  key={grp}
                  type="button"
                  onClick={() => setSelectedGroup(selectedGroup === grp ? 'ALL' : grp)}
                  className={`p-3 rounded-2xl border transition-all text-center cursor-pointer flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
                      : 'bg-white hover:border-rose-300 border-slate-200 shadow-2xs'
                  }`}
                >
                  <span className={`text-base font-black ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {grp}
                  </span>
                  <span className={`text-lg font-mono font-black mt-1 ${isSelected ? 'text-white' : isLow ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {units}
                  </span>
                  <span className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${isSelected ? 'text-rose-100' : isLow ? 'text-amber-700' : 'text-slate-400'}`}>
                    {isLow ? 'Low Stock' : 'Units'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Location Bar with GPS & Radius filter */}
        <LocationBar showRadiusFilter={true} className="border-rose-200 from-rose-50/50 via-white to-red-50/30" />

        {/* Hospital Blood Banks Directory Header & View Toggle */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FaHospital className="text-rose-600" />
                <span>{isTamil ? 'அங்கீகரிக்கப்பட்ட இரத்த வங்கிகள்' : 'Certified Hospital Blood Banks'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {isTamil ? 'அருகிலுள்ள இரத்த வங்கிகள் மற்றும் நிகழ்நேர இருப்பு விபரம்' : 'Nearest storage centers sorted by real-time distance from your location'}
              </p>
            </div>

            {/* View Mode Toggle: Grid vs Interactive Map */}
            <div className="flex bg-rose-50 p-1 rounded-2xl border border-rose-200 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-rose-800 hover:bg-rose-100'
                }`}
              >
                <FaThLarge size={11} />
                <span>Grid ({displayedBloodBanks.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-rose-800 hover:bg-rose-100'
                }`}
              >
                <FaMapMarkedAlt size={12} />
                <span>Live Map</span>
              </button>
            </div>
          </div>

          {viewMode === 'map' ? (
            <BloodBankMap bloodBanks={displayedBloodBanks} height="520px" />
          ) : displayedBloodBanks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
              <div className="text-2xl mb-2">🩸</div>
              <h3 className="font-extrabold text-sm text-slate-900">No Blood Banks within this radius</h3>
              <p className="text-xs text-slate-500 mt-1">Try selecting 5 km, 10 km, or All in the location bar above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedBloodBanks.map((bank) => {
                const dist = bank.location?.lat ? getDistanceTo(bank.location.lat, bank.location.lng) : 2.5;
                const driveETA = bank.location?.lat ? getETATo(bank.location.lat, bank.location.lng) : '6 mins';

                return (
                  <Card key={bank.id} className="p-5 border-2 border-slate-200 hover:border-rose-300 bg-white shadow-xs rounded-3xl space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="badge badge-primary text-[9px] font-black">
                            {bank.type}
                          </span>
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            📍 {dist} km away (~{driveETA})
                          </span>
                        </div>
                        <h3 className="font-black text-base text-slate-900 mt-2 leading-snug">
                          {bank.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <FaMapMarkerAlt className="text-rose-500 flex-shrink-0" />
                          <span>{bank.address}</span>
                        </p>
                      </div>
                    </div>

                    {/* Stock per group inside this bank */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex justify-between">
                        <span>Units In Stock</span>
                        {bank.componentSeparation && (
                          <span className="text-teal-700 font-extrabold">PRBC / Platelets / FFP ✓</span>
                        )}
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 text-center">
                        {Object.entries(bank.stock).map(([grp, qty]) => (
                          <div 
                            key={grp}
                            className={`p-1.5 rounded-xl border ${
                              selectedGroup === grp 
                                ? 'bg-rose-50 border-rose-300 text-rose-800 font-black' 
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="text-[10px] font-bold block">{grp}</span>
                            <span className="text-xs font-black">{qty}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                      <a
                        href={`tel:${bank.phone}`}
                        className="font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 no-underline"
                      >
                        <FaPhoneAlt size={11} className="text-rose-600" /> <span>{bank.phone}</span>
                      </a>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openNavigation(bank.location.lat, bank.location.lng)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all hover:scale-105 active:scale-95"
                          title="Open turn-by-turn navigation in Google Maps"
                        >
                          <FaDirections /> <span>Directions</span>
                        </button>

                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`Urgent Blood Enquiry at ${bank.name}: Phone ${bank.phone}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-black text-xs flex items-center gap-1.5 no-underline"
                        >
                          <FaWhatsapp /> <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Volunteer Donors Directory */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FaHeartbeat className="text-rose-600" />
                <span>{isTamil ? 'உடனடி தன்னார்வ இரத்தக் கொடையாளர்கள்' : 'Emergency Volunteer Donors'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {isTamil ? 'அவசர சிகிச்சைக்காக தொடர்பு கொள்ளக்கூடிய சரிபார்க்கப்பட்ட தன்னார்வலர்கள்' : 'Verified donors in Tirunelveli ready to assist in urgent situations'}
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isTamil ? 'பெயர் அல்லது பகுதி...' : 'Search name or area...'}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-rose-500 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredDonors.map((donor) => (
              <Card key={donor.id} className="p-4 border border-slate-200 bg-white rounded-2xl shadow-2xs hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 font-mono font-black text-lg flex items-center justify-center flex-shrink-0">
                    {donor.bloodGroup}
                  </div>
                  <span className="badge badge-success text-[9px] font-black flex items-center gap-1">
                    <FaShieldAlt /> VERIFIED
                  </span>
                </div>

                <div className="mt-3">
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                    {donor.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <FaMapMarkerAlt size={10} className="text-slate-400" /> {donor.area}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-bold mt-1">
                    Last Donated: {donor.lastDonated}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                  <a
                    href={`tel:${donor.phone}`}
                    className="py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 no-underline transition-colors"
                  >
                    <FaPhoneAlt size={10} /> <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/91${donor.phone}?text=${encodeURIComponent(`Vanakkam, we found your contact via TVL SmartCare emergency blood donor network for urgent ${donor.bloodGroup} requirement.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 no-underline transition-colors"
                  >
                    <FaWhatsapp size={12} /> <span>Chat</span>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Blood Request Modal */}
        <Modal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          title={isTamil ? 'அவசர இரத்தக் கோரிக்கை பதிவு' : 'Broadcast Urgent Blood Request'}
        >
          <form onSubmit={handleSendRequest} className="space-y-4 p-2 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isTamil ? 'நோயாளி பெயர்' : 'Patient Name'}
              </label>
              <input
                type="text"
                required
                value={requestForm.patientName}
                onChange={(e) => setRequestForm({ ...requestForm, patientName: e.target.value })}
                placeholder="e.g. Meenakshi Sundaram"
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isTamil ? 'இரத்த பிரிவு' : 'Blood Group'}
                </label>
                <select
                  value={requestForm.bloodGroup}
                  onChange={(e) => setRequestForm({ ...requestForm, bloodGroup: e.target.value })}
                  className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-rose-500 bg-white"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isTamil ? 'தேவைப்படும் அலகுகள்' : 'Units Required'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={requestForm.units}
                  onChange={(e) => setRequestForm({ ...requestForm, units: e.target.value })}
                  className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isTamil ? 'மருத்துவமனை' : 'Hospital Name & Ward'}
              </label>
              <input
                type="text"
                required
                value={requestForm.hospitalName}
                onChange={(e) => setRequestForm({ ...requestForm, hospitalName: e.target.value })}
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isTamil ? 'உடனடி தொடர்பு எண்' : 'Attendant Contact Number'}
              </label>
              <input
                type="tel"
                required
                placeholder="9876543210"
                value={requestForm.contactNumber}
                onChange={(e) => setRequestForm({ ...requestForm, contactNumber: e.target.value })}
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={requestSubmitted}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-extrabold text-xs shadow-lg transition-transform hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
              >
                <FaTint />
                <span>{requestSubmitted ? 'அனுப்பப்படுகிறது...' : (isTamil ? 'அவசர கோரிக்கையை அனுப்பு' : 'Broadcast to Donors')}</span>
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default BloodBankPage;
