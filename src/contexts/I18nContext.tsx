import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const SUPPORTED_LANGUAGES = ['en', 'hi', 'mr', 'gu', 'bn', 'ta'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

type Dictionary = Record<string, string>;

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const languageLabels: Record<Language, string> = {
  en: 'English',
  hi: 'हिन्दी',
  mr: 'मराठी',
  gu: 'ગુજરાતી',
  bn: 'বাংলা',
  ta: 'தமிழ்',
};

export { SUPPORTED_LANGUAGES, languageLabels };

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [dictionary, setDictionary] = useState<Dictionary>({});

  useEffect(() => {
    const saved = localStorage.getItem('agri.language') as Language | null;
    if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
      setLanguage(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('agri.language', language);
    fetch(`/locales/${language}.json`)
      .then((res) => res.json())
      .then((dict: Dictionary) => setDictionary(dict))
      .catch(() => setDictionary({}));
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: string) => dictionary[key] ?? key,
    }),
    [dictionary, language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}
