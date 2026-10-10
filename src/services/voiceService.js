import { diseaseMapping } from '../data/diseaseMapping';

export const voiceService = {
  startListening: (callback, onError) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API not available in this browser. Simulating voice input.');
      setTimeout(() => {
        const mockPhrases = ['fever and body ache', 'skin allergy', 'chest pain', 'eye redness', 'ear problem'];
        const randomPhrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
        callback(randomPhrase);
      }, 1400);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN'; // or 'ta-IN' for Tamil / English mix
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        callback(transcript);
      };

      recognition.onerror = (err) => {
        console.warn('SpeechRecognition error:', err);
        if (onError) onError(err);
        // graceful fallback to common symptom
        callback('fever');
      };

      recognition.start();
    } catch (e) {
      console.error('Error starting speech recognition:', e);
      if (onError) onError(e);
      callback('fever');
    }
  },

  matchSymptom: (transcript) => {
    if (!transcript) return null;
    const lower = transcript.toLowerCase();
    const allDiseases = Object.keys(diseaseMapping);

    // Exact or substring match
    const found = allDiseases.find(d => lower.includes(d.toLowerCase()) || d.toLowerCase().includes(lower));
    if (found) return found;

    // Word-by-word token match
    const words = lower.split(/\s+/);
    for (const w of words) {
      if (w.length < 3) continue;
      const match = allDiseases.find(d => d.toLowerCase().includes(w));
      if (match) return match;
    }

    return null;
  }
};
