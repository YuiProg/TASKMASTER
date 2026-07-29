import { create } from 'zustand';
import gateWayApi from '../lib/gateway';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await gateWayApi.post('/login', { email, password });

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


  fetchCurrentUser: async () => {
    try {
      const res = await gateWayApi.get('/getAuthUser');
      if (res.data.status === 'SUCCESS' && res.data.data) {
        set({ user: res.data.data, isAuthenticated: true });
        return res.data.data;
      }
      return null;
    } catch (err) {
      console.log(err.message);
      return null;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {

      await gateWayApi.post('/logout');
    } catch (err) {
      console.error("Backend session cleanup failed:", err);
    } finally {

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