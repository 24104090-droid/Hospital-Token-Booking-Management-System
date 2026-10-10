/**
 * Hospital Public Address (PA) Audio & Voice Announcement Engine
 * Uses Web Audio API for authentic 2-tone melodic hospital chime (Ding-Dong)
 * and Web Speech API for bilingual (Tamil + English) patient token announcements.
 */

// Pre-warm voices cache
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  } catch (e) {
    // ignore
  }
}

// Play authentic 2-tone hospital/airport melodic chime (Ding-Dong 🔔)
export const playHospitalChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Tone 1: High crisp ding (659.25 Hz - E5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.35, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.6);

    // Tone 2: Warm lower dong (523.25 Hz - C5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(523.25, now + 0.28);
    gain2.gain.setValueAtTime(0, now + 0.28);
    gain2.gain.linearRampToValueAtTime(0.35, now + 0.33);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.28);
    osc2.stop(now + 1.0);
  } catch (err) {
    console.warn('AudioContext chime error:', err);
  }
};

// Main speech announcement for calling patient tokens
export const speakTokenAnnouncement = ({
  tokenNumber,
  patientName = '',
  room = 'Room 102',
  doctorName = 'Doctor Chamber',
  lang = 'both' // 'ta', 'en', 'both'
}) => {
  // 1. First play the chime
  playHospitalChime();

  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Cancel any running speech and resume context
  window.speechSynthesis.cancel();
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }

  // Allow 450ms for chime tone before voice starts
  setTimeout(() => {
    const voices = window.speechSynthesis.getVoices() || [];
    
    // Look for Tamil voice (Google தமிழ், Microsoft Valluvar, ta-IN)
    const tamilVoice = voices.find(v => 
      v.lang.toLowerCase().includes('ta') || 
      v.name.toLowerCase().includes('tamil') ||
      v.name.toLowerCase().includes('valluvar')
    );

    // Look for Indian English voice or best available English
    const indianEngVoice = voices.find(v => 
      v.lang.toLowerCase().includes('en-in') || 
      v.name.toLowerCase().includes('india') ||
      v.name.toLowerCase().includes('rishi') ||
      v.name.toLowerCase().includes('neerja')
    ) || voices.find(v => v.lang.toLowerCase().includes('en'));

    // Construct announcements
    const cleanRoom = room.replace(/^OPD\s*/i, '');
    const cleanDoctor = doctorName.split(',')[0];

    // Priority 1: Tamil Announcement
    if (lang === 'ta' || lang === 'both') {
      const tamilText = `டோக்கன் எண் ${tokenNumber}, ${cleanDoctor} அறைக்கு வரவும்.`;
      const taUtterance = new SpeechSynthesisUtterance(tamilText);
      taUtterance.rate = 0.92;
      taUtterance.pitch = 1.05;
      taUtterance.volume = 1.0;

      if (tamilVoice) {
        taUtterance.voice = tamilVoice;
        taUtterance.lang = 'ta-IN';
      } else {
        // Phonetic romanized Tamil fallback so English TTS engines pronounce it properly
        taUtterance.text = `Token number ${tokenNumber}. ${patientName ? patientName + ',' : ''} please proceed to ${cleanRoom || 'Doctor Room'}.`;
        if (indianEngVoice) taUtterance.voice = indianEngVoice;
      }

      window.speechSynthesis.speak(taUtterance);
    }

    // Priority 2: Crisp English Announcement (Follow-up)
    if (lang === 'en' || (lang === 'both' && tamilVoice)) {
      const engText = `Attention please. Token number ${tokenNumber}, please proceed to ${cleanRoom || 'consulting room'}.`;
      const enUtterance = new SpeechSynthesisUtterance(engText);
      enUtterance.rate = 0.95;
      enUtterance.pitch = 1.0;
      enUtterance.volume = 1.0;

      if (indianEngVoice) {
        enUtterance.voice = indianEngVoice;
        enUtterance.lang = 'en-IN';
      }

      window.speechSynthesis.speak(enUtterance);
    }
  }, 450);
};

// 1-Click Speaker Test
export const testHospitalAudio = () => {
  speakTokenAnnouncement({
    tokenNumber: 25,
    patientName: 'Selvakumar',
    room: 'Room 102',
    doctorName: 'Dr. Sundararajan'
  });
};

// Play Emergency Siren (Trauma / Code Red)
export const playEmergencySiren = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    // Frequency sweep: 600Hz -> 950Hz -> 600Hz -> 950Hz -> 600Hz
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.linearRampToValueAtTime(950, now + 0.35);
    osc.frequency.linearRampToValueAtTime(600, now + 0.70);
    osc.frequency.linearRampToValueAtTime(950, now + 1.05);
    osc.frequency.linearRampToValueAtTime(600, now + 1.40);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain.gain.setValueAtTime(0.3, now + 1.35);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.55);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.6);
  } catch (err) {
    console.warn('AudioContext siren error:', err);
  }
};

// Emergency Code Red Announcement
export const speakCodeRedAnnouncement = ({ room = 'Room 102', reason = 'Trauma Resuscitation' } = {}) => {
  playEmergencySiren();

  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  if (window.speechSynthesis.paused) window.speechSynthesis.resume();

  setTimeout(() => {
    const voices = window.speechSynthesis.getVoices() || [];
    const tamilVoice = voices.find(v => 
      v.lang.toLowerCase().includes('ta') || 
      v.name.toLowerCase().includes('tamil') ||
      v.name.toLowerCase().includes('valluvar')
    );
    const indianEngVoice = voices.find(v => 
      v.lang.toLowerCase().includes('en-in') || 
      v.name.toLowerCase().includes('india') ||
      v.name.toLowerCase().includes('rishi')
    ) || voices.find(v => v.lang.toLowerCase().includes('en'));

    // English Alert
    const enText = `Emergency Alert: Code Red priority activated in ${room}. Regular OPD queue consultations are temporarily held for 15 minutes.`;
    const enUtterance = new SpeechSynthesisUtterance(enText);
    enUtterance.rate = 0.95;
    enUtterance.pitch = 1.1;
    if (indianEngVoice) enUtterance.voice = indianEngVoice;

    if (tamilVoice) {
      const taText = `அவசர எச்சரிக்கை! கோட் ரெட் அவசர சிகிச்சை பிரிவு செயல்படுத்தப்பட்டுள்ளது. வழக்கமான ஓபிடி டோக்கன் வரிசை தற்காலிகமாக நிறுத்தப்பட்டுள்ளது.`;
      const taUtterance = new SpeechSynthesisUtterance(taText);
      taUtterance.voice = tamilVoice;
      taUtterance.rate = 0.92;
      window.speechSynthesis.speak(taUtterance);
      setTimeout(() => {
        window.speechSynthesis.speak(enUtterance);
      }, 3500);
    } else {
      window.speechSynthesis.speak(enUtterance);
    }
  }, 1600);
};

// Emergency Stand-Down (Code Green / Resume Queue)
export const speakCodeGreenAnnouncement = () => {
  playHospitalChime();

  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  if (window.speechSynthesis.paused) window.speechSynthesis.resume();

  setTimeout(() => {
    const voices = window.speechSynthesis.getVoices() || [];
    const indianEngVoice = voices.find(v => 
      v.lang.toLowerCase().includes('en-in') || 
      v.name.toLowerCase().includes('india')
    ) || voices.find(v => v.lang.toLowerCase().includes('en'));

    const text = 'Attention please. Code Red emergency has been cleared. Regular OPD consultations and token calls have resumed.';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    if (indianEngVoice) utterance.voice = indianEngVoice;
    window.speechSynthesis.speak(utterance);
  }, 500);
};

