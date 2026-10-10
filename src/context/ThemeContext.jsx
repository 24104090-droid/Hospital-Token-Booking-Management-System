import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext();

export const AVAILABLE_THEMES = [
  {
    id: 'light',
    name: 'Clinical Light',
    nameTa: 'வெளிச்சம் (இயல்பு)',
    desc: 'Clean medical white with sky blue accents',
    descTa: 'தெளிவான வெள்ளை மற்றும் நீல நிற இடைமுகம்',
    badge: 'Standard',
    colorHex: '#0284c7',
    previewBg: '#f8fafc',
    previewCard: '#ffffff',
    previewAccent: '#0284c7',
    isDarkVariant: false
  },
  {
    id: 'dark',
    name: 'Midnight Slate',
    nameTa: 'இரவு முறை (Dark)',
    desc: 'Deep slate dark mode, gentle on tired eyes',
    descTa: 'இரவு நேர மருத்துவ பயன்பாட்டிற்கான இருள் முறை',
    badge: 'Popular',
    colorHex: '#38bdf8',
    previewBg: '#0b1120',
    previewCard: '#0f172a',
    previewAccent: '#38bdf8',
    isDarkVariant: true
  },
  {
    id: 'system',
    name: 'System Sync',
    nameTa: 'கணினி முறை (Auto)',
    desc: 'Automatically matches your device OS theme',
    descTa: 'உங்கள் போன்/கணினி அமைப்பிற்கு ஏற்ப மாறும்',
    badge: 'Auto',
    colorHex: '#94a3b8',
    previewBg: '#1e293b',
    previewCard: '#334155',
    previewAccent: '#94a3b8',
    isDarkVariant: null
  },
  {
    id: 'emerald',
    name: 'Ayurveda Emerald',
    nameTa: 'ஆயுஷ் பசுமை (Emerald)',
    desc: 'Serene botanical mint & wellness herbal green',
    descTa: 'இயற்கை மற்றும் நல்வாழ்வுக்கான மூலிகை பசுமை',
    badge: 'Wellness',
    colorHex: '#10b981',
    previewBg: '#041d18',
    previewCard: '#082d25',
    previewAccent: '#10b981',
    isDarkVariant: true
  },
  {
    id: 'indigo',
    name: 'Royal Specialty',
    nameTa: 'மருத்துவம் (Royal Indigo)',
    desc: 'Premium deep violet & clinical specialty purple',
    descTa: 'சிறப்பு மருத்துவ சிகிச்சைக்கான ராயல் ஊதா நிறம்',
    badge: 'Specialty',
    colorHex: '#818cf8',
    previewBg: '#0d0c22',
    previewCard: '#151336',
    previewAccent: '#818cf8',
    isDarkVariant: true
  },
  {
    id: 'ocean',
    name: 'Telemetry Ocean',
    nameTa: 'ஆழ் கடல் (Cyber Ocean)',
    desc: 'High-contrast sapphire & cardiac monitor cyan',
    descTa: 'தீவிர சிகிச்சை மற்றும் அதிக மாறுபட்ட கடல் நீலம்',
    badge: 'High Contrast',
    colorHex: '#06b6d4',
    previewBg: '#031726',
    previewCard: '#07253d',
    previewAccent: '#06b6d4',
    isDarkVariant: true
  }
];

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem('tvl_theme');
      const valid = AVAILABLE_THEMES.some(t => t.id === saved);
      if (valid) return saved;
    } catch (e) {
      console.warn('Could not read saved theme:', e);
    }
    return 'light';
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const applyTheme = (currentTheme) => {
      let activeIsDark = false;

      if (currentTheme === 'system') {
        activeIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        const found = AVAILABLE_THEMES.find(t => t.id === currentTheme);
        activeIsDark = found ? found.isDarkVariant : currentTheme === 'dark';
      }

      setIsDark(activeIsDark);

      // Set data-theme attribute
      root.setAttribute('data-theme', currentTheme);
      body.setAttribute('data-theme', currentTheme);

      // Remove any prior theme classes
      AVAILABLE_THEMES.forEach(t => {
        root.classList.remove(`theme-${t.id}`);
        body.classList.remove(`theme-${t.id}`);
      });
      root.classList.add(`theme-${currentTheme}`);
      body.classList.add(`theme-${currentTheme}`);

      // Apply or remove .dark class for Tailwind darkMode: 'class'
      if (activeIsDark) {
        root.classList.add('dark');
        body.classList.add('dark');
      } else {
        root.classList.remove('dark');
        body.classList.remove('dark');
      }
    };

    applyTheme(theme);

    try {
      localStorage.setItem('tvl_theme', theme);
    } catch (e) {
      console.warn('Could not save theme:', e);
    }

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme('system');
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  const setTheme = (newTheme) => {
    const valid = AVAILABLE_THEMES.some(t => t.id === newTheme);
    if (valid) {
      setThemeState(newTheme);
    }
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'emerald';
      if (prev === 'emerald') return 'indigo';
      if (prev === 'indigo') return 'ocean';
      return 'light';
    });
  };

  const activeThemeObj = useMemo(() => {
    return AVAILABLE_THEMES.find(t => t.id === theme) || AVAILABLE_THEMES[0];
  }, [theme]);

  return (
    <ThemeContext.Provider value={{
      theme,
      isDark,
      setTheme,
      toggleTheme,
      availableThemes: AVAILABLE_THEMES,
      activeTheme: activeThemeObj
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
