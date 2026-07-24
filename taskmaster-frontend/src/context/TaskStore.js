// context/taskStore.js
import { create } from "zustand";
import api from "../lib/axios"; // TODO: confirm this matches projectStore's import
import { useReportStore } from "./reportStore";
import { useAuthStore } from "./authStore";

export const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: false,
  myTasks: [],
  isLoadingMyTasks: false,
  isCreating: false,
  error: null,
  openTasks: [],

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
  },

  // POST /createTask  { taskName, assignee, description, project, status }
  // `assignee` and `project` are sent as plain strings (email / project
  // name) per the sample payload — adjust if the backend actually expects
  // ids for either of those instead.
  createTask: async ({ taskName, assignee, description, project, status }) => {
    set({ isCreating: true, error: null });
    try {
      const res = await api.post("/createTask", {
        taskName,
        assignee,
        description,
        project,
        status,
      });

      if (String(res.data.status).toUpperCase() === "SUCCESS") {
        const newTask = res.data.data;
        set({
          tasks: [newTask, ...get().tasks],
          isCreating: false,
        });
        return newTask;
      }

      set({
        isCreating: false,
        error: res.data.message || "Could not create task.",
      });
      return null;
    } catch (error) {
      console.log(error.message);
      set({
        isCreating: false,
        error:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
      return null;
    }
  },

  fetchOpenTask: async () => {
    try {
      set({ isLoadingMyTasks: true });
      const response = await api.get("/getOpenTasks");
      set({ openTasks: response.data?.data || [], isLoadingMyTasks: false });
    } catch (error) {
      console.log(error.message);
      set({
        isCreating: false,
        error:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
      return null;
    }
  },

  updateTask: async (task, id) => {
    try {
      const response = await api.put(`/updateTaskDetail/${id}`,{
        assignee: task.assignee || null,
        description: task.description || null
      });
      return response.data.data;
    } catch (error) {
      console.log(error.message);
      set({
        isCreating: false,
        error:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
      return null;
    }
  }
}));