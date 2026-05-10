"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase/client";
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  LogOut, 
  ExternalLink,
  Cpu,
  Palette
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  const sections = [
    {
      title: "Profile Information",
      icon: <User className="w-5 h-5 text-blue-600" />,
      items: [
        { label: "Email Address", value: user?.email, sub: "Primary email for notifications" },
        { label: "Account ID", value: user?.id?.slice(0, 12) + "...", sub: "Unique identifier for your account" }
      ]
    },
    {
      title: "AI Preferences",
      icon: <Cpu className="w-5 h-5 text-purple-600" />,
      items: [
        { label: "Current Model", value: "Llama 3.1 (Groq API)", sub: "Super-fast agentic orchestration" },
        { label: "Response Mode", value: "Streaming", sub: "ChatGPT-style real-time typing" }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-10 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">Settings</h1>
        <p className="text-slate-500 font-medium">Manage your account preferences and AI configurations.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Sections Loop */}
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3">
              {section.icon}
              <h3 className="font-bold text-slate-800">{section.title}</h3>
            </div>
            <div className="p-8 space-y-6">
              {section.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center group">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-400 font-medium">{item.sub}</p>
                  </div>
                  <span className="text-sm font-mono bg-slate-50 px-3 py-1 rounded-lg text-slate-600 border border-slate-100">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Security & System */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800">Account Security</h3>
          </div>
          <div className="p-8">
             <button className="flex items-center gap-3 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
               Change Password <ExternalLink size={14} />
             </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="pt-4">
          <button 
            onClick={handleLogout}
            className="w-full md:w-auto px-8 py-4 bg-red-50 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-all active:scale-95 border border-red-100"
          >
            <LogOut size={18} /> Logout from Traveloop
          </button>
        </div>

      </div>

      {/* Footer Info */}
      <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
        Traveloop v1.0.4 • Powered by Groq & Llama 3.1
      </p>
    </div>
  );
}