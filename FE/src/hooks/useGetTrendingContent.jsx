import { useEffect, useState } from "react"
import { useContentStore } from "../store/content"
import axios from "axios"

// Get values from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_PATH = import.meta.env.VITE_API_PATH || '/api/v1';

// Create configured axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const useGetTrendingContent = () => {
	const [trendingContent, setTrendingContent] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)
	const { contentType } = useContentStore()

	useEffect(() => {
		const getTrendingContent = async () => {
			try {
				setIsLoading(true)
				const res = await api.get(`${API_PATH}/${contentType}/trending`)
				setTrendingContent(res.data.content)
				setError(null)
			} catch (err) {
				console.error("Error fetching trending content:", err)
				setError("Failed to load trending content")
				setTrendingContent(null)
			} finally {
				setIsLoading(false)
			}
		}

		getTrendingContent()
	}, [contentType])

	return { trendingContent, isLoading, error }
}

export default useGetTrendingContent