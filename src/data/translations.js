/**
 * Comprehensive Multi-Lingual Translation Dictionary
 * Languages: English (en), தமிழ் (ta - Tamil), हिन्दी (hi - Hindi), മലയാളം (ml - Malayalam), తెలుగు (te - Telugu)
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', label: 'English (EN)' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', label: 'தமிழ் (TA)' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', label: 'हिन्दी (HI)' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', label: 'മലയാളം (ML)' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', label: 'తెలుగు (TE)' }
];

export const translations = {
  en: {
    // Header & Navigation
    app_title: 'TVL SmartCare',
    app_subtitle: 'Tirunelveli Hospital Token System',
    nav_dashboard: 'Dashboard',
    nav_find_care: 'Find Care',
    nav_hospitals: 'Hospitals',
    nav_compare: 'Compare',
    nav_my_tokens: 'My Tokens',
    nav_api: 'API Hub',
    emergency_108: 'EMERGENCY 108',
    sign_in: 'Sign In',
    admin_login: 'Admin / Staff',
    sign_out: 'Sign Out',
    my_profile: 'My Profile',
    live_alerts: 'Live Alerts',
    language_select: 'Select Language',
    
    // Landing Page
    landing_pill: 'Tirunelveli District Public Health Digital Network',
    landing_headline_1: 'Skip The OPD Waiting Room.',
    landing_headline_2: 'Book Your Digital Token Pass',
    landing_desc: 'Discover real-time hospital queues across TVMCH High Grounds, Shifa, Aravind Eye, Kauvery, and get instant verified OPD appointments with live queue tracking.',
    btn_get_started: 'Get Started Now',
    btn_emergency: 'Emergency 108 Casualty',
    stat_hospitals: '10 Hospitals',
    stat_hospitals_sub: 'Govt & Private TVL',
    stat_tokens: '520+ Tokens',
    stat_tokens_sub: 'Issued Today',
    stat_wait: '~12 Mins',
    stat_wait_sub: 'Avg Queue Wait',
    stat_free: '100% Free',
    stat_free_sub: 'TVMCH Govt OPD',
    
    // Process Steps
    how_it_works: 'How TVL SmartCare Works',
    how_it_works_sub: 'Get diagnosed, pick your doctor counter, and arrive just in time.',
    step_1_title: 'Pick Health Concern',
    step_1_desc: 'Search or speak your symptom in your preferred language to auto-match the right department.',
    step_2_title: 'Compare Live Queues',
    step_2_desc: 'View live token availability, waiting times, and doctor schedules across 10 hospitals.',
    step_3_title: 'Instant QR Pass',
    step_3_desc: 'Get an instant confirmed digital token pass with scannable QR code on your mobile.',
    step_4_title: 'Track & Consult',
    step_4_desc: 'Track live serving numbers on your phone and enter the doctor chamber when called.',
    
    // Dashboard
    vanakkam: 'Vanakkam',
    live_opd_badge: 'Tirunelveli District Live OPD Network',
    active_token: 'ACTIVE TOKEN PASS',
    now_serving: 'Now Serving',
    estimated_wait: 'Estimated Wait',
    track_live: 'Track Live',
    select_health_concern: 'Select Health Concern',
    fast_routing: 'Fast Routing',
    view_all_problems: 'View All Concerns',
    featured_hospitals: 'Featured Hospitals & Live Capacity',
    explore_all: 'Explore All 10 Hospitals',
    
    // Booking
    step_problem: 'Symptom',
    step_date: 'Date',
    step_hospital: 'Hospital',
    step_doctor: 'Doctor',
    step_slot: 'Time & Token',
    btn_proceed: 'Proceed to Next Step',
    btn_back: 'Previous Step',
    btn_confirm_token: 'Confirm OPD Token Pass',
    
    // Auth & JWT
    patient_sign_in: 'Patient Sign In',
    admin_sign_in: 'Hospital Admin & Staff Console',
    email_label: 'Email Address',
    password_label: 'Password',
    mobile_label: 'Mobile Number',
    quick_test_accounts: 'Quick Demo Accounts (Click to autofill)',
    jwt_claims: 'JWT Cryptographic Token Claims',
    oauth_google: 'Sign In with Google OAuth 2.0',
    oauth_github: 'Sign In with GitHub OAuth',
    oauth_tn_health: 'Tamil Nadu Digital Health ID (ABHA) OAuth',
    
    // Chatbot
    chat_header: 'TVL SmartCare AI Assistant',
    chat_sub: 'Triage, Department Advice & Live Token Info',
    chat_placeholder: 'Ask about symptoms, hospital queues, or token tracking...',
    chat_suggest_1: 'I have acute fever and throat pain',
    chat_suggest_2: 'Which hospital is best for ophthalmology?',
    chat_suggest_3: 'What is current queue status at TVMCH?',
    
    // Recently Visited
    recently_visited: 'Recently Accessed',
    clear_history: 'Clear'
  },

  ta: {
    // Header & Navigation
    app_title: 'டிவிஎல் ஸ்மார்ட்கேர்',
    app_subtitle: 'திருநெல்வேலி மருத்துவமனை டோக்கன் முன்பதிவு முறைமை',
    nav_dashboard: 'முகப்பு பலகை',
    nav_find_care: 'சிகிச்சை தேடல்',
    nav_hospitals: 'மருத்துவமனைகள்',
    nav_compare: 'ஒப்பீடு செய்க',
    nav_my_tokens: 'என் டோக்கன்கள்',
    nav_api: 'டெவலப்பர் API',
    emergency_108: 'அவசரம் 108',
    sign_in: 'உள்நுழைக',
    admin_login: 'நிர்வாகம் / ஊழியர்',
    sign_out: 'வெளியேறு',
    my_profile: 'என் சுயவிவரம்',
    live_alerts: 'நேரலை அறிவிப்புகள்',
    language_select: 'மொழி தேர்வு',
    
    // Landing Page
    landing_pill: 'திருநெல்வேலி மாவட்ட பொது சுகாதார எண்ம கட்டமைப்பு',
    landing_headline_1: 'மருத்துவமனை காத்திருப்பு அறையை தவிருங்கள்.',
    landing_headline_2: 'டிஜிட்டல் OPD டோக்கன் முன்பதிவு செய்க',
    landing_desc: 'திருநெல்வேலி அரசு மருத்துவக் கல்லூரி மருத்துவமனை (TVMCH), ஷிஃபா, அரவிந்த் கண் மருத்துவமனை, காவேரி மருத்துவமனைகளின் நேரலை வரிசை நிலையை அறிந்து உடனடியாக டிஜிட்டல் டோக்கன் பெறுங்கள்.',
    btn_get_started: 'இப்போதே தொடங்குக',
    btn_emergency: '108 அவசர சிகிச்சை',
    stat_hospitals: '10 மருத்துவமனைகள்',
    stat_hospitals_sub: 'அரசு & தனியார் நெல்லை',
    stat_tokens: '520+ டோக்கன்கள்',
    stat_tokens_sub: 'இன்று வழங்கப்பட்டது',
    stat_wait: '~12 நிமிடங்கள்',
    stat_wait_sub: 'சராசரி வரிசை நேரம்',
    stat_free: '100% இலவசம்',
    stat_free_sub: 'TVMCH அரசு புறநோயாளி',
    
    // Process Steps
    how_it_works: 'ஸ்மார்ட்கேர் எவ்வாறு இயங்குகிறது?',
    how_it_works_sub: 'நோய் அறிகுறியை தேர்வு செய்து, நேரத்தை கணித்து, சரியான நேரத்தில் செல்லுங்கள்.',
    step_1_title: '1. உடல் நலக்குறைவு தேர்வு',
    step_1_desc: 'உங்கள் உடல் உபாதையை தமிழிலோ பிற மொழியிலோ தேர்வு செய்யுங்கள் அல்லது குரல் மூலம் கூறுங்கள்.',
    step_2_title: '2. நேரலை வரிசை ஒப்பீடு',
    step_2_desc: '10 மருத்துவமனைகளின் தற்போதைய வரிசை நிலவரம் மற்றும் மருத்துவர் நேரத்தை ஒப்பிடுங்கள்.',
    step_3_title: '3. உடனடி QR டோக்கன்',
    step_3_desc: 'உங்கள் செல்போனில் உடனடியாக QR குறியீடுடன் கூடிய டிஜிட்டல் டோக்கன் சீட்டைப் பெறுங்கள்.',
    step_4_title: '4. சரியான நேரத்தில் சிகிச்சை',
    step_4_desc: 'உங்கள் டோக்கன் எண் வரும் வரை வீட்டிலிருந்தே நேரலையில் கண்காணித்து மருத்துவரை அணுகுங்கள்.',
    
    // Dashboard
    vanakkam: 'வணக்கம்',
    live_opd_badge: 'திருநெல்வேலி மாவட்ட நேரலை புறநோயாளி வலையமைப்பு',
    active_token: 'செயலில் உள்ள டோக்கன் சீட்டு',
    now_serving: 'தற்போது அழைக்கப்படும் எண்',
    estimated_wait: 'மதிப்பிடப்பட்ட நேரம்',
    track_live: 'நேரலை கண்காணிப்பு',
    select_health_concern: 'உடல்நல பிரச்சனை தேர்வு',
    fast_routing: 'விரைவு வழிநடத்துதல்',
    view_all_problems: 'அனைத்து உபாதைகளையும் காண்க',
    featured_hospitals: 'திருநெல்வேலி மருத்துவமனைகள் & நேரலை இடங்கள்',
    explore_all: 'அனைத்து 10 மருத்துவமனைகளும்',
    
    // Booking
    step_problem: 'உபாதை',
    step_date: 'தேதி',
    step_hospital: 'மருத்துவமனை',
    step_doctor: 'மருத்துவர்',
    step_slot: 'நேரம் & டோக்கன்',
    btn_proceed: 'அடுத்து செல்க',
    btn_back: 'முந்தைய பக்கம்',
    btn_confirm_token: 'டோக்கன் சீட்டை உறுதி செய்க',
    
    // Auth & JWT
    patient_sign_in: 'நோயாளி உள்நுழைவு',
    admin_sign_in: 'மருத்துவமனை நிர்வாகி & ஊழியர் பலகை',
    email_label: 'மின்னஞ்சல் முகவரி',
    password_label: 'கடவுச்சொல்',
    mobile_label: 'அலைபேசி எண்',
    quick_test_accounts: 'விரைவு சோதனை கணக்குகள் (தானியங்கி நிரப்ப கிளிக் செய்க)',
    jwt_claims: 'JWT பாதுகாப்பு சான்றிதழ் (Claims)',
    oauth_google: 'கூகிள் OAuth 2.0 மூலம் உள்நுழைக',
    oauth_github: 'கிட்ஹப் OAuth மூலம் உள்நுழைக',
    oauth_tn_health: 'தமிழ்நாடு நல்வாழ்வு அடையாள அட்டை (TN Health ID) OAuth',
    
    // Chatbot
    chat_header: 'டிவிஎல் மருத்துவ AI உதவியாளர்',
    chat_sub: 'அறிகுறி பரிசோதனை & டோக்கன் வழிகாட்டி',
    chat_placeholder: 'நோய் அறிகுறிகள் அல்லது டோக்கன் நிலையை தமிழில் கேளுங்கள்...',
    chat_suggest_1: 'எனக்கு காய்ச்சல் மற்றும் தொண்டை வலி உள்ளது',
    chat_suggest_2: 'திருநெல்வேலியில் சிறந்த கண் மருத்துவமனை எது?',
    chat_suggest_3: 'TVMCH டோக்கன் எண் #14 நிலவரம் என்ன?',
    
    // Recently Visited
    recently_visited: 'சமீபத்தில் பார்த்தவை',
    clear_history: 'அழி'
  },

  hi: {
    // Header & Navigation
    app_title: 'टीवीएल स्मार्टकेयर',
    app_subtitle: 'तिरुनेलवेली अस्पताल टोकन प्रणाली',
    nav_dashboard: 'डैशबोर्ड',
    nav_find_care: 'इलाज खोजें',
    nav_hospitals: 'अस्पताल',
    nav_compare: 'तुलना करें',
    nav_my_tokens: 'मेरे टोकन',
    nav_api: 'एपीआई हब',
    emergency_108: 'आपातकालीन 108',
    sign_in: 'लॉग इन करें',
    admin_login: 'व्यवस्थापक / कर्मचारी',
    sign_out: 'लॉग आउट',
    my_profile: 'मेरी प्रोफ़ाइल',
    live_alerts: 'लाइव अलर्ट',
    language_select: 'भाषा चुनें',
    
    // Landing Page
    landing_pill: 'तिरुनेलवेली जिला सार्वजनिक स्वास्थ्य डिजिटल नेटवर्क',
    landing_headline_1: 'ओपीडी प्रतीक्षा कक्ष से बचें।',
    landing_headline_2: 'अपना डिजिटल टोकन पास बुक करें',
    landing_desc: 'टीवीएमसीएच हाई ग्राउंड्स, शिफा, अरविन्द आई अस्पताल में वास्तविक समय की कतारें देखें और लाइव टोकन पास प्राप्त करें।',
    btn_get_started: 'अभी शुरू करें',
    btn_emergency: '108 आपातकालीन चिकित्सा',
    stat_hospitals: '10 अस्पताल',
    stat_hospitals_sub: 'सरकारी और निजी',
    stat_tokens: '520+ टोकन',
    stat_tokens_sub: 'आज जारी किए गए',
    stat_wait: '~12 मिनट',
    stat_wait_sub: 'औसत प्रतीक्षा',
    stat_free: '100% मुफ्त',
    stat_free_sub: 'टीवीएमसीएच सरकारी ओपीडी',
    
    // Process Steps
    how_it_works: 'स्मार्टकेयर कैसे काम करता है?',
    how_it_works_sub: 'लक्षण चुनें, डॉक्टर काउंटर चुनें और सही समय पर पहुंचे।',
    step_1_title: '1. स्वास्थ्य समस्या चुनें',
    step_1_desc: 'अपनी भाषा में लक्षण खोजें या बोलें, सही विभाग का तुरंत सुझाव मिलेगा।',
    step_2_title: '2. लाइव कतारों की तुलना करें',
    step_2_desc: '10 अस्पतालों में लाइव टोकन उपलब्धता और प्रतीक्षा समय देखें।',
    step_3_title: '3. तत्काल क्यूआर टोकन',
    step_3_desc: 'अपने मोबाइल पर क्यूआर कोड के साथ तुरंत डिजिटल टोकन पास प्राप्त करें।',
    step_4_title: '4. ट्रैक करें और परामर्श लें',
    step_4_desc: 'फोन पर लाइव टोकन नंबर ट्रैक करें और बुलाए जाने पर डॉक्टर से मिलें।',
    
    // Dashboard
    vanakkam: 'नमस्ते',
    live_opd_badge: 'तिरुनेलवेली जिला लाइव ओपीडी नेटवर्क',
    active_token: 'सक्रिय टोकन पास',
    now_serving: 'वर्तमान सेवा नंबर',
    estimated_wait: 'अनुमानित समय',
    track_live: 'लाइव ट्रैक करें',
    select_health_concern: 'समस्या चुनें',
    fast_routing: 'तेज़ रूटिंग',
    view_all_problems: 'सभी समस्याएं देखें',
    featured_hospitals: 'प्रमुख अस्पताल और लाइव क्षमता',
    explore_all: 'सभी 10 अस्पताल देखें',
    
    // Booking
    step_problem: 'लक्षण',
    step_date: 'तारीख',
    step_hospital: 'अस्पताल',
    step_doctor: 'डॉक्टर',
    step_slot: 'समय और टोकन',
    btn_proceed: 'आगे बढ़ें',
    btn_back: 'पिछला कदम',
    btn_confirm_token: 'टोकन पास पुष्टि करें',
    
    // Auth & JWT
    patient_sign_in: 'रोगी लॉगिन',
    admin_sign_in: 'अस्पताल व्यवस्थापक लॉगिन',
    email_label: 'ईमेल पता',
    password_label: 'पासवर्ड',
    mobile_label: 'मोबाइल नंबर',
    quick_test_accounts: 'डेमो खाते (ऑटो-फिल करने के लिए क्लिक करें)',
    jwt_claims: 'जेडब्ल्यूटी सुरक्षा दावे',
    oauth_google: 'Google के साथ लॉगिन करें',
    oauth_github: 'GitHub के साथ लॉगिन करें',
    oauth_tn_health: 'तमिलनाडु स्वास्थ्य पहचान (ABHA) लॉगिन',
    
    // Chatbot
    chat_header: 'टीवीएल स्मार्टकेयर एआई सहायक',
    chat_sub: 'लक्षण जांच और लाइव टोकन गाइड',
    chat_placeholder: 'लक्षणों या अस्पताल कतार के बारे में पूछें...',
    chat_suggest_1: 'मुझे तेज बुखार और गले में दर्द है',
    chat_suggest_2: 'आंखों के लिए सबसे अच्छा अस्पताल कौन सा है?',
    chat_suggest_3: 'टीवीएमसीएच टोकन #14 की स्थिति क्या है?',
    
    // Recently Visited
    recently_visited: 'हाल ही में देखे गए',
    clear_history: 'साफ़ करें'
  },

  ml: {
    // Header & Navigation
    app_title: 'ടിവിഎൽ സ്മാർട്ട്‌കെയർ',
    app_subtitle: 'തിരുനെൽവേലി ആശുപത്രി ടോക്കൺ സംവിധാനം',
    nav_dashboard: 'ഡാഷ്‌ബോർഡ്',
    nav_find_care: 'ചികിത്സ കണ്ടെത്തുക',
    nav_hospitals: 'ആശുപത്രികൾ',
    nav_compare: 'താരതമ്യം ചെയ്യുക',
    nav_my_tokens: 'എന്റെ ടോക്കണുകൾ',
    nav_api: 'എപിഐ ഹബ്',
    emergency_108: 'അടിയന്തിരം 108',
    sign_in: 'ലോഗിൻ ചെയ്യുക',
    admin_login: 'അഡ്മിൻ / സ്റ്റാഫ്',
    sign_out: 'ലോഗ് ഔട്ട്',
    my_profile: 'എന്റെ പ്രൊഫൈൽ',
    live_alerts: 'തത്സമയ അലേർട്ടുകൾ',
    language_select: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    
    // Landing Page
    landing_pill: 'തിരുനെൽവേലി ജില്ലാ ഡിജിറ്റൽ ആരോഗ്യ ശൃംഖല',
    landing_headline_1: 'ഒപിഡി വരിയിൽ കാത്തിരിക്കേണ്ടതില്ല.',
    landing_headline_2: 'ഡിജിറ്റൽ ടോക്കൺ പാസ് ബുക്ക് ചെയ്യുക',
    landing_desc: 'ടിവിഎംസിഎച്ച്, ഷിഫ, അരവിന്ദ് തുടങ്ങിയ ആശുപത്രികളിലെ തത്സമയ ക്യൂ നില അറിഞ്ഞ് ഡിജിറ്റൽ ടോക്കൺ നേടൂ.',
    btn_get_started: 'ഇപ്പോൾ ആരംഭിക്കുക',
    btn_emergency: '108 അടിയന്തിര സേവനം',
    stat_hospitals: '10 ആശുപത്രികൾ',
    stat_hospitals_sub: 'സർക്കാർ & സ്വകാര്യ',
    stat_tokens: '520+ ടോക്കണുകൾ',
    stat_tokens_sub: 'ഇന്ന് നൽകിയത്',
    stat_wait: '~12 മിനിറ്റ്',
    stat_wait_sub: 'ശരാശരി കാത്തിരിപ്പ്',
    stat_free: '100% സൗജന്യം',
    stat_free_sub: 'ടിവിഎംസിഎച്ച് സർക്കാർ ഒപിഡി',
    
    // Process Steps
    how_it_works: 'സ്മാർട്ട്‌കെയർ എങ്ങനെ പ്രവർത്തിക്കുന്നു?',
    how_it_works_sub: 'ലക്ഷണങ്ങൾ തിരഞ്ഞെടുത്ത് ശരിയായ സമയത്ത് ഡോക്ടറെ കാണുക.',
    step_1_title: '1. രോഗലക്ഷണം തിരഞ്ഞെടുക്കുക',
    step_1_desc: 'നിങ്ങളുടെ ഭാഷയിൽ ലക്ഷണം പറയുകയോ തിരയുകയോ ചെയ്യുക.',
    step_2_title: '2. തത്സമയ ക്യൂ താരതമ്യം',
    step_2_desc: '10 ആശുപത്രികളിലെ തത്സമയ ടോക്കൺ ലഭ്യത പരിശോധിക്കുക.',
    step_3_title: '3. തൽക്ഷണ ക്യുആർ ടോക്കൺ',
    step_3_desc: 'മൊബൈലിൽ ക്യുആർ കോഡുള്ള ഡിജിറ്റൽ പാസ് നേടുക.',
    step_4_title: '4. ട്രാക്ക് ചെയ്ത് ഡോക്ടറെ കാണുക',
    step_4_desc: 'തത്സമയ നമ്പർ ട്രാക്ക് ചെയ്ത് നിങ്ങളുടെ ഊഴമാകുമ്പോൾ എത്തിച്ചേരുക.',
    
    // Dashboard
    vanakkam: 'നമസ്കാരം',
    live_opd_badge: 'തിരുനെൽവേലി ജില്ലാ തത്സമയ ഒപിഡി ശൃംഖല',
    active_token: 'സജീവ ടോക്കൺ പാസ്',
    now_serving: 'ഇപ്പോൾ വിളിക്കുന്ന നമ്പർ',
    estimated_wait: 'പ്രതീക്ഷിക്കുന്ന സമയം',
    track_live: 'തത്സമയം ട്രാക്ക് ചെയ്യുക',
    select_health_concern: 'ആരോഗ്യ പ്രശ്നം തിരഞ്ഞെടുക്കുക',
    fast_routing: 'ദ്രുത റൂട്ടിംഗ്',
    view_all_problems: 'എല്ലാം കാണുക',
    featured_hospitals: 'പ്രധാന ആശുപത്രികൾ',
    explore_all: 'എല്ലാ 10 ആശുപത്രികളും കാണുക',
    
    // Booking
    step_problem: 'ലക്ഷണം',
    step_date: 'തീയതി',
    step_hospital: 'ആശുപത്രി',
    step_doctor: 'ഡോക്ടർ',
    step_slot: 'സമയവും ടോക്കണും',
    btn_proceed: 'അടുത്ത ഘട്ടം',
    btn_back: 'മുമ്പത്തെ ഘട്ടം',
    btn_confirm_token: 'ടോക്കൺ സ്ഥിരീകരിക്കുക',
    
    // Auth & JWT
    patient_sign_in: 'രോഗി ലോഗിൻ',
    admin_sign_in: 'ആശുപത്രി അഡ്മിൻ ലോഗിൻ',
    email_label: 'ഇമെയിൽ വിലാസം',
    password_label: 'പാസ്‌വേഡ്',
    mobile_label: 'മൊബൈൽ നമ്പർ',
    quick_test_accounts: 'ഡെമോ അക്കൗണ്ടുകൾ',
    jwt_claims: 'സുരക്ഷാ സർട്ടിഫിക്കറ്റ്',
    oauth_google: 'Google വഴി ലോഗിൻ ചെയ്യുക',
    oauth_github: 'GitHub വഴി ലോഗിൻ ചെയ്യുക',
    oauth_tn_health: 'ടിഎൻ ഹെൽത്ത് ഐഡി ലോഗിൻ',
    
    // Chatbot
    chat_header: 'ടിവിഎൽ സ്മാർട്ട്‌കെയർ എഐ അസിസ്റ്റന്റ്',
    chat_sub: 'ലക്ഷണ പരിശോധനയും ടോക്കൺ വിവരങ്ങളും',
    chat_placeholder: 'ലക്ഷണങ്ങളെക്കുറിച്ചോ ടോക്കണുകളെക്കുറിച്ചോ ചോദിക്കുക...',
    chat_suggest_1: 'എനിക്ക് കടുത്ത പനിയും തൊണ്ടവേദനയും ഉണ്ട്',
    chat_suggest_2: 'ഏറ്റവും മികച്ച നേത്രരോഗ ആശുപത്രി ഏതാണ്?',
    chat_suggest_3: 'ടിവിഎംസിഎച്ച് ടോക്കൺ നില എന്താണ്?',
    
    // Recently Visited
    recently_visited: 'അടുത്തിടെ കണ്ടവ',
    clear_history: 'മായ്ക്കുക'
  },

  te: {
    // Header & Navigation
    app_title: 'టీవీఎల్ స్మార్ట్‌కేర్',
    app_subtitle: 'తిరునెల్వేలి ఆసుపత్రి టోకెన్ వ్యవస్థ',
    nav_dashboard: 'డాష్‌బోర్డ్',
    nav_find_care: 'వైద్యం కనుగొనండి',
    nav_hospitals: 'ఆసుపత్రులు',
    nav_compare: 'పోల్చండి',
    nav_my_tokens: 'నా టోకెన్లు',
    nav_api: 'ఏపీఐ హబ్',
    emergency_108: 'అత్యవసరం 108',
    sign_in: 'లాగిన్ అవ్వండి',
    admin_login: 'అడ్మిన్ / సిబ్బంది',
    sign_out: 'లాగ్ అవుట్',
    my_profile: 'నా ప్రొఫైల్',
    live_alerts: 'లైవ్ అలర్టులు',
    language_select: 'భాష ఎంచుకోండి',
    
    // Landing Page
    landing_pill: 'తిరునెల్వేలి జిల్లా ప్రజా ఆరోగ్య డిజిటల్ నెట్‌వర్క్',
    landing_headline_1: 'ఓపీడీ వెయిటింగ్ రూమ్‌ను దాటవేయండి.',
    landing_headline_2: 'డిజిటల్ టోకెన్ పాస్ బుక్ చేసుకోండి',
    landing_desc: 'టీవీఎంసీహెచ్, షిఫా, అరవింద్ కంటి ఆసుపత్రులలో లైవ్ క్యూ స్టేటస్ తెలుసుకొని తక్షణ డిజిటల్ టోకెన్ పొందండి.',
    btn_get_started: 'ఇప్పుడే ప్రారంభించండి',
    btn_emergency: '108 అత్యవసర సేవలు',
    stat_hospitals: '10 ఆసుపత్రులు',
    stat_hospitals_sub: 'ప్రభుత్వ & ప్రైవేట్',
    stat_tokens: '520+ టోకెన్లు',
    stat_tokens_sub: 'ఈరోజు జారీ చేయబడినవి',
    stat_wait: '~12 నిమిషాలు',
    stat_wait_sub: 'సగటు నిరీక్షణ సమయం',
    stat_free: '100% ఉచితం',
    stat_free_sub: 'టీవీఎంసీహెచ్ ప్రభుత్వ ఓపీడీ',
    
    // Process Steps
    how_it_works: 'స్మార్ట్‌కేర్ ఎలా పనిచేస్తుంది?',
    how_it_works_sub: 'లక్షణాలు ఎంచుకొని సరైన సమయానికి డాక్టర్‌ను సంప్రదించండి.',
    step_1_title: '1. లక్షణాలు ఎంచుకోండి',
    step_1_desc: 'మీ భాషలో లక్షణాలను శోధించండి లేదా మాట్లాడండి.',
    step_2_title: '2. లైవ్ క్యూ పోలిక',
    step_2_desc: '10 ఆసుపత్రులలో లైవ్ టోకెన్ లభ్యతను సరిపోల్చండి.',
    step_3_title: '3. తక్షణ క్యూఆర్ టోకెన్',
    step_3_desc: 'మీ మొబైల్‌లో క్యూఆర్ కోడ్‌తో డిజిటల్ పాస్ పొందండి.',
    step_4_title: '4. ట్రాక్ చేసి సంప్రదించండి',
    step_4_desc: 'లైవ్ నంబర్‌ను ట్రాక్ చేసి మీ వంతు వచ్చినప్పుడు డాక్టర్‌ని కలవండి.',
    
    // Dashboard
    vanakkam: 'నమస్కారం',
    live_opd_badge: 'తిరునెల్వేలి జిల్లా లైవ్ ఓపీడీ నెట్‌వర్క్',
    active_token: 'యాక్టివ్ టోకెన్ పాస్',
    now_serving: 'ప్రస్తుతం పిలుస్తున్న నంబర్',
    estimated_wait: 'అంచనా సమయం',
    track_live: 'లైవ్ ట్రాక్ చేయండి',
    select_health_concern: 'సమస్యను ఎంచుకోండి',
    fast_routing: 'వేగవంతమైన రౌటింగ్',
    view_all_problems: 'అన్ని సమస్యలు చూడండి',
    featured_hospitals: 'ప్రముఖ ఆసుపత్రులు',
    explore_all: 'అన్ని 10 ఆసుపత్రులను అన్వేషించండి',
    
    // Booking
    step_problem: 'లక్షణం',
    step_date: 'తేదీ',
    step_hospital: 'ఆసుపత్రి',
    step_doctor: 'డాక్టర్',
    step_slot: 'సమయం & టోకెన్',
    btn_proceed: 'తదుపరి దశ',
    btn_back: 'మునుపటి దశ',
    btn_confirm_token: 'టోకెన్ పాస్ నిర్ధారించండి',
    
    // Auth & JWT
    patient_sign_in: 'రోగి లాగిన్',
    admin_sign_in: 'ఆసుపత్రి అడ్మిన్ లాగిన్',
    email_label: 'ఇమెయిల్ చిరునామా',
    password_label: 'పాస్‌వర్డ్',
    mobile_label: 'మొబైల్ నంబర్',
    quick_test_accounts: 'డెమో ఖాతాలు',
    jwt_claims: 'భద్రతా సర్టిఫికేట్',
    oauth_google: 'Google తో లాగిన్ అవ్వండి',
    oauth_github: 'GitHub తో లాగిన్ అవ్వండి',
    oauth_tn_health: 'టీఎన్ హెల్త్ ఐడీ లాగిన్',
    
    // Chatbot
    chat_header: 'టీవీఎల్ స్మార్ట్‌కేర్ ఏఐ సహాయకుడు',
    chat_sub: 'లక్షణాల తనిఖీ మరియు లైవ్ టోకెన్ సమాచారం',
    chat_placeholder: 'లక్షణాలు లేదా టోకెన్ గురించి అడగండి...',
    chat_suggest_1: 'నాకు తీవ్రమైన జ్వరం మరియు గొంతు నొప్పి ఉంది',
    chat_suggest_2: 'ఉత్తమ కంటి ఆసుపత్రి ఏది?',
    chat_suggest_3: 'టీవీఎంసీహెచ్ టోకెన్ స్థితి ఏమిటి?',
    
    // Recently Visited
    recently_visited: 'ఇటీవల చూసినవి',
    clear_history: 'క్లియర్ చేయండి'
  }
};
