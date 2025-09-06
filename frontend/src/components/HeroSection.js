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
  onScrollClick
}) => {
  const defaultBg = "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGdyaWR8ZW58MHx8fHwxNzU2NTM1MTU3fDA&ixlib=rb-4.1.0&q=85";
  
  return (
    <section className={`relative ${height} flex items-center justify-center overflow-hidden`}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage || defaultBg})`
        }}
      />
      
      {/* Gradient Overlay */}
      {gradient && (
        <div className="absolute inset-0 hero-gradient-overlay" />
      )}
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          {subtitle && (
            <p className="text-primary-400 font-medium text-lg mb-4 tracking-wide uppercase">
              {subtitle}
            </p>
          )}
          
          <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-heading text-white mb-6 leading-tight">
            {title}
          </h1>
          
          {description && (
            <p className="hero-subtitle text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
          
          {buttons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              {buttons.map((button, index) => (
                <button
                  key={index}
                  onClick={button.onClick}
                  className={`${button.variant === 'secondary' ? 'btn-secondary' : 'btn-primary'} flex items-center space-x-2`}
                >
                  <span>{button.text}</span>
                  {button.icon && <button.icon className="h-5 w-5" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            onClick={onScrollClick}
            className="flex flex-col items-center space-y-2 text-white/70 hover:text-white transition-colors"
          >
            <span className="text-sm">Scroll to explore</span>
            <ChevronDown className="h-6 w-6" />
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroSection;