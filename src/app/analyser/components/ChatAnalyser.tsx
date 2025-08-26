'use client';

import { FileDropzone } from '@/components/FileDropzone';
import { FormField } from '@/components/FormField';
import { useT } from '@/lib/translations/TranslationsProvider';
import { ocrImageToText } from '@/utils/ocr';
import { useCallback, useState } from 'react';
import { AnalyserContentWrapper, AnalyserWrapper } from './AnalyserWrapper';
import { ChatAnalyserProps, ChatAnalysis, ReportFormData } from '@/types';

const BP = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function ChatAnalyser({ providerConfig }: ChatAnalyserProps) {
  const t = useT();
  const [files, setFiles] = useState<File[]>([]);
  const [rawText, setRawText] = useState<string>('');
  const [isOcring, setIsOcring] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analysis, setAnalysis] = useState<ChatAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    if (acceptedFiles.length > 0) {
      runOcrOnFiles(acceptedFiles);
    }
  }, []);

  async function runOcrOnFiles(incoming: File[]) {
    setIsOcring(true);
    try {
      const parts = await Promise.all(incoming.map((f) => ocrImageToText(f)));
      setRawText(
        parts
          .map(
            (txt: string, i: number) => `--- screenshot_${i + 1} ---\n${txt}`
          )
          .join('\n\n')
      );
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErrorMsg(e.message);
      } else {
        setErrorMsg(t('analyser.chat.ocrError'));
      }
    } finally {
      setIsOcring(false);
    }
  }

  async function analyse() {
    setIsAnalysing(true);
    setErrorMsg(null);
    setAnalysis(null);
    setShowReportForm(false);

    try {
      if (!rawText.trim()) {
        setErrorMsg(t('analyser.chat.errorNoText'));
        return;
      }

      const res = await fetch(`${BP}/scam-radar/api/analyse/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: rawText.trim(),
          providerConfig,
          useLlm:
            !!providerConfig.provider &&
            providerConfig.provider !== 'heuristic',
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ChatAnalysis = await res.json();
      setAnalysis(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErrorMsg(e.message);
      } else {
        setErrorMsg(t('analyser.common.errorAnalysing'));
      }
    } finally {
      setIsAnalysing(false);
    }
  }

  const handleReportSubmit = (/*reportId: string*/) => {
    setShowReportForm(false);
    setErrorMsg(t('analyser.common.reportSubmitted'));
  };

  const handleCancelReport = () => {
    setShowReportForm(false);
  };

  // Prepare initial data for the report form based on analysis
  const getReportFormInitialData = () => {
    if (!analysis) return {} as ReportFormData;

    const firstUrl = analysis.entities.urls?.[0] ?? '';

    // Auto-fill title from first line of chat text
    const firstLine = rawText.split('\n')[0].trim();
    const title =
      firstLine.length > 0 ? firstLine.substring(0, 100) : 'Chat Analysis';

    const aiReason = `Analysis Score: ${
      analysis.riskScore
    }/100\n\nFlags:\n${analysis.flags.join('\n')}\n\nSummary:\n${
      analysis.summary
    }`;

    return {
      url: firstUrl,
      title,
      reason: aiReason,
      type: 'profile' as const,
      platform: 'Analyser',
    } as ReportFormData;
  };

  return (
    <AnalyserWrapper
      analysis={analysis}
      onConvertToReport={() => setShowReportForm(true)}
      showReportForm={showReportForm}
      onCancelReport={handleCancelReport}
      getReportFormInitialData={getReportFormInitialData}
      onSubmitReport={handleReportSubmit}
      analysisType="chat"
    >
      {/* Input Section */}
      <AnalyserContentWrapper>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('analyser.chat.input')}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('analyser.chat.screenshots')}
          </label>
          <FileDropzone
            onDrop={onDrop}
            accept={{
              'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'],
              'text/plain': ['.txt', '.md', '.pdf'],
            }}
            multiple={true}
            selectedFiles={files}
            onRemoveFile={(index) => {
              const newFiles = files.filter((_, i) => i !== index);
              setFiles(newFiles);
            }}
          />
        </div>

        {/* Text Input */}
        <div className="mb-4">
          <FormField
            label={t('analyser.chat.chatText')}
            name="text"
            type="textarea"
            value={rawText}
            onChange={(value) => setRawText(value)}
            placeholder={t('analyser.chat.chatTextPlaceholder')}
            rows={8}
          />
        </div>

        <button
          onClick={analyse}
          disabled={isAnalysing || isOcring || !rawText.trim()}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isOcring
            ? t('analyser.chat.processingImages')
            : isAnalysing
            ? t('analyser.chat.analysing')
            : t('analyser.chat.analyseButton')}
        </button>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{errorMsg}</p>
          </div>
        )}
      </AnalyserContentWrapper>
    </AnalyserWrapper>
  );
}
