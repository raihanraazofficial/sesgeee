import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

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
    // Check for existing Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if this is the admin user
        const adminEmail = 'admin@sesgrg.com';
        if (firebaseUser.email === adminEmail) {
          const token = await firebaseUser.getIdToken();
          const user = {
            uid: firebaseUser.uid,
            username: 'admin',
            email: firebaseUser.email,
            role: 'admin'
          };
          
          // Store in localStorage
          localStorage.setItem('admin_user', JSON.stringify(user));
          localStorage.setItem('admin_session', token);
          
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user, token }
          });
        } else {
          // Not admin, sign out
          await signOut(auth);
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        // No user signed in
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_session');
        dispatch({ type: 'LOGOUT' });
      }
      
      dispatch({ type: 'SET_LOADING', payload: false });
    });

    return () => unsubscribe();
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Check admin credentials
      const adminUsername = process.env.REACT_APP_ADMIN_USERNAME || 'admin';
      const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD || '@dminsesg705';
      
      console.log('🔍 Login attempt:', { username: credentials.username });
      console.log('🔍 Expected credentials:', { username: adminUsername });
      
      if (credentials.username !== adminUsername || credentials.password !== adminPassword) {
        throw new Error('Invalid username or password');
      }
      
      // Create admin email for Firebase
      const adminEmail = 'admin@sesgrg.com';
      
      try {
        // Try to sign in with existing account
        const userCredential = await signInWithEmailAndPassword(auth, adminEmail, credentials.password);
        console.log('✅ Signed in with existing account');
        
        const token = await userCredential.user.getIdToken();
        const user = {
          uid: userCredential.user.uid,
          username: credentials.username,
          email: adminEmail,
          role: 'admin'
        };
        
        return { success: true };
        
      } catch (signInError) {
        console.log('🔍 Sign in failed, trying to create account:', signInError.code);
        
        if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/wrong-password') {
          // Try to create the admin account
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, credentials.password);
            console.log('✅ Created new admin account');
            
            const token = await userCredential.user.getIdToken();
            const user = {
              uid: userCredential.user.uid,
              username: credentials.username,
              email: adminEmail,
              role: 'admin'
            };
            
            return { success: true };
            
          } catch (createError) {
            console.error('❌ Failed to create admin account:', createError);
            throw createError;
          }
        } else {
          throw signInError;
        }
      }
      
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      console.error('❌ Login error:', error);
      
      let errorMessage = 'Login failed';
      
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled';
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid username or password';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_session');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
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