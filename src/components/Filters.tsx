'use client';

import { useT } from '@/lib/translations/TranslationsProvider';

interface FiltersProps {
  selectedType: string;
  searchQuery: string;
  onTypeChange: (type: string) => void;
  onSearchChange: (query: string) => void;
}

export function Filters({
  selectedType,
  searchQuery,
  onTypeChange,
  onSearchChange,
}: FiltersProps) {
  const t = useT();

  const typeOptions = [
    { value: '', label: t('filters.allTypes') },
    { value: 'project', label: t('filters.projects') },
    { value: 'profile', label: t('filters.profiles') },
    { value: 'company', label: t('filters.companies') },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="type-filter"
            className="block text-sm font-medium text-gray-800 mb-2"
          >
            {t('filters.filterByType')}
          </label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="p-3 block w-full rounded-md border border-gray-300 shadow-sm text-gray-900 bg-white sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            {typeOptions.map((option) => (
              <option
                className="p-2 bg-white text-gray-900 text-sm"
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-800 mb-2"
          >
            {t('filters.searchReports')}
          </label>
          <input
            id="search"
            type="text"
            placeholder={t('filters.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="p-3 block w-full rounded-md border border-gray-300 shadow-sm text-gray-900 placeholder-gray-500 bg-white sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>
      </div>
    </div>
  );
}
