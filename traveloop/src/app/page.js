import Link from 'next/link';
import { Plane, Map, Calendar, DollarSign, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Plane className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold tracking-tight text-slate-900">Traveloop</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Login</Link>
          <Link href="/signup" className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-8 pt-20 pb-32 mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
              Personalized Travel Planning <br />
              <span className="text-blue-600">Made Easy</span>
            </h1>
            <p className="max-w-2xl mx-auto mt-6 text-lg leading-8 text-slate-600">
              Dream, design, and organize your trips with our intelligent platform. 
              Transform the way you experience travel through structured itineraries and smart budgeting.
            </p>
            <div className="flex items-center justify-center gap-4 mt-10">
              <Link href="/planner/new" className="flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                Plan New Trip <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/trips" className="px-8 py-4 text-lg font-semibold text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                View My Trips
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-8 mt-32 md:grid-cols-3">
            <div className="p-8 border border-slate-100 rounded-3xl bg-slate-50/50">
              <div className="flex items-center justify-center w-12 h-12 mb-6 bg-white rounded-2xl shadow-sm">
                <Map className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Multi-City Itineraries</h3>
              <p className="mt-2 text-slate-600">Create customized multi-city plans with ease, adding stops and durations effortlessly[cite: 11, 18].</p>
            </div>

            <div className="p-8 border border-slate-100 rounded-3xl bg-slate-50/50">
              <div className="flex items-center justify-center w-12 h-12 mb-6 bg-white rounded-2xl shadow-sm">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Visual Timelines</h3>
              <p className="mt-2 text-slate-600">Review your full plan in a structured format with grouped city headers and activity blocks[cite: 12, 54].</p>
            </div>

            <div className="p-8 border border-slate-100 rounded-3xl bg-slate-50/50">
              <div className="flex items-center justify-center w-12 h-12 mb-6 bg-white rounded-2xl shadow-sm">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Smart Budgeting</h3>
              <p className="mt-2 text-slate-600">Estimate trip budgets automatically and get detailed cost breakdowns for every stop[cite: 11, 21].</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-8 py-12 border-t border-slate-100">
        <div className="text-center text-sm text-slate-500">
          © 2026 Traveloop. Designed for collaborative and intelligent travel[cite: 4].
        </div>
      </footer>
    </div>
  );
}