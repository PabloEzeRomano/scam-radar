'use client';

import { useTranslations, useT } from '@/lib/translations/TranslationsProvider';

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslations();
  const t = useT();

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'es' : 'en';
    setLocale(newLocale);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      title={locale === 'en' ? t('nav.switchToSpanish') : t('nav.switchToEnglish')}
    >
      {locale === 'en' ? 'ES' : 'EN'}
    </button>
  );
}
