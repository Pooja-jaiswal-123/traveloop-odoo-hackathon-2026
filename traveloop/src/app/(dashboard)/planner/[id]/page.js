"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase/client";
import ActivityModal from "@/components/planner/ActivityModal"; 
import { generateTripPDF } from "@/lib/utils/exportPDF"; // ✅ PDF Utility import
import { 
  MapPin, 
  Plus, 
  Calendar, 
  Clock, 
  Trash2, 
  ChevronRight, 
  Loader2,
  Tent,
  Sparkles // ✅ AI Icon
} from "lucide-react";

export default function TripPlannerPage({ params }) {
  const { id: tripId } = use(params);
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingStop, setAddingStop] = useState(false);
  const [newCity, setNewCity] = useState("");
  const [aiLoading, setAiLoading] = useState(false); // ✅ AI Loading state
  
  const [activeStopId, setActiveStopId] = useState(null);

  useEffect(() => {
    fetchTripData();
  }, [tripId]);

  const fetchTripData = async () => {
    setLoading(true);
    const { data: tripData } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();
    
    setTrip(tripData);

    const { data: stopsData } = await supabase
      .from('stops')
      .select('*, activities(*)')
      .eq('trip_id', tripId)
      .order('order_index', { ascending: true });

    setStops(stopsData || []);
    setLoading(false);
  };

  // ✅ AI Logic: Backend se data lekar Supabase mein save karna
  const generateAIActivities = async (cityName, stopId) => {
    setAiLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8080/suggest?city=${cityName}`);
      const data = await res.json();
      
      if (data.activities && data.activities.length > 0) {
        for (const act of data.activities) {
          const [name, desc, cost] = act.split('|').map(s => s.trim());
          const cleanCost = parseFloat(cost?.replace(/[^0-9.]/g, '')) || 0;

          await supabase.from('activities').insert([{
            stop_id: stopId,
            name: name || "AI Suggestion",
            description: desc || "Recommended by Traveloop",
            cost: cleanCost
          }]);
        }
        fetchTripData(); // Update the UI
      }
    } catch (err) {
      console.error("AI Fetch Error:", err);
      alert("Backend (Port 8080) connect nahi ho raha!");
    } finally {
      setAiLoading(false);
    }
  };

  const totalActivities = stops.reduce((acc, stop) => acc + (stop.activities?.length || 0), 0);
  const totalBudget = stops.reduce((acc, stop) => {
    const stopCost = stop.activities?.reduce((sum, act) => sum + (Number(act.cost) || 0), 0) || 0;
    return acc + stopCost;
  }, 0);

  const addStop = async () => {
    if (!newCity) return;
    const { error } = await supabase
      .from('stops')
      .insert([{ trip_id: tripId, city_name: newCity, order_index: stops.length }]);

    if (!error) {
      setNewCity("");
      setAddingStop(false);
      fetchTripData();
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* Trip Header */}
      <div className="mb-10 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 text-blue-600 mb-2">
          <Calendar className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-wider">
            {trip?.start_date} — {trip?.end_date}
          </span>
        </div>
        <h1 className="text-4xl font-black text-slate-900">{trip?.name}</h1>
        <p className="text-slate-500 mt-2">{trip?.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Your Route</h2>
            <button 
              onClick={() => setAddingStop(true)}
              className="flex items-center gap-2 text-sm font-bold bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-all"
            >
              <Plus className="w-4 h-4" /> Add City
            </button>
          </div>

          {addingStop && (
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4 animate-in slide-in-from-top-2 duration-200">
              <input 
                type="text" 
                placeholder="Where to? (e.g. Paris)"
                className="flex-1 px-4 py-2 rounded-lg border border-blue-200 outline-none"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
              />
              <button onClick={addStop} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Add</button>
              <button onClick={() => setAddingStop(false)} className="text-slate-500 font-bold hover:text-slate-700">Cancel</button>
            </div>
          )}

          <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
            {stops.map((stop, index) => (
              <div key={stop.id} className="relative pl-14">
                <div className="absolute left-4 top-1 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-sm z-10"></div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        {stop.city_name} <ChevronRight className="w-4 h-4 text-slate-300" />
                      </h3>
                      <span className="text-sm text-slate-500">Stop #{index + 1}</span>
                    </div>
                    <button className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 mt-6">
                    {/* ✅ AI Suggestion Button */}
                    <button 
                      onClick={() => generateAIActivities(stop.city_name, stop.id)}
                      disabled={aiLoading}
                      className="w-full mb-3 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold border border-indigo-100 hover:bg-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      Generate AI Activities
                    </button>

                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Activities</p>
                    {stop.activities?.map(act => (
                      <div key={act.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group">
                        <div className="flex items-center gap-3">
                          <Tent className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-slate-700">{act.name}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                          ${act.cost}
                        </span>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => setActiveStopId(stop.id)}
                      className="w-full py-3 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 text-sm hover:bg-slate-50 hover:border-blue-200 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Activity
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl sticky top-8">
            <h3 className="text-lg font-bold mb-4">Trip Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Stops</span>
                <span className="font-bold">{stops.length} Cities</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Activities</span>
                <span className="font-bold">{totalActivities} Items</span>
              </div>
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Est. Budget</span>
                <span className="text-xl font-bold text-blue-400">${totalBudget.toFixed(2)}</span>
              </div>
            </div>
            {/* ✅ PDF Download Trigger */}
            <button 
              onClick={() => generateTripPDF(trip, stops)}
              disabled={stops.length === 0}
              className="w-full mt-8 bg-blue-600 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <ActivityModal 
        stopId={activeStopId} 
        isOpen={!!activeStopId} 
        onClose={() => setActiveStopId(null)} 
        onRefresh={fetchTripData} 
      />
    </div>
  );
}