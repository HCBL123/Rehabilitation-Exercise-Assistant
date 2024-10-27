// src/components/ExerciseCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExerciseCard = ({ exercise }) => {
  const navigate = useNavigate();

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <img 
        src={exercise.imageUrl} 
        alt={exercise.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      
      <h3 className="text-xl font-semibold mb-2">{exercise.name}</h3>
      <p className="text-gray-600 mb-4">{exercise.description}</p>
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">
          Duration: {exercise.duration}
        </span>
        <span className="text-sm text-gray-500">
          Difficulty: {exercise.difficulty}
        </span>
      </div>
      
      <button 
        onClick={() => navigate(`/compare/${exercise.id}`)}
        className="btn-primary w-full"
      >
        Start Exercise
      </button>
    </div>
  );
};

export default ExerciseCard;