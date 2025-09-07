import React, { useState, useEffect } from 'react';
import { Calendar, ExternalLink, Settings } from 'lucide-react';

const GoogleCalendar = ({ calendarLink, title = "Upcoming Events Calendar", height = 400 }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (calendarLink) {
      setIsLoading(false);
    }
  }, [calendarLink]);

  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Failed to load calendar. Please check the calendar link.');
  };

  if (!calendarLink) {
    return (
      <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 text-center">
        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">
          Events calendar will be displayed here once configured by the admin.
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Settings className="h-4 w-4" />
          <span>Calendar integration managed through admin panel</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary-600" />
          <span>{title}</span>
        </h3>
        {calendarLink && (
          <a
            href={calendarLink.replace('/embed', '')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            <span>Open in Google Calendar</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
      
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-2 text-gray-600">Loading calendar...</span>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
            <div className="text-center">
              <div className="text-red-600 mb-2">⚠️ Calendar Error</div>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        <iframe
          src={calendarLink}
          style={{ border: 0 }}
          width="100%"
          height={height}
          frameBorder="0"
          scrolling="no"
          title={title}
          onLoad={handleLoad}
          onError={handleError}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default GoogleCalendar;