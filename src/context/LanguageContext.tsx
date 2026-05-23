import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Language = 'en' | 'hi' | 'te' | 'ta' | 'bn' | 'mr'

export interface Translations {
  [key: string]: string
}

const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.matches': 'Matches',
    'nav.standings': 'Standings',
    'nav.stats': 'Statistics',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    
    // Common
    'common.search': 'Search teams, players, tournaments...',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.share': 'Share',
    'common.copy': 'Copy',
    'common.download': 'Download',
    
    // Match
    'match.live': 'Live',
    'match.upcoming': 'Upcoming',
    'match.finished': 'Finished',
    'match.score': 'Score',
    'match.overs': 'Overs',
    'match.runRate': 'Run Rate',
    'match.winner': 'Winner',
    'match.venue': 'Venue',
    'match.tournament': 'Tournament',
    
    // Team
    'team.name': 'Team Name',
    'team.players': 'Players',
    'team.standings': 'Standings',
    'team.stats': 'Statistics',
    
    // Player
    'player.name': 'Player Name',
    'player.role': 'Role',
    'player.stats': 'Statistics',
    'player.performance': 'Performance',
    
    // Notifications
    'notif.title': 'Notifications',
    'notif.markRead': 'Mark as read',
    'notif.clear': 'Clear',
    'notif.noNotif': 'No notifications',
    
    // Chat
    'chat.title': 'Live Chat',
    'chat.placeholder': 'Type a message...',
    'chat.send': 'Send',
    'chat.online': 'Online',
    
    // Fantasy
    'fantasy.title': 'Fantasy League',
    'fantasy.createTeam': 'Create Your Team',
    'fantasy.save': 'Save Team',
    'fantasy.credits': 'Credits',
    'fantasy.points': 'Points',
    'fantasy.players': 'Players',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.email': 'Email',
    'auth.fullName': 'Full Name',
    'auth.welcome': 'Welcome Back',
    'auth.createAccount': 'Create Account',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.matches': 'मैच',
    'nav.standings': 'स्टैंडिंग्स',
    'nav.stats': 'आंकड़े',
    'nav.profile': 'प्रोफाइल',
    'nav.settings': 'सेटिंग्स',
    'nav.admin': 'एडमिन',
    'nav.login': 'लॉगिन',
    'nav.logout': 'लॉगआउट',
    
    // Common
    'common.search': 'टीम, खिलाड़ी, टूर्नामेंट खोजें...',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.view': 'देखें',
    'common.share': 'साझा करें',
    'common.copy': 'कॉपी करें',
    'common.download': 'डाउनलोड',
    
    // Match
    'match.live': 'लाइव',
    'match.upcoming': 'आगामी',
    'match.finished': 'समाप्त',
    'match.score': 'स्कोर',
    'match.overs': 'ओवर',
    'match.runRate': 'रन रेट',
    'match.winner': 'विजेता',
    'match.venue': 'स्थान',
    'match.tournament': 'टूर्नामेंट',
    
    // Team
    'team.name': 'टीम का नाम',
    'team.players': 'खिलाड़ी',
    'team.standings': 'स्टैंडिंग्स',
    'team.stats': 'आंकड़े',
    
    // Player
    'player.name': 'खिलाड़ी का नाम',
    'player.role': 'भूमिका',
    'player.stats': 'आंकड़े',
    'player.performance': 'प्रदर्शन',
    
    // Notifications
    'notif.title': 'नोटिफिकेशन',
    'notif.markRead': 'पढ़े हुए के रूप में चिह्नित करें',
    'notif.clear': 'साफ करें',
    'notif.noNotif': 'कोई नोटिफिकेशन नहीं',
    
    // Chat
    'chat.title': 'लाइव चैट',
    'chat.placeholder': 'संदेश टाइप करें...',
    'chat.send': 'भेजें',
    'chat.online': 'ऑनलाइन',
    
    // Fantasy
    'fantasy.title': 'फैंटेसी लीग',
    'fantasy.createTeam': 'अपनी टीम बनाएं',
    'fantasy.save': 'टीम सहेजें',
    'fantasy.credits': 'क्रेडिट',
    'fantasy.points': 'पॉइंट्स',
    'fantasy.players': 'खिलाड़ी',
    
    // Auth
    'auth.login': 'लॉगिन',
    'auth.register': 'रजिस्टर',
    'auth.username': 'उपयोगकर्ता नाम',
    'auth.password': 'पासवर्ड',
    'auth.email': 'ईमेल',
    'auth.fullName': 'पूरा नाम',
    'auth.welcome': 'वापसी पर स्वागत है',
    'auth.createAccount': 'खाता बनाएं',
  },
  te: {
    // Navigation
    'nav.home': 'హోమ్',
    'nav.matches': 'మ్యాచ్‌లు',
    'nav.standings': 'స్టాండింగ్స్',
    'nav.stats': 'గణాంకాలు',
    'nav.profile': 'ప్రొఫైల్',
    'nav.settings': 'సెట్టింగ్‌లు',
    'nav.admin': 'అడ్మిన్',
    'nav.login': 'లాగిన్',
    'nav.logout': 'లాగ్అవుట్',
    
    // Common
    'common.search': 'జట్లు, ఆటగాళ్లు, టోర్నమెంట్‌లను శోధించండి...',
    'common.loading': 'లోడ్ అవుతోంది...',
    'common.error': 'లోపం',
    'common.success': 'విజయం',
    'common.cancel': 'రద్దు చేయండి',
    'common.save': 'సేవ్ చేయండి',
    'common.delete': 'తొలగించండి',
    'common.edit': 'సవరించండి',
    'common.view': 'చూడండి',
    'common.share': 'భాగస్వామ్యం చేయండి',
    'common.copy': 'కాపీ చేయండి',
    'common.download': 'డౌన్‌లోడ్',
    
    // Match
    'match.live': 'లైవ్',
    'match.upcoming': 'రాబోయే',
    'match.finished': 'పూర్తయ్యింది',
    'match.score': 'స్కోర్',
    'match.overs': 'ఓవర్లు',
    'match.runRate': 'రన్ రేట్',
    'match.winner': 'విజేత',
    'match.venue': 'వేదిక',
    'match.tournament': 'టోర్నమెంట్',
    
    // Team
    'team.name': 'జట్టు పేరు',
    'team.players': 'ఆటగాళ్లు',
    'team.standings': 'స్టాండింగ్స్',
    'team.stats': 'గణాంకాలు',
    
    // Player
    'player.name': 'ఆటగాడు పేరు',
    'player.role': 'పాత్ర',
    'player.stats': 'గణాంకాలు',
    'player.performance': 'ప్రదర్శన',
    
    // Notifications
    'notif.title': 'నోటిఫికేషన్లు',
    'notif.markRead': 'చదివినట్లుగా గుర్తించండి',
    'notif.clear': 'క్లియర్',
    'notif.noNotif': 'నోటిఫికేషన్లు లేవు',
    
    // Chat
    'chat.title': 'లైవ్ చాట్',
    'chat.placeholder': 'సందేశం టైప్ చేయండి...',
    'chat.send': 'పంపండి',
    'chat.online': 'ఆన్‌లైన్',
    
    // Fantasy
    'fantasy.title': 'ఫాంటసీ లీగ్',
    'fantasy.createTeam': 'మీ జట్టును సృష్టించండి',
    'fantasy.save': 'జట్టును సేవ్ చేయండి',
    'fantasy.credits': 'క్రెడిట్లు',
    'fantasy.points': 'పాయింట్లు',
    'fantasy.players': 'ఆటగాళ్లు',
    
    // Auth
    'auth.login': 'లాగిన్',
    'auth.register': 'నమోదు',
    'auth.username': 'వినియోగదారు పేరు',
    'auth.password': 'పాస్‌వర్డ్',
    'auth.email': 'ఇమెయిల్',
    'auth.fullName': 'పూర్తి పేరు',
    'auth.welcome': 'తిరిగి స్వాగతం',
    'auth.createAccount': 'ఖాతాను సృష్టించండి',
  },
  ta: {
    // Navigation
    'nav.home': 'முகப்பு',
    'nav.matches': 'போட்டிகள்',
    'nav.standings': 'நிலைகள்',
    'nav.stats': 'புள்ளிவிவரங்கள்',
    'nav.profile': 'சுயவிவரம்',
    'nav.settings': 'அமைப்புகள்',
    'nav.admin': 'நிர்வாகி',
    'nav.login': 'உள்நுழை',
    'nav.logout': 'வெளியேறு',
    
    // Common
    'common.search': 'அணிகள், வீரர்கள், போட்டிகளைத் தேடுங்கள்...',
    'common.loading': 'ஏற்றுகிறது...',
    'common.error': 'பிழை',
    'common.success': 'வெற்றி',
    'common.cancel': 'ரத்துசெய்',
    'common.save': 'சேமி',
    'common.delete': 'நீக்கு',
    'common.edit': 'திருத்து',
    'common.view': 'காண்க',
    'common.share': 'பகிரவும்',
    'common.copy': 'நகலெடு',
    'common.download': 'பதிவிறக்கு',
    
    // Match
    'match.live': 'நேரடி',
    'match.upcoming': 'வரவிருக்கும்',
    'match.finished': 'முடிந்தது',
    'match.score': 'மதிப்பெண்',
    'match.overs': 'ஓவர்கள்',
    'match.runRate': 'ஓட்ட விகிதம்',
    'match.winner': 'வெற்றியாளர்',
    'match.venue': 'இடம்',
    'match.tournament': 'போட்டி',
    
    // Team
    'team.name': 'அணி பெயர்',
    'team.players': 'வீரர்கள்',
    'team.standings': 'நிலைகள்',
    'team.stats': 'புள்ளிவிவரங்கள்',
    
    // Player
    'player.name': 'வீரர் பெயர்',
    'player.role': 'பங்கு',
    'player.stats': 'புள்ளிவிவரங்கள்',
    'player.performance': 'செயல்திறன்',
    
    // Notifications
    'notif.title': 'அறிவிப்புகள்',
    'notif.markRead': 'படித்ததாகக் குறிக்க',
    'notif.clear': 'அழி',
    'notif.noNotif': 'அறிவிப்புகள் இல்லை',
    
    // Chat
    'chat.title': 'நேரடி உரையாடல்',
    'chat.placeholder': 'செய்தியை தட்டச்சு செய்க...',
    'chat.send': 'அனுப்பு',
    'chat.online': 'ஆன்லைன்',
    
    // Fantasy
    'fantasy.title': 'கற்பனை லீக்',
    'fantasy.createTeam': 'உங்கள் அணியை உருவாக்கவும்',
    'fantasy.save': 'அணியை சேமி',
    'fantasy.credits': 'க்ரெடிட்கள்',
    'fantasy.points': 'புள்ளிகள்',
    'fantasy.players': 'வீரர்கள்',
    
    // Auth
    'auth.login': 'உள்நுழை',
    'auth.register': 'பதிவு',
    'auth.username': 'பயனர்பெயர்',
    'auth.password': 'கடவுச்சொல்',
    'auth.email': 'மின்னஞ்சல்',
    'auth.fullName': 'முழு பெயர்',
    'auth.welcome': 'மீண்டும் வரவேற்கிறோம்',
    'auth.createAccount': 'கணக்கை உருவாக்கவும்',
  },
  bn: {
    // Navigation
    'nav.home': 'হোম',
    'nav.matches': 'ম্যাচ',
    'nav.standings': 'স্ট্যান্ডিংস',
    'nav.stats': 'পরিসংখ্যান',
    'nav.profile': 'প্রোফাইল',
    'nav.settings': 'সেটিংস',
    'nav.admin': 'অ্যাডমিন',
    'nav.login': 'লগইন',
    'nav.logout': 'লগআউট',
    
    // Common
    'common.search': 'দল, খেলোয়াড়, টুর্নামেন্ট অনুসন্ধান করুন...',
    'common.loading': 'লোড হচ্ছে...',
    'common.error': 'ত্রুটি',
    'common.success': 'সাফল্য',
    'common.cancel': 'বাতিল',
    'common.save': 'সংরক্ষণ',
    'common.delete': 'মুছে ফেলুন',
    'common.edit': 'সম্পাদনা',
    'common.view': 'দেখুন',
    'common.share': 'শেযার',
    'common.copy': 'কপি',
    'common.download': 'ডাউনলোড',
    
    // Match
    'match.live': 'লাইভ',
    'match.upcoming': 'আসন্ন',
    'match.finished': 'সমাপ্ত',
    'match.score': 'স্কোর',
    'match.overs': 'ওভার',
    'match.runRate': 'রান রেট',
    'match.winner': 'বিজয়ী',
    'match.venue': 'ভেন্যু',
    'match.tournament': 'টুর্নামেন্ট',
    
    // Team
    'team.name': 'দলের নাম',
    'team.players': 'খেলোয়াড়',
    'team.standings': 'স্ট্যান্ডিংস',
    'team.stats': 'পরিসংখ্যান',
    
    // Player
    'player.name': 'খেলোয়াড়ের নাম',
    'player.role': 'ভূমিকা',
    'player.stats': 'পরিসংখ্যান',
    'player.performance': 'পারফরম্যান্স',
    
    // Notifications
    'notif.title': 'নোটিফিকেশন',
    'notif.markRead': 'পঠিত হিসাবে চিহ্নিত',
    'notif.clear': 'মুছে ফেলুন',
    'notif.noNotif': 'কোনো নোটিফিকেশন নেই',
    
    // Chat
    'chat.title': 'লাইভ চ্যাট',
    'chat.placeholder': 'বার্তা টাইপ করুন...',
    'chat.send': 'পাঠান',
    'chat.online': 'অনলাইন',
    
    // Fantasy
    'fantasy.title': 'ফ্যান্টাসি লিগ',
    'fantasy.createTeam': 'আপনার দল তৈরি করুন',
    'fantasy.save': 'দল সংরক্ষণ',
    'fantasy.credits': 'ক্রেডিট',
    'fantasy.points': 'পয়েন্ট',
    'fantasy.players': 'খেলোয়াড়',
    
    // Auth
    'auth.login': 'লগইন',
    'auth.register': 'নিবন্ধন',
    'auth.username': 'ব্যবহারকারী নাম',
    'auth.password': 'পাসওয়ার্ড',
    'auth.email': 'ইমেল',
    'auth.fullName': 'পূর্ণ নাম',
    'auth.welcome': 'স্বাগতম',
    'auth.createAccount': 'অ্যাকাউন্ট তৈরি করুন',
  },
  mr: {
    // Navigation
    'nav.home': 'होम',
    'nav.matches': 'सामने',
    'nav.standings': 'स्थान',
    'nav.stats': 'आकडे',
    'nav.profile': 'प्रोफाइल',
    'nav.settings': 'सेटिंग्ज',
    'nav.admin': 'अॅडमिन',
    'nav.login': 'लॉगिन',
    'nav.logout': 'लॉगआउट',
    
    // Common
    'common.search': 'संघ, खेळाडू, स्पर्धा शोधा...',
    'common.loading': 'लोड होत आहे...',
    'common.error': 'त्रुटी',
    'common.success': 'यशस्वी',
    'common.cancel': 'रद्द करा',
    'common.save': 'जतन करा',
    'common.delete': 'हटवा',
    'common.edit': 'संपादित करा',
    'common.view': 'पहा',
    'common.share': 'शेअर करा',
    'common.copy': 'कॉपी करा',
    'common.download': 'डाउनलोड',
    
    // Match
    'match.live': 'लाइव्ह',
    'match.upcoming': 'आगामी',
    'match.finished': 'संपन्न',
    'match.score': 'गुण',
    'match.overs': 'षटके',
    'match.runRate': 'धाव दर',
    'match.winner': 'विजेता',
    'match.venue': 'स्थळ',
    'match.tournament': 'स्पर्धा',
    
    // Team
    'team.name': 'संघाचे नाव',
    'team.players': 'खेळाडू',
    'team.standings': 'स्थान',
    'team.stats': 'आकडे',
    
    // Player
    'player.name': 'खेळाडूचे नाव',
    'player.role': 'भूमिका',
    'player.stats': 'आकडे',
    'player.performance': 'कामगिरी',
    
    // Notifications
    'notif.title': 'सूचना',
    'notif.markRead': 'वाचल्याप्रमाणे चिन्हांकित करा',
    'notif.clear': 'साफ करा',
    'notif.noNotif': 'कोणतीही सूचना नाही',
    
    // Chat
    'chat.title': 'लाइव्ह चॅट',
    'chat.placeholder': 'संदेश टाइप करा...',
    'chat.send': 'पाठवा',
    'chat.online': 'ऑनलाइन',
    
    // Fantasy
    'fantasy.title': 'फॅन्टसी लीग',
    'fantasy.createTeam': 'तुमचा संघ तयार करा',
    'fantasy.save': 'संघ जतन करा',
    'fantasy.credits': 'क्रेडिट',
    'fantasy.points': 'गुण',
    'fantasy.players': 'खेळाडू',
    
    // Auth
    'auth.login': 'लॉगिन',
    'auth.register': 'नोंदणी',
    'auth.username': 'वापरकर्ता नाव',
    'auth.password': 'संकेतशब्द',
    'auth.email': 'ईमेल',
    'auth.fullName': 'पूर्ण नाव',
    'auth.welcome': 'पुन्हा स्वागत',
    'auth.createAccount': 'खाते तयार करा',
  },
}

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  languages: { code: Language; name: string; nativeName: string }[]
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const saved = localStorage.getItem('strider-language') as Language
    if (saved && translations[saved]) {
      setLanguage(saved)
    }
  }, [])

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('strider-language', lang)
  }, [])

  const t = useCallback(
    (key: string): string => {
      return translations[language][key] || translations['en'][key] || key
    },
    [language]
  )

  const languages = [
    { code: 'en' as Language, name: 'English', nativeName: 'English' },
    { code: 'hi' as Language, name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'te' as Language, name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ta' as Language, name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'bn' as Language, name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'mr' as Language, name: 'Marathi', nativeName: 'मराठी' },
  ]

  const value = useMemo(
    () => ({
      language,
      setLanguage: handleSetLanguage,
      t,
      languages,
    }),
    [language, handleSetLanguage, t]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
