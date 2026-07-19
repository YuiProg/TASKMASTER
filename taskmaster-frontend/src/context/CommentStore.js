import { create } from 'zustand'
import commentsApi from '../lib/commentAxios';


export const useCommentStore = create((set) => ({
    comments: [],
    isLoading: false,
    error: null,
    loadButton: false,

    getComments: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await commentsApi.get(`/getTaskComments/${id}`);
            const list = Array.isArray(response.data?.data) ? response.data.data.reverse() : [];
            set({ comments: list, isLoading: false });
            return list;
        } catch (error) {
            console.log(error.message);
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Could not load comments.',
            });
            return [];
        }
    },

    postComment: async (comment, taskId) => {
        set({loadButton: true});
        try {
            const response = await commentsApi.post("/newComment", {
                comment,
                taskId
            });
            const newCommentData = response?.data?.data; 
            
            if (newCommentData) {
                set((state) => ({
                    comments: [newCommentData, ...state.comments]
                }));
            }
        } catch (error) {
            console.log(error.messagge);
        } finally {
            set({loadButton: false});
        }
    }
}));