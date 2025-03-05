import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { API_CONFIG } from '../config'; // Make sure to create this config file

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
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
			
			const response = await api.post(`${API_CONFIG.API_PATH}/auth/signup`, credentials);

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
		  const response = await api.post(`${API_CONFIG.API_PATH}/auth/login`, credentials);
		  set({ user: response.data.user, isLoggingIn: false });
		  
		  // Save user to localStorage for persistence
		  localStorage.setItem('user', JSON.stringify(response.data.user));
		  
		  toast.success("Logged in successfully");
		} catch (error) {
		  set({ isLoggingIn: false, user: null });
		  toast.error(error.response?.data?.message || "Login failed");
		}
	},
	logout: async () => {
		set({ isLoggingOut: true });
		try {
			await api.post(`${API_CONFIG.API_PATH}/auth/logout`);
			set({ user: null, isLoggingOut: false });
			
			// Remove user from localStorage
			localStorage.removeItem('user');
			
			toast.success("Logged out successfully");
		} catch (error) {
			set({ isLoggingOut: false });
			toast.error(error.response?.data?.message || "Logout failed");
		}
	},
	// Replace authCheck with a simple localStorage check
	checkLocalAuth: () => {
		set({ isCheckingAuth: true });
		try {
			const storedUser = localStorage.getItem('user');
			if (storedUser) {
				set({ user: JSON.parse(storedUser), isCheckingAuth: false });
			} else {
				set({ user: null, isCheckingAuth: false });
			}
		} catch (error) {
			console.error("Error checking local auth:", error);
			set({ isCheckingAuth: false, user: null });
		}
	},
}));