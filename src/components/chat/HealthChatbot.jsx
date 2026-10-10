import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { useHospital } from '../../context/HospitalContext';
import { searchProblems } from '../../data/problems';
import { 
  FaComments, 
  FaTimes, 
  FaPaperPlane, 
  FaRobot, 
  FaUser, 
  FaHeartbeat, 
  FaHospital, 
  FaTicketAlt, 
  FaAmbulance, 
  FaLanguage,
  FaVolumeUp,
  FaMicrophone,
  FaTint,
  FaMapMarkedAlt
} from 'react-icons/fa';

const HealthChatbot = () => {
  const navigate = useNavigate();
  const { isTamil: globalIsTamil } = useLanguage();
  const { appointments, lastBookedToken } = useBooking();
  const { hospitals } = useHospital();

  const [isOpen, setIsOpen] = useState(false);
  const [chatLang, setChatLang] = useState(globalIsTamil ? 'ta' : 'en');
  const isTa = chatLang === 'ta';

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  // Sync initial welcome message based on selected language
  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: isTa
          ? 'வணக்கம்! நான் உங்கள் டிவிஎல் ஸ்மார்ட்கேர் AI மருத்துவ உதவியாளர். தமிழ் மற்றும் ஆங்கிலத்தில் உங்கள் அறிகுறிகள், மருத்துவமனைகள், இரத்த வங்கி அல்லது டோக்கன் நிலவரம் குறித்து கேட்கலாம்.'
          : 'Vanakkam! I am your TVL SmartCare AI Medical Assistant. Feel free to ask in Tamil or English about symptoms, blood availability, indoor hospital maps, or live OPD tokens.',
        time: 'Just now',
        suggestions: isTa
          ? ['எனக்கு கடுமையான காய்ச்சல் உள்ளது', 'கண் மருத்துவமனை விவரம்', 'அவசர இரத்த வங்கி', 'என் டோக்கன் நிலை என்ன?']
          : ['I have high fever & chills', 'Best eye hospital in TVL', 'Emergency Blood Bank', 'Check active token status']
      }
    ]);
  }, [chatLang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Voice speech-to-text inside chatbot
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(isTa ? 'உங்கள் உலாவியில் குரல் அறிதல் ஆதரிக்கப்படவில்லை.' : 'Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = isTa ? 'ta-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSend(transcript);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  // AI Response Engine with bilingual Tamil & English natural language understanding
  const generateBotResponse = (userQuery) => {
    const q = userQuery.toLowerCase().trim();
    const hasTamilScript = /[\u0B80-\u0BFF]/.test(userQuery);
    const replyTa = isTa || hasTamilScript;

    // Helper to check any keyword match
    const hasAny = (keywords) => keywords.some(k => q.includes(k.toLowerCase()));

    // 1. Greetings & Casual Chat
    if (
      hasAny([
        'வணக்கம்', 'ஹலோ', 'காலை வணக்கம்', 'மாலை வணக்கம்', 'நலம்', 'நலமா', 
        'எப்படி இருக்கீங்க', 'எப்படி இருக்கிறீர்கள்', 'vanakkam', 'hello', 'hi', 'hey', 
        'good morning', 'good afternoon', 'good evening', 'epdi irukinga', 'nalama'
      ])
    ) {
      return {
        text: replyTa
          ? 'வணக்கம்! நான் உங்கள் டிவிஎல் ஸ்மார்ட்கேர் AI மருத்துவ உதவியாளர். 🙏\n\nஉங்களுக்கு காய்ச்சல், சளி, தலைவலி போன்ற உடல்நல உபாதைகள் உள்ளதா? அல்லது திருநெல்வேலி மருத்துவமனைகளின் ஓபிடி டோக்கன் முன்பதிவு, மருத்துவர் நேரம், அவசர இரத்த வங்கி தேவைப்படுகிறதா? சொல்லுங்கள், நான் உதவுகிறேன்.'
          : 'Hello! I am your TVL SmartCare AI Medical Assistant. 🙏\n\nHow can I help you today? You can ask about symptoms, OPD token booking, hospital timings, or emergency blood bank stock in Tirunelveli.',
        suggestions: replyTa
          ? ['எனக்கு காய்ச்சல் உள்ளது', 'டாக்டர் நேரம் என்ன?', 'டோக்கன் எடுப்பது எப்படி?', 'அவசர இரத்த வங்கி']
          : ['I have fever & body pain', 'Doctor OPD Timings', 'How to book token?', 'Blood Bank Directory']
      };
    }

    // 2. Gratitude / Thanks
    if (
      hasAny([
        'நன்றி', 'மிக்க நன்றி', 'ரொம்ப நன்றி', 'தேங்க்ஸ்', 'thanks', 'thank you', 'nandri', 'romba nandri'
      ])
    ) {
      return {
        text: replyTa
          ? 'மகிழ்ச்சி! 😊 உங்கள் உடல்நலம் விரைவாக நலம் பெற டிவிஎல் ஸ்மார்ட்கேர் வாழ்த்துகிறது. வேறு ஏதேனும் மருத்துவ வழிகாட்டல் தேவைப்பட்டால் எப்போதும் கேட்கலாம். ஆரோக்கியமாக இருங்கள்!'
          : 'You are welcome! 😊 Wishing you good health and a speedy recovery. Feel free to ask anytime if you need more medical assistance.',
        suggestions: replyTa
          ? ['டோக்கன் நிலை காண்க', 'மருத்துவமனைகள்', 'இரத்த வங்கி']
          : ['View Token Status', 'Top Hospitals', 'Blood Bank']
      };
    }

    // 3. Emergency & 108 Casualty / Chest Pain / Heart Issues
    if (
      hasAny([
        'emergency', 'accident', '108', 'ambulance', 'heart attack', 'chest pain', 
        'breathing difficulty', 'trauma', 'casualty', 'severe bleeding', 'unconscious',
        'அவசரம்', 'விபத்து', 'மாரடைப்பு', 'நெஞ்சு வலி', 'மூச்சுத்திணறல்', 'ஆம்புலன்ஸ்', 
        'தீக்காயம்', 'மயக்கம்', 'உயிருக்கு ஆபத்து', 'nenju vali', 'maradaipu', 'moochu', 'avasaram'
      ])
    ) {
      return {
        text: replyTa
          ? '🚨 அவசர சிகிச்சை வழிகாட்டுதல்:\nதீவிர நெஞ்சு வலி, விபத்து, அதிக இரத்தப்போக்கு அல்லது மூச்சுத்திணறல் இருந்தால் உடனடியாக 108 அவசர ஊர்தியை அழையுங்கள்.\n\nதிருநெல்வேலி அரசு மருத்துவக் கல்லூரி (TVMCH ஹை கிரவுண்ட்ஸ்) மற்றும் ஷிஃபா மருத்துவமனைகளில் 24/7 அவசர சிகிச்சை பிரிவு (Casualty & Trauma Bay) தயார் நிலையில் உள்ளது.'
          : '🚨 CRITICAL EMERGENCY ALERT:\nFor acute trauma, severe chest pain, road accidents, or breathing distress, dial 108 Ambulance immediately.\n\nTVMCH (High Grounds) and Shifa Hospital maintain 24/7 casualty trauma rooms and critical care teams.',
        action: { label: replyTa ? '108 அவசர டோக்கன் பாஸ்' : 'Generate Emergency 108 Pass', link: '/emergency' },
        suggestions: replyTa
          ? ['108 அவசர டோக்கன்', 'இரத்த வங்கி காண்க', 'TVMCH வரைபடம்']
          : ['108 Emergency Pass', 'Blood Bank Stock', 'TVMCH Map']
      };
    }

    // 4. Blood Bank & Donors
    if (
      hasAny([
        'blood', 'donor', 'plasma', 'platelet', 'ரத்தம்', 'இரத்தம்', 'பிளட்', 'தானம்', 
        'இரத்த வங்கி', 'குருதி', 'raththam', 'iratham', 'blood bank'
      ])
    ) {
      return {
        text: replyTa
          ? '🩸 அவசர இரத்த வங்கி வழிகாட்டி:\nதிருநெல்வேலி அரசு மருத்துவக் கல்லூரி (TVMCH), ஷிஃபா மற்றும் ரோட்டரி சென்ட்ரல் இரத்த வங்கிகளில் A+, B+, O+, AB+ மற்றும் நெகட்டிவ் இரத்த அலகுகள் உள்ளன. அவசர தேவைக்கு நேரலை நன்கொடையாளர்களையும் இணைக்கலாம்.'
          : '🩸 Emergency Blood Bank Directory:\nReal-time blood stock for A+, B+, O+, AB+, and Rare Negative groups across TVMCH, Shifa, and Rotary Central are updated live.',
        action: { label: replyTa ? 'இரத்த வங்கி அடைவு காண்க' : 'Open Blood Bank Directory', link: '/blood-bank' },
        suggestions: replyTa
          ? ['O+ ரத்தம் தேவை', 'B+ ரத்தம் தேவை', 'இரத்த தானம் செய்ய']
          : ['O+ Blood Units', 'B+ Blood Units', 'Emergency Donors']
      };
    }

    // 5. How to Book Token / Token Guidance
    if (
      hasAny([
        'டோக்கன் எடுப்பது எப்படி', 'எப்படி புக் செய்வது', 'முன்பதிவு செய்ய', 'புதிய டோக்கன்', 
        'டோக்கன் வேணும்', 'எடுக்க வேண்டும்', 'புக் பண்ண', 'டோக்கன் போடுவது', 'token eppadi', 
        'how to book', 'token booking', 'book appointment', 'token edukka', 'book token', 'reserve token'
      ])
    ) {
      return {
        text: replyTa
          ? '🎫 டோக்கன் முன்பதிவு செய்யும் எளிய முறை:\n1. உங்கள் உடல் பிரச்சனையை தேர்வு செய்யுங்கள் (எ.கா: காய்ச்சல், கண், எலும்பு, மகளிர் நலம்).\n2. எங்கள் அமைப்பு உகந்த துறை மற்றும் மருத்துவமனையை பரிந்துரைக்கும்.\n3. நோயாளி விவரங்களை உள்ளிட்டு "Book Token" அழுத்தினால் உடனடி QR டோக்கன் எண் வழங்கப்படும்.\n4. மருத்துவமனை காத்திருப்பு அறையில் மணிக்கணக்கில் நிற்காமல், உங்கள் நேரம் வரும்போது நேரடியாக மருத்துவரை அணுகலாம்.'
          : '🎫 How to Book an OPD Token:\n1. Select your health complaint or symptom.\n2. Choose the recommended hospital & specialist department.\n3. Enter patient details and generate your instant QR token pass.\n4. Track your live turn and visit without waiting in physical queues.',
        action: { label: replyTa ? 'உடனடி டோக்கன் பதிவு செய்க' : 'Book OPD Token Now', link: '/book' },
        suggestions: replyTa
          ? ['காய்ச்சல் டோக்கன்', 'இலவச TVMCH டோக்கன்', 'கண் மருத்துவமனை டோக்கன்']
          : ['Fever Token', 'TVMCH Free Token', 'Eye Hospital Pass']
      };
    }

    // 6. Token Status & Live Queue Tracking
    if (
      hasAny([
        'என் டோக்கன்', 'டோக்கன் நிலை', 'வரிசை எண்', 'எந்த டோக்கன் போகுது', 'காத்திருப்பு நேரம்', 
        'எப்போ என் முறை வரும்', 'token status', 'my token', 'current token', 'queue', 'live status', 'token check'
      ])
    ) {
      const active = appointments?.find(a => a.status === 'confirmed' || a.status === 'serving') || lastBookedToken;
      if (active) {
        return {
          text: replyTa
            ? `📋 நேரலை டோக்கன் நிலவரம்:\n• உங்கள் டோக்கன் எண்: #${active.tokenNumber}\n• மருத்துவமனை: ${active.hospitalName}\n• தற்போது அழைக்கப்படும் எண்: #${active.currentServing || 14}\n• உத்தேச காத்திருப்பு: சுமார் ~${active.estimatedWaitMinutes || 12} நிமிடங்கள்.`
            : `📋 Live Token Status:\n• Your Token: #${active.tokenNumber}\n• Hospital: ${active.hospitalName}\n• Currently Serving: Token #${active.currentServing || 14}\n• Estimated wait: ~${active.estimatedWaitMinutes || 12} mins.`,
          action: { label: replyTa ? 'நேரலை டோக்கன் பலகை காண்க' : 'View Live Token Ticker', link: '/appointments' }
        };
      } else {
        return {
          text: replyTa
            ? 'தற்போது உங்களிடம் செயலில் உள்ள டோக்கன் பதிவு எதுவும் இல்லை. திருநெல்வேலி மருத்துவமனைகளில் புதிய OPD டோக்கன் முன்பதிவு செய்ய விரும்புகிறீர்களா?'
            : 'You do not have an active token right now. Would you like to book a verified OPD consultation token pass?',
          action: { label: replyTa ? 'டோக்கன் முன்பதிவு செய்க' : 'Book OPD Token', link: '/book' }
        };
      }
    }

    // 7. Fever, Cold, Cough & Viral Infection
    if (
      hasAny([
        'காய்ச்சல்', 'சுரம்', 'சளி', 'இருமல்', 'தொண்டை வலி', 'உடம்பு வலி', 'மூக்கடைப்பு', 
        'குளிர்', 'நடுக்கம்', 'வைரஸ்', 'kaichal', 'suram', 'sali', 'irumal', 'thondai vali', 
        'odambu vali', 'fever', 'cold', 'cough', 'chills', 'viral', 'flu'
      ])
    ) {
      return {
        text: replyTa
          ? '🌡️ காய்ச்சல் & சளி மருத்துவ ஆலோசனை:\nஉங்களுக்கு வைரஸ் காய்ச்சல் அல்லது தட்பவெப்ப சளி அறிகுறிகள் தென்படுகின்றன.\n• மிதமான வெந்நீர், கஞ்சி அருந்தி ஓய்வெடுக்கவும்.\n• 101°F-க்கு மேல் காய்ச்சல் இருந்தால் நெற்றியில் குளிர்ந்த நீர் ஒத்தடம் கொடுக்கவும்.\n\nபரிந்துரைக்கப்படும் துறை: "பொது மருத்துவம்" (General Medicine). TVMCH அரசு மருத்துவமனை அல்லது ஷிஃபா மருத்துவமனையில் நேரலை டோக்கன் பெறலாம்.'
          : '🌡️ Fever & Cold Triage Advice:\nSymptoms suggest viral pyrexia or upper respiratory tract infection.\n• Stay hydrated with warm fluids and adequate bed rest.\n• Consult a General Medicine specialist if fever persists over 3 days.\n\nRecommended Department: General Medicine at TVMCH or Shifa Hospital.',
        action: { label: replyTa ? 'பொது மருத்துவம் டோக்கன் பெறுக' : 'Book General Medicine Token', link: '/book?problem=Fever%20%26%20Chills' },
        suggestions: replyTa
          ? ['பொது மருத்துவர் டோக்கன்', 'டிவிஎம்சி இலவச ஓபிடி', 'டாக்டர் நேரம்']
          : ['Book General OPD', 'TVMCH Free Token', 'OPD Timings']
      };
    }

    // 8. Headache, Migraine & Nerves
    if (
      hasAny([
        'தலைவலி', 'மைக்ரேன்', 'தலை சுற்றல்', 'தலைசுற்றல்', 'மயக்கம்', 'நரம்பு', 
        'thalavali', 'thala vali', 'migraine', 'headache', 'dizziness', 'mayakkam', 'vertigo'
      ])
    ) {
      return {
        text: replyTa
          ? '🧠 தலைவலி & மைக்ரேன் ஆலோசனை:\nகடுமையான தலைவலி, ஒற்றைத் தலைவலி அல்லது தலைசுற்றல் இருந்தால் இரத்த அழுத்தம் (BP) மற்றும் கண் பார்வை பரிசோதனை செய்து கொள்வது அவசியம்.\n• அமைதியான, வெளிச்சம் குறைவான அறையில் ஓய்வெடுக்கவும்.\n\nபரிந்துரைக்கப்படும் துறை: "நரம்பியல்" (Neurology) அல்லது "பொது மருத்துவம்" (General Medicine).'
          : '🧠 Headache & Migraine Guidance:\nSevere throbbing headache with light sensitivity or dizziness may indicate migraine or elevated blood pressure.\n• Rest in a quiet, darkened room and avoid screen glare.\n\nRecommended Department: Neurology / General Medicine.',
        action: { label: replyTa ? 'நரம்பியல் துறை முன்பதிவு' : 'Book Neurology Consultation', link: '/book?problem=Headache%2C%20Migraine%20%26%20Nerves' },
        suggestions: replyTa
          ? ['நரம்பியல் டோக்கன்', 'BP பரிசோதனை', 'கண் பரிசோதனை']
          : ['Neurology Token', 'BP Checkup', 'Eye Examination']
      };
    }

    // 9. Stomach Pain, Gastritis, Acidity, Vomiting & Diarrhea
    if (
      hasAny([
        'வயிறு வலி', 'வயிற்று வலி', 'அஜீரணம்', 'வாந்தி', 'பேதி', 'வயிற்றுப்போக்கு', 
        'வாயு', 'அசிடிட்டி', 'குமட்டல்', 'செரிமானம்', 'vayiru vali', 'vanthi', 'acidity', 
        'gas problem', 'stomach pain', 'diarrhea', 'vomiting', 'indigestion', 'loose motion'
      ])
    ) {
      return {
        text: replyTa
          ? '🥣 வயிறு வலி & செரிமானக் கோளாறு ஆலோசனை:\nவயிற்று வலி, அசிடிட்டி அல்லது வாந்தி, வயிற்றுப்போக்கு இருந்தால் காரமான, எண்ணெய் பலகாரங்களை தவிர்க்கவும். ORS கரைசல் மற்றும் இளநீர் குடித்து நீரிழப்பைத் தடுக்கவும்.\n\nபரிந்துரைக்கப்படும் துறை: "இரைப்பை & குடல் மருத்துவம்" (Gastroenterology).'
          : '🥣 Gastroenterology & Stomach Pain Advice:\nAbdominal cramps, acidity, or nausea require gentle hydration with ORS and avoiding spicy foods.\n\nRecommended Department: Gastroenterology / General Medicine.',
        action: { label: replyTa ? 'இரைப்பை மருத்துவம் முன்பதிவு' : 'Book Gastroenterology Slot', link: '/book?problem=Digestive%20%26%20Stomach%20Pain' },
        suggestions: replyTa
          ? ['வயிறு வலி டாக்டர்', 'டிவிஎம்சி ஓபிடி', 'மருந்தகம் காண்க']
          : ['Stomach Specialist', 'TVMCH Free OPD', 'Pharmacy Info']
      };
    }

    // 10. Bone, Joints, Knee, Back Pain & Orthopedics
    if (
      hasAny([
        'எலும்பு', 'மூட்டு வலி', 'முழங்கால்', 'முதுகு வலி', 'இடுப்பு வலி', 'சுளுக்கு', 
        'முறிவு', 'கை கால் வலி', 'elumbu', 'mootu vali', 'mudhugu vali', 'iduppu vali', 
        'bone', 'ortho', 'joint pain', 'knee pain', 'fracture', 'back pain', 'sprain', 'arthritis'
      ])
    ) {
      return {
        text: replyTa
          ? '🦴 எலும்பு & மூட்டு நலம் ஆலோசனை:\nமூட்டு வலி, இடுப்பு/முதுகு வலி அல்லது அடிபட்டு எலும்பு முறிவு ஏற்பட்டிருந்தால் எக்ஸ்-ரே (X-Ray) பரிசோதனை தேவைப்படலாம்.\n\nபரிந்துரைக்கப்படும் துறை: "எலும்பியல் துறை" (Orthopedics). TVMCH, Galaxy மற்றும் ஷிஃபா மருத்துவமனைகளில் சிறப்பு எலும்பு அறுவை சிகிச்சை நிபுணர்கள் உள்ளனர்.'
          : '🦴 Orthopedic & Joint Care Guidance:\nJoint swelling, acute knee pain, back sprain, or suspected fracture require orthopedic evaluation and digital X-ray.\n\nRecommended Department: Orthopedics at TVMCH, Galaxy, or Shifa Hospital.',
        action: { label: replyTa ? 'எலும்பியல் துறை முன்பதிவு' : 'Book Orthopedics Token', link: '/book?problem=Bone%20Fracture%20%26%20Joint%20Pain' },
        suggestions: replyTa
          ? ['எலும்பியல் டோக்கன்', 'எக்ஸ்-ரே வசதி', 'மருத்துவமனை வரைபடம்']
          : ['Ortho Token', 'X-Ray Facilities', 'Hospital Map']
      };
    }

    // 11. Eye Care & Vision (Aravind / Agarwal)
    if (
      hasAny([
        'கண்', 'கண்பார்வை', 'கண்புரை', 'கண் வலி', 'கண் எரிச்சல்', 'அரவிந்த்', 'அகர்வால்', 
        'பார்வை மங்கல்', 'kan', 'kan vali', 'eye', 'vision', 'cataract', 'aravind', 'agarwal', 'ophthalmology'
      ])
    ) {
      return {
        text: replyTa
          ? '👁️ கண் சிகிச்சை வழிகாட்டி:\nகண் பார்வை மங்கல், கண்புரை, கண் வலி அல்லது சிவந்து போதலுக்கு திருநெல்வேலி வண்ணார்பேட்டையில் உள்ள உலகப் புகழ்பெற்ற "அரவிந்த் கண் மருத்துவமனை" (Aravind Eye Hospital - ₹200 கட்டணம்) மற்றும் ஹை கிரவுண்ட்ஸ் டாக்டர் அகர்வால்ஸ் கண் மருத்துவமனை மிகச் சிறந்தவை.'
          : '👁️ Ophthalmology & Eye Care:\nFor refractive vision errors, cataract screening, or eye strain, Aravind Eye Hospital (Vannarpettai) and Dr. Agarwal\'s Eye Hospital (High Grounds) provide top ophthalmic care.',
        action: { label: replyTa ? 'அரவிந்த் கண் மருத்துவமனை விவரம்' : 'View Aravind Eye Hospital', link: '/hospital/h3' },
        suggestions: replyTa
          ? ['கண் மருத்துவமனை டோக்கன்', 'அரவிந்த் கண் ஆஸ்பத்திரி', 'டாக்டர் நேரம்']
          : ['Eye Care Token', 'Aravind Eye Details', 'OPD Timings']
      };
    }

    // 12. Ear, Nose, Throat (ENT)
    if (
      hasAny([
        'காது', 'காது வலி', 'மூக்கு', 'தொண்டை அடைப்பு', 'சீழ்', 'சைனஸ்', 'கேட்கவில்லை', 
        'டான்சில்', 'kaadhu', 'kaadhu vali', 'sinus', 'ear pain', 'hearing', 'ent', 'tonsil'
      ])
    ) {
      return {
        text: replyTa
          ? '👂 காது, மூக்கு & தொண்டை (ENT) வழிகாட்டி:\nகாது வலி, சீழ் வடிதல், சைனஸ் தலைபாரம், டான்சில் அல்லது தொண்டை கரகரப்பு பிரச்சனைக்கு "ENT சிறப்பு மருத்துவரை" அணுக வேண்டும். டிவிஎம்சி மற்றும் ஷிஃபா மருத்துவமனைகளில் உடனடி டோக்கன் வசதி உள்ளது.'
          : '👂 ENT Consultation Directory:\nFor earache, discharge, sinus pressure, or acute throat congestion, schedule an appointment with an ENT specialist at TVMCH or Shifa.',
        action: { label: replyTa ? 'ENT துறை டோக்கன் பெறுக' : 'Book ENT Token', link: '/book?problem=Ear%2C%20Nose%20%26%20Throat%20(ENT)' },
        suggestions: replyTa
          ? ['ENT மருத்துவர் டோக்கன்', 'டிவிஎம்சி ஓபிடி', 'மருத்துவமனை நேரம்']
          : ['ENT Token', 'TVMCH OPD', 'OPD Hours']
      };
    }

    // 13. Skin, Allergy & Itching
    if (
      hasAny([
        'தோல்', 'அரிப்பு', 'தடிப்பு', 'பரு', 'படை', 'அலர்ஜி', 'சொறி', 
        'thol', 'arippu', 'thadippu', 'skin', 'rash', 'allergy', 'itching', 'dermatology', 'acne', 'eczema'
      ])
    ) {
      return {
        text: replyTa
          ? '🧴 தோல் & ஒவ்வாமை மருத்துவ ஆலோசனை:\nதோல் தடிப்பு, தொடர் அரிப்பு, படை அல்லது ஒவ்வாமைக்கு சுய மருந்துகளைத் தவிர்த்து தோல் மருத்துவரை (Dermatologist) அணுகவும்.\n\nபரிந்துரைக்கப்படும் துறை: "தோல் நோய் பிரிவு" (Dermatology).'
          : '🧴 Dermatology & Skin Allergy Care:\nFor itchy rashes, eczema, fungal infections, or allergic flare-ups, consult a registered dermatologist.\n\nRecommended Department: Dermatology.',
        action: { label: replyTa ? 'தோல் மருத்துவம் டோக்கன்' : 'Book Dermatology Pass', link: '/book?problem=Skin%20Rash%2C%20Allergy%20%26%20Acne' },
        suggestions: replyTa
          ? ['தோல் மருத்துவர் டோக்கன்', 'டிவிஎம்சி இலவச ஓபிடி']
          : ['Dermatology Token', 'Free Govt OPD']
      };
    }

    // 14. Pregnancy, Maternity & Women's Health
    if (
      hasAny([
        'கர்ப்பம்', 'பிரசவம்', 'மாதவிடாய்', 'மகப்பேறு', 'பெண்கள் நல', 'லேடி டாக்டர்', 
        'குழந்தை பிறப்பு', 'கருவுற்ற', 'தாய்சேய்', 'karppam', 'prasavam', 'pregnancy', 
        'maternity', 'gynecology', 'periods', 'lady doctor', 'antenatal'
      ])
    ) {
      return {
        text: replyTa
          ? '🤰 மகப்பேறு & பெண்கள் நலம் வழிகாட்டி:\nகர்ப்ப கால தாய்-சேய் பரிசோதனைகள், அல்ட்ராசவுண்ட் ஸ்கேன் மற்றும் மகளிர் நலம் சார்ந்த ஆலோசனைகளுக்கு TVMCH தாய் சேய் நலம் வார்டு (OPD-204) மற்றும் ஷிஃபா மகளிர் நலப் பிரிவு சிறந்தவை.'
          : '🤰 Maternity & Obstetrics Care:\nFor prenatal checkups, sonography scans, and gynecological consultations, TVMCH Maternity Chamber (OPD-204) and Shifa Hospital offer dedicated women\'s care.',
        action: { label: replyTa ? 'மகப்பேறு மருத்துவம் முன்பதிவு' : 'Book Maternity OPD Pass', link: '/book?problem=Women%27s%20Health%20%26%20Pregnancy' },
        suggestions: replyTa
          ? ['மகப்பேறு வார்டு டோக்கன்', 'ஸ்கேன் மற்றும் பரிசோதனை']
          : ['Maternity Token', 'Ultrasound Scan']
      };
    }

    // 15. Pediatrics & Child Care
    if (
      hasAny([
        'குழந்தை', 'குழந்தைகள்', 'தடுப்பூசி', 'பால் குடிக்கவில்லை', 'குழந்தை நல', 
        'குழந்தைக்கு', 'சின்ன குழந்தை', 'kuzhandhai', 'baby', 'child', 'pediatric', 'vaccine', 'infant'
      ])
    ) {
      return {
        text: replyTa
          ? '👶 குழந்தைகள் நலம் & தடுப்பூசி வழிகாட்டி:\nகுழந்தைகளுக்கு தீவிர காய்ச்சல், சளி, வாந்தி அல்லது தடுப்பூசி அட்டவணைக்கு குழந்தைகள் நல மருத்துவரை (Pediatrician) உடனடியாக அணுகவும். டிவிஎம்சி குழந்தைகள் வார்டில் அரசு இலவச தடுப்பூசிகளும் வழங்கப்படுகின்றன.'
          : '👶 Pediatrics & Child Health:\nFor pediatric fever, infant feeding issues, and scheduled vaccinations, reserve an appointment with our specialist pediatricians.',
        action: { label: replyTa ? 'குழந்தைகள் நல டோக்கன்' : 'Book Pediatrics OPD Token', link: '/book?problem=Child%20%26%20Infant%20Health' },
        suggestions: replyTa
          ? ['குழந்தைகள் மருத்துவர் டோக்கன்', 'தடுப்பூசி அட்டவணை']
          : ['Pediatrician Token', 'Vaccination Schedule']
      };
    }

    // 16. Diabetes & Blood Pressure (Sugar & BP)
    if (
      hasAny([
        'சர்க்கரை', 'நீரிழிவு', 'சுகர்', 'பிரஷர்', 'பிபி', 'இரத்த அழுத்தம்', 
        'sugar', 'diabetes', 'bp', 'blood pressure', 'hypertension', 'sugar test'
      ])
    ) {
      return {
        text: replyTa
          ? '🩺 சர்க்கரை நோய் (Sugar) & இரத்த அழுத்தம் (BP) ஆலோசனை:\nமாதந்தோறும் சர்க்கரை அளவு (Fasting/PP) மற்றும் இரத்த அழுத்தத்தை பரிசோதிப்பது பக்கவாதம் மற்றும் இதய நோய் அபாயத்தைத் தடுக்கும்.\n\nபரிந்துரைக்கப்படும் துறை: "பொது மருத்துவம் & டயாபடிக் பிரிவு".'
          : '🩺 Diabetes & Hypertension Care:\nRegular monitoring of blood glucose and blood pressure helps avoid cardiovascular complications.\n\nRecommended Department: General Medicine & Diabetology.',
        action: { label: replyTa ? 'பொது மருத்துவம் & BP செக்கப்' : 'Book BP & Sugar Checkup', link: '/book?problem=Diabetes%20%26%20Blood%20Sugar' },
        suggestions: replyTa
          ? ['டயாபடிக் டோக்கன்', 'மருத்துவமனை நேரம்']
          : ['Diabetic Token', 'OPD Timings']
      };
    }

    // 17. Dental & Toothache
    if (
      hasAny([
        'பல் வலி', 'பல் சொத்தை', 'ஈறு', 'பல்லு', 'பல் டாக்டர்', 
        'pal vali', 'pal sothai', 'teeth', 'toothache', 'dental', 'dentist'
      ])
    ) {
      return {
        text: replyTa
          ? '🦷 பல் நலம் ஆலோசனை:\nபல் சொத்தை, ஈறு வலி அல்லது பல் கூச்சத்திற்கு பல் மருத்துவரை (Dentist) அணுகவும். டிவிஎம்சி பல் மருத்துவப் பிரிவு மற்றும் ரோஸ் மேரி டென்டல் பிரிவில் சிகிச்சை பெறலாம்.'
          : '🦷 Dental Care Consultation:\nFor toothache, cavities, root canal evaluation, or bleeding gums, schedule a session with dental specialists.',
        action: { label: replyTa ? 'பல் மருத்துவர் டோக்கன்' : 'Book Dental Appointment', link: '/book' },
        suggestions: replyTa
          ? ['பல் டாக்டர் டோக்கன்', 'டிவிஎம்சி ஓபிடி']
          : ['Dentist Token', 'TVMCH Dental Wing']
      };
    }

    // 18. Kidney Stones & Urinary Issues
    if (
      hasAny([
        'சிறுநீரகம்', 'சிறுநீரக கல்', 'சிறுநீர்', 'எரிச்சல்', 'கிட்னி', 
        'siruneer', 'kidney', 'stone', 'urology', 'flank pain'
      ])
    ) {
      return {
        text: replyTa
          ? '💧 சிறுநீரக நலம் & கல் பிரச்சனை:\nஅடிவயிறு அல்லது விலா பகுதியில் கடுமையான வலி, சிறுநீரில் எரிச்சல் இருந்தால் சிறுநீரக கல் (Kidney Stone) பரிசோதனை அவசியமாகும். போதுமான அளவு தண்ணீர் குடிக்கவும்.\n\nபரிந்துரைக்கப்படும் துறை: "சிறுநீரகவியல்" (Urology).'
          : '💧 Kidney & Urology Evaluation:\nSharp flank pain, burning urination, or kidney stones require urological consultation and ultrasound imaging.\n\nRecommended Department: Urology.',
        action: { label: replyTa ? 'சிறுநீரகவியல் டோக்கன் பெறுக' : 'Book Urology Consultation', link: '/book?problem=Kidney%20Stones%20%26%20Urinary%20Issues' },
        suggestions: replyTa
          ? ['சிறுநீரக பிரிவு டோக்கன்', 'அல்ட்ராசவுண்ட் ஸ்கேன்']
          : ['Urology Token', 'Ultrasound Scan']
      };
    }

    // 19. Hospital Timings & Doctor Schedule
    if (
      hasAny([
        'நேரம்', 'எப்போ திறக்கும்', 'எத்தனை மணிக்கு', 'டாக்டர் நேரம்', 'ஓபிடி நேரம்', 
        'நேரம் என்ன', 'timing', 'time', 'open', 'doctor available', 'opd time', 'working hours', 'schedule'
      ])
    ) {
      return {
        text: replyTa
          ? '⏰ திருநெல்வேலி மருத்துவமனை நேர விவரங்கள்:\n• TVMCH அரசு மருத்துவக் கல்லூரி: புறநோயாளி பிரிவு (OPD) காலை 8:00 மணி முதல் மதியம் 1:00 மணி வரை. அவசர சிகிச்சை (Casualty 24x7) எப்போதும் செயல்படும்.\n• ஷிஃபா, கேலக்ஸி, அரவிந்த்: காலை 9:00 மணி முதல் இரவு 9:00 மணி வரை ஆலோசனை வழங்குகின்றன.'
          : '⏰ Tirunelveli Hospital OPD Timings:\n• TVMCH Govt Hospital: General OPD 8:00 AM to 1:00 PM; Emergency & Trauma 24/7.\n• Shifa & Galaxy Hospitals: Morning & Evening OPD 9:00 AM to 9:00 PM.\n• Aravind Eye Hospital: 8:30 AM to 5:30 PM.',
        action: { label: replyTa ? 'அனைத்து மருத்துவமனைகள் காண்க' : 'Explore Hospitals & Timings', link: '/hospitals' },
        suggestions: replyTa
          ? ['TVMCH டோக்கன்', 'இன்றைய டோக்கன் வரிசை']
          : ['TVMCH Token', 'Live Queue Status']
      };
    }

    // 20. Fees, Costs & Free Govt / CMCHIS Treatment
    if (
      hasAny([
        'கட்டணம்', 'எவ்வளவு ஆகும்', 'ரூபாய்', 'இலவசம்', 'காப்பீடு', 'முதலமைச்சர் காப்பீடு', 
        'fees', 'cost', 'charges', 'free', 'cmchis', 'insurance', 'kattanam', 'ayushman'
      ])
    ) {
      return {
        text: replyTa
          ? '💳 மருத்துவ கட்டணம் & இலவச சிகிச்சை விவரம்:\n• TVMCH அரசு மருத்துவக் கல்லூரி மருத்துவமனை: 100% இலவச ஆலோசனை (₹0 Fee) மற்றும் இலவச மருந்து மாத்திரைகள்.\n• முதலமைச்சர் காப்பீட்டுத் திட்டம் (CMCHIS): ஷிஃபா, கேலக்ஸி போன்ற தனியார் மருத்துவமனைகளிலும் தகுதியான சிகிச்சைகள் காப்பீடு அட்டை மூலம் முற்றிலும் இலவசம்.\n• தனியார் OPD ஆலோசனை கட்டணம்: ₹150 முதல் ₹300 வரை.'
          : '💳 Consultation Fees & Government Schemes:\n• TVMCH Govt Medical College: 100% Free Consultation (₹0 Fee) and free medications.\n• CMCHIS & Ayushman Bharat: Empaneled at Shifa & Galaxy for cashless surgical treatments.\n• Private OPD Fees range from ₹150 to ₹300.',
        action: { label: replyTa ? 'TVMCH இலவச டோக்கன் பெறுக' : 'Book Free TVMCH OPD Pass', link: '/book?hospitalId=h1' },
        suggestions: replyTa
          ? ['இலவச TVMCH டோக்கன்', 'காப்பீட்டு மருத்துவமனைகள்']
          : ['Book Free TVMCH Pass', 'Empaneled Hospitals']
      };
    }

    // 21. Best Hospitals in Tirunelveli
    if (
      hasAny([
        'சிறந்த மருத்துவமனை', 'மருத்துவமனை பட்டியல்', 'எந்த ஆஸ்பத்திரி', 'திருநெல்வேலி மருத்துவமனை', 
        'ஆஸ்பத்திரி', 'best hospital', 'hospital enga', 'hospitals list', 'top hospitals'
      ])
    ) {
      return {
        text: replyTa
          ? '🏥 திருநெல்வேலியின் முன்னணி மருத்துவமனைகள்:\n1. TVMCH அரசு மருத்துவக் கல்லூரி (High Grounds) - அனைத்து சிறப்பு துறைகள், அதிநவீன அவசர சிகிச்சை, 100% இலவசம்.\n2. அரவிந்த் கண் மருத்துவமனை (Vannarpettai) - சர்வதேச தரத்தில் கண் சிகிச்சை.\n3. ஷிஃபா மருத்துவமனை (Vannarpettai) - பல்நோக்கு தனியார் சிறப்பு மையம் & இதய சிகிச்சை.\n4. கேலக்ஸி மருத்துவமனை (Palayamkottai) - அவசர விபத்து & அறுவை சிகிச்சைகள்.'
          : '🏥 Top Hospitals in Tirunelveli:\n1. TVMCH (High Grounds) - Premier Govt Multispecialty & 24/7 Trauma Care.\n2. Aravind Eye Hospital (Vannarpettai) - World-renowned ophthalmic center.\n3. Shifa Hospital (Vannarpettai) - Tertiary care & interventional cardiology.\n4. Galaxy Hospital (Palayamkottai) - Emergency surgery & intensive care.',
        action: { label: replyTa ? 'மருத்துவமனைகள் பட்டியலை காண்க' : 'View All Hospitals', link: '/hospitals' },
        suggestions: replyTa
          ? ['மருத்துவமனைகளை ஒப்பிடுக', 'உள்ளரங்கு வரைபடம்']
          : ['Compare Hospitals', 'Indoor Map']
      };
    }

    // 22. Hospital Indoor Map & Directions
    if (
      hasAny([
        'வரைபடம்', 'ரூட்', 'எங்கே உள்ளது', 'வழி', 'அறை எண்', 'தரைத்தளம்', 
        'map', 'direction', 'route', 'indoor', 'chamber', 'room', 'floor', 'wayfinder'
      ])
    ) {
      return {
        text: replyTa
          ? '🗺️ மருத்துவமனை உள்ளரங்கு வழிசெலுத்தல்:\nTVMCH (ஹை கிரவுண்ட்ஸ்) மற்றும் ஷிஃபா மருத்துவமனைகளில் தரைத்தள பதிவு கவுண்டர், OPD அறைகள், மருந்தகம், ஆய்வகம் மற்றும் அவசர சிகிச்சை பிரிவுக்கான நேரலை வழிகாட்டுதல் வரைபடத்தைக் காணலாம்.'
          : '🗺️ Hospital Indoor Wayfinder:\nInteractive floor maps for TVMCH & Shifa Hospital showing OPD Chambers, Pharmacy, Pathology Lab, and Trauma Bay with turn-by-turn routes.',
        action: { label: replyTa ? 'TVMCH வரைபடம் திறக்குக' : 'Open TVMCH Indoor Map', link: '/hospital/h1/map' },
        suggestions: replyTa
          ? ['TVMCH வரைபடம்', 'ஷிஃபா வரைபடம்']
          : ['TVMCH Floor Map', 'Shifa Hospital Map']
      };
    }

    // 23. Medicines & Pharmacy
    if (
      hasAny([
        'மருந்து', 'மருந்தகம்', 'மெடிக்கல் ஸ்டோர்', 'ஜன ஔஷதி', 'மருந்து சீட்டு', 
        'marunthu', 'pharmacy', 'medical shop', 'jan aushadhi', 'medicine'
      ])
    ) {
      return {
        text: replyTa
          ? '💊 மருந்தகம் & மக்கள் மருந்தகம் (Jan Aushadhi):\n• TVMCH மற்றும் தனியார் மருத்துவமனைகளில் 24x7 உள் மருந்தகங்கள் செயல்படுகின்றன.\n• மலிவு விலையில் தரமான ஜெனரிக் மருந்துகள் பெற பாளையங்கோட்டை, நெல்லை ஜங்ஷன் மற்றும் டவுனில் உள்ள "பிரதான் மந்திரி ஜன ஔஷதி கேந்திரா" கடைகளைப் பயன்படுத்தலாம்.'
          : '💊 Pharmacy & Generic Medicine Stores:\n• 24/7 pharmacies operate inside TVMCH and Shifa Hospital.\n• For affordable generic medicines (up to 80% discount), visit Pradhan Mantri Jan Aushadhi Kendras in Palayamkottai, Town, or Junction.',
        action: { label: replyTa ? 'மருத்துவமனைகள் காண்க' : 'Find Nearby Hospital Pharmacies', link: '/hospitals' },
        suggestions: replyTa
          ? ['TVMCH டோக்கன்', 'பொது மருத்துவர்']
          : ['TVMCH Token', 'General Medicine']
      };
    }

    // 24. Symptom Matching Engine (with Tokenized Natural Language Matching)
    const matchedProblems = searchProblems(q);
    if (matchedProblems && matchedProblems.length > 0) {
      const topMatch = matchedProblems[0];
      return {
        text: replyTa
          ? `🩺 அறிகுறிகள் பகுப்பாய்வு முடிவு:\nஉங்கள் உடல் உபாதைக்கு (${topMatch.name} - ${topMatch.tamil}) பரிந்துரைக்கப்படும் மருத்துவத் துறை: "${topMatch.specialty}".\n\nதிருநெல்வேலி மருத்துவமனைகளில் இந்த துறைக்கான நேரலை OPD டோக்கனை உடனடியாக பதிவு செய்யலாம்.`
          : `🩺 Triage Recommendation:\nFor symptoms matching "${topMatch.name}", the recommended specialist department is "${topMatch.specialty}". You can reserve an OPD slot right away.`,
        action: { 
          label: replyTa ? `${topMatch.specialty} முன்பதிவு செய்க` : `Book for ${topMatch.specialty}`, 
          link: `/book?problem=${encodeURIComponent(topMatch.name)}` 
        },
        suggestions: replyTa
          ? [`${topMatch.specialty} டோக்கன்`, 'மருத்துவமனை நேரம்', 'இலவச TVMCH டோக்கன்']
          : [`Book ${topMatch.specialty}`, 'OPD Hours', 'TVMCH Free Token']
      };
    }

    // Default Fallback
    return {
      text: replyTa
        ? 'நான் உங்களுக்கு திருநெல்வேலி மருத்துவமனைகளின் நேரலை டோக்கன், மருத்துவர் ஆலோசனை, இரத்த வங்கி இருப்பு, மருத்துவமனை வரைபடம் மற்றும் அறிகுறிகள் சார்ந்த வழிகாட்டுதலை வழங்க முடியும். எதை அறிய விரும்புகிறீர்கள்?'
        : 'I can assist you with symptom triage, live hospital wait times, emergency blood bank stock, indoor hospital floor maps, or booking OPD token passes across Tirunelveli. What would you like to explore?',
      suggestions: replyTa
        ? ['காய்ச்சல் & சளி ஆலோசனை', 'டாக்டர் நேரம் என்ன?', 'அனைத்து மருத்துவமனைகள்', 'அவசர இரத்த வங்கி']
        : ['Fever & Cold doctor', 'Doctor OPD Timings', 'All Tirunelveli Hospitals', 'Blood Bank Directory']
    };
  };

  const handleSend = (textToSend = null) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    // Auto-detect Tamil script in user message and switch language mode seamlessly
    const containsTamil = /[\u0B80-\u0BFF]/.test(query);
    if (containsTamil && chatLang !== 'ta') {
      setChatLang('ta');
    }

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const botReply = generateBotResponse(query);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botReply.text,
        action: botReply.action,
        suggestions: botReply.suggestions,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 400);
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      const hasTamil = /[\u0B80-\u0BFF]/.test(text);
      utterance.lang = hasTamil || isTa ? 'ta-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Floating Chat Launcher Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-5 z-40 bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-700 hover:to-teal-600 text-white p-3.5 sm:px-4 sm:py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 hover:scale-105 transition-all border border-white/20 cursor-pointer"
        title="Open AI HealthBot"
      >
        <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center font-bold">
          <FaRobot size={15} />
        </div>
        <span className="hidden sm:inline font-black text-xs tracking-wide">
          {isTa ? 'AI மருத்துவ உதவி' : 'TVL HealthBot AI'}
        </span>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
      </button>

      {/* Interactive Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-full max-w-[380px] sm:max-w-[420px] h-[540px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-slate-900 via-sky-900 to-teal-900 text-white p-3.5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 to-teal-300 text-slate-950 flex items-center justify-center font-black shadow-sm">
                <FaRobot size={18} />
              </div>
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm flex items-center gap-1.5 leading-tight">
                  <span>TVL HealthBot AI</span>
                  <span className="badge bg-emerald-400 text-slate-950 text-[8px] font-black">
                    ONLINE
                  </span>
                </h3>
                <p className="text-[10px] text-sky-200 mt-0.5">
                  {isTa ? 'தமிழ் & ஆங்கில மருத்துவ உதவியாளர்' : 'Tirunelveli OPD & Triage Assistant'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Switcher Pill Button (Tamil / English) */}
              <div className="flex items-center bg-white/15 rounded-lg p-0.5 text-[10px] font-bold border border-white/10">
                <button
                  type="button"
                  onClick={() => setChatLang('ta')}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                    chatLang === 'ta'
                      ? 'bg-white text-slate-900 shadow-xs font-black'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="Switch to Tamil"
                >
                  தமிழ்
                </button>
                <button
                  type="button"
                  onClick={() => setChatLang('en')}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                    chatLang === 'en'
                      ? 'bg-white text-slate-900 shadow-xs font-black'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="Switch to English"
                >
                  EN
                </button>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <FaTimes size={15} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto bg-slate-50 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-sky-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Interactive Action Button in Chat */}
                  {m.action && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate(m.action.link);
                      }}
                      className="mt-2.5 w-full py-1.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 font-extrabold text-[11px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <FaHeartbeat />
                      <span>{m.action.label} →</span>
                    </button>
                  )}

                  {/* Text-to-speech audio trigger */}
                  {m.sender === 'bot' && (
                    <div className="flex justify-end mt-1.5">
                      <button
                        onClick={() => handleSpeak(m.text)}
                        className="text-slate-400 hover:text-sky-600 text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                        title={isTa ? 'குரல் வழியே கேட்க' : 'Listen via audio'}
                      >
                        <FaVolumeUp size={11} /> <span>{isTa ? 'ஒலி' : 'Audio'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Suggestions Pills */}
                {m.suggestions && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {m.suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(s)}
                        className="text-[10px] font-bold bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[9px] text-slate-400 mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-white p-2.5 rounded-2xl w-24 border border-slate-200 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-600 border-slate-200'
              }`}
              title={isTa ? 'குரல் மூலம் பேசு' : 'Speak to chatbot'}
            >
              <FaMicrophone size={12} />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isTa ? 'கேள்விகளை இங்கே தட்டச்சு செய்க...' : 'Type symptoms or ask questions...'}
              className="flex-1 py-2 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500 bg-slate-50"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white font-bold transition-colors cursor-pointer"
            >
              <FaPaperPlane size={12} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default HealthChatbot;
