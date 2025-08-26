'use client';

import { ReportForm } from '@/components/ReportForm';
import { useT } from '@/lib/translations/TranslationsProvider';
import {
  AnalyserContentWrapperProps,
  AnalyserWrapperProps
} from '@/types';
import { AnalysisResults } from './AnalysisResults';

export function AnalyserWrapper({
  children,
  analysis,
  onConvertToReport,
  showReportForm,
  onCancelReport,
  getReportFormInitialData,
  onSubmitReport,
  className = '',
  analysisType,
}: AnalyserWrapperProps) {
  const t = useT();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Content */}
      {children}

      {/* Analysis Results */}
      {analysis && (
        <AnalysisResults
          analysis={analysis}
          onConvertToReport={onConvertToReport}
        />
      )}

      {/* Report Form */}
      {showReportForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('analyser.reportForm.title')}
            </h2>
            <button
              onClick={onCancelReport}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <ReportForm
            initialData={getReportFormInitialData()}
            onSubmit={onSubmitReport}
            onCancel={onCancelReport}
            submitButtonText={t('analyser.reportForm.submitButton')}
            showHoneypot={false}
            analysisType={analysisType}
          />
        </div>
      )}
    </div>
  );
}

// Simple wrapper for just the common UI structure
export function AnalyserContentWrapper({
  children,
  className = '',
}: AnalyserContentWrapperProps) {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
