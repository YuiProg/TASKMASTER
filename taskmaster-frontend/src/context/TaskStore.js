// context/taskStore.js
import { create } from "zustand";
import api from "../lib/axios"; // TODO: confirm this matches projectStore's import
import { useReportStore } from "./reportStore";
import { useAuthStore } from "./authStore";

export const useTaskStore = create((set) => ({
  tasks: [],
  isLoading: false,
  myTasks: [],
  isLoadingMyTasks: false,

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/getOpenTasks");
      set({ tasks: response.data?.data || [], isLoading: false });
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      set({ tasks: [], isLoading: false });
    }
  },

  fetchMyTasks: async () => {
    set({ isLoadingMyTasks: true });
    try {
      const response = await api.get("/getAuthenticatedUserTask");
      set({ myTasks: response.data?.data || [], isLoadingMyTasks: false });
    } catch (error) {
      console.error("Failed to fetch my tasks:", error);
      set({ myTasks: [], isLoadingMyTasks: false });
    }
  },

  fetchTaskById: async (id) => {
    try {
      const response = await api.get(`getTaskById/${id}`);
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  },

  updateStatus: async (id, status) => {
    try {
      await api.put(`/updateTask/${id}`, {
        status
      });

      // Build the report entry locally instead of hitting the network
      // again — it won't have a real backend id until the next actual
      // refresh, but it renders identically in the meantime.
      let { user } = useAuthStore.getState();
      if (!user) {
        // authStore only populates `user` during login() with no
        // rehydration on page load, so a fresh session/refresh can leave
        // it null even though we're still authenticated server-side.
        user = await useAuthStore.getState().fetchCurrentUser();
      }
      const { addReport } = useReportStore.getState();
      addReport({
        id: `local-${Date.now()}`,
        description: `UPDATED STATUS TO: ${status}`,
        performedBy: user,
        createdAt: new Date().toString(),
      });
    } catch (error) {
      console.log(error.message);
    }
  }
}));