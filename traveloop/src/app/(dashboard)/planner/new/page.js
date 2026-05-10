"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { ArrowRight, Loader2, PlaneTakeoff } from "lucide-react";
import Image from "next/image";

export default function CreateTripForm() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login first");
    setLoading(true);

    const { data, error } = await supabase
      .from('trips')
      .insert([{ 
        name, 
        user_id: user.id, 
        start_date: new Date().toISOString().split('T')[0] 
      }])
      .select();

    if (!error && data) {
      router.push(`/planner/${data[0].id}`);
    } else {
      alert(error?.message || "Failed to create trip");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-5xl w-full bg-white rounded-[2rem] overflow-hidden shadow-2xl grid md:grid-cols-2">
        
        {/* Left Side: Form Section */}
        <div className="p-10 md:p-16 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-4 text-sm uppercase tracking-wider">
            <PlaneTakeoff className="w-5 h-5" />
            Plan your journey
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
            Create New Trip
          </h1>
          <p className="text-slate-500 mb-10 text-lg">
            What should we call your next adventure? Give it a name to get started.
          </p>

          <form onSubmit={handleCreate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Trip Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Summer in Tokyo"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-blue-200"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Start Planning <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Image Section */}
        <div className="relative hidden md:block bg-slate-100">
          <img
            src="/image1.png" 
            alt="Travel Adventure"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay Gradient for better look */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-10 left-10 text-white">
            <p className="text-xl font-medium opacity-90">"Adventure is worthwhile."</p>
            <p className="text-sm opacity-75">— Aesop</p>
          </div>
        </div>

      </div>
    </div>
  );
}