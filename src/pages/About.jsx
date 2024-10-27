// src/pages/About.jsx
import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">About Rehabilitation Assistant</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600">
            We aim to help elderly people maintain and improve their physical
            health through guided rehabilitation exercises. Our system uses
            advanced pose estimation technology to provide real-time feedback
            and ensure exercises are performed correctly.
          </p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <ol className="list-decimal pl-4 space-y-2 text-gray-600">
            <li>Choose an exercise from our curated list</li>
            <li>Follow the on-screen instructions</li>
            <li>Get real-time feedback on your form</li>
            <li>Track your progress over time</li>
          </ol>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Safety First</h2>
          <p className="text-gray-600">
            All exercises are designed with safety in mind and are suitable
            for elderly users. Always consult with your healthcare provider
            before starting any new exercise routine.
          </p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions or feedback, please don't hesitate
            to reach out to us at:
          </p>
          <a 
            href="mailto:support@rehabassistant.com"
            className="text-primary-600 hover:underline"
          >
            support@rehabassistant.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;