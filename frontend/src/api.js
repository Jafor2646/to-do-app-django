import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Request interceptor to add token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("access");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired
      if (decoded.exp < currentTime) {
        // Token is expired, try to refresh
        return refreshToken().then(() => {
          const newToken = localStorage.getItem("access");
          if (newToken) {
            req.headers.Authorization = `Bearer ${newToken}`;
          }
          return req;
        }).catch(() => {
          // Refresh failed, clear storage and redirect
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject('Token refresh failed');
        });
      } else {
        req.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Token decode error:', error);
      localStorage.clear();
    }
  }
  return req;
});

// Response interceptor to handle 401 errors
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshTokenValue = localStorage.getItem("refresh");
      if (refreshTokenValue) {
        try {
          await refreshToken();
          // Retry the original request
          const originalRequest = error.config;
          const newToken = localStorage.getItem("access");
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return API(originalRequest);
          }
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = '/login';
        }
      } else {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Function to refresh token
const refreshToken = async () => {
  const refreshTokenValue = localStorage.getItem("refresh");
  if (!refreshTokenValue) {
    throw new Error('No refresh token available');
  }
  
  try {
    const response = await axios.post("http://localhost:8000/api/auth/refresh/", {
      refresh: refreshTokenValue
    });
    
    localStorage.setItem("access", response.data.access);
    if (response.data.refresh) {
      localStorage.setItem("refresh", response.data.refresh);
    }
    return response.data;
  } catch (error) {
    localStorage.clear();
    throw error;
  }
};

export default API;