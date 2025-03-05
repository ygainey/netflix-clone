import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

// Get values from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_PATH = import.meta.env.VITE_API_PATH || '/api/v1';

// Create configured axios instance for auth requests
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export const useAuthStore = create((set) => ({
	user: null,
	isSigningUp: false,
	isCheckingAuth: true,
	isLoggingOut: false,
	isLoggingIn: false,
	signup: async (credentials) => {
		set({ isSigningUp: true });
		try {
			console.log("Sending signup data:", credentials);
			
			const response = await api.post(`${API_PATH}/auth/signup`, credentials);

			set({ user: response.data.user, isSigningUp: false });
			toast.success("Account created successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Signup failed");
			set({ isSigningUp: false, user: null });
		}
	},
	login: async (credentials) => {
		set({ isLoggingIn: true });
		try {
			const response = await api.post(`${API_PATH}/auth/login`, credentials);
			set({ user: response.data.user, isLoggingIn: false });
			toast.success("Logged in successfully");
		} catch (error) {
			set({ isLoggingIn: false, user: null });
			toast.error(error.response?.data?.message || "Login failed");
		}
	},
	logout: async () => {
		set({ isLoggingOut: true });
		try {
			await api.post(`${API_PATH}/auth/logout`);
			set({ user: null, isLoggingOut: false });
			toast.success("Logged out successfully");
		} catch (error) {
			set({ isLoggingOut: false });
			toast.error(error.response?.data?.message || "Logout failed");
		}
	},
	authCheck: async () => {
		set({ isCheckingAuth: true });
		try {
			const response = await api.get(`${API_PATH}/auth/authCheck`);
			set({ user: response.data.user, isCheckingAuth: false });
		} catch (error) {
			set({ isCheckingAuth: false, user: null });
			if (error.response && error.response.status !== 401) {
				toast.error(error.response?.data?.message || "An error occurred");
			}
		}
	},
}));