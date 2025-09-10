import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import People from './pages/People';
import ResearchAreas from './pages/ResearchAreas';
import ResearchAreaDetail from './pages/ResearchAreaDetail';
import Publications from './pages/Publications';
import Projects from './pages/Projects';
import Achievements from './pages/Achievements';
import Contact from './pages/Contact';
import PhotoGallery from './pages/PhotoGallery';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPeople from './pages/admin/AdminPeople';
import AdminPublications from './pages/admin/AdminPublications';
import AdminProjects from './pages/admin/AdminProjects';
import AdminAchievements from './pages/admin/AdminAchievements';
import AdminNews from './pages/admin/AdminNews';
import AdminSettings from './pages/admin/AdminSettings';

// Context
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <ScrollToTop />
          <div className="App min-h-screen bg-dark-900 text-white">
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
            
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route path="/people" element={<AdminPeople />} />
                    <Route path="/publications" element={<AdminPublications />} />
                    <Route path="/projects" element={<AdminProjects />} />
                    <Route path="/achievements" element={<AdminAchievements />} />
                    <Route path="/news" element={<AdminNews />} />
                    <Route path="/settings" element={<AdminSettings />} />
                  </Routes>
                </ProtectedRoute>
              } />
              
              {/* Public Routes */}
              <Route path="/*" element={
                <>
                  <Navbar />
                  <main className="min-h-screen">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/people" element={<People />} />
                      <Route path="/research" element={<ResearchAreas />} />
                      <Route path="/research/:areaId" element={<ResearchAreaDetail />} />
                      <Route path="/publications" element={<Publications />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/achievements" element={<Achievements />} />
                      <Route path="/news" element={<News />} />
                      <Route path="/news/:slug" element={<NewsDetail />} />
                      <Route path="/events/:slug" element={<NewsDetail />} />
                      <Route path="/upcoming-events/:slug" element={<NewsDetail />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/gallery" element={<PhotoGallery />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              } />
            </Routes>
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;