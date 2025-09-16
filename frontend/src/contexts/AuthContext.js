import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for existing session on app load
    const userData = localStorage.getItem('admin_user');
    const sessionToken = localStorage.getItem('admin_session');
    
    if (userData && sessionToken) {
      try {
        const user = JSON.parse(userData);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token: sessionToken }
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_session');
      }
    }
    
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Use backend API for authentication
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://network-fix-3.preview.emergentagent.com';
      
      console.log('🔍 Backend URL being used:', backendUrl);
      console.log('🔍 Environment variable REACT_APP_BACKEND_URL:', process.env.REACT_APP_BACKEND_URL);
      
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        username: credentials.username,
        password: credentials.password
      });
      
      if (response.data && response.data.access_token) {
        const user = {
          uid: 'api-admin',
          username: credentials.username,
          email: `${credentials.username}@sesgrg.com`,
          role: response.data.user_role || 'admin'
        };
        
        const sessionToken = response.data.access_token;
        
        // Store in localStorage
        localStorage.setItem('admin_user', JSON.stringify(user));
        localStorage.setItem('admin_session', sessionToken);
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token: sessionToken }
        });
        
        return { success: true };
      } else {
        throw new Error('Invalid response from server');
      }
      
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      let errorMessage = 'Login failed';
      
      if (error.response && error.response.status === 401) {
        errorMessage = 'Invalid username or password';
      } else if (error.response && error.response.data && error.response.data.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = 'Unable to connect to server. Please try again.';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_session');
    dispatch({ type: 'LOGOUT' });
  };

  const value = {
    ...state,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}