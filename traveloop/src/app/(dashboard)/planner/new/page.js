"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { Map, ArrowRight, Loader2 } from "lucide-react";

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
      // Ab hum user ko uski Trip ID ke saath Builder page par bhej rahe hain
      router.push(`/planner/${data[0].id}`);
    } else {
      alert(error?.message || "Failed to create trip");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-20 p-10 bg-white rounded-3xl border border-slate-100 shadow-xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Create New Trip</h1>
      <p className="text-slate-500 mb-8">What should we call your next adventure?</p>

      <form onSubmit={handleCreate} className="space-y-4">
        <input
          type="text"
          required
          placeholder="e.g. Summer in Tokyo"
          className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <>Start Planning <ArrowRight className="w-5 h-5" /></>}
        </button>
      </form>
    </div>
  );
}