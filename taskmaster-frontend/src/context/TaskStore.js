// context/taskStore.js
import { create } from "zustand";
import { useReportStore } from "./ReportStore.js";
import { useAuthStore } from "./AuthStore.js";
import gateWayApi from "../lib/gateway";

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
      const response = await gateWayApi.get("/getOpenTasks");
      set({ tasks: response.data?.data || [], isLoading: false });
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      set({ tasks: [], isLoading: false });
    }
  },

  fetchMyTasks: async () => {
    set({ isLoadingMyTasks: true });
    try {
      const response = await gateWayApi.get("/getAuthenticatedUserTask");
      set({ myTasks: response.data?.data || [], isLoadingMyTasks: false });
    } catch (error) {
      console.error("Failed to fetch my tasks:", error);
      set({ myTasks: [], isLoadingMyTasks: false });
    }
  },

  fetchTaskById: async (id) => {
    try {
      const response = await gateWayApi.get(`/getTaskById/${id}`);
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  },

  addLocalReport: async (description) => {
    let { user } = useAuthStore.getState();
    if (!user) {
      user = await useAuthStore.getState().fetchCurrentUser();
    }
    const { addReport } = useReportStore.getState();
    addReport({
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      description,
      performedBy: user,
      createdAt: new Date().toString(),
    });
  },

  updateStatus: async (id, status) => {
    try {
      const response = await gateWayApi.put(`/updateTask/${id}`, {
        status
      });
      await get().addLocalReport(`UPDATED STATUS TO: ${status}`);
      return response.data.data;
    } catch (error) {
      console.log(error.message);
    }
  },

  createTask: async ({ taskName, assignee, description, project, status, priority }) => {
    set({ isCreating: true, error: null });
    try {
      const res = await gateWayApi.post("/createTask", {
        taskName,
        assignee,
        description,
        project,
        status,
        priority
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
      const response = await gateWayApi.get("/getOpenTasks");
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
      const response = await gateWayApi.put(`/updateTaskDetail/${id}`, {
        assignee: task.assignee || null,
        description: task.description || null,
        priority: task.priority || null
      });

      if (task.description) {
        await get().addLocalReport(`UPDATED DESCRIPTION TO: ${task.description}`);
      }
      if (task.assignee) {
        await get().addLocalReport(`UPDATED ASSIGNEE TO: ${task.assignee}`);
      }

      if (task.priority) {
        await get().addLocalReport(`UPDATED PRIORITY TO: ${task.priority}`);
      }

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