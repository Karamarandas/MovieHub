import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

const useUserStore = create((set) => ({
  authUser: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth:", error.message);
      set({ authUser: null });
    }
  },

  signup: async (data) => {
    try {
      return await axiosInstance.post("/auth/signup", data);
    } catch (error) {
      console.error(
        "Signup Error:",
        error.response?.data?.message || error.message
      );
    }
  },

  login: async (data) => {
    try {
      const response = await axiosInstance.post("/auth/login", data);
      set({ authUser: response.data });
      return response.data;
    } catch (error) {
      console.error("Login Error:", error.response?.data?.message);
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      return response.data;
    } catch (error) {
      console.error("Logout Error:", error.response?.data?.message);
    }
  },

  updateUser: async (data) => {
    try {
      const response = await axiosInstance.post("/auth/edit", data);
      set({ authUser: response.data.user });
      return response.data;
    } catch (error) {
      console.error("Update User Error:", error.response?.data?.message);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      return { success: true, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong",
      };
    }
  },

  resetPassword: async (token, password) => {
    try {
      const res = await axiosInstance.post("/auth/reset-password", {
        token,
        password,
      });
      return { success: true, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong",
      };
    }
  },
}));

export default useUserStore;
