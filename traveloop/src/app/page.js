import Link from 'next/link';
import Image from 'next/image';
import { 
  Plane, 
  Map, 
  Calendar, 
  DollarSign, 
  ArrowRight, 
  Users, 
  Compass, 
  ShieldCheck 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 flex items-center justify-between px-6 py-5 mx-auto max-w-7xl left-0 right-0">
        <div className="flex items-center gap-2">
          <Plane className="w-8 h-8 text-blue-500" />
          <span className="text-2xl font-bold tracking-tight text-white drop-shadow-md">Traveloop</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-white hover:text-blue-200 drop-shadow-md transition-colors">
            Login
          </Link>
          <Link href="/signup" className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Banner Section - HEIGHT REDUCED HERE */}
        <section className="relative flex items-center justify-center min-h-[65vh] px-6 py-24 overflow-hidden">
          
          {/* Background Banner Image */}
          <Image 
            src="/image.png" 
            alt="Traveloop Destination" 
            fill
            className="object-cover object-center"
            priority
          />
          
          {/* Dark Gradient Overlay (Text clear padhne ke liye) */}
          <div className="absolute inset-0 bg-slate-900/50 bg-gradient-to-b from-slate-900/30 via-slate-900/40 to-slate-900/80"></div>

          {/* Banner Content (Text Over Image) */}
          <div className="relative z-10 text-center max-w-4xl mx-auto mt-8">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1] drop-shadow-lg">
              Personalized Travel <br /> Planning <span className="text-blue-400">Made Easy</span>
            </h1>
            <p className="max-w-2xl mx-auto mt-6 text-lg sm:text-xl leading-relaxed text-slate-200 drop-shadow-md">
              Dream, design, and organize your trips with our intelligent platform. 
              Transform the way you experience travel through structured itineraries and smart budgeting.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <Link href="/planner/new" className="flex items-center justify-center w-full sm:w-auto gap-2 px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 shadow-lg shadow-blue-900/50 transition-all duration-300">
                Plan New Trip <ArrowRight className="w-5 h-5" />
              </Link>
              {/* Glassmorphism secondary button */}
              <Link href="/trips" className="flex items-center justify-center w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/40 transition-all duration-300">
                View My Trips
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid Section (Clean UI ke liye white background) */}
        <section className="px-6 py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Everything you need for the perfect trip
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Powerful tools designed to take the stress out of planning so you can focus on making memories.
              </p>
            </div>

            {/* 6 Grid Items */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="p-8 bg-white border border-slate-100 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-center w-14 h-14 mb-6 bg-blue-50 rounded-2xl">
                  <Map className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Multi-City Itineraries</h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  Create customized multi-city plans with ease. Add destinations, configure stops, and manage durations seamlessly.
                </p>
              </div>

              <div className="p-8 bg-white border border-slate-100 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-center w-14 h-14 mb-6 bg-indigo-50 rounded-2xl">
                  <Calendar className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Visual Timelines</h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  Review your full plan in a structured format with grouped city headers, daily breakdowns, and activity blocks.
                </p>
              </div>

              <div className="p-8 bg-white border border-slate-100 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-center w-14 h-14 mb-6 bg-emerald-50 rounded-2xl">
                  <DollarSign className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Smart Budgeting</h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  Estimate trip budgets automatically and get detailed cost breakdowns for flights, hotels, and local expenses.
                </p>
              </div>

              <div className="p-8 bg-white border border-slate-100 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-center w-14 h-14 mb-6 bg-purple-50 rounded-2xl">
                  <Users className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Collaborative Planning</h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  Invite friends and family to your trip board. Vote on activities, split expenses, and plan together in real-time.
                </p>
              </div>

              <div className="p-8 bg-white border border-slate-100 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-center w-14 h-14 mb-6 bg-orange-50 rounded-2xl">
                  <Compass className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Smart Recommendations</h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  Discover hidden gems, top-rated restaurants, and must-visit attractions tailored to your personal preferences.
                </p>
              </div>

              <div className="p-8 bg-white border border-slate-100 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-center w-14 h-14 mb-6 bg-rose-50 rounded-2xl">
                  <ShieldCheck className="w-7 h-7 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Secure Document Storage</h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  Keep all your flight tickets, hotel bookings, and travel insurance documents safely in one accessible vault.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5" />
            <span className="font-semibold text-slate-700">Traveloop</span>
          </div>
          <div className="text-sm">
            © {new Date().getFullYear()} Traveloop. Designed for collaborative and intelligent travel.
          </div>
        </div>
      </footer>
    </div>
  );
}