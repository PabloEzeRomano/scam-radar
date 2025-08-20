import { SubmitForm } from './SubmitForm'

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Submit a Scam Report
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Help protect the community by reporting suspicious activity
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SubmitForm />
      </div>
    </div>
  )
}
