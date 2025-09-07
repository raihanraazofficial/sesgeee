import { db } from '../firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Testing Firebase connection...');
    
    // Test 1: Try to fetch news collection
    console.log('📰 Fetching news collection...');
    const newsRef = collection(db, 'news');
    const newsSnapshot = await getDocs(newsRef);
    console.log('✅ News collection fetch successful. Found', newsSnapshot.size, 'documents');
    
    // Log all news documents
    newsSnapshot.forEach((doc) => {
      console.log('📄 News doc:', doc.id, doc.data());
    });
    
    // Test 2: Try to fetch events collection
    console.log('🎉 Fetching events collection...');
    const eventsRef = collection(db, 'events');
    const eventsSnapshot = await getDocs(eventsRef);
    console.log('✅ Events collection fetch successful. Found', eventsSnapshot.size, 'documents');
    
    // Log all events documents
    eventsSnapshot.forEach((doc) => {
      console.log('📄 Events doc:', doc.id, doc.data());
    });
    
    return {
      success: true,
      newsCount: newsSnapshot.size,
      eventsCount: eventsSnapshot.size,
      newsData: newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      eventsData: eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    };
    
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const addTestNewsItem = async () => {
  try {
    console.log('📝 Adding test news item...');
    
    const testNews = {
      title: 'Test News Item - Real-time Database Connection',
      content: '<p>This is a test news item to verify that our Firestore database connection is working properly.</p>',
      excerpt: 'Test news item to verify database connection',
      author: 'System Test',
      published_date: serverTimestamp(),
      category: 'news',
      is_featured: false,
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
      image_alt: 'Test news image',
      tags: ['test', 'database', 'firestore'],
      seo_keywords: 'test news database connection',
      status: 'published',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'news'), testNews);
    console.log('✅ Test news item added with ID:', docRef.id);
    
    return {
      success: true,
      docId: docRef.id
    };
    
  } catch (error) {
    console.error('❌ Failed to add test news item:', error);
    return {
      success: false,
      error: error.message
    };
  }
};