import { create } from 'zustand';
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

  createProject: async (projectName, description, emails = [], priorities) => {
    set({ isCreating: true, error: null });
    try {
      const prio = priorities.map(p => p.toUpperCase());
      const res = await gateWayApi.post('/addProject', { projectName, description, emails, priorities: prio });
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
      set({ selectedProject: projectData });

      const tasks = await get().getProjectTasks(projectId);

      return { project: projectData, tasks };
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Something went wrong. Please try again.',
      });
    }
  },

  // PUT /addProjectMembers/{projectId}
  // Body sent: { "emails": ["email1@gmail.com", "email2@gmail.com"] }
  addProjectMembers: async (projectId, emails) => {
    set({ error: null });
    try {
      const res = await gateWayApi.put(`/addProjectMembers/${projectId}`, { emails });

      if (String(res.data.status).toUpperCase() === 'SUCCESS') {
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
      set({ isLoading: true });
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

  getProjectById: async (projectId) => {
    try {
      const res = await gateWayApi.get(`/getProjectById/${projectId}`);
      const projectData = res.data?.data;

      if (projectData) {
        set({ selectedProject: projectData });
        const tasks = await get().getProjectTasks(projectId);
        return { project: projectData, tasks };
      }
      
      return { project: null, tasks: [] };
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Something went wrong fetching the project by ID.',
      });
      return { project: null, tasks: [] };
    }
  },

  clearError: () => set({ error: null }),
}));