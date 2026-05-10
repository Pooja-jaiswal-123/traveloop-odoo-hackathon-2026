"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  Briefcase, 
  Wallet, 
  MapPin, 
  Plus, 
  ChevronRight, 
  Loader2,
  Calendar,
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalBudget: 0,
    totalCities: 0
  });
  const [recentTrips, setRecentTrips] = useState([]);

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Trips, Stops aur Activities ko single query mein fetch karna
      const { data: trips, error } = await supabase
        .from('trips')
        .select(`
          *,
          stops (
            city_name,
            activities (cost)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (trips) {
        let budget = 0;
        let cities = new Set();

        trips.forEach(trip => {
          trip.stops?.forEach(stop => {
            cities.add(stop.city_name);
            stop.activities?.forEach(act => {
              budget += Number(act.cost) || 0;
            });
          });
        });

        setStats({
          totalTrips: trips.length,
          totalBudget: budget,
          totalCities: cities.size
        });

        setRecentTrips(trips.slice(0, 2));
      }
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50/50">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-slate-500 font-medium">Ready to explore your next destination?</p>
        </div>
        <Link href="/planner/new">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95">
            <Plus className="w-5 h-5" /> Plan New Trip
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Trips</p>
            <h3 className="text-2xl font-black text-slate-900">{stats.totalTrips}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Est. Budget</p>
            <h3 className="text-2xl font-black text-slate-900">${stats.totalBudget.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="h-14 w-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Destinations</p>
            <h3 className="text-2xl font-black text-slate-900">{stats.totalCities} Cities</h3>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Recent Trips Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Trips</h2>
            <Link href="/trips" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentTrips.length > 0 ? recentTrips.map(trip => (
              <Link key={trip.id} href={`/planner/${trip.id}`}>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-blue-50">
                      <MapPin className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                    </div>
                    <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                      ${trip.stops?.reduce((acc, s) => acc + (s.activities?.reduce((sum, a) => sum + Number(a.cost), 0) || 0), 0)}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-blue-600 transition-colors capitalize">
                    {trip.name}
                  </h4>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{trip.start_date}</span>
                    <span className="mx-1">•</span>
                    <span>{trip.stops?.length || 0} Stops</span>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-2 py-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 italic">No trips planned yet. Start your journey now!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: AI Inspiration */}
        <div className="space-y-6">
           <h2 className="text-xl font-bold text-slate-900">Quick Inspiration</h2>
           <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white space-y-4 shadow-xl shadow-blue-200/50 relative overflow-hidden group">
              {/* Abstract decorative circles */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="flex items-center gap-2 text-blue-200">
                <Sparkles size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">New Feature</span>
              </div>
              
              <h3 className="text-2xl font-black leading-tight">Plan with Traveloop AI Agent</h3>
              <p className="text-blue-100 text-sm leading-relaxed font-medium">
                Ask our streaming AI to suggest destinations or create a 5-day itinerary instantly.
              </p>
              
              {/* ✅ Link updated to /chat */}
              <Link href="/chat" className="block w-full pt-2">
                <button className="w-full bg-white text-blue-700 py-4 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all shadow-lg active:scale-95">
                  Talk to AI Agent
                </button>
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}