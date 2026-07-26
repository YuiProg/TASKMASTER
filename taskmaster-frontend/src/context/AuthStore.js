import { create } from 'zustand';
import api from '../lib/axios';
import gateWayApi from '../lib/gateway';

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

  // Rehydrates `user` from the session cookie/JWT via the existing
  // /getAuthUser endpoint. Call this once on app load (and anywhere else
  // that needs `user` but might be running in a fresh session) so a page
  // refresh or direct navigation doesn't leave `user` stuck at null even
  // though the person is still authenticated server-side.
  fetchCurrentUser: async () => {
    try {
      const res = await gateWayApi.get('/getAuthUser');
      if (res.data.status === 'SUCCESS' && res.data.data) {
        set({ user: res.data.data, isAuthenticated: true });
        return res.data.data;
      }
      return null;
    } catch (err) {
      // Not logged in / session expired — leave user as null rather than
      // throwing, since callers should treat this as "no user available."
      console.log(err.message);
      return null;
    }
  },

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