import { create } from 'zustand';
import api from '../lib/axios';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/login', { email, password });

      if (res.data.status === 'SUCCESS') {
        set({
          user: res.data.data,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      }

      set({
        isLoading: false,
        error: res.data.message || 'Login failed.',
      });
      return false;
    } catch (err) {
      set({
        isLoading: false,
        error:
          err.response?.data?.message ||
          'Something went wrong. Please try again.',
      });
      return false;
    }
  },

  // Centralized Async Logout Action
  logout: async () => {
    set({ isLoading: true });
    try {
      // Hits http://localhost:8080/api/v1/logout via your base Axios configuration
      await api.post('/logout');
    } catch (err) {
      console.error("Backend session cleanup failed:", err);
    } finally {
      // Always wipe local credentials and reset state, even if network request fails
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null 
      });
    }
  },

  clearError: () => set({ error: null }),
}));