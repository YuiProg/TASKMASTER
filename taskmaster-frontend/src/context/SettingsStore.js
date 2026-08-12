import { create } from "zustand";
import gateWayApi from "../lib/gateway";
import toast from "react-hot-toast";

export const useSettingsStore = create((set, get) => ({
  settings: {
    id: null,
    appliedTo: null,
    sendEmailUponProjectCreation: true,
    sendEmailUponTaskCreation: true,
    sendEmailUponLogin: true,
    sendEmailUponTaskUpdate: false,
    sendDailyEmailTaskUpdates: true,
    sendEmailDaily: true,
    locked: false,
  },
  isLoading: false,
  isSaving: false,
  error: null,

  // Fetch settings from server
  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await gateWayApi.get("/settings/getSettings");
      const resData = response.data;

      if (String(resData?.status).toUpperCase() === "SUCCESS") {
        set({
          settings: resData.data || {},
          isLoading: false,
        });
        return resData.data;
      }

      set({
        isLoading: false,
        error: resData?.message || "Failed to fetch settings.",
      });
      return null;
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      const errorMsg =
        error.response?.data?.message || "Something went wrong fetching settings.";
      set({ isLoading: false, error: errorMsg });
      return null;
    }
  },

  // Manual setter for component state sync
  setSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  // Toggle individual boolean key
  toggleSetting: (key) => {
    set((state) => ({
      settings: {
        ...state.settings,
        [key]: !state.settings[key],
      },
    }));
  },

  // Save changes to backend
  saveSettings: async () => {
    set({ isSaving: true, error: null });

    const { settings } = get();

    // STRICTLY MATCHES BACKEND DTO (ONLY THE 7 BOOLEANS)
    const payload = {
      sendEmailUponProjectCreation: Boolean(settings.sendEmailUponProjectCreation),
      sendEmailUponTaskCreation: Boolean(settings.sendEmailUponTaskCreation),
      sendEmailUponTaskUpdate: Boolean(settings.sendEmailUponTaskUpdate),
      sendDailyEmailTaskUpdates: Boolean(settings.sendDailyEmailTaskUpdates),
      sendEmailUponLogin: Boolean(settings.sendEmailUponLogin),
      sendEmailDaily: Boolean(settings.sendEmailDaily),
      locked: Boolean(settings.locked),
    };
    console.log(payload);
    try {
      const response = await gateWayApi.put("/settings/setSettings", payload);
      const resData = response.data;

      if (String(resData?.status).toUpperCase() === "ERROR") {
        let errorMsg = "Failed to update settings";

        if (resData.message) {
          try {
            const parsed = JSON.parse(resData.message);
            errorMsg = parsed.message || errorMsg;
          } catch {
            errorMsg = resData.message;
          }
        }

        toast.error(errorMsg, { position: "bottom-right", duration: 4000 });
        set({ error: errorMsg, isSaving: false });
        return { success: false, message: errorMsg };
      }

      if (resData?.data) {
        set({
          settings: resData.data,
          isSaving: false,
        });
      } else {
        set({ isSaving: false });
      }

      toast.success("Settings saved successfully!", {
        position: "bottom-right",
        duration: 3000,
      });

      return { success: true, data: resData?.data };
    } catch (error) {
      console.error("Save settings failed:", error);

      let errorMsg = "Something went wrong. Please try again.";
      if (error.response?.data) {
        const resData = error.response.data;
        if (resData.message) {
          try {
            const parsed = JSON.parse(resData.message);
            errorMsg = parsed.message || errorMsg;
          } catch {
            errorMsg = resData.message;
          }
        }
      }

      toast.error(errorMsg, { position: "bottom-right", duration: 4000 });
      set({ error: errorMsg, isSaving: false });
      return { success: false, message: errorMsg };
    }
  },
}));