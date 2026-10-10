import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { translations, SUPPORTED_LANGUAGES } from '../data/translations';
import { translateText } from '../utils/universalTranslator';

const LanguageContext = createContext();

// WeakMaps to store original untranslated English text for DOM text nodes and element attributes
const textNodeOriginals = new WeakMap();
const placeholderOriginals = new WeakMap();
const titleOriginals = new WeakMap();

const IGNORED_TAGS = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'NOSCRIPT', 'TEXTAREA']);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('tvl_lang');
    return saved && (translations[saved] || ['en', 'ta', 'hi', 'ml', 'te'].includes(saved)) ? saved : 'en';
  });

  const isTranslatingRef = useRef(false);

  useEffect(() => {
    localStorage.setItem('tvl_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  // Translate a single DOM element and its children
  const translateNode = (node, targetLang) => {
    if (!node) return;

    // Handle Text Node
    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentNode;
      if (!parent || IGNORED_TAGS.has(parent.nodeName) || parent.classList?.contains('notranslate')) {
        return;
      }

      const currentVal = node.nodeValue;
      if (!currentVal || !currentVal.trim()) return;

      if (!textNodeOriginals.has(node)) {
        textNodeOriginals.set(node, currentVal);
      }

      const origText = textNodeOriginals.get(node);

      if (targetLang === 'en') {
        if (node.nodeValue !== origText) {
          node.nodeValue = origText;
        }
      } else {
        const translated = translateText(origText, targetLang);
        if (node.nodeValue !== translated) {
          node.nodeValue = translated;
        }
      }
      return;
    }

    // Handle Element Node
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (IGNORED_TAGS.has(node.nodeName) || node.classList?.contains('notranslate')) {
        return;
      }

      // Input placeholder
      if (node.placeholder) {
        if (!placeholderOriginals.has(node)) {
          placeholderOriginals.set(node, node.placeholder);
        }
        const origPl = placeholderOriginals.get(node);
        const transPl = targetLang === 'en' ? origPl : translateText(origPl, targetLang);
        if (node.placeholder !== transPl) {
          node.placeholder = transPl;
        }
      }

      // Element title
      if (node.title) {
        if (!titleOriginals.has(node)) {
          titleOriginals.set(node, node.title);
        }
        const origTitle = titleOriginals.get(node);
        const transTitle = targetLang === 'en' ? origTitle : translateText(origTitle, targetLang);
        if (node.title !== transTitle) {
          node.title = transTitle;
        }
      }

      // Recursively translate child nodes
      const children = node.childNodes;
      for (let i = 0; i < children.length; i++) {
        translateNode(children[i], targetLang);
      }
    }
  };

  // Full DOM Walk Translation Effect + MutationObserver
  useEffect(() => {
    const runFullTranslation = () => {
      if (isTranslatingRef.current || !document.body) return;
      isTranslatingRef.current = true;
      try {
        translateNode(document.body, lang);
      } finally {
        isTranslatingRef.current = false;
      }
    };

    // Run translation immediately
    runFullTranslation();

    // Set up MutationObserver to translate dynamically added or changed nodes
    const observer = new MutationObserver((mutations) => {
      if (isTranslatingRef.current) return;

      isTranslatingRef.current = true;
      try {
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            for (let i = 0; i < mutation.addedNodes.length; i++) {
              translateNode(mutation.addedNodes[i], lang);
            }
          } else if (mutation.type === 'characterData') {
            const target = mutation.target;
            if (!textNodeOriginals.has(target)) {
              textNodeOriginals.set(target, target.nodeValue);
            }
            if (lang !== 'en') {
              const orig = textNodeOriginals.get(target);
              const translated = translateText(orig, lang);
              if (target.nodeValue !== translated) {
                target.nodeValue = translated;
              }
            } else {
              const orig = textNodeOriginals.get(target);
              if (target.nodeValue !== orig) {
                target.nodeValue = orig;
              }
            }
          }
        }
      } finally {
        isTranslatingRef.current = false;
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // Second pass after microtask to catch async React tree completions
    const timer = setTimeout(runFullTranslation, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'ta' : 'en'));
  };

  const setLanguage = (newLang) => {
    if (translations[newLang] || ['en', 'ta', 'hi', 'ml', 'te'].includes(newLang)) {
      setLang(newLang);
    }
  };

  const currentLanguage = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];

  const t = (key, fallback = '') => {
    if (!key) return '';
    // 1. Check exact key in dictionary
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    // 2. Check if key can be translated directly via universalTranslator
    const directTrans = translateText(key, lang);
    if (directTrans && directTrans !== key) {
      return directTrans;
    }
    // 3. Fallback to English dictionary entry
    if (translations['en'] && translations['en'][key]) {
      return translations['en'][key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      lang, 
      isTamil: lang === 'ta',
      isHindi: lang === 'hi',
      isMalayalam: lang === 'ml',
      isTelugu: lang === 'te',
      currentLanguage,
      languages: SUPPORTED_LANGUAGES,
      toggleLanguage, 
      setLanguage, 
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
