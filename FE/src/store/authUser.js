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

// Updated checkAuth function
export const useAuthStore = create((set) => ({
	user: null,
	isSigningUp: false,
	isCheckingAuth: true,
	isLoggingOut: false,
	isLoggingIn: false,
  
	// Signup function
	signup: async (credentials) => {
	  set({ isSigningUp: true });
	  try {
		const response = await api.post(`${API_CONFIG.API_PATH}/auth/signup`, credentials);
		set({ user: response.data.user, isSigningUp: false });
		toast.success("Account created successfully");
	  } catch (error) {
		toast.error(error.response?.data?.message || "Signup failed");
		set({ isSigningUp: false, user: null });
	  }
	},
  
	// Login function
	login: async (credentials) => {
	  set({ isLoggingIn: true });
	  try {
		const response = await api.post(`${API_CONFIG.API_PATH}/auth/login`, credentials);
		set({ user: response.data.user, isLoggingIn: false });
  
		// Save user data in localStorage (optional)
		localStorage.setItem('user', JSON.stringify(response.data.user));
  
		toast.success("Logged in successfully");
	  } catch (error) {
		set({ isLoggingIn: false, user: null });
		toast.error(error.response?.data?.message || "Login failed");
	  }
	},
  
	// Logout function
	logout: async () => {
	  set({ isLoggingOut: true });
	  try {
		await api.post(`${API_CONFIG.API_PATH}/auth/logout`);
		set({ user: null, isLoggingOut: false });
  
		// Remove user from localStorage
		localStorage.removeItem('user');
		
		// Remove the JWT cookie
		document.cookie = 'jwt-netflix=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
		toast.success("Logged out successfully");
	  } catch (error) {
		set({ isLoggingOut: false });
		toast.error(error.response?.data?.message || "Logout failed");
	  }
	},
  
	// New checkAuth function to validate JWT token from cookie
	checkAuth: async () => {
	  set({ isCheckingAuth: true });
	  try {
		// Check if the jwt-netflix cookie exists
		const token = document.cookie.split('; ').find(row => row.startsWith('jwt-netflix='));
		if (!token) {
		  set({ user: null, isCheckingAuth: false });
		  return;
		}
  
		// If token exists, validate it with the backend
		const res = await api.get(`${API_CONFIG.API_PATH}/auth/authCheck`);
		set({ user: res.data.user, isCheckingAuth: false });
	  } catch (error) {
		console.error("Error checking authentication:", error);
		set({ user: null, isCheckingAuth: false });
	  }
	},
  
	// Optional check for localStorage fallback
	checkLocalAuth: async () => {
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