import React from 'react';

const About = () => {
  const teamMembers = [
    
    {
      name: "Mohammed Hamza Fikri",
      role: "Owner",
      image: "https://avatars.githubusercontent.com/u/103943413?v=4",
      description: "Tech innovator passionate about green technology and sustainable solutions."
    },
    
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-green-800/80"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="flex items-center justify-center mb-6">
            <span className="text-4xl mr-4">🌱</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white">About EcoWeb</h1>
          </div>
          <p className="text-xl text-white opacity-90 max-w-2xl mx-auto">
            Empowering Sustainable Development Through Technology
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 transform hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4">🌍</span>
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            At EcoWeb, we are dedicated to creating innovative solutions that bridge the gap between technology and environmental sustainability. Our platform connects developers, environmentalists, and communities to collaborate on projects that make a real difference in the world.
          </p>
        </div>

        {/* What We Do & Values Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center mb-6">
              <span className="text-4xl mr-4">💡</span>
              <h2 className="text-2xl font-bold text-gray-900">What We Do</h2>
            </div>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">•</span>
                <span>Connect developers with environmental projects worldwide</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">•</span>
                <span>Provide cutting-edge tools for project management and collaboration</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">•</span>
                <span>Track and measure environmental impact with precision</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">•</span>
                <span>Foster community engagement in sustainability initiatives</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center mb-6">
              <span className="text-4xl mr-4">✨</span>
              <h2 className="text-2xl font-bold text-gray-900">Our Values</h2>
            </div>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">•</span>
                <span>Environmental Stewardship: Protecting our planet for future generations</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">•</span>
                <span>Innovation: Pushing boundaries in green technology</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">•</span>
                <span>Community: Building strong, sustainable networks</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl">•</span>
                <span>Transparency: Open and honest in all our operations</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          <div className="flex justify-center">
            <div className="max-w-sm bg-white rounded-2xl shadow-xl p-6 transform hover:scale-[1.02] transition-transform duration-300">
              <img
                src={teamMembers[0].image}
                alt={teamMembers[0].name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{teamMembers[0].name}</h3>
              <p className="text-green-600 text-center mb-4">{teamMembers[0].role}</p>
              <p className="text-gray-600 text-center">{teamMembers[0].description}</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-green-400 rounded-2xl shadow-xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Whether you're a developer looking to contribute to environmental projects, an organization seeking technical solutions, or someone passionate about sustainability, EcoWeb provides the platform to make a difference.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/register"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-base font-medium rounded-full text-white hover:bg-white hover:text-green-600 transition-all duration-300"
            >
              Get Started
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-base font-medium rounded-full text-white hover:bg-white hover:text-green-600 transition-all duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 