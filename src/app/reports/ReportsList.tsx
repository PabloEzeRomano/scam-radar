'use client'

import { useState, useEffect } from 'react'
import { Report } from '@/lib/firebase/models'
import { ReportCard } from '@/components/ReportCard'
import { Filters } from '@/components/Filters'
import { useT } from '@/lib/translations/TranslationsProvider'
import Link from 'next/link'

// Skeleton loader component
function ReportSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
          <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </div>

      <div className="mb-4">
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}

export function ReportsList() {
  const t = useT();
  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [selectedType, setSelectedType] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // For MVP, we'll use mock data since we don't have the database set up yet
    const mockReports: Report[] = [
      {
        id: '1',
        type: 'profile',
        url: 'https://www.linkedin.com/in/kannan-kanagiah-03b866a5/',
        title: 'kannan-kanagiah-03b866a5',
        platform: 'LinkedIn',
        reason: 'Suspicious behaviour, fast process, too good to be true',
        reporterId: 'user1',
        status: 'approved',
        createdAt: new Date('2024-01-15')
      },
      {
        id: '2',
        type: 'company',
        url: 'https://www.linkedin.com/company/ohm-developments/',
        title: 'ohm-developments',
        platform: 'LinkedIn',
        reason: 'No posts, suspicious activity',
        reporterId: 'user1',
        status: 'approved',
        createdAt: new Date('2024-01-10')
      }
    ]

    setReports(mockReports)
    setFilteredReports(mockReports)
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = reports

    // Filter by type
    if (selectedType) {
      filtered = filtered.filter(report => report.type === selectedType)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(report =>
        (report.title && report.title.toLowerCase().includes(query)) ||
        report.url.toLowerCase().includes(query)
      )
    }

    setFilteredReports(filtered)
  }, [reports, selectedType, searchQuery])

  if (loading) {
    return (
      <div>
        <Filters
          selectedType={selectedType}
          searchQuery={searchQuery}
          onTypeChange={setSelectedType}
          onSearchChange={setSearchQuery}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, index) => (
            <ReportSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <Filters
        selectedType={selectedType}
        searchQuery={searchQuery}
        onTypeChange={setSelectedType}
        onSearchChange={setSearchQuery}
      />

      {filteredReports.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-6">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery || selectedType ? t('reports.noResults') : t('reports.noReports')}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchQuery || selectedType
              ? t('reports.noResultsDesc')
              : t('reports.noReportsDesc')
            }
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {t('reports.submitFirst')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  )
}
