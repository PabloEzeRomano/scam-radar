'use client';

import { ContactForm } from './ContactForm';
import { useT } from '@/lib/translations/TranslationsProvider';

export default function ContactPage() {
  const t = useT();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('contact.title')}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {t('contact.subtitle')}
          </p>
          <p className="mt-4 text-base text-gray-600 max-w-2xl mx-auto">
            {t('contact.description')}
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
