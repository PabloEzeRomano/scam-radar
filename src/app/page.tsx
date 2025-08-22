'use client';

import { LocaleDetector } from '@/components/LocaleDetector';
import SectionCarousel from '@/components/SectionCarousel';
import { useT, useTranslations } from '@/lib/translations/TranslationsProvider';
import Link from 'next/link';

export default function HomePage() {
  return (
    <LocaleDetector>
      <HomePageContent />
    </LocaleDetector>
  );
}

function HomePageContent() {
  const t = useT();
  const { dictionary } = useTranslations();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {t('home.title')}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t('home.subtitle')}
            </p>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              {t('home.description')}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/reports"
                className="rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {t('home.ctaBrowse')}
              </a>
              <a
                href="/submit"
                className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {t('home.ctaSubmit')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Red Flags Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t('home.redFlags.title')}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('home.redFlags.subtitle')}
            </p>
          </div>

          <SectionCarousel
            ariaLabel={t('home.redFlags.title')}
            sectionDict={dictionary?.home?.redFlags || {}}
            variant="flag"
            intervalMs={2500}
            className="max-w-6xl mx-auto"
          />

          {/* noscript fallback */}
          <noscript>
            <div className="max-w-6xl mx-auto mt-8">
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none">
                <li className="bg-red-50 rounded-lg p-6 border border-red-200">
                  <div className="text-red-600 mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('home.redFlags.item1')}</h3>
                  <p className="text-gray-700">{t('home.redFlags.item1Desc')}</p>
                </li>
                <li className="bg-red-50 rounded-lg p-6 border border-red-200">
                  <div className="text-red-600 mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('home.redFlags.item2')}</h3>
                  <p className="text-gray-700">{t('home.redFlags.item2Desc')}</p>
                </li>
                <li className="bg-red-50 rounded-lg p-6 border border-red-200">
                  <div className="text-red-600 mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('home.redFlags.item3')}</h3>
                  <p className="text-gray-700">{t('home.redFlags.item3Desc')}</p>
                </li>
              </ul>
            </div>
          </noscript>
        </div>
      </div>

      {/* Safe Practices Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t('home.advice.title')}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('home.advice.subtitle')}
            </p>
          </div>

          <SectionCarousel
            ariaLabel={t('home.advice.title')}
            sectionDict={dictionary?.home?.advice || {}}
            variant="practice"
            intervalMs={2500}
            className="max-w-6xl mx-auto"
          />

          {/* noscript fallback */}
          <noscript>
            <div className="max-w-6xl mx-auto mt-8">
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none">
                <li className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <div className="text-green-600 mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('home.advice.item1')}</h3>
                  <p className="text-gray-700">{t('home.advice.item1Desc')}</p>
                </li>
                <li className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <div className="text-green-600 mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('home.advice.item2')}</h3>
                  <p className="text-gray-700">{t('home.advice.item2Desc')}</p>
                </li>
                <li className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <div className="text-green-600 mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('home.advice.item3')}</h3>
                  <p className="text-gray-700">{t('home.advice.item3Desc')}</p>
                </li>
              </ul>
            </div>
          </noscript>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t('home.cta.title')}
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              {t('home.cta.subtitle')}
            </p>
            <div className="mt-8 flex items-center justify-center gap-x-6">
              <Link
                href="/submit"
                className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-blue-600 shadow-sm hover:bg-gray-200"
              >
                {t('home.ctaSubmit')}
              </Link>
              <Link
                href="/reports"
                className="rounded-md bg-transparent px-6 py-3 text-lg font-semibold text-white ring-1 ring-inset ring-white hover:bg-white hover:text-blue-600"
              >
                {t('home.ctaBrowse')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
