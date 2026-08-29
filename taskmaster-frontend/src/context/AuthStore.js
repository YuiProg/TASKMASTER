import { create } from 'zustand';
import gateWayApi from '../lib/gateway';
import navigateTo from '../lib/navigate.js';

const extractErrorMessage = (rawError, fallbackMessage = 'Something went wrong. Please try again.') => {
  if (!rawError) return fallbackMessage;

  const input = typeof rawError === 'object' ? rawError.message || rawError : rawError;

  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      if (parsed && parsed.message) {
        return parsed.message;
      }
    } catch {
      return input;
    }
  }

  return fallbackMessage;
};

// Helper function to handle server-level crashes (5xx errors)
const handleServerError = (err) => {
  const status = err.response?.status;
  if (!status || status >= 404 || status >= 500) {
    navigateTo('/error'); // Navigate to the SCSS 500 Server Error page
  }
};

export const useAuthStore = create((set, get) => ({
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
        error: extractErrorMessage(res.data?.message, 'Login failed.'),
      });
      return false;
    } catch (err) {
      const rawError = err.response?.data?.message || err.response?.data;
      const parsedMessage = extractErrorMessage(rawError, 'Something went wrong. Please try again.');

      set({
        isLoading: false,
        error: parsedMessage,
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
        error: extractErrorMessage(res.data?.message, 'Registration failed.'),
      });
      return false;

    } catch (err) {
      handleServerError(err);
      const rawError = err.response?.data?.message || err.response?.data;
      const parsedMessage = extractErrorMessage(rawError, 'Something went wrong. Please try again.');

      set({
        isLoading: false,
        error: parsedMessage,
      });
      return false;
    }
  },

  updateUser: async (base64Image) => {
    const currentUser = get().user;
    const userId = currentUser?._id || currentUser?.id;

    if (!userId) {
      set({ error: 'User ID is missing.' });
      return false;
    }

    set({ isLoading: true, error: null });

    try {
      const res = await gateWayApi.put(`/updateUser/${userId}`, {
        image: base64Image,
      });

      if (res.data.status === 'SUCCESS' || res.status === 200) {
        const updatedUser = res.data.data || { ...currentUser, image: base64Image, avatarUrl: base64Image };

        set({
          user: updatedUser,
          isLoading: false,
          error: null,
        });

        return true;
      }

      set({
        isLoading: false,
        error: extractErrorMessage(res.data?.message, 'Failed to update user.'),
      });
      return false;
    } catch (err) {
      handleServerError(err);
      const rawError = err.response?.data?.message || err.response?.data;
      const parsedMessage = extractErrorMessage(rawError, 'Failed to update profile picture.');

      set({
        isLoading: false,
        error: parsedMessage,
      });
      return false;
    } finally {
      get().fetchCurrentUser();
    }
  },

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
        error: extractErrorMessage(res.data?.message, 'Failed to send reset code.'),
      });
      return false;
    } catch (err) {
      handleServerError(err);
      const rawError = err.response?.data?.message || err.response?.data;

      set({
        isLoading: false,
        error: extractErrorMessage(rawError, 'Something went wrong. Please try again.'),
      });
      return false;
    }
  },

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
        error: extractErrorMessage(res.data?.message, 'Invalid or expired code.'),
      });
      return false;
    } catch (err) {
      handleServerError(err);
      const rawError = err.response?.data?.message || err.response?.data;

      set({
        isLoading: false,
        error: extractErrorMessage(rawError, 'Invalid verification code.'),
      });
      return false;
    }
  },

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
        error: extractErrorMessage(res.data?.message, 'Failed to reset password.'),
      });
      return false;
    } catch (err) {
      handleServerError(err);
      const rawError = err.response?.data?.message || err.response?.data;

      set({
        isLoading: false,
        error: extractErrorMessage(rawError, 'Something went wrong. Please try again.'),
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
      handleServerError(err);
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