import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ExternalLink, ArrowUp } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Footer = () => {
  const { settings } = useData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-dark-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={settings.logo || "https://customer-assets.emergentagent.com/job_da31abd5-8dec-452e-a49e-9beda777d1d4/artifacts/ii07ct2o_Logo.jpg"} 
                alt="SESGRG Logo" 
                className="h-12 w-12 object-contain"
              />
              <div>
                <h3 className="text-xl font-bold font-heading text-white">
                  Sustainable Energy & Smart Grid Research
                </h3>
                <p className="text-sm text-gray-400">BSRM School of Engineering, BRAC University</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Pioneering research in clean energy, renewable integration, and next-generation smart grid systems. 
              Committed to developing innovative and resilient energy solutions for a sustainable future.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-primary-500" />
                <span>{settings.contact_email || 'sesg@bracu.ac.bd'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-primary-500" />
                <span>BRAC University, 66 Mohakhali, Dhaka 1212, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/people" className="text-gray-300 hover:text-primary-400 transition-colors">People</Link></li>
              <li><Link to="/research" className="text-gray-300 hover:text-primary-400 transition-colors">Research Areas</Link></li>
              <li><Link to="/publications" className="text-gray-300 hover:text-primary-400 transition-colors">Publications</Link></li>
              <li><Link to="/projects" className="text-gray-300 hover:text-primary-400 transition-colors">Projects</Link></li>
              <li><Link to="/achievements" className="text-gray-300 hover:text-primary-400 transition-colors">Achievements</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/news" className="text-gray-300 hover:text-primary-400 transition-colors">News & Events</Link></li>
              <li><Link to="/gallery" className="text-gray-300 hover:text-primary-400 transition-colors">Photo Gallery</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-primary-400 transition-colors">Contact Us</Link></li>
              <li>
                <a 
                  href="https://www.bracu.ac.bd" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-primary-400 transition-colors flex items-center space-x-1"
                >
                  <span>BRAC University</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} Sustainable Energy & Smart Grid Research Group. All rights reserved.
          </div>
          
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 text-sm text-gray-300 hover:text-primary-400 transition-colors group"
          >
            <span>Back to Top</span>
            <ArrowUp className="h-4 w-4 group-hover:transform group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;