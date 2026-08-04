import { create } from 'zustand';
import api from '../lib/axios';
import gateWayApi from '../lib/gateway';

export const useProjectStore = create((set, get) => ({
  projects: [],
  selectedProject: null,
  tasks: [],
  isLoading: false,
  isCreating: false,
  error: null,
  userProjects: [],
  archiveProjects: [],

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await gateWayApi.get('/getProjects');
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      set({ projects: list, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Could not load projects.',
      });
    }
  },

  createProject: async (projectName, description, emails = []) => {
    set({ isCreating: true, error: null });
    try {
      const res = await gateWayApi.post('/addProject', { projectName, description, emails });

      if (String(res.data.status).toUpperCase() === 'SUCCESS') {
        set({
          projects: [res.data.data, ...get().projects],
          isCreating: false,
        });
        return true;
      }

      set({
        isCreating: false,
        error: res.data.message || 'Could not create project.',
      });
      return false;
    } catch (err) {
      set({
        isCreating: false,
        error:
          err.response?.data?.message ||
          'Something went wrong. Please try again.',
      });
      return false;
    }
  },

  getProjectTasks: async (projectId) => {
    try {
        const res = await gateWayApi.get(`/getProjectTask/${projectId}`);
        const tasksList = res.data.data || [];
        set({ tasks: tasksList });
        return tasksList;
    } catch (err) {
        set({
          error: err.response?.data?.message || 'Something went wrong. Please try again.',
        });
        return [];
    }
  },

  getProjectByName: async (projectName) => {
    try {
        const res = await gateWayApi.get(`/getProjectByName/${projectName}`);
        const projectData = res.data.data;

        const projectId = projectData.id;
        console.log(res);
        set({ selectedProject: projectData });

        const tasks = await get().getProjectTasks(projectId);

        return { project: projectData, tasks };
    } catch (err) {
        set({
          error: err.response?.data?.message || 'Something went wrong. Please try again.',
        });
    }
  },

  // PUT /addProjectMembers/{projectId}  { emails: [...] }
  // Updates the matching project in the list with whatever the backend returns,
  // if it returns the updated project; otherwise just reports success/failure.
  addProjectMembers: async (projectId, emails) => {
    set({ error: null });
    try {
      const res = await api.put(`/addProjectMembers/${projectId}`, { emails });

      if (res.data.status === 'SUCCESS') {
        if (res.data.data) {
          set({
            projects: get().projects.map((p) =>
              p.id === projectId ? res.data.data : p
            ),
          });
        }
        return true;
      }

      set({ error: res.data.message || 'Could not add members.' });
      return false;
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          'Something went wrong adding those members.',
      });
      return false;
    }
  },

  fetchArchivedProjects: async () => {
    try {
      set({ isLoading: true });
      const res = await gateWayApi.get("/getArchiveProjects");
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      set({ archiveProjects: list, isLoading: false });
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          'Something went wrong fetching archived projects.',
      });
      set({ archiveProjects: [], isLoading: false });
      return false;
    }
  },

  fetchUserCreatedProjects: async () => {
    try {
      set({isLoading: true});
      const res = await gateWayApi.get("/getUserCreatedProjects");
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      set({ userProjects: list, isLoading: false });
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          'Something went wrong fetching projects.',
      });
      set({ userProjects: [], isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));