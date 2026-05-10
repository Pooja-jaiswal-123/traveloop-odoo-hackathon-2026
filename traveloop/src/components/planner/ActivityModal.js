"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { X, DollarSign, LayoutGrid, Loader2 } from "lucide-react";

export default function ActivityModal({ stopId, isOpen, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "Sightseeing",
    cost: 0, 
    description: ""
  });

  const categories = ["Sightseeing", "Food", "Adventure", "Transport", "Relaxation"];

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Final check to ensure cost is a valid number before DB insert
    const submissionData = {
      ...formData,
      stop_id: stopId,
      cost: Number(formData.cost) || 0 
    };

    const { error } = await supabase
      .from("activities")
      .insert([submissionData]);

    if (!error) {
      setFormData({ name: "", category: "Sightseeing", cost: 0, description: "" });
      onRefresh();
      onClose();
    } else {
      alert("Error adding activity: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Add New Activity</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Activity Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Visit Eiffel Tower"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <div className="relative">
                  <LayoutGrid className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <select
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white outline-none appearance-none"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Cost (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    // ✅ Fix: Handled NaN/Empty input display
                    value={isNaN(formData.cost) || formData.cost === "" ? "" : formData.cost}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ 
                        ...formData, 
                        cost: val === "" ? "" : parseFloat(val) 
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Save Activity"}
          </button>
        </form>
      </div>
    </div>
  );
}