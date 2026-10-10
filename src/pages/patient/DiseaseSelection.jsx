import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Stethoscope, ArrowRight, Activity, Sparkles } from 'lucide-react';
import { HospitalContext } from '../../context/HospitalContext';
import { diseaseCategories, diseaseMapping } from '../../data/diseaseMapping';
import VoiceAssistant from '../../components/VoiceAssistant';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { DEFAULT_LOCATION } from '../../utils/constants';

const DiseaseSelection = () => {
  const navigate = useNavigate();
  const { setSelectedDisease, selectedCity } = useContext(HospitalContext);
  const [search, setSearch] = useState('');

  const handleSelect = (symptom) => {
    setSelectedDisease(symptom);
    navigate('/specialist');
  };

  const filteredCategories = diseaseCategories.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) =>
      item.toLowerCase().includes(search.toLowerCase()) ||
      (diseaseMapping[item] && diseaseMapping[item].toLowerCase().includes(search.toLowerCase()))
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Stethoscope className="w-3.5 h-3.5" /> OPD Medical Triage Engine
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          What Health Problem Are You Facing?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Select your symptom to identify the matching hospital department in <strong>{selectedCity || DEFAULT_LOCATION}</strong>.
        </p>
      </div>

      {/* Voice Assistant */}
      <div className="max-w-2xl mx-auto mb-6">
        <VoiceAssistant
          onDetected={(detected) => {
            if (detected) handleSelect(detected);
          }}
        />
      </div>

      {/* Search Input */}
      <div className="max-w-xl mx-auto mb-8">
        <Input
          placeholder="Filter symptoms or medical department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={Search}
        />
      </div>

      {/* Categorized Symptoms Grid */}
      <div className="space-y-6">
        {filteredCategories.map((cat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <Activity className="w-5 h-5 text-sky-600" />
              <h3 className="text-base font-bold text-slate-900">{cat.category}</h3>
              <span className="text-xs text-slate-400 font-medium">({cat.items.length} conditions)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {cat.items.map((item) => {
                const specialty = diseaseMapping[item];
                return (
                  <button
                    key={item}
                    onClick={() => handleSelect(item)}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-sky-50 text-left border border-slate-200 hover:border-sky-300 transition-all hover:shadow-md group flex flex-col justify-between"
                  >
                    <span className="text-xs font-bold text-slate-900 group-hover:text-sky-700 block mb-1">
                      {item}
                    </span>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                      <span className="text-[11px] text-sky-600 font-semibold truncate">
                        {specialty}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiseaseSelection;
