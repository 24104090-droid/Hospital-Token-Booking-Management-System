import React, { useState } from 'react';
import { Mic, MicOff, Sparkles } from 'lucide-react';
import Button from './Button';
import { voiceService } from '../services/voiceService';

const VoiceAssistant = ({ onDetected, className = '' }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [matchStatus, setMatchStatus] = useState('');

  const handleListen = () => {
    setIsListening(true);
    setTranscript('');
    setMatchStatus('Listening for symptoms (e.g. "fever", "chest pain", "skin rash")...');

    voiceService.startListening(
      (text) => {
        setIsListening(false);
        setTranscript(text);
        const matched = voiceService.matchSymptom(text);
        if (matched) {
          setMatchStatus(`Identified: "${matched}"`);
          onDetected(matched);
        } else {
          setMatchStatus(`Recognized "${text}". Could not find direct match, showing general symptoms.`);
          onDetected(text);
        }
      },
      () => {
        setIsListening(false);
        setMatchStatus('Voice listening timed out or unavailable. Defaulted to sample triage.');
      }
    );
  };

  return (
    <div className={`voice-assistant-card p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-sky-600 text-white shadow-md'}`}>
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800 uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            AI Voice Triage Assistant
          </div>
          <p className="text-xs text-slate-600">
            {matchStatus || 'Speak in English or Tamil to automatically match OPD specialty'}
          </p>
          {transcript && (
            <p className="text-xs font-semibold text-slate-800 mt-0.5">
              Heard: <span className="italic">"{transcript}"</span>
            </p>
          )}
        </div>
      </div>

      <Button
        variant={isListening ? 'danger' : 'primary'}
        size="sm"
        onClick={handleListen}
        disabled={isListening}
      >
        {isListening ? 'Listening...' : 'Speak Symptoms'}
      </Button>
    </div>
  );
};

export default VoiceAssistant;
