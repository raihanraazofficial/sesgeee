import { db } from '../firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';

// Initialize admin user in Firestore
export const initializeAdmin = async () => {
  try {
    const adminRef = doc(db, 'users', 'admin');
    await setDoc(adminRef, {
      username: 'admin',
      password: '@dminsesg705', // In production, this should be hashed
      role: 'admin',
      email: 'admin@sesgrg.com',
      created_at: new Date(),
      updated_at: new Date()
    });
    console.log('Admin user initialized in Firestore');
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
};

// Initialize sample data
export const initializeSampleData = async () => {
  try {
    // Add sample people data
    const peopleData = [
      {
        name: 'Dr. Shameem Ahmad',
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
        },
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Dr. Amirul Islam',
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
        },
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    for (const person of peopleData) {
      await addDoc(collection(db, 'people'), person);
    }

    // Add sample publications
    const publicationsData = [
      {
        title: 'Advanced Smart Grid Technologies for Renewable Energy Integration',
        authors: ['Ahmad, S.', 'Islam, A.', 'Huda, N.'],
        publication_type: 'journal',
        journal_name: 'IEEE Transactions on Smart Grid',
        year: 2024,
        volume: '15',
        issue: '3',
        pages: '45-68',
        keywords: ['Smart Grid', 'Renewable Energy', 'Integration'],
        research_areas: ['Smart Grid Technologies', 'Renewable Energy Integration'],
        citations: 25,
        is_open_access: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Microgrids for Sustainable Energy Distribution in Bangladesh',
        authors: ['Huda, N.', 'Ahmad, S.'],
        publication_type: 'conference',
        conference_name: 'International Conference on Power Systems',
        year: 2024,
        location: 'Dhaka, Bangladesh',
        pages: '123-130',
        keywords: ['Microgrids', 'Sustainable Energy', 'Bangladesh'],
        research_areas: ['Microgrids & Distributed Energy Systems'],
        citations: 12,
        is_open_access: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    for (const publication of publicationsData) {
      await addDoc(collection(db, 'publications'), publication);
    }

    // Add sample projects
    const projectsData = [
      {
        title: 'Smart Grid Implementation for Rural Bangladesh',
        description: 'Developing efficient smart grid solutions for rural energy distribution in Bangladesh with focus on renewable energy integration.',
        category: 'research',
        status: 'ongoing',
        start_date: new Date('2024-01-01'),
        end_date: new Date('2025-12-31'),
        team_members: ['Dr. Shameem Ahmad', 'Dr. Amirul Islam'],
        research_areas: ['Smart Grid Technologies', 'Renewable Energy Integration'],
        funding: '2.5M BDT',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Renewable Energy Integration System',
        description: 'Advanced system for integrating solar and wind power into the national grid with AI-driven optimization.',
        category: 'development',
        status: 'completed',
        start_date: new Date('2023-03-01'),
        end_date: new Date('2024-02-29'),
        team_members: ['Dr. Shameem Ahmad'],
        research_areas: ['Renewable Energy Integration', 'Grid Optimization & Stability'],
        funding: '1.8M BDT',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    for (const project of projectsData) {
      await addDoc(collection(db, 'projects'), project);
    }

    // Add sample achievements
    const achievementsData = [
      {
        title: 'Best Research Paper Award',
        description: 'Received at IEEE International Conference on Smart Grid Technologies for groundbreaking research in renewable energy integration.',
        date: new Date('2024-11-15'),
        category: 'award',
        image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Research Grant Success',
        description: 'Successfully secured 2.5M BDT research grant from Bangladesh Research Foundation for smart grid project.',
        date: new Date('2024-09-20'),
        category: 'funding',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    for (const achievement of achievementsData) {
      await addDoc(collection(db, 'achievements'), achievement);
    }

    // Add sample news
    const newsData = [
      {
        title: 'SESGRG Launches New Research Initiative',
        content: 'Our research group has launched a groundbreaking initiative in sustainable energy systems focusing on rural electrification in Bangladesh.',
        excerpt: 'Our research group has launched a groundbreaking initiative in sustainable energy systems.',
        author: 'Dr. Shameem Ahmad',
        published_date: new Date('2024-12-01'),
        is_featured: true,
        image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c',
        tags: ['Research', 'Initiative', 'Sustainable Energy'],
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Research Collaboration with International Partners',
        content: 'We are excited to announce new research partnerships with leading international institutions in the field of smart grid technologies.',
        excerpt: 'We are excited to announce new research partnerships with leading international institutions.',
        author: 'Dr. Amirul Islam',
        published_date: new Date('2024-11-15'),
        is_featured: false,
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
        tags: ['Collaboration', 'International', 'Partnership'],
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    for (const news of newsData) {
      await addDoc(collection(db, 'news'), news);
    }

    console.log('Sample data initialized in Firestore');
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
};

// Function to initialize everything
export const initializeFirestore = async () => {
  await initializeAdmin();
  await initializeSampleData();
};