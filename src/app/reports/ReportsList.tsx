'use client'

import { useState, useEffect } from 'react'
import { Report } from '@/lib/firebase/models'
import { ReportCard } from '@/components/ReportCard'
import { Filters } from '@/components/Filters'
import { useT } from '@/lib/translations/TranslationsProvider'

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
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">{t('reports.loading')}</p>
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
        <div className="text-center py-12">
          <p className="text-gray-600">{t('reports.noResults')}</p>
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
