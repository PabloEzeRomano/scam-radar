export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              About Scam Radar
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Our mission and guidelines for keeping the community safe
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              Scam Radar is a community-driven platform designed to help developers, investors, and professionals
              identify and avoid suspicious online activities. We believe that collective vigilance is the best
              defense against scams, fraud, and malicious actors in the digital space.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
            <p className="text-gray-700 mb-6">
              Community members submit reports of suspicious projects, profiles, or companies they encounter.
              Our team reviews each submission for accuracy and relevance before publishing. Only verified,
              approved reports are made public to ensure the quality and reliability of our database.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Submission Guidelines</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li><strong>Be specific:</strong> Provide clear details about what makes the subject suspicious</li>
              <li><strong>Include evidence:</strong> Share URLs, screenshots, or specific examples when possible</li>
              <li><strong>Stay factual:</strong> Focus on observable red flags rather than personal opinions</li>
              <li><strong>Contact required:</strong> We require either an email or LinkedIn profile to verify submissions</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Look For</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>Suspicious code patterns or requests to run untrusted code</li>
              <li>Encoded strings that decode to external URLs</li>
              <li>Missing company information or fake credentials</li>
              <li>Dramatic stories with urgency to rush decisions</li>
              <li>Requests for sensitive information or unusual access</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy & Ethics</h2>
            <p className="text-gray-700 mb-6">
              We take privacy seriously. Reporter information is kept confidential and is only used for
              verification purposes. We do not share personal details with third parties. Our goal is to
              protect the community while respecting individual privacy and maintaining ethical standards.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Disclaimer</h2>
            <p className="text-gray-700">
              Scam Radar provides information for educational and awareness purposes only. Reports on this
              platform do not constitute legal advice or definitive proof of fraudulent activity. Always
              conduct your own research and due diligence before making any decisions. We are not responsible
              for any actions taken based on information found on this platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
