// context/taskStore.js
import { create } from "zustand";
import api from "../lib/axios"; // TODO: confirm this matches projectStore's import
import { useReportStore } from "./reportStore";
import { useAuthStore } from "./authStore";
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
      const response = await gateWayApi.get(`/getTaskById/${id}`);
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  },

  // Shared by updateStatus/updateTask: grabs the current user (rehydrating
  // via /getAuthUser if authStore's `user` is null — a fresh session/
  // refresh can leave it null with no rehydration otherwise), then
  // appends a report entry locally instead of hitting the network again.
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
      await api.put(`/updateTask/${id}`, {
        status
      });

      await get().addLocalReport(`UPDATED STATUS TO: ${status}`);
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

  // PUT /updateTaskDetail/{id}  { assignee, description }
  // Adds one report entry per field that was actually provided —
  // "UPDATED DESCRIPTION TO: ..." and/or "UPDATED ASSIGNEE TO: ..." —
  // matching the same naming convention as updateStatus's report.
  updateTask: async (task, id) => {
    try {
      const response = await api.put(`/updateTaskDetail/${id}`, {
        assignee: task.assignee || null,
        description: task.description || null
      });

      if (task.description) {
        await get().addLocalReport(`UPDATED DESCRIPTION TO: ${task.description}`);
      }
      if (task.assignee) {
        await get().addLocalReport(`UPDATED ASSIGNEE TO: ${task.assignee}`);
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