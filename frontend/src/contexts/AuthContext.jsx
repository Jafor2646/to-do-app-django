import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import API from '../api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('access');
      const refreshToken = localStorage.getItem('refresh');
      
      console.log('Checking auth status:', { 
        tokenExists: !!token,
        refreshTokenExists: !!refreshToken,
        tokenLength: token?.length,
        refreshTokenLength: refreshToken?.length,
        localStorageKeys: Object.keys(localStorage),
        allLocalStorageData: JSON.stringify(localStorage)
      });
      
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          const timeUntilExpiry = decoded.exp - currentTime;
          
          console.log('Token validation:', {
            exp: decoded.exp,
            currentTime,
            isValid: decoded.exp > currentTime,
            expiresAt: new Date(decoded.exp * 1000).toISOString(),
            timeUntilExpirySeconds: timeUntilExpiry,
            timeUntilExpiryMinutes: Math.floor(timeUntilExpiry / 60),
            userId: decoded.user_id,
            username: decoded.username
          });
          
          if (decoded.exp > currentTime) {
            setUser({ id: decoded.user_id, username: decoded.username });
            setIsAuthenticated(true);
            console.log('User authenticated successfully');
          } else {
            console.log('Token expired, clearing localStorage');
            localStorage.clear();
            setIsAuthenticated(false);
          }
        } catch (decodeError) {
          console.error('Token decode error:', decodeError);
          console.log('Invalid token format, clearing localStorage');
          localStorage.clear();
          setIsAuthenticated(false);
        }
      } else {
        console.log('No access token found in localStorage');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.clear();
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      console.log('Attempting login with credentials:', { username: credentials.username });
      const response = await API.post('/auth/login/', credentials);
      const { access, refresh } = response.data;
      
      console.log('Login response received:', {
        accessTokenLength: access?.length,
        refreshTokenLength: refresh?.length,
        hasAccess: !!access,
        hasRefresh: !!refresh
      });
      
      // Store tokens in localStorage
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      
      // Verify tokens were stored
      const storedAccess = localStorage.getItem('access');
      const storedRefresh = localStorage.getItem('refresh');
      console.log('Tokens stored verification:', {
        accessStored: !!storedAccess,
        refreshStored: !!storedRefresh,
        accessMatches: storedAccess === access,
        refreshMatches: storedRefresh === refresh
      });
      
      const decoded = jwtDecode(access);
      console.log('Decoded token:', {
        userId: decoded.user_id,
        username: decoded.username,
        exp: decoded.exp,
        iat: decoded.iat,
        expiresAt: new Date(decoded.exp * 1000).toISOString()
      });
      
      setUser({ id: decoded.user_id, username: decoded.username });
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Login error response:', error.response?.data);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await API.post('/users/', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    console.log('Logout called');
    console.log('Before clearing - localStorage keys:', Object.keys(localStorage));
    
    localStorage.clear();
    
    console.log('After clearing - localStorage keys:', Object.keys(localStorage));
    console.log('Tokens after logout:', {
      access: localStorage.getItem('access'),
      refresh: localStorage.getItem('refresh')
    });
    
    setUser(null);
    setIsAuthenticated(false);
    console.log('User logged out successfully');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
