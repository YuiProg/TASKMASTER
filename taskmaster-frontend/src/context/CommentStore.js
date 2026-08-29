import { create } from 'zustand';
import gateWayApi from '../lib/gateway';
import navigateTo from '../lib/navigate.js';

// Helper to redirect on network failures, 403 Forbidden, or 5xx Server Errors
const handleServerError = (err) => {
  const status = err.response?.status;
  if (!status || status === 403 || status >= 500) {
    navigateTo('/error');
  }
};

export const useCommentStore = create((set) => ({
  comments: [],
  isLoading: false,
  error: null,
  loadButton: false,

  getComments: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await gateWayApi.get(`/comments/getTaskComments/${id}`);
      const list = Array.isArray(response.data?.data) ? response.data.data.reverse() : [];
      set({ comments: list, isLoading: false });
      return list;
    } catch (error) {
      handleServerError(error);
      console.log(error.message);
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Could not load comments.',
      });
      return [];
    }
  },

  postComment: async (comment, taskId, image) => {
    set({ loadButton: true });
    try {
      const response = await gateWayApi.post("/comments/newComment", {
        comment,
        taskId,
        image
      });
      const newCommentData = response?.data?.data; 
      
      if (newCommentData) {
        set((state) => ({
          comments: [newCommentData, ...state.comments]
        }));
      }
    } catch (error) {
      handleServerError(error);
      console.log(error.message);
    } finally {
      set({ loadButton: false });
    }
  }
}));