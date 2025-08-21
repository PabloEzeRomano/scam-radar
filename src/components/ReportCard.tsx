import { Report } from '@/lib/firebase/models';
import { useT } from '@/lib/translations/TranslationsProvider';

interface ReportCardProps {
  report: Report;
}

export function ReportCard({ report }: ReportCardProps) {
  const t = useT();

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'project':
        return 'bg-blue-100 text-blue-800';
      case 'profile':
        return 'bg-green-100 text-green-800';
      case 'company':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor(
              report.type
            )}`}
          >
            {t(`reports.types.${report.type}`)}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
              report.status
            )}`}
          >
            {t(`reports.statuses.${report.status}`)}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {formatDate(report.createdAt)}
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
