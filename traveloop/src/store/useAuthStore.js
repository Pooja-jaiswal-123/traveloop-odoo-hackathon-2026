import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  isLoading: true,

  // User and Session update 
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  
  // Loading state toggle
  setLoading: (bool) => set({ isLoading: bool }),

  // Logout logic 
  clearAuth: () => set({ user: null, session: null, isLoading: false }),
}));