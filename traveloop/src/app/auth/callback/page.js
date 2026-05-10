"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
        <p className="text-slate-500 font-medium">Setting up your workspace...</p>
      </div>
    </div>
  );
}