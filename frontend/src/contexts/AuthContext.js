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
    const token = localStorage.getItem('token');
    
    if (userData && token) {
      try {
        const user = JSON.parse(userData);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token }
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('admin_user');
        localStorage.removeItem('token');
      }
    }
    
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        username: credentials.username,
        password: credentials.password
      });
      
      const { access_token, user_role } = response.data;
      
      const user = {
        username: credentials.username,
        role: user_role
      };
      
      // Store in localStorage
      localStorage.setItem('admin_user', JSON.stringify(user));
      localStorage.setItem('token', access_token);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token: access_token }
      });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      let errorMessage = 'Login failed';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid username or password';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
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
    localStorage.removeItem('token');
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