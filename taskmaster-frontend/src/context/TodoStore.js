import { create } from 'zustand';
import gateWayApi from '../lib/gateway';

const extractErrorMessage = (rawError, fallbackMessage = 'Something went wrong. Please try again.') => {
    if (!rawError) return fallbackMessage;

    const input = typeof rawError === 'object' ? rawError.message || rawError : rawError;

    if (typeof input === 'string') {
        try {
            const parsed = JSON.parse(input);
            if (parsed && parsed.message) {
                return parsed.message;
            }
        } catch {
            return input;
        }
    }

    return fallbackMessage;
};

export const useTodoStore = create((set, get) => ({
    todos: [],
    currentTodo: null,
    isLoading: false,
    error: null,

    // Fetch all todos
    fetchTodos: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await gateWayApi.get('/getTodos');

            if (res.data?.status === 'SUCCESS') {
                set({
                    todos: res.data.data || [],
                    isLoading: false,
                    error: null,
                });
                return true;
            }

            set({
                isLoading: false,
                error: extractErrorMessage(res.data?.message, 'Failed to fetch todos.'),
            });
            return false;
        } catch (err) {
            const rawError = err.response?.data?.message || err.response?.data;
            const parsedMessage = extractErrorMessage(rawError, 'Failed to load todos. Please try again.');

            set({
                isLoading: false,
                error: parsedMessage,
            });
            return false;
        }
    },

    // Fetch single todo by ID
    fetchTodoById: async (id) => {
        set({ isLoading: true, error: null, currentTodo: null });
        try {
            const res = await gateWayApi.get(`/getTodoById/${id}`);

            if (res.data?.status === 'SUCCESS') {
                set({
                    currentTodo: res.data.data,
                    isLoading: false,
                    error: null,
                });
                return true;
            }

            set({
                isLoading: false,
                error: extractErrorMessage(res.data?.message, 'Failed to fetch todo details.'),
            });
            return false;
        } catch (err) {
            const rawError = err.response?.data?.message || err.response?.data;
            const parsedMessage = extractErrorMessage(rawError, 'Failed to load todo details.');

            set({
                isLoading: false,
                error: parsedMessage,
            });
            return false;
        }
    },

    // Toggle todo status (Sends payload: { completed: boolean })
    toggleTodoStatus: async (todoId, currentFinishedStatus) => {
        const isCurrentlyFinished = currentFinishedStatus === 1 || currentFinishedStatus === true;
        const nextFinishedNumeric = isCurrentlyFinished ? 0 : 1;
        const nextCompletedBoolean = !isCurrentlyFinished;

        const previousTodos = get().todos;

        // Optimistic UI update
        set({
            todos: previousTodos.map((todo) =>
                todo.id === todoId ? { ...todo, finished: nextFinishedNumeric } : todo
            ),
            currentTodo: get().currentTodo?.id === todoId 
                ? { ...get().currentTodo, finished: nextFinishedNumeric } 
                : get().currentTodo,
        });

        try {
            const res = await gateWayApi.put(`/updateTodo/${todoId}`, {
                completed: nextCompletedBoolean,
            });

            if (res.data?.status !== 'SUCCESS') {
                set({ todos: previousTodos });
            }
        } catch (err) {
            set({ todos: previousTodos });
            console.error('Error updating todo status:', err);
        }
    },

    // Delete a todo (Optimistic update)
    deleteTodo: async (todoId) => {
        const previousTodos = get().todos;

        set({
            todos: previousTodos.filter((todo) => todo.id !== todoId),
        });

        try {
            const res = await gateWayApi.delete(`/deleteTodo/${todoId}`);

            if (res.data?.status !== 'SUCCESS') {
                set({ todos: previousTodos });
            }
        } catch (err) {
            set({ todos: previousTodos });
            console.error('Error deleting todo:', err);
        }
    },

    // Add a new todo
    addTodo: async (todoData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await gateWayApi.post('/createTodo', {
                todoName: todoData.todoName,
                deadline: todoData.deadline,
            });

            if (res.data?.status === 'SUCCESS') {
                set((state) => ({
                    todos: [res.data.data, ...state.todos],
                    isLoading: false,
                    error: null,
                }));
                return true;
            }

            set({
                isLoading: false,
                error: extractErrorMessage(res.data?.message, 'Failed to create todo.'),
            });
            return false;
        } catch (err) {
            const rawError = err.response?.data?.message || err.response?.data;
            const parsedMessage = extractErrorMessage(rawError, 'Something went wrong. Please try again.');

            set({
                isLoading: false,
                error: parsedMessage,
            });
            return false;
        }
    },

    clearCurrentTodo: () => set({ currentTodo: null }),
    clearError: () => set({ error: null }),
}));