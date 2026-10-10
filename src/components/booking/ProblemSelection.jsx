import React, { useState } from 'react';
import { healthProblems, searchProblems, getCategories } from '../../data/problems';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import Card from '../common/Card';
import Button from '../common/Button';
import { FaSearch, FaMicrophone, FaHeartbeat, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

const ProblemSelection = ({ selectedProblem, onSelectProblem, onNext }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { isListening, transcript, startListening, error: voiceError } = useVoiceInput((text) => {
    setSearchTerm(text);
    const results = searchProblems(text);
    if (results.length > 0) {
      handleSelect(results[0]);
    }
  });

  const categories = ['All', ...getCategories()];
  const searched = searchProblems(searchTerm);
  const filteredProblems = selectedCategory === 'All' 
    ? searched 
    : searched.filter(p => p.category === selectedCategory);

  const handleSelect = (problemObj) => {
    if (onSelectProblem) {
      onSelectProblem(problemObj);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="text-center">
        <span className="badge badge-primary uppercase tracking-wider mb-2 inline-flex items-center gap-1.5">
          <FaHeartbeat /> Step 1: Health Concern Triage
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">What health problem are you facing?</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
          Select or search your symptom in English or தமிழ். We'll automatically route you to the right department.
        </p>
      </div>

      {/* Search & Voice Box */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search problem (e.g. Fever, காய்ச்சல், Chest pain, Allergy, Asthma)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 text-sm font-medium focus:border-sky-500 focus:outline-none bg-slate-50/50"
            />
          </div>

          <button
            type="button"
            onClick={startListening}
            className={`w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-sky-600 hover:bg-sky-700 text-white shadow-md'
            }`}
          >
            <FaMicrophone size={14} />
            <span>{isListening ? 'Listening...' : 'Voice Triage'}</span>
          </button>
        </div>

        {isListening && (
          <div className="text-xs text-sky-800 bg-sky-100 p-3 rounded-xl font-semibold flex items-center gap-2 animate-pulse">
            <FaMicrophone /> Listening... Speak your health symptoms clearly (English or Tamil)
          </div>
        )}

        {voiceError && (
          <div className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl font-medium">{voiceError}</div>
        )}

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProblems.map((p) => {
          const isSelected = selectedProblem?.id === p.id || selectedProblem === p.name;
          return (
            <div
              key={p.id}
              onClick={() => handleSelect(p)}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between ${
                isSelected
                  ? 'bg-sky-50/80 border-sky-600 ring-2 ring-sky-300 shadow-md'
                  : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                      {p.name}
                    </h3>
                    <div className="text-xs font-bold text-teal-600 mt-0.5">{p.tamil}</div>
                  </div>
                  <span className={`badge text-[9px] font-black flex-shrink-0 ${
                    p.severity === 'emergency' ? 'badge-danger' :
                    p.severity === 'priority' ? 'badge-warning' : 'badge-primary'
                  }`}>
                    {p.specialty}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
                <span>{p.category}</span>
                {isSelected ? (
                  <span className="text-sky-600 flex items-center gap-1">
                    <FaCheckCircle /> Selected
                  </span>
                ) : (
                  <span className="text-slate-400 group-hover:text-sky-600 flex items-center gap-1">
                    Select <FaArrowRight size={10} />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {onNext && selectedProblem && (
        <div className="flex justify-end pt-4">
          <Button onClick={onNext} size="lg" className="font-bold text-xs" icon={FaArrowRight}>
            Proceed to Date Selection
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProblemSelection;
