'use client'

interface FiltersProps {
  selectedType: string
  searchQuery: string
  onTypeChange: (type: string) => void
  onSearchChange: (query: string) => void
}

export function Filters({ selectedType, searchQuery, onTypeChange, onSearchChange }: FiltersProps) {
  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'project', label: 'Projects' },
    { value: 'profile', label: 'Profiles' },
    { value: 'company', label: 'Companies' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Type
          </label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Reports
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search by title or URL..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  )
}
