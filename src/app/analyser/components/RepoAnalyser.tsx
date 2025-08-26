'use client';

import { FileDropzone } from '@/components/FileDropzone';
import { FormField } from '@/components/FormField';
import { useT } from '@/lib/translations/TranslationsProvider';
import { useCallback, useState } from 'react';
import { AnalyserContentWrapper, AnalyserWrapper } from './AnalyserWrapper';
import { RepoAnalyserProps, RepoAnalysis, ReportFormData } from '@/types';

const BP = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function RepoAnalyser({ providerConfig }: RepoAnalyserProps) {
  const t = useT();
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [analysis, setAnalysis] = useState<RepoAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setZipFile(file);
        if (!repoUrl) {
          setRepoUrl(repoUrl || '');
        }
      }
    },
    [repoUrl]
  );

  async function analyse() {
    setErrorMsg(null);
    setAnalysis(null);
    setShowReportForm(false);

    try {
      setIsAnalysing(true);
      if (!zipFile) {
        setErrorMsg(t('analyser.repo.errorNoZip'));
        return;
      }

      const base64 = await new Promise<string>((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve((fr.result as string).split(',')[1] || '');
        fr.onerror = reject;
        fr.readAsDataURL(zipFile);
      });

      const res = await fetch(`${BP}/scam-radar/api/analyse/repo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zipBase64: base64,
          useLlm:
            !!providerConfig.provider &&
            providerConfig.provider !== 'heuristic',
          providerConfig,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: RepoAnalysis = await res.json();
      console.log('data', data);
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

  const getReportFormInitialData = () => {
    if (!analysis) return {} as ReportFormData;

    const aiReason = `Analysis Score: ${
      analysis.riskScore
    }/100\n\nFlags:\n${analysis.flags.join('\n')}\n\nSummary:\n${
      analysis.summary
    }`;

    // Auto-fill title from zip filename if no URL provided
    const title =
      repoUrl ||
      (zipFile ? zipFile.name.replace('.zip', '') : 'Repository Analysis');

    return {
      url: repoUrl,
      title,
      reason: aiReason,
      type: 'project' as const,
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
      analysisType="repo"
    >
      <AnalyserContentWrapper>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('analyser.repo.input')}
        </h2>

        <div className="mb-4">
          <FormField
            label={t('analyser.repo.repoUrl')}
            name="repoUrl"
            type="url"
            value={repoUrl}
            onChange={(value) => setRepoUrl(value)}
            placeholder={t('analyser.repo.repoUrlPlaceholder')}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('analyser.repo.zipFile')}
          </label>
          <FileDropzone
            onDrop={onDrop}
            accept={{
              'application/zip': ['.zip'],
              'application/x-zip-compressed': ['.zip'],
            }}
            multiple={false}
            selectedFiles={zipFile ? [zipFile] : []}
            onRemoveFile={() => setZipFile(null)}
          />
        </div>

        <button
          onClick={analyse}
          disabled={isAnalysing || !zipFile}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAnalysing
            ? t('analyser.repo.analysing')
            : t('analyser.repo.analyseButton')}
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
