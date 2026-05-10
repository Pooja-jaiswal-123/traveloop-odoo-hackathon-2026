"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  PlusCircle, 
  Settings, 
  LogOut, 
  Plane 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearAuth();
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Trips", href: "/trips", icon: MapIcon },
    { name: "Plan New Trip", href: "/planner/new", icon: PlusCircle },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-2 border-b border-slate-50">
          <Plane className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold text-slate-900 tracking-tight">Traveloop</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive 
                    ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}