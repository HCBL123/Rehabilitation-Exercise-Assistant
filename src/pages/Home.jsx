// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Rehabilitation Exercise Assistant
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your personal guide to safe and effective rehabilitation exercises
        </p>
        <Link to="/exercises" className="btn-primary text-lg">
          Start Exercising
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <FeatureCard 
          title="Easy to Follow"
          description="Clear instructions and real-time feedback"
          icon="📱"
        />
        <FeatureCard 
          title="Safe Practice"
          description="Designed for elderly users with safety in mind"
          icon="🛡️"
        />
        <FeatureCard 
          title="Track Progress"
          description="Monitor your improvement over time"
          icon="📈"
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }) => (
  <div className="card text-center">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Home;