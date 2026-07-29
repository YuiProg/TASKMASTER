import { create } from 'zustand'
import gateWayApi from '../lib/gateway';

export const useReportStore = create((set) => ({
    reports: [],
    isLoading: false,
    error: null,

    getReports: async (taskId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await gateWayApi.get(`/report/getReports/${taskId}`);
            const list = Array.isArray(response.data?.data) ? response.data.data : [];
            set({ reports: list.reverse(), isLoading: false });
            return list;
        } catch (error) {
            console.log(error.message);
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Could not load reports.',
            });
            return [];
        }
    },

    // Appends a report entry directly to local state instead of
    // re-fetching from the server. The sample response comes back
    // oldest-first, so new entries go at the end to match that order.
    addReport: (report) =>
        set((state) => ({ reports: [report, ...state.reports] })),
}));