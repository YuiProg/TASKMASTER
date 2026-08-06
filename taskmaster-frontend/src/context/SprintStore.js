import { create } from 'zustand';
import gateWayApi from '../lib/gateway';

const parseErrorMessage = (err, fallbackMessage) => {
  const rawMessage = err.response?.data?.message || err.message;

  if (!rawMessage) return fallbackMessage;


  if (typeof rawMessage === 'string' && rawMessage.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(rawMessage);
      if (parsed.message) {
        return parsed.message;
      }
    } catch {
      return null;
    }
  }

  return typeof rawMessage === 'string' ? rawMessage : fallbackMessage;
};

export const useSprintStore = create((set) => ({
  sprints: [],
  isLoading: false,
  isCreating: false,
  error: null,

  fetchSprints: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await gateWayApi.get('/getSprints');
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      set({ sprints: list, isLoading: false });
    } catch (err) {
      const errorMessage = parseErrorMessage(err, 'Could not load sprints.');
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  getSprintById: async (sprintId) => {
    if (!sprintId) {
      return { success: false, error: 'Sprint ID is required.' };
    }

    set({ isLoading: true, error: null });
    try {
      const res = await gateWayApi.get(`/getSprintById/${sprintId}`);
      const sprintData = res.data?.data || null;

      if (sprintData) {
        // Cache/update sprint in local state list if found
        set((state) => {
          const exists = state.sprints.some(
            (s) => s.id === sprintId || s._id === sprintId
          );
          const updatedSprints = exists
            ? state.sprints.map((s) =>
                s.id === sprintId || s._id === sprintId ? sprintData : s
              )
            : [...state.sprints, sprintData];

          return { sprints: updatedSprints, isLoading: false };
        });
      } else {
        set({ isLoading: false });
      }

      return { success: true, data: sprintData };
    } catch (err) {
      const errorMessage = parseErrorMessage(err, 'Could not load sprint details.');
      set({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  createSprint: async ({ sprintName, projectId, taskIds = [], deadline }) => {
    set({ isCreating: true, error: null });
    try {
      // Convert deadline to Epoch timestamp (ms) if provided as Date or ISO String
      const epochDeadline = deadline ? new Date(deadline).getTime() : null;

      const payload = {
        sprintName,
        projectId,
        taskIds,
        deadline: epochDeadline,
      };

      const res = await gateWayApi.post('/createSprint', payload);
      const newSprint = res.data?.data;

      if (newSprint) {
        set((state) => ({
          sprints: [newSprint, ...state.sprints],
          isCreating: false,
        }));
      } else {
        set({ isCreating: false });
      }

      return { success: true, data: newSprint };
    } catch (err) {
      const errorMessage = parseErrorMessage(err, 'Failed to create sprint.');

      set({
        isCreating: false,
        error: errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  },

  clearError: () => set({ error: null }),
}));