import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ArrowUp } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'sesg@bracu.ac.bd',
      link: 'mailto:sesg@bracu.ac.bd'
    },
    {
      icon: Phone,
      title: 'Phone',
      details: '+880-2-9844051-4',
      link: 'tel:+88029844051'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: 'BRAC University, 66 Mohakhali, Dhaka 1212, Bangladesh',
      link: 'https://maps.google.com/?q=BRAC+University+Dhaka'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Contact Us"
        description="Get in touch with our research team. We welcome collaborations, inquiries, and partnerships in sustainable energy and smart grid research."
        backgroundImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxjb250YWN0JTIwdXN8ZW58MHx8fHwxNzU2NjU0MTQ5fDA&ixlib=rb-4.1.0&q=85"
        height="h-96"
      />

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <div className="mb-12">
                <h2 className="text-3xl font-bold font-heading text-gray-900 mb-6">
                  Get In Touch
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  We're always interested in connecting with researchers, students, industry partners, 
                  and anyone passionate about sustainable energy and smart grid technologies. 
                  Reach out to us for collaborations, research opportunities, or general inquiries.
                </p>
              </div>

              {/* Contact Info Cards */}
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="glass rounded-xl p-6 card-hover border border-gray-200 shadow-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                        <info.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-semibold mb-1">{info.title}</h3>
                        <a
                          href={info.link}
                          target={info.title === 'Address' ? '_blank' : '_self'}
                          rel={info.title === 'Address' ? 'noopener noreferrer' : ''}
                          className="text-gray-600 hover:text-primary-600 transition-colors"
                        >
                          {info.details}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Research Areas */}
              <div className="mt-12 glass rounded-xl p-6 border border-gray-200 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Research Collaboration Areas</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Smart Grid Technologies',
                    'Renewable Energy Integration',
                    'Microgrids & Distributed Energy',
                    'Power System Automation',
                    'Energy Storage Systems',
                    'Cybersecurity & AI'
                  ].map((area, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                      <span className="text-gray-600 text-sm">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass rounded-xl p-8 border border-gray-200 shadow-lg">
              <h3 className="text-2xl font-bold font-heading text-gray-900 mb-6">
                Send us a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="form-input"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="form-input"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="form-input"
                    placeholder="Enter message subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="6"
                    className="form-textarea"
                    placeholder="Enter your message..."
                    value={formData.message}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="spinner" />
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  We typically respond within 24-48 hours during business days.
                </p>
              </div>
            </div>
          </div>

          {/* Location Map Placeholder */}
          <div className="mt-20">
            <div className="glass rounded-xl p-8 text-center border border-gray-200 shadow-lg">
              <h3 className="text-2xl font-bold font-heading text-gray-900 mb-4">Visit Our Location</h3>
              <p className="text-gray-600 mb-6">
                Located at BRAC University, one of Bangladesh's leading private universities
              </p>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Interactive map coming soon</p>
                </div>
              </div>
            </div>
          </div>

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

export default Contact;