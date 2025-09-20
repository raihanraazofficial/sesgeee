import React from 'react';
import { ChevronDown } from 'lucide-react';

const HeroSection = ({ 
  title, 
  subtitle, 
  description, 
  backgroundImage, 
  gradient = true,
  height = "h-screen",
  buttons = [],
  showScrollIndicator = false,
  onScrollClick,
  enableAnimations = false
}) => {
  
  return (
    <section className={`relative ${height} flex items-center justify-center overflow-hidden`}>
      {/* Solid Color Background - No Photo */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      
      {/* Animated floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-teal-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-r from-blue-400/15 to-cyan-500/15 rounded-full blur-2xl animate-bounce slow-bounce"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-gradient-to-r from-teal-400/25 to-emerald-500/25 rounded-full blur-lg animate-pulse delay-1000"></div>
      </div>
      
      {/* Content - Moved further down and centered */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ marginTop: '80px' }}>
        <div className={enableAnimations ? "animate-hero-fade-in" : ""}>
          {subtitle && (
            <p className={`text-cyan-400 font-semibold text-lg mb-4 tracking-wide uppercase ${enableAnimations ? 'animate-slide-up' : ''}`}>
              {subtitle}
            </p>
          )}
          
          <h1 className={`hero-title text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold font-heading mb-3 leading-tight ${enableAnimations ? 'animate-scale-in' : ''}`}>
            {enableAnimations ? (
              <>
                <span className="bg-gradient-to-r from-white via-gray-100 to-cyan-200 bg-clip-text text-transparent drop-shadow-lg">
                  Sustainable Energy &
                </span>
                <br />
                <span className="bg-clip-text text-transparent animate-gradient-x" style={{ color: '#4FE1BF' }}>
                  Smart Grid Research
                </span>
              </>
            ) : (
              <span className="bg-gradient-to-r from-white via-gray-100 to-cyan-200 bg-clip-text text-transparent drop-shadow-lg">
                {title}
              </span>
            )}
          </h1>
          
          {description && (
            <p className={`hero-subtitle text-lg md:text-xl text-gray-200 mb-2 max-w-3xl mx-auto leading-relaxed ${enableAnimations ? 'animate-fade-up delay-300 animate-pulse-light' : ''}`}>
              {description}
            </p>
          )}
          
          {buttons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10 animate-fade-up delay-500">
              {buttons.map((button, index) => (
                <button
                  key={index}
                  onClick={button.onClick}
                  className="relative overflow-hidden group bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-3"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">{button.text}</span>
                  {button.icon && <button.icon className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Enhanced Scroll Indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-gentle-bounce">
          <button
            onClick={onScrollClick}
            className="flex flex-col items-center space-y-2 text-gray-300 hover:text-cyan-300 transition-all duration-300 group"
          >
            <span className="text-sm font-medium tracking-wide">Scroll to explore</span>
            <div className="relative">
              <ChevronDown className="h-6 w-6 group-hover:translate-y-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
            </div>
          </button>
        </div>
      )}
      
      <style jsx>{`
        @keyframes hero-fade-in {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gentle-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
        
        .animate-hero-fade-in {
          animation: hero-fade-in 1.2s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s both;
        }
        
        .animate-scale-in {
          animation: scale-in 0.8s ease-out 0.4s both;
        }
        
        .animate-fade-up {
          animation: fade-up 0.8s ease-out both;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 4s ease infinite;
        }
        
        .animate-gentle-bounce {
          animation: gentle-bounce 2s ease-in-out infinite;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-500 {
          animation-delay: 0.5s;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .slow-bounce {
          animation-duration: 3s;
        }
        

        
        @keyframes pulse-light {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }
        
        .animate-pulse-light {
          animation: pulse-light 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;