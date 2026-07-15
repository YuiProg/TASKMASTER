import { create } from 'zustand';
import api from '../lib/axios';

export const useProjectStore = create((set, get) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,
  isCreating: false,
  error: null,

  // GET /getProjects -> returns the list of projects
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/getProjects');
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      set({ projects: list, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Could not load projects.',
      });
    }
  },

  // POST /addProject  { projectName, description } -> prepend the created project to the list
  createProject: async (projectName, description) => {
    // TEMP DEBUG — remove once this is sorted
    console.log('[projectStore] createProject called with:', { projectName, description });
    set({ isCreating: true, error: null });
    try {
      const payload = { projectName, description };
      console.log('[projectStore] posting payload:', payload);
      const res = await api.post('/addProject', payload);

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

  getProjectByName: async (projectName) => {
    try {
        const res = await api.get(`/getProjectByName/${projectName}`);
        set({ selectedProject: res.data.data });
        return res.data.data;
    } catch (err) {
        set({
        isCreating: false,
        error:
          err.response?.data?.message ||
          'Something went wrong. Please try again.',
      });
    }
  },

  // PUT /addProjectMembers/{projectId}/{userId}
  // Updates the matching project in the list with whatever the backend returns,
  // if it returns the updated project; otherwise just reports success/failure.
  addProjectMember: async (projectId, userId) => {
    set({ error: null });
    try {
      const res = await api.put(`/addProjectMembers/${projectId}/${userId}`);

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

      set({ error: res.data.message || 'Could not add member.' });
      return false;
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          'Something went wrong adding that member.',
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));