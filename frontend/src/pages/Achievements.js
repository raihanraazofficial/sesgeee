import React, { useEffect, useState } from 'react';
import { ArrowUp, Award, DollarSign, Users, Calendar } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { useData } from '../contexts/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Achievements = () => {
  const { achievements, fetchData, loading } = useData();
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredAchievements, setFilteredAchievements] = useState([]);

  useEffect(() => {
    fetchData('achievements');
  }, [fetchData]);

  useEffect(() => {
    if (achievements.length > 0) {
      let filtered = achievements;
      if (activeCategory !== 'all') {
        filtered = achievements.filter(achievement => achievement.category === activeCategory);
      }
      setFilteredAchievements(filtered);
    }
  }, [achievements, activeCategory]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'award':
        return Award;
      case 'funding':
        return DollarSign;
      case 'recognition':
        return Users;
      default:
        return Award;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'award':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'funding':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'recognition':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Achievements"
        backgroundImage="https://images.unsplash.com/photo-1553484771-371a605b060b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxhY2hpZXZlbWVudHN8ZW58MHx8fHwxNzU2NjU0MTQ5fDA&ixlib=rb-4.1.0&q=85"
        height="h-96"
        enableAnimations={false}
      />

      {/* Filter Tabs */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="flex bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
              {[
                { id: 'all', name: 'All Achievements' },
                { id: 'award', name: 'Awards' },
                { id: 'funding', name: 'Funding' },
                { id: 'recognition', name: 'Recognition' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-3 rounded-md font-medium transition-all text-sm ${
                    activeCategory === tab.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading.achievements ? (
            <LoadingSpinner text="Loading achievements..." />
          ) : (
            <>
              {filteredAchievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredAchievements.map((achievement) => {
                    const CategoryIcon = getCategoryIcon(achievement.category);
                    return (
                      <div key={achievement.id} className="glass rounded-xl p-6 card-hover border border-gray-200 shadow-lg">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${getCategoryColor(achievement.category)}`}>
                            <CategoryIcon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{achievement.name}</h3>
                            <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                              {achievement.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{achievement.year}</span>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs capitalize border ${getCategoryColor(achievement.category)}`}>
                                {achievement.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Award className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    No Achievements Found
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    {activeCategory === 'all' 
                      ? 'Our achievements database is being updated. Stay tuned as we prepare to showcase our significant achievements and milestones.'
                      : `No ${activeCategory} achievements available at the moment. Try switching to a different category.`
                    }
                  </p>
                  <div className="space-x-4">
                    {activeCategory !== 'all' && (
                      <button 
                        onClick={() => setActiveCategory('all')}
                        className="btn-secondary"
                      >
                        View All Achievements
                      </button>
                    )}
                    <button className="btn-primary">
                      View Research Impact
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Back to Top */}
          <div className="mt-12 text-center">
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors mx-auto"
            >
              <span>Back to Top</span>
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Achievements;