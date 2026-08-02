import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const FALLBACK_ERROR_MESSAGE = "Something went wrong. Please try again.";

const getErrorMessage = (error) =>
  error.response?.data?.message || FALLBACK_ERROR_MESSAGE;

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isSigningIn: false,
  isCheckingAuth: true,
  isLoggingOut: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      set({ isSigningUp: false });
    }
  },

  signin: async (data) => {
    set({ isSigningIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      set({ isSigningIn: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      set({ isLoggingOut: false });
    }
  },
}));
