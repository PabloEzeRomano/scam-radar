import { useT, useTranslations } from '@/lib/translations/TranslationsProvider';
import { ReportCardProps } from '@/types';
import { StatusBadge, TypeBadge } from './Badge';

export function ReportCard({ report }: ReportCardProps) {
  const t = useT();
  const { locale } = useTranslations();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <TypeBadge type={report.type} />
          <StatusBadge status={report.status} />
        </div>
        <span className="text-sm text-gray-500">
          {formatDate(report.createdAt.toDate())}
        </span>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {report.title || t('reports.untitled')}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">{t('reports.platform')}:</span>{' '}
          {report.platform || t('reports.unknown')}
        </p>
        <a
          href={report.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm break-all"
        >
          {report.url}
        </a>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          {t('reports.whySuspicious')}
        </h4>
        <p className="text-sm text-gray-600 leading-relaxed">{report.reason}</p>
      </div>
    </div>
  );
}
