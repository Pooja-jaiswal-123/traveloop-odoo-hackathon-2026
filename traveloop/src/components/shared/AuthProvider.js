"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthProvider({ children }) {
  const setUser = useAuthStore((state) => state.setUser);
  const setSession = useAuthStore((state) => state.setSession);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    // 1. Check current session on mount
    const initializeAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session) {
        setSession(session);
        setUser(session.user);
      }
      setLoading(false);
    };

    initializeAuth();

    // 2. Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        setUser(session.user);
      } else {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, setUser, setLoading]);

  return <>{children}</>;
}