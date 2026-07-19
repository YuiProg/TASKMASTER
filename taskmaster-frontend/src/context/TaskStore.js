// context/taskStore.js
import { create } from "zustand";
import api from "../lib/axios"; // TODO: confirm this matches projectStore's import

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
    } catch (error) {
      console.log(error.message);
    }
  }
}));