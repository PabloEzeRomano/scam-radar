'use client';

import { ReportForm } from '@/components/ReportForm';
import { useT } from '@/lib/translations/TranslationsProvider';
import { useState } from 'react';

export function SubmitForm() {
  const t = useT();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (/*reportId: string*/) => {
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-green-600 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t('submit.success.title')}
        </h2>
        <p className="text-gray-600 mb-6">{t('submit.success.message')}</p>
        <a
          href="/reports"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          {t('submit.success.browseReports')}
        </a>
      </div>
    );
  }

  return (
    <ReportForm
      onSubmit={handleSubmit}
      submitButtonText={t('submit.form.submit')}
      className="p-8"
    />
  );
}
