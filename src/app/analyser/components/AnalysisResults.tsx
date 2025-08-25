import { RiskBadge } from '../../../components/Badge';
import { Pill } from '../../../components/Pill';
import { useT } from '../../../lib/translations/TranslationsProvider';
import { AnalysisResultsProps } from '@/lib/types/analyser';

export function AnalysisResults({
  analysis,
  onConvertToReport,
  className,
}: AnalysisResultsProps) {
  const t = useT();

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${
        className || ''
      }`}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {t('analyser.results.title')}
      </h2>

      {/* Risk Score */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('analyser.results.riskScore')}
        </h3>
        <RiskBadge score={analysis.riskScore} />
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('analyser.results.summary')}</h3>
        <p className="text-gray-700">{analysis.summary}</p>
      </div>

      {/* Flags */}
      {analysis.flags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('analyser.results.flags')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.flags.map((flag, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full border border-red-200"
              >
                {flag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Guidance */}
      {analysis.guidance.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('analyser.results.guidance')}
          </h3>
          <ul className="space-y-2">
            {analysis.guidance.map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Entities */}
      {analysis.entities && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('analyser.results.entities')}
          </h3>
          <div className="space-y-3">
            {analysis.entities.emails &&
              analysis.entities.emails.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    {t('analyser.results.emails')}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {analysis.entities.emails.map((email, i) => (
                      <Pill key={i} variant="info">
                        {email}
                      </Pill>
                    ))}
                  </div>
                </div>
              )}
            {analysis.entities.urls && analysis.entities.urls.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  {t('analyser.results.urls')}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {analysis.entities.urls.map((url, i) => (
                    <Pill key={i} variant="warning">
                      {url}
                    </Pill>
                  ))}
                </div>
              </div>
            )}
            {analysis.entities.wallets &&
              analysis.entities.wallets.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    {t('analyser.results.wallets')}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {analysis.entities.wallets.map((wallet, i) => (
                      <Pill key={i} variant="error">
                        {wallet}
                      </Pill>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      {/* Signals */}
      {analysis.signals && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('analyser.results.signals')}
          </h3>

          {/* Scripts */}
          {analysis.signals.scripts &&
            Object.keys(analysis.signals.scripts).length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  {t('analyser.results.suspiciousScripts')}:
                </h4>
                <div className="space-y-2">
                  {Object.entries(analysis.signals.scripts).map(
                    ([name, content], i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-md">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {name}
                        </p>
                        <p className="text-xs font-mono text-gray-600 break-all">
                          {content}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {/* Files */}
          {analysis.signals.files && analysis.signals.files.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                {t('analyser.results.suspiciousFiles')}:
              </h4>
              <div className="flex flex-wrap gap-1">
                {analysis.signals.files.map((file, i) => (
                  <Pill key={i} variant="warning">
                    {file}
                  </Pill>
                ))}
              </div>
            </div>
          )}

          {/* Findings */}
          {analysis.signals.findings &&
            analysis.signals.findings.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  {t('analyser.results.findings')}:
                </h4>
                <div className="space-y-2">
                  {analysis.signals.findings.map((finding, i) => (
                    <div
                      key={i}
                      className="p-3 bg-yellow-50 border border-yellow-200 rounded-md"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-sm font-medium text-yellow-800">
                          {finding.type}
                        </span>
                        {finding.file && (
                          <Pill variant="warning">{finding.file}</Pill>
                        )}
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        {finding.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {/* Evidence */}
      {analysis.evidence && analysis.evidence.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('analyser.results.evidence')}</h3>
          <div className="space-y-2">
            {analysis.evidence.map((item, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-md">
                {typeof item === 'string' ? (
                  // Handle string evidence (from chat analysis)
                  <p className="text-sm text-gray-700">{item}</p>
                ) : (
                  // Handle object evidence (from repo analysis)
                  <div className="space-y-1">
                    {item.file && (
                      <p className="text-xs font-mono text-gray-600">
                        <span className="font-medium">File:</span> {item.file}
                        {item.line && `:${item.line}`}
                      </p>
                    )}
                    {item.snippet && (
                      <p className="text-xs font-mono text-gray-800 bg-gray-100 p-2 rounded border">
                        {item.snippet}
                      </p>
                    )}
                    {item.note && (
                      <p className="text-sm text-gray-700">{item.note}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Convert to Report Button */}
      <div className="border-t border-gray-200 pt-6">
        <button
          onClick={onConvertToReport}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          {t('analyser.results.convertToReport')}
        </button>
      </div>
    </div>
  );
}
