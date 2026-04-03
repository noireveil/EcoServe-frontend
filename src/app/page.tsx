import Hero from '@/components/sections/Hero';
import ImpactDashboard from '@/components/sections/ImpactDashboard';
import ServiceCategories from '@/components/sections/ServiceCategories';
import AIChatPreview from '@/components/sections/AIChatPreview';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Hero />
      <ServiceCategories />
      <ImpactDashboard />
      <AIChatPreview />

      {/* CTA Section */}
      <section className="py-12 md:py-24 bg-gradient-to-br from-emerald-500 to-teal-600">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Ready to Start?
          </h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are making a difference through responsible e-waste management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/request"
              className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:bg-emerald-50 transition-colors shadow-lg inline-flex items-center justify-center"
            >
              Get Started Now
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/demo"
              className="bg-emerald-700 text-white border-2 border-white/30 px-8 py-4 rounded-xl font-semibold hover:bg-emerald-800 transition-colors inline-flex items-center justify-center"
            >
              Preview Dashboard
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </Link>
            <Link
              href="/triage"
              className="bg-emerald-600 text-white border-2 border-white/30 px-8 py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center justify-center"
            >
              Try AI Diagnosis
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 pb-28 md:pb-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">EcoServe</span>
              </div>
              <p className="text-gray-400 max-w-sm">
                Empowering communities to embrace circular economy through responsible e-waste management and repair services.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/triage" className="hover:text-emerald-400 transition-colors">AI Triage</Link></li>
                <li><Link href="/demo/user" className="hover:text-emerald-400 transition-colors">Demo: User Dashboard</Link></li>
                <li><Link href="/demo/technician" className="hover:text-emerald-400 transition-colors">Demo: Technician Dashboard</Link></li>
                <li><Link href="/auth/request" className="hover:text-emerald-400 transition-colors">Get Started</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>hello@ecoserve.com</li>
                <li>+62 812-3456-7890</li>
                <li>Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 EcoServe. All rights reserved. Built for I/O Festival 2026.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
