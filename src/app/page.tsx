import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Scam Radar
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
              Community-driven scam reports to help you stay safe online
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/reports"
                className="rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Browse Reports
              </Link>
              <Link
                href="/submit"
                className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Submit a Report
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Red Flags Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Red Flags to Watch For
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Common warning signs that should make you pause and investigate further
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <div className="text-red-600 mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Suspicious Code Patterns</h3>
              <p className="text-gray-700">Repos with single commit, ghost accounts, placeholder code, or requests to run code locally before any live demo.</p>
            </div>

            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <div className="text-red-600 mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Encoded Strings & Dynamic Execution</h3>
              <p className="text-gray-700">Base64 strings that decode to external URLs, or dynamic execution like <code>new Function()</code> fetching network payloads.</p>
            </div>

            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <div className="text-red-600 mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Missing Credibility</h3>
              <p className="text-gray-700">No company domain, GitHub org with real history, deployed demo, or dramatic stories with urgency to rush you.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Advice Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Safe Practices
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Follow these guidelines to protect yourself from scams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="text-green-600 mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Never Run Untrusted Code</h3>
              <p className="text-gray-700">Review code first in a safe environment (container/VM) before executing anything locally.</p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="text-green-600 mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify All Sources</h3>
              <p className="text-gray-700">Check company domain, org repo history, live demo, and team LinkedIn profiles thoroughly.</p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="text-green-600 mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Trust Your Instincts</h3>
              <p className="text-gray-700">If something feels off, pause and double-check. Ask for proof like contracts on explorers or real commit history.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Help Keep the Community Safe
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Report suspicious activity and browse verified scam reports
            </p>
            <div className="mt-8 flex items-center justify-center gap-x-6">
              <Link
                href="/submit"
                className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-blue-600 shadow-sm hover:bg-gray-50"
              >
                Submit a Report
              </Link>
              <Link
                href="/reports"
                className="rounded-md bg-transparent px-6 py-3 text-lg font-semibold text-white ring-1 ring-inset ring-white hover:bg-white hover:text-blue-600"
              >
                Browse Reports
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
