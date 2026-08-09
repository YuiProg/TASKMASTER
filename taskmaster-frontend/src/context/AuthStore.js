import { create } from 'zustand';
import gateWayApi from '../lib/gateway';
import navigateTo from '../lib/navigate.js';

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
      const error = JSON.parse(err.response?.data?.message || '{}');
      console.log(error.message);
      set({
        isLoading: false,
        error:
          err.response?.data?.message ||
          'Something went wrong. Please try again.',
      });
      return false;
    }
  },

  register: async (username, email, password, confirmPassword) => {
    set({ isLoading: true, error: null });
    try {
      if (!username || !email || !password) {
        set({
          isLoading: false,
          error: 'Please fill in all fields.',
        });
        return false;
      }

      if (password !== confirmPassword) {
        set({
          isLoading: false,
          error: 'Passwords do not match.',
        });
        return false;
      }

      const res = await gateWayApi.post('/addUser', { username, email, password });

      if (res.data.status === 'SUCCESS') {
        set({
          user: res.data.data,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        navigateTo('/');
        return true;
      }

      set({
        isLoading: false,
        error: res.data.message || 'Registration failed.',
      });
      return false;

    } catch (err) {
      const data = JSON.parse(err.response?.data?.message || '{}');

      set({
        isLoading: false,
        error:
          data.message ||
          'Something went wrong. Please try again.',
      });
      return false;
    }
  },

  // --- Forgot Password Flow ---

  // Step 1: Request code (Pass placeholder string like "code" for path param)
  requestPasswordResetCode: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const res = await gateWayApi.post('/resetPassword/code', {
        email,
        isReset: false,
        password: '',
      });

      if (res.data.status === 'SUCCESS') {
        set({ isLoading: false });
        return true;
      }

      set({
        isLoading: false,
        error: res.data.message || 'Failed to send reset code.',
      });
      return false;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Something went wrong. Please try again.',
      });
      return false;
    }
  },

  // Step 2: Confirm Code
  verifyPasswordResetCode: async (email, code) => {
    set({ isLoading: true, error: null });
    try {
      const res = await gateWayApi.post(`/confirmResetPasswordCode/${code}`, {
        email,
        isReset: true,
        password: '',
      });

      if (res.data.status === 'SUCCESS') {
        set({ isLoading: false });
        return true;
      }

      set({
        isLoading: false,
        error: res.data.message || 'Invalid or expired code.',
      });
      return false;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Invalid verification code.',
      });
      return false;
    }
  },

  // Step 3: Final Password Reset
  resetPassword: async (email, code, newPassword, confirmPassword) => {
    set({ isLoading: true, error: null });
    try {
      if (newPassword !== confirmPassword) {
        set({
          isLoading: false,
          error: 'Passwords do not match.',
        });
        return false;
      }

      const res = await gateWayApi.post(`/resetPassword/${code}`, {
        email,
        isReset: true,
        password: newPassword,
      });

      if (res.data.status === 'SUCCESS') {
        set({ isLoading: false, error: null });
        return true;
      }

      set({
        isLoading: false,
        error: res.data.message || 'Failed to reset password.',
      });
      return false;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Something went wrong. Please try again.',
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