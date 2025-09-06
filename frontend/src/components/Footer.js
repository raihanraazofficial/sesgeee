import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ArrowUp } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Footer = () => {
  const { settings } = useData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* SESGRG Research Info */}
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src={settings.logo || "https://customer-assets.emergentagent.com/job_da31abd5-8dec-452e-a49e-9beda777d1d4/artifacts/ii07ct2o_Logo.jpg"} 
                alt="SESG Research Logo" 
                className="h-16 w-16 object-contain"
              />
              <div>
                <h3 className="text-lg font-bold text-cyan-400">
                  SESG Research
                </h3>
                <p className="text-sm text-gray-300">Sustainable Energy & Smart Grid</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Pioneering Research in Clean Energy, 
              Renewable Integration and Next-Generation 
              Smart Grid Systems.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://www.bracu.ac.bd" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  BRAC University ↗
                </a>
              </li>
              <li>
                <a href="https://www.bracu.ac.bd/academics/schools/engineering" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  BSRM School of Engineering ↗
                </a>
              </li>
              <li>
                <Link to="/research" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  Research Areas
                </Link>
              </li>
              <li>
                <Link to="/publications" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  Publications
                </Link>
              </li>
            </ul>
          </div>

          {/* Find Us */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Find Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">sesg@bracu.ac.bd</span>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">+880 2-8844051-4</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <div>BRAC University</div>
                  <div>Kha 224 Bir Uttam Rafiqul Islam Ave,</div>
                  <div>Merul Badda</div>
                  <div>Dhaka-1212, Bangladesh</div>
                </div>
              </div>
              <div className="mt-4">
                <a 
                  href="https://maps.google.com/?q=BRAC+University,+Dhaka" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
                >
                  View on Map →
                </a>
              </div>
            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Follow Us</h4>
            <div className="flex space-x-3 mb-6">
              {/* Facebook */}
              <a 
                href="https://facebook.com/bracuniversity" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                title="Facebook"
              >
                <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              {/* LinkedIn */}
              <a 
                href="https://linkedin.com/school/brac-university" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                title="LinkedIn"
              >
                <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              
              {/* Twitter/X */}
              <a 
                href="https://twitter.com/bracuniversity" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-black rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                title="Twitter"
              >
                <svg className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              
              {/* Instagram */}
              <a 
                href="https://instagram.com/bracuniversity" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                title="Instagram"
              >
                <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.014 5.367 18.635.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.596-3.205-1.535l1.464-.89c.47.58 1.167.925 1.899.925 1.416 0 2.256-1.178 2.256-2.68 0-1.503-.84-2.682-2.256-2.682-.732 0-1.429.346-1.899.925l-1.464-.89c.757-.939 1.908-1.535 3.205-1.535 2.331 0 4.215 1.884 4.215 4.215S10.78 16.988 8.449 16.988zM19.523 16.075h-1.959v-1.959h1.959v1.959zM19.523 12.157h-1.959v-1.959h1.959v1.959z"/>
                </svg>
              </a>
              
              {/* YouTube */}
              <a 
                href="https://youtube.com/@bracuniversity" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                title="YouTube"
              >
                <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              
              {/* ResearchGate */}
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-700 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                title="ResearchGate"
              >
                <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.677-.242.741-.242 1.677 0 2.419.242.741.65 1.3 1.213 1.677.565.377 1.255.565 2.073.565.817 0 1.508-.188 2.073-.565.563-.377.97-.936 1.213-1.677.242-.742.242-1.678 0-2.419-.243-.741-.65-1.3-1.213-1.677C21.094.188 20.403 0 19.586 0zM8.217 5.836c-1.69 0-3.036.086-4.297.086v2.024c.96 0 1.296.086 1.296 1.243V16.7c0 1.114-.422 1.114-1.296 1.114v2.024h8.16v-2.024c-.873 0-1.297 0-1.297-1.114v-3.97h.17c2.613 0 4.728-2.024 4.728-4.942C15.681 7.86 13.651 5.836 8.217 5.836z"/>
                </svg>
              </a>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Stay connected with our latest research 
              updates and announcements.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © 2025 Sustainable Energy and Smart Grid Research. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <Link to="#" className="hover:text-cyan-400 transition-colors">FAQ</Link>
            <Link to="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-cyan-400 transition-colors">Terms & Conditions</Link>
            <Link to="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link>
          </div>
          
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 text-sm text-gray-300 hover:text-cyan-400 transition-colors group mt-4 md:mt-0"
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