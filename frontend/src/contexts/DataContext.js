import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext();

const initialState = {
  people: [],
  publications: [],
  projects: [],
  achievements: [],
  news: [],
  events: [],
  researchAreas: [],
  photoGallery: [],
  settings: {},
  loading: {
    people: false,
    publications: false,
    projects: false,
    achievements: false,
    news: false,
    events: false,
    researchAreas: false,
    photoGallery: false,
    settings: false,
  },
  error: null,
};

// Mock data fallback
const getMockData = (type) => {
  const mock = {
    people: [{ id: 1, name: 'John Doe' }],
    publications: [{ id: 1, title: 'Sample Publication' }],
    projects: [{ id: 1, name: 'Demo Project' }],
    achievements: [{ id: 1, name: 'Achievement' }],
    news: [{ id: 1, title: 'News Item' }],
    events: [{ id: 1, title: 'Event' }],
    researchAreas: [{ id: 1, name: 'Research Area' }],
    photoGallery: [{ id: 1, url: '/placeholder.png' }],
    settings: {},
  };
  return mock[type] || [];
};

function dataReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.type]: action.payload.loading,
        },
      };
    case 'SET_DATA':
      return {
        ...state,
        [action.payload.type]: action.payload.data,
        loading: {
          ...state.loading,
          [action.payload.type]: false,
        },
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: initialState.loading,
      };
    case 'ADD_ITEM':
      return {
        ...state,
        [action.payload.type]: [...state[action.payload.type], action.payload.item],
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        [action.payload.type]: state[action.payload.type].map(item =>
          item.id === action.payload.item.id ? action.payload.item : item
        ),
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        [action.payload.type]: state[action.payload.type].filter(
          item => item.id !== action.payload.id
        ),
      };
    default:
      return state;
  }
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const fetchData = async (type, params = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { type, loading: true } });

      let endpoint = `/api/${type.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      if (type === 'researchAreas') endpoint = '/api/research-areas';
      if (type === 'photoGallery') endpoint = '/api/photo-gallery';

      const baseURL = process.env.REACT_APP_BACKEND_URL || '/api';
      const fullURL = baseURL.startsWith('http') ? `${baseURL}${endpoint}` : endpoint;

      try {
        const response = await axios.get(fullURL, { params });

        dispatch({
          type: 'SET_DATA',
          payload: { type, data: response.data },
        });

        return response.data;
      } catch (apiError) {
        console.warn(`API call failed for ${type}, using mock data:`, apiError.message);

        const mockData = getMockData(type);

        dispatch({
          type: 'SET_DATA',
          payload: { type, data: mockData },
        });

        return mockData;
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);

      const mockData = getMockData(type);

      dispatch({
        type: 'SET_DATA',
        payload: { type, data: mockData },
      });

      dispatch({ type: 'SET_LOADING', payload: { type, loading: false } });
      return mockData;
    }
  };

  const createItem = async (type, data) => {
    try {
      let endpoint = `/api/${type.replace(/([A-Z])/g, '-$1').toLowerCase()}`;

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL || ''}${endpoint}`, data);

      dispatch({
        type: 'ADD_ITEM',
        payload: { type, item: response.data },
      });

      return response.data;
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
      throw error;
    }
  };

  const updateItem = async (type, id, data) => {
    try {
      let endpoint = `/api/${type.replace(/([A-Z])/g, '-$1').toLowerCase()}/${id}`;

      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL || ''}${endpoint}`, data);

      dispatch({
        type: 'UPDATE_ITEM',
        payload: { type, item: response.data },
      });

      return response.data;
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      throw error;
    }
  };

  const deleteItem = async (type, id) => {
    try {
      let endpoint = `/api/${type.replace(/([A-Z])/g, '-$1').toLowerCase()}/${id}`;

      await axios.delete(`${process.env.REACT_APP_BACKEND_URL || ''}${endpoint}`);

      dispatch({
        type: 'DELETE_ITEM',
        payload: { type, id },
      });
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      throw error;
    }
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchData('researchAreas'),
          fetchData('settings'),
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  const value = {
    ...state,
    fetchData,
    createItem,
    updateItem,
    deleteItem,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
