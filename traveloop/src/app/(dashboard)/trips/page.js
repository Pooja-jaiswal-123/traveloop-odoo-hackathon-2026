"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore"; // ✅ Sahi path: useAuthStore
import Link from "next/link";
import { Calendar, Plus, Loader2, ArrowRight, Plane } from "lucide-react";

export default function MyTripsPage() { // ✅ Ensure default export
  const { user } = useAuthStore();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrips() {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setTrips(data);
      setLoading(false);
    }
    fetchTrips();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Journeys</h1>
          <p className="text-slate-500 mt-1">Explore and manage your planned adventures.</p>
        </div>
        <Link 
          href="/planner/new" 
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold"
        >
          <Plus className="w-5 h-5" /> New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <Plane className="mx-auto w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold">No trips found</h3>
          <Link href="/planner/new" className="text-blue-600 font-bold hover:underline">
            Create your first trip now →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Link 
              href={`/planner/${trip.id}`} 
              key={trip.id}
              className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-300 transition-all"
            >
              <h3 className="text-xl font-bold group-hover:text-blue-600">{trip.name}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                <Calendar className="w-4 h-4" />
                <span>{trip.start_date}</span>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">View Details</span>
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}