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
  researchAreas: [],
  photoGallery: [],
  settings: {},
  loading: {
    people: false,
    publications: false,
    projects: false,
    achievements: false,
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
        description: 'A comprehensive project to implement smart grid technology in rural areas of Bangladesh, focusing on renewable energy integration and grid stability. This project aims to bring reliable electricity to remote communities while promoting sustainable energy practices.',
        start_date: '2024-01-15T00:00:00.000Z',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxyZXNlYXJjaCUyMHByb2plY3RzfGVufDB8fHx8MTc1NjY1NDE0OXww&ixlib=rb-4.1.0&q=85',
        project_link: 'https://example.com/smart-grid-project',
        research_area: 'Smart Grid Technologies'
      },
      { 
        id: 2, 
        name: 'Renewable Energy Integration System',
        status: 'completed',
        description: 'Advanced system for integrating solar and wind power into the national grid while maintaining stability and efficiency. The project involves developing sophisticated control algorithms and real-time monitoring systems.',
        start_date: '2023-03-10T00:00:00.000Z',
        image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxyZW5ld2FibGV8ZW58MHx8fHwxNzU2NTM1MTY0fDA&ixlib=rb-4.1.0&q=85',
        project_link: 'https://example.com/renewable-integration',
        research_area: 'Renewable Energy Integration'
      },
      { 
        id: 3, 
        name: 'Microgrid Development for Campus Energy Management',
        status: 'ongoing',
        description: 'Design and implementation of a microgrid system for university campuses to achieve energy independence and reduce carbon footprint. The project includes energy storage systems, renewable energy sources, and intelligent load management.',
        start_date: '2024-06-20T00:00:00.000Z',
        image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMGVuZXJneXxlbnwwfHx8fDE3NTY1MzUxNTJ8MA&ixlib=rb-4.1.0&q=85',
        research_area: 'Microgrids & Distributed Energy Systems'
      },
      { 
        id: 4, 
        name: 'AI-Powered Grid Optimization Algorithm',
        status: 'completed',
        description: 'Development of artificial intelligence algorithms for real-time power grid optimization, focusing on load balancing, fault detection, and predictive maintenance. This project leverages machine learning techniques to enhance grid reliability.',
        start_date: '2022-08-05T00:00:00.000Z',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw2fHxBSSUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNjk3MDI3MDAwfDA&ixlib=rb-4.1.0&q=85',
        project_link: 'https://example.com/ai-grid-optimization',
        research_area: 'Grid Optimization & Stability'
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


    researchAreas: [
      {
        id: '1',
        title: 'Smart Grid Technologies',
        description: 'Next-generation intelligent grid systems for improved reliability and efficiency.',
        image: 'https://i.ibb.co.com/kV0RP1Xh/smart-grid.jpg',
        detailed_description: 'Advanced grid monitoring, control systems, and intelligent distribution networks for enhanced reliability and efficiency.',
        research_overview: 'Our smart grid research focuses on developing cutting-edge technologies for modernizing electrical power systems. We work on intelligent monitoring systems, automated control mechanisms, and advanced communication protocols that enable real-time grid management and optimization.',
        research_objectives: [
          'Develop intelligent grid monitoring and control systems',
          'Enhance grid reliability through predictive analytics',
          'Implement advanced communication protocols for grid automation',
          'Create self-healing grid capabilities for improved resilience'
        ],
        key_applications: [
          'Real-time grid monitoring and visualization',
          'Automated demand response systems',
          'Predictive maintenance of grid infrastructure',
          'Smart meter integration and data analytics'
        ],
        research_output: 'Our research has resulted in 5 journal publications, 3 conference papers, and 2 patent applications in smart grid technologies.'
      },
      {
        id: '2',
        title: 'Microgrids & Distributed Energy Systems',
        description: 'Localized energy grids that can operate independently or with traditional grids.',
        image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMGVuZXJneXxlbnwwfHx8fDE3NTY1MzUxNTJ8MA&ixlib=rb-4.1.0&q=85',
        detailed_description: 'Localized energy networks that can operate independently or in conjunction with the main power grid.',
        research_overview: 'Our microgrid research focuses on creating resilient, efficient, and sustainable distributed energy systems. We develop advanced control strategies, energy management systems, and integration protocols for various distributed energy resources.',
        research_objectives: [
          'Design and implement robust microgrid control systems',
          'Optimize energy management in distributed systems',
          'Develop seamless grid-tie and islanding capabilities',
          'Create scalable solutions for community energy independence'
        ],
        key_applications: [
          'Campus and institutional microgrids',
          'Rural electrification projects',
          'Emergency backup power systems',
          'Industrial distributed energy solutions'
        ],
        research_output: 'Published 8 research papers on microgrid technologies and developed 2 prototype systems for real-world implementation.'
      },
      {
        id: '3',
        title: 'Renewable Energy Integration',
        description: 'Seamless integration of solar, wind, and other renewable sources.',
        image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxyZW5ld2FibGV8ZW58MHx8fHwxNzU2NTM1MTY0fDA&ixlib=rb-4.1.0&q=85',
        detailed_description: 'Seamless integration of solar, wind, and other renewable sources into existing grid infrastructure.',
        research_overview: 'We focus on developing advanced technologies and methodologies for integrating renewable energy sources into existing power systems while maintaining stability, reliability, and optimal performance.',
        research_objectives: [
          'Develop advanced power electronics for renewable integration',
          'Create forecasting models for renewable energy generation',
          'Design grid stability solutions for high renewable penetration',
          'Optimize renewable energy dispatch and storage coordination'
        ],
        key_applications: [
          'Large-scale solar and wind farm integration',
          'Distributed rooftop solar systems',
          'Hybrid renewable energy systems',
          'Grid-scale energy storage integration'
        ],
        research_output: 'Completed 3 major renewable integration projects and published 12 peer-reviewed articles on renewable energy technologies.'
      },
      {
        id: '4',
        title: 'Grid Optimization & Stability',
        description: 'Advanced algorithms for power system optimization and stability analysis.',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGdyaWR8ZW58MHx8fHwxNzU2NTM1MTU3fDA&ixlib=rb-4.1.0&q=85',
        detailed_description: 'Advanced algorithms and control systems to maintain grid stability and optimize power flow.',
        research_overview: 'Our research focuses on developing sophisticated algorithms and control systems that ensure power system stability while optimizing energy flow, reducing losses, and maintaining service quality.',
        research_objectives: [
          'Develop advanced optimization algorithms for power flow',
          'Create real-time stability monitoring systems',
          'Design adaptive control strategies for dynamic grid conditions',
          'Implement machine learning for predictive grid management'
        ],
        key_applications: [
          'Power flow optimization software',
          'Dynamic stability assessment tools',
          'Voltage and frequency control systems',
          'Load balancing and dispatch optimization'
        ],
        research_output: 'Developed 4 optimization algorithms adopted by utility companies and published 15 technical papers on grid stability.'
      },
      {
        id: '5',
        title: 'Energy Storage Systems',
        description: 'Battery management and energy storage solutions for grid applications.',
        image: 'https://i.ibb.co.com/7tvcqhBV/EV.jpg',
        detailed_description: 'Battery technologies, grid-scale storage solutions, and energy management systems for optimal utilization.',
        research_overview: 'We develop advanced energy storage technologies and management systems that enhance grid flexibility, enable renewable integration, and provide backup power solutions for various applications.',
        research_objectives: [
          'Develop advanced battery management systems',
          'Create grid-scale energy storage solutions',
          'Design optimal energy storage placement strategies',
          'Implement smart charging systems for electric vehicles'
        ],
        key_applications: [
          'Grid-scale battery storage systems',
          'Electric vehicle charging infrastructure',
          'Residential energy storage solutions',
          'Industrial backup power systems'
        ],
        research_output: 'Designed 6 energy storage systems currently in operation and published 10 research papers on battery technologies.'
      },
      {
        id: '6',
        title: 'Power System Automation',
        description: 'Automated control systems for modern power grid operations.',
        image: 'https://c0.wallpaperflare.com/preview/682/771/804/industrial-industry-automation-automatic.jpg',
        detailed_description: 'Intelligent automation systems for power generation, transmission, and distribution networks.',
        research_overview: 'Our automation research focuses on developing intelligent systems that can automatically monitor, control, and optimize power system operations with minimal human intervention.',
        research_objectives: [
          'Design autonomous grid operation systems',
          'Develop predictive maintenance algorithms',
          'Create automated fault detection and isolation systems',
          'Implement AI-driven decision support systems'
        ],
        key_applications: [
          'Substation automation systems',
          'Automated protection and control',
          'Remote monitoring and diagnostics',
          'Intelligent load management systems'
        ],
        research_output: 'Implemented automation systems in 8 substations and published 7 papers on power system automation technologies.'
      },
      {
        id: '7',
        title: 'Cybersecurity and AI for Power Infrastructure',
        description: 'Advanced AI-driven cybersecurity solutions protecting critical power infrastructure from emerging threats.',
        image: 'https://itbrief.com.au/uploads/story/2024/01/23/cybersecurity_trends.webp',
        detailed_description: 'Security protocols, threat detection, and AI-driven solutions for critical energy infrastructure protection.',
        research_overview: 'We develop comprehensive cybersecurity frameworks and AI-powered threat detection systems specifically designed to protect critical power infrastructure from cyber attacks and ensure system resilience.',
        research_objectives: [
          'Develop AI-based intrusion detection systems for power grids',
          'Create secure communication protocols for smart grid networks',
          'Design resilient control systems against cyber attacks',
          'Implement blockchain technology for secure energy transactions'
        ],
        key_applications: [
          'SCADA system security enhancement',
          'Smart grid communication security',
          'Industrial control system protection',
          'Energy trading platform security'
        ],
        research_output: 'Developed 3 cybersecurity frameworks adopted by power utilities and published 9 papers on power system security.'
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
    news: [
      {
        id: '1',
        title: 'SESGRG Research Team Wins Best Paper Award at IEEE Conference',
        content: '<p>Our research team has been awarded the prestigious Best Paper Award at the IEEE International Conference on Smart Grid Technologies for our work on "Advanced Microgrid Control Systems for Rural Electrification".</p><p>The paper presents innovative solutions for implementing sustainable energy systems in remote areas, focusing on intelligent control mechanisms and renewable energy integration.</p>',
        excerpt: 'SESGRG research team receives recognition for groundbreaking work in microgrid technologies at international IEEE conference.',
        author: 'Dr. Shameem Ahmad',
        published_date: '2024-08-15T10:00:00.000Z',
        category: 'news',
        is_featured: true,
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw1fHxhd2FyZCUyMGNlcmVtb255fGVufDB8fHx8MTY5NzAyNzAwMHww&ixlib=rb-4.1.0&q=85',
        image_alt: 'Award ceremony at IEEE conference',
        tags: ['award', 'ieee', 'microgrid', 'research'],
        seo_keywords: 'IEEE award, microgrid research, smart grid technology',
        status: 'published',
        google_calendar_link: ''
      },
      {
        id: '2', 
        title: 'Successful Implementation of Solar Microgrid in Rural Bangladesh',
        content: '<p>Our team has successfully implemented a 50kW solar microgrid system in a rural community in Rangpur district, providing reliable electricity to over 200 households.</p><p>This project demonstrates the practical application of our research in distributed energy systems and showcases the potential for sustainable energy solutions in remote areas.</p>',
        excerpt: 'SESGRG implements 50kW solar microgrid system providing electricity to 200+ households in rural Rangpur.',
        author: 'Dr. A. S. Nazmul Huda',
        published_date: '2024-08-10T09:30:00.000Z',
        category: 'news',
        is_featured: false,
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw3fHxzb2xhciUyMHBhbmVsfGVufDB8fHx8MTY5NzAyNzAwMHww&ixlib=rb-4.1.0&q=85',
        image_alt: 'Solar panels in rural setting',
        tags: ['solar', 'microgrid', 'rural', 'implementation'],
        seo_keywords: 'solar microgrid, rural electrification, renewable energy',
        status: 'published',
        google_calendar_link: ''
      },
      {
        id: '3',
        title: 'SESGRG Annual Research Symposium 2024',
        content: '<p>Join us for our Annual Research Symposium featuring presentations from leading researchers in smart grid technologies, renewable energy systems, and power system optimization.</p><p>The event will showcase cutting-edge research, industry collaborations, and future directions in sustainable energy systems.</p>',
        excerpt: 'Annual research symposium featuring latest developments in smart grid and renewable energy technologies.',
        author: 'Dr. Amirul Islam',
        published_date: '2024-09-15T14:00:00.000Z',
        category: 'upcoming_events',
        is_featured: true,
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw0fHxjb25mZXJlbmNlfGVufDB8fHx8MTY5NzAyNzAwMHww&ixlib=rb-4.1.0&q=85',
        image_alt: 'Conference presentation hall',
        tags: ['symposium', 'research', 'conference', '2024'],
        seo_keywords: 'research symposium, smart grid conference, renewable energy',
        status: 'published',
        google_calendar_link: 'https://calendar.google.com/calendar/embed?src=example'
      },
      {
        id: '4',
        title: 'New Research Grant Awarded for AI-Powered Grid Optimization',
        content: '<p>SESGRG has been awarded a significant research grant from the Ministry of Science and Technology for developing AI-powered grid optimization algorithms.</p><p>This three-year project will focus on creating intelligent systems for real-time power grid management and renewable energy integration.</p>',
        excerpt: 'SESGRG receives major research grant for AI-powered grid optimization from Ministry of Science and Technology.',
        author: 'Dr. Shameem Ahmad',
        published_date: '2024-08-05T11:15:00.000Z',
        category: 'news',
        is_featured: false,
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw2fHxBSSUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNjk3MDI3MDAwfDA&ixlib=rb-4.1.0&q=85',
        image_alt: 'AI technology and grid systems',
        tags: ['AI', 'grant', 'optimization', 'funding'],
        seo_keywords: 'AI grid optimization, research grant, power systems',
        status: 'published',
        google_calendar_link: ''
      },
      {
        id: '5',
        title: 'Workshop on Renewable Energy Integration Techniques',
        content: '<p>SESGRG is organizing a comprehensive workshop on renewable energy integration techniques for power system engineers and researchers.</p><p>Topics will include wind and solar integration, energy storage systems, and grid stability analysis methods.</p>',
        excerpt: 'Technical workshop covering renewable energy integration techniques and grid stability analysis.',
        author: 'Dr. A. S. Nazmul Huda',
        published_date: '2024-09-25T10:00:00.000Z',
        category: 'events',
        is_featured: false,
        image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw1fHxyZW5ld2FibGUlMjBlbmVyZ3l8ZW58MHx8fHwxNjk3MDI3MDAwfDA&ixlib=rb-4.1.0&q=85',
        image_alt: 'Renewable energy systems',
        tags: ['workshop', 'renewable', 'integration', 'training'],
        seo_keywords: 'renewable energy workshop, grid integration, training',
        status: 'published',
        google_calendar_link: 'https://calendar.google.com/calendar/embed?src=workshop'
      }
    ],
    settings: {
      logo: 'https://customer-assets.emergentagent.com/job_da31abd5-8dec-452e-a49e-9beda777d1d4/artifacts/ii07ct2o_Logo.jpg',
      university_name: 'BRAC University',
      department_name: 'Department of EEE',
      contact_email: 'sesg@bracu.ac.bd',
      contact_phone: '+880-2-9844051-4',
      address: 'BRAC University, 66 Mohakhali, Dhaka 1212, Bangladesh',
      google_calendar_url: 'https://calendar.google.com/calendar/embed?height=400&wkst=1&bgcolor=%23ffffff&ctz=Asia%2FDhaka&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&mode=AGENDA'
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
      console.log(`[DataContext] Fetching ${type}...`);
      dispatch({ type: 'SET_LOADING', payload: { type, loading: true } });

      // All data types now use direct Firestore approach

      // Map type to Firestore collection name
      let collectionName = type;
      if (type === 'researchAreas') collectionName = 'research_areas';
      if (type === 'photoGallery') collectionName = 'photo_gallery';
      // news and events use their own collection names

      try {
        console.log(`[DataContext] Attempting Firestore query for collection: ${collectionName}`);
        
        // Get data from Firestore with simplified query
        const collectionRef = collection(db, collectionName);
        let q = collectionRef;
        
        // For news and events, use minimal querying to avoid index issues
        if (type === 'news' || type === 'events') {
          // Only apply basic filtering if needed, no complex combinations
          if (params.status && !params.category && !params.featured && !params.sort_by) {
            q = query(q, where('status', '==', params.status));
          } else if (params.category && !params.status && !params.featured && !params.sort_by) {
            q = query(q, where('category', '==', params.category));
          }
          // Add simple ordering only if no filters
          else if (!params.category && !params.status && !params.featured && params.sort_by) {
            const direction = params.sort_order === 'asc' ? 'asc' : 'desc';
            q = query(q, orderBy(params.sort_by, direction));
          }
        } else {
          // Apply filters from params for other types
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
          }
        }
        
        // Apply limit
        if (params.limit) {
          q = query(q, firestoreLimit(params.limit));
        }

        const querySnapshot = await Promise.race([
          getDocs(q),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Firestore query timeout after 10 seconds')), 10000)
          )
        ]);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore timestamps to ISO strings, also handle string dates
          created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
          updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
          published_date: doc.data().published_date?.toDate?.()?.toISOString() || doc.data().published_date,
          date: doc.data().date?.toDate?.()?.toISOString() || doc.data().date,
          start_date: doc.data().start_date?.toDate?.()?.toISOString() || doc.data().start_date,
          end_date: doc.data().end_date?.toDate?.()?.toISOString() || doc.data().end_date,
        }));

        console.log(`[DataContext] Firestore data loaded for ${type}:`, data.length, 'items');
        
        // If Firestore returns empty data, use mock data fallback (except for people, news, events)
        if (data.length === 0 && type !== 'people' && type !== 'news' && type !== 'events') {
          console.log(`[DataContext] Firestore collection ${collectionName} is empty, using mock data`);
          const mockData = getMockData(type);
          console.log(`[DataContext] Mock data loaded for ${type}:`, mockData.length, 'items');
          
          dispatch({
            type: 'SET_DATA',
            payload: { type, data: mockData },
          });

          return mockData;
        }

        dispatch({
          type: 'SET_DATA',
          payload: { type, data },
        });

        return data;
      } catch (firestoreError) {
        console.warn(`[DataContext] Firestore call failed for ${type}, using mock data:`, firestoreError.message);

        // Don't use mock data for people, publications, news, and events - return empty array instead
        if (type === 'people' || type === 'publications' || type === 'news' || type === 'events') {
          console.log(`[DataContext] Firestore failed for ${type}, returning empty array instead of mock data`);
          dispatch({
            type: 'SET_DATA',
            payload: { type, data: [] },
          });
          return [];
        }

        const mockData = getMockData(type);
        console.log(`[DataContext] Using mock data for ${type}:`, mockData.length, 'items');

        dispatch({
          type: 'SET_DATA',
          payload: { type, data: mockData },
        });

        return mockData;
      }
    } catch (error) {
      console.error(`[DataContext] Error fetching ${type}:`, error);

      // Don't use mock data for people, publications, news, and events - return empty array instead
      if (type === 'people' || type === 'publications' || type === 'news' || type === 'events') {
        console.log(`[DataContext] General error for ${type}, returning empty array instead of mock data`);
        dispatch({
          type: 'SET_DATA',
          payload: { type, data: [] },
        });
        dispatch({ type: 'SET_LOADING', payload: { type, loading: false } });
        return [];
      }

      const mockData = getMockData(type);
      console.log(`[DataContext] Fallback to mock data for ${type}:`, mockData.length, 'items');

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

      // Clean data to remove undefined values
      const cleanedData = cleanData(data, false);

      // Add timestamps
      const itemData = {
        ...cleanedData,
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

  const cleanData = (data, isUpdate = false) => {
    const cleaned = {};
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        // Handle arrays
        if (Array.isArray(data[key])) {
          cleaned[key] = data[key];
        } else if (data[key] === '' && isUpdate) {
          // For updates, explicitly set empty strings to clear fields
          cleaned[key] = '';
        } else if (data[key] !== '') {
          // For non-empty values
          cleaned[key] = data[key];
        } else if (isUpdate) {
          // For updates, include empty strings to clear fields
          cleaned[key] = '';
        }
      } else if (isUpdate && data[key] === null) {
        // For updates, explicitly set null values
        cleaned[key] = null;
      }
    });
    return cleaned;
  };

  const updateItem = async (type, id, data) => {
    try {
      let collectionName = type;
      if (type === 'researchAreas') collectionName = 'research_areas';
      if (type === 'photoGallery') collectionName = 'photo_gallery';

      // Clean data for updates - keep empty strings to clear fields
      const cleanedData = cleanData(data, true);
      
      const itemData = {
        ...cleanedData,
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
