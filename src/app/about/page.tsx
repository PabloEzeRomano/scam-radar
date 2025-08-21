
'use client';

import { useT } from '@/lib/translations/TranslationsProvider';

export default function AboutPage() {
  const t = useT();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('about.title')}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('about.mission')}</h2>
              <p className="text-gray-700 mb-6">
                {t('about.missionText')}
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('about.howItWorks')}</h2>
              <p className="text-gray-700 mb-6">
                {t('about.howItWorksText')}
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('about.submissionGuidelines')}</h2>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li><strong>{t('about.guidelines.specific')}:</strong> {t('about.guidelines.specificDesc')}</li>
                <li><strong>{t('about.guidelines.evidence')}:</strong> {t('about.guidelines.evidenceDesc')}</li>
                <li><strong>{t('about.guidelines.factual')}:</strong> {t('about.guidelines.factualDesc')}</li>
                <li><strong>{t('about.guidelines.contact')}:</strong> {t('about.guidelines.contactDesc')}</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('about.whatWeLookFor')}</h2>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>{t('about.lookFor.codePatterns')}</li>
                <li>{t('about.lookFor.encodedStrings')}</li>
                <li>{t('about.lookFor.missingInfo')}</li>
                <li>{t('about.lookFor.dramaticStories')}</li>
                <li>{t('about.lookFor.sensitiveInfo')}</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('about.privacyEthics')}</h2>
              <p className="text-gray-700 mb-6">
                {t('about.privacyEthicsText')}
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('about.disclaimer')}</h2>
              <p className="text-gray-700">
                {t('about.disclaimerText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
