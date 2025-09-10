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
      
      // Check credentials in Firestore first
      try {
        const usersRef = collection(db, 'users');
        const q = query(
          usersRef, 
          where('username', '==', credentials.username),
          where('role', '==', 'admin')
        );
        
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          // User found in Firestore, validate password
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          
          // Simple password check (in production, passwords should be hashed)
          if (userData.password !== credentials.password) {
            throw new Error('Invalid password');
          }
          
          const user = {
            uid: userDoc.id,
            username: userData.username,
            email: userData.email || `${userData.username}@sesgrg.com`,
            role: userData.role
          };
          
          const sessionToken = `session-${Date.now()}`;
          
          // Store in localStorage
          localStorage.setItem('admin_user', JSON.stringify(user));
          localStorage.setItem('admin_session', sessionToken);
          
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user, token: sessionToken }
          });
          
          return { success: true };
        }
      } catch (firestoreError) {
        console.warn('Firestore authentication failed, trying hardcoded credentials:', firestoreError.message);
      }
      
      // Fallback to hardcoded admin credentials if Firestore fails
      if (credentials.username === 'admin' && credentials.password === '@dminsesg705') {
        const user = {
          uid: 'hardcoded-admin',
          username: 'admin',
          email: 'admin@sesgrg.com',
          role: 'admin'
        };
        
        const sessionToken = `session-${Date.now()}`;
        
        // Store in localStorage
        localStorage.setItem('admin_user', JSON.stringify(user));
        localStorage.setItem('admin_session', sessionToken);
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token: sessionToken }
        });
        
        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
      
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      let errorMessage = 'Login failed';
      
      if (error.message.includes('Invalid')) {
        errorMessage = error.message;
      } else if (error.code === 'permission-denied') {
        errorMessage = 'Access denied. Please check your credentials.';
      } else {
        errorMessage = 'Unable to connect to database. Please try again.';
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