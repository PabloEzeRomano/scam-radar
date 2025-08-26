'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import dictionaryData from './dictionary.json';
import { Locale, TranslationDictionary } from './types';

interface TranslationsContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dictionary: TranslationDictionary | null;
  loading: boolean;
}

const TranslationsContext = createContext<TranslationsContextType | undefined>(
  undefined
);

interface TranslationsProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function TranslationsProvider({
  children,
  initialLocale = 'en',
}: TranslationsProviderProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [dictionary, setDictionary] = useState<TranslationDictionary | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDictionary = async () => {
      setLoading(true);
      try {
        // In a real app, you might fetch this from an API
        const translations = dictionaryData;
        setDictionary(translations[locale] as TranslationDictionary);
      } catch (error) {
        console.error('Failed to load dictionary:', error);
        // Fallback to English if loading fails
        const fallbackDict = dictionaryData.en as TranslationDictionary;
        setDictionary(fallbackDict);
        setLocale('en');
      } finally {
        setLoading(false);
      }
    };

    loadDictionary();
  }, [locale]);

  const t = (key: string): string => {
    if (!dictionary) return key;

    const keys = key.split('.');
    let value: unknown = dictionary;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key;
  };

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    // Update URL search param
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', newLocale);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const value: TranslationsContextType = {
    locale,
    setLocale: handleSetLocale,
    t,
    dictionary,
    loading,
  };

  return (
    <TranslationsContext.Provider value={value}>
      {children}
    </TranslationsContext.Provider>
  );
}

export function useTranslations() {
  const context = useContext(TranslationsContext);
  if (context === undefined) {
    throw new Error(
      'useTranslations must be used within a TranslationsProvider'
    );
  }
  return context;
}

// Convenience hook for translations
export function useT() {
  const { t } = useTranslations();
  return t;
}
