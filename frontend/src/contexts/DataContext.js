import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit as firestoreLimit,
  serverTimestamp 
} from 'firebase/firestore';

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
    people: [
      {
        id: '1',
        name: 'Shameem Ahmad, PhD',
        title: 'Associate Professor',
        department: 'Department of EEE, BRAC University',
        category: 'advisors',
        bio: 'Specialist in smart grids, microgrids, and AI-driven power system control with expertise in renewable energy and advanced power converters.',
        research_interests: ['Microgrids & Distributed Energy Systems', 'Grid Optimization & Stability', 'Renewable Energy Integration'],
        image: 'https://raw.githubusercontent.com/raihanraazofficial/SESGRG_v2/refs/heads/main/imgdirectory/Shameem%20Ahmad.jpg',
        email: 'shameem.ahmad@bracu.ac.bd',
        social_links: {
          google_scholar: '#',
          researchgate: '#',
          orcid: '#',
          linkedin: '#'
        }
      },
      {
        id: '2',
        name: 'Amirul Islam, PhD',
        title: 'Assistant Professor',
        department: 'Department of EEE, BRAC University',
        category: 'advisors',
        bio: 'Researcher in artificial intelligence and power systems with expertise in multimodal signal processing, smart grid automation, and interdisciplinary applications of AI.',
        research_interests: ['Power System Automation', 'Cybersecurity and AI for Power Infrastructure'],
        image: 'https://raw.githubusercontent.com/raihanraazofficial/SESGRG_v2/refs/heads/main/imgdirectory/Amirul%20Islam.jpg',
        email: 'amirul.islam@bracu.ac.bd',
        social_links: {
          google_scholar: '#',
          researchgate: '#',
          orcid: '#',
          linkedin: '#'
        }
      },
      {
        id: '3',
        name: 'A. S. Nazmul Huda, PhD',
        title: 'Associate Professor',
        department: 'Department of EEE, BRAC University',
        category: 'advisors',
        bio: 'Expert in power systems reliability, renewable energy, and smart grid optimization with strong focus on modeling, simulation, and condition monitoring.',
        research_interests: ['Smart Grid Technologies', 'Renewable Energy Integration', 'Grid Optimization & Stability', 'Energy Storage Systems'],
        image: 'https://i.ibb.co.com/mVjdfL22/Nazmul-sir.jpg',
        email: 'nazmul.huda@bracu.ac.bd',
        social_links: {
          google_scholar: '#',
          researchgate: '#',
          orcid: '#',
          linkedin: '#'
        }
      }
    ],
    publications: [
      { 
        id: 1, 
        title: 'Advanced Smart Grid Technologies for Renewable Energy Integration',
        authors: 'Ahmad, S., Islam, A., Huda, N.',
        journal: 'IEEE Transactions on Smart Grid',
        year: 2024,
        category: 'journal'
      },
      { 
        id: 2, 
        title: 'Microgrids for Sustainable Energy Distribution in Bangladesh',
        authors: 'Huda, N., Ahmad, S.',
        journal: 'International Conference on Power Systems',
        year: 2024,
        category: 'conference'
      }
    ],
    projects: [
      { 
        id: 1, 
        name: 'Smart Grid Implementation for Rural Bangladesh',
        status: 'ongoing',
        description: 'Developing efficient smart grid solutions for rural energy distribution',
        year: 2024
      },
      { 
        id: 2, 
        name: 'Renewable Energy Integration System',
        status: 'completed',
        description: 'Advanced system for integrating solar and wind power into the national grid',
        year: 2023
      }
    ],
    achievements: [
      { 
        id: 1, 
        name: 'Best Research Paper Award',
        year: 2024,
        description: 'IEEE International Conference on Smart Grid Technologies',
        category: 'award'
      },
      { 
        id: 2, 
        name: 'Research Grant Success',
        year: 2024,
        description: 'Successfully secured 2.5M BDT research grant for smart grid project',
        category: 'funding'
      }
    ],
    news: [
      { 
        id: 1, 
        title: 'SESGRG Launches New Research Initiative',
        excerpt: 'Our research group has launched a groundbreaking initiative in sustainable energy systems.',
        published_date: '2024-12-01',
        is_featured: true,
        image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxuZXdzJTIwZXZlbnRzfGVufDB8fHx8MTc1NjY1NDE0OXww&ixlib=rb-4.1.0&q=85'
      },
      { 
        id: 2, 
        title: 'Research Collaboration with International Partners',
        excerpt: 'We are excited to announce new research partnerships with leading international institutions.',
        published_date: '2024-11-15',
        is_featured: false,
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwwfHx8fDE3NTY2NTQxNDl8MA&ixlib=rb-4.1.0&q=85'
      }
    ],
    events: [{ id: 1, title: 'Smart Grid Conference 2024', date: '2024-12-15' }],
    researchAreas: [
      {
        id: '1',
        title: 'Smart Grid Technologies',
        description: 'Advanced technologies for next-generation power grids including intelligent monitoring, control systems, and automated demand response.',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGdyaWR8ZW58MHx8fHwxNzU2NTM1MTU3fDA&ixlib=rb-4.1.0&q=85',
        detailed_description: 'Our smart grid research focuses on developing cutting-edge technologies for modernizing electrical power systems.'
      },
      {
        id: '2',
        title: 'Renewable Energy Integration',
        description: 'Seamless integration of solar, wind, and other renewable energy sources into existing power infrastructure.',
        image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxyZW5ld2FibGV8ZW58MHx8fHwxNzU2NTM1MTY0fDA&ixlib=rb-4.1.0&q=85',
        detailed_description: 'Research focused on maximizing renewable energy utilization while maintaining grid stability.'
      },
      {
        id: '3',
        title: 'Microgrids & Distributed Energy Systems',
        description: 'Development of localized energy networks that can operate independently or in conjunction with the main power grid.',
        image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMGVuZXJneXxlbnwwfHx8fDE3NTY1MzUxNTJ8MA&ixlib=rb-4.1.0&q=85',
        detailed_description: 'Creating resilient and efficient distributed energy systems for communities and institutions.'
      },
      {
        id: '4',
        title: 'Energy Storage Systems',
        description: 'Advanced battery technologies and energy storage solutions for grid stabilization and renewable energy storage.',
        image: 'https://images.unsplash.com/photo-1655300256620-680cb0f1cec3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMGVuZXJneSUyMHJlc2VhcmNoJTIwbGFib3JhdG9yeXxlbnwwfHx8fDE3NTY2NTQxNDl8MA&ixlib=rb-4.1.0&q=85',
        detailed_description: 'Developing innovative energy storage solutions for improved grid reliability and efficiency.'
      },
      {
        id: '5',
        title: 'Power System Automation',
        description: 'Intelligent automation systems for power generation, transmission, and distribution networks.',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxyZXNlYXJjaCUyMGxhYm9yYXRvcnl8ZW58MHx8fHwxNzU2NjU0MTQ5fDA&ixlib=rb-4.1.0&q=85',
        detailed_description: 'Automation technologies to enhance power system reliability and operational efficiency.'
      },
      {
        id: '6',
        title: 'Cybersecurity & AI for Power Infrastructure',
        description: 'Protecting critical power infrastructure through advanced cybersecurity measures and AI-driven threat detection.',
        image: 'https://images.unsplash.com/photo-1639313521811-fdfb1c040ddb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHw0fHxzdXN0YWluYWJsZSUyMGVuZXJneSUyMHJlc2VhcmNoJTIwbGFib3JhdG9yeXxlbnwwfHx8fDE3NTY2NTQxNDl8MA&ixlib=rb-4.1.0&q=85',
        detailed_description: 'Securing power systems against cyber threats using artificial intelligence and advanced security protocols.'
      },
      {
        id: '7',
        title: 'Sustainable Energy Policy & Economics',
        description: 'Research on energy policies, economic models, and regulatory frameworks for sustainable energy transition.',
        image: 'https://images.unsplash.com/photo-1608037222011-cbf484177126?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw0fHxyZXNlYXJjaCUyMGxhYm9yYXRvcnl8ZW58MHx8fHwxNzU2NjU0MTU2fDA&ixlib=rb-4.1.0&q=85',
        detailed_description: 'Analyzing policy implications and economic aspects of sustainable energy systems implementation.'
      }
    ],
    photoGallery: [
      { 
        id: 1, 
        url: 'https://images.unsplash.com/photo-1655300256620-680cb0f1cec3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMGVuZXJneSUyMHJlc2VhcmNoJTIwbGFib3JhdG9yeXxlbnwwfHx8fDE3NTY2NTQxNDl8MA&ixlib=rb-4.1.0&q=85',
        title: 'Research Laboratory',
        category: 'Lab Work'
      }
    ],
    settings: {
      logo: 'https://customer-assets.emergentagent.com/job_da31abd5-8dec-452e-a49e-9beda777d1d4/artifacts/ii07ct2o_Logo.jpg',
      university_name: 'BRAC University',
      department_name: 'Department of EEE',
      contact_email: 'sesg@bracu.ac.bd',
      contact_phone: '+880-2-9844051-4',
      address: 'BRAC University, 66 Mohakhali, Dhaka 1212, Bangladesh'
    },
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

  const fetchData = useCallback(async (type, params = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { type, loading: true } });

      // Map type to Firestore collection name
      let collectionName = type;
      if (type === 'researchAreas') collectionName = 'research_areas';
      if (type === 'photoGallery') collectionName = 'photo_gallery';

      try {
        // Get data from Firestore
        const collectionRef = collection(db, collectionName);
        let q = collectionRef;
        
        // Apply filters from params
        if (params.category) {
          q = query(q, where('category', '==', params.category));
        }
        if (params.status) {
          q = query(q, where('status', '==', params.status));
        }
        if (params.featured !== undefined) {
          q = query(q, where('is_featured', '==', params.featured));
        }
        
        // Apply ordering
        if (params.sort_by) {
          const direction = params.sort_order === 'asc' ? 'asc' : 'desc';
          q = query(q, orderBy(params.sort_by, direction));
        } else if (type === 'news' || type === 'events') {
          q = query(q, orderBy('published_date', 'desc'));
        }
        
        // Apply limit
        if (params.limit) {
          q = query(q, firestoreLimit(params.limit));
        }

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore timestamps to ISO strings
          created_at: doc.data().created_at?.toDate?.()?.toISOString(),
          updated_at: doc.data().updated_at?.toDate?.()?.toISOString(),
          published_date: doc.data().published_date?.toDate?.()?.toISOString(),
          date: doc.data().date?.toDate?.()?.toISOString(),
          start_date: doc.data().start_date?.toDate?.()?.toISOString(),
          end_date: doc.data().end_date?.toDate?.()?.toISOString(),
        }));

        dispatch({
          type: 'SET_DATA',
          payload: { type, data },
        });

        return data;
      } catch (firestoreError) {
        console.warn(`Firestore call failed for ${type}, using mock data:`, firestoreError.message);

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
  }, []);

  const createItem = async (type, data) => {
    try {
      let collectionName = type;
      if (type === 'researchAreas') collectionName = 'research_areas';
      if (type === 'photoGallery') collectionName = 'photo_gallery';

      // Add timestamps
      const itemData = {
        ...data,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, collectionName), itemData);
      
      const newItem = {
        id: docRef.id,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      dispatch({
        type: 'ADD_ITEM',
        payload: { type, item: newItem },
      });

      return newItem;
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
      throw error;
    }
  };

  const updateItem = async (type, id, data) => {
    try {
      let collectionName = type;
      if (type === 'researchAreas') collectionName = 'research_areas';
      if (type === 'photoGallery') collectionName = 'photo_gallery';

      const itemData = {
        ...data,
        updated_at: serverTimestamp(),
      };

      await updateDoc(doc(db, collectionName, id), itemData);
      
      const updatedItem = {
        id,
        ...data,
        updated_at: new Date().toISOString(),
      };

      dispatch({
        type: 'UPDATE_ITEM',
        payload: { type, item: updatedItem },
      });

      return updatedItem;
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      throw error;
    }
  };

  const deleteItem = async (type, id) => {
    try {
      let collectionName = type;
      if (type === 'researchAreas') collectionName = 'research_areas';
      if (type === 'photoGallery') collectionName = 'photo_gallery';

      await deleteDoc(doc(db, collectionName, id));

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
  }, [fetchData]);

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
