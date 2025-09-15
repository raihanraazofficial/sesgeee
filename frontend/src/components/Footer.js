import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, ArrowUp, Clock } from 'lucide-react';
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
          {/* SESG Research Info */}
          <div className="col-span-1">
            <div className="flex flex-col items-center text-center mb-6">
              <img 
                src={settings.logo || "https://customer-assets.emergentagent.com/job_da31abd5-8dec-452e-a49e-9beda777d1d4/artifacts/ii07ct2o_Logo.jpg"} 
                alt="SESG Research Logo" 
                className="h-24 w-24 object-contain mb-4"
              />
              <div>
                <h3 className="text-xl font-bold text-cyan-400 mb-2">
                  SESG Research
                </h3>
                <p className="text-base text-gray-300">Sustainable Energy & Smart Grid Research</p>
              </div>
            </div>
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
                <a href="https://engineering.bracu.ac.bd/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  BSRM School of Engineering ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Find Us */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Find Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">sesg.eee@bracu.ac.bd</span>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">Sunday - Thursday: 9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <div>BRAC University</div>
                  <div>Kha 224 Bir Uttam Rafiqul Islam Ave,</div>
                  <div>Merul Badda, Dhaka-1212, Bangladesh</div>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div>
            <div className="w-full h-32 rounded-lg overflow-hidden shadow-lg border border-gray-700">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.0906415649384!2d90.42482!3d23.773206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xec0c4aa9b5a9d7e5!2sBRAC%20University!5e0!3m2!1sen!2sbd!4v1703920000000!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="BRAC University Location"
              />
            </div>
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