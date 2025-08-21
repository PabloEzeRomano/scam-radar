'use client';

import { useEffect, useState } from 'react';
import { TranslationsProvider } from '@/lib/translations/TranslationsProvider';
import { Locale } from '@/lib/translations/types';

interface LocaleDetectorProps {
  children: React.ReactNode;
}

export function LocaleDetector({ children }: LocaleDetectorProps) {
  const [isClient, setIsClient] = useState(false);
  const [initialLocale, setInitialLocale] = useState<Locale>('en');

  useEffect(() => {
    setIsClient(true);

    // Check URL search params first
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang') as Locale;

    if (urlLang && (urlLang === 'en' || urlLang === 'es')) {
      setInitialLocale(urlLang);
    } else {
      // Fallback to browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'es') {
        setInitialLocale('es');
      } else {
        setInitialLocale('en'); // Default to English
      }
    }
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <TranslationsProvider initialLocale={initialLocale}>
      {children}
    </TranslationsProvider>
  );
}
