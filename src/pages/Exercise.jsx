// src/pages/Exercise.jsx
import React, { useState } from 'react';
import { exercises } from '../data/exercises';
import ExerciseCard from '../components/ExerciseCard';

const Exercise = () => {
  const [difficulty, setDifficulty] = useState('All');

  const filteredExercises = exercises.filter(exercise => 
    difficulty === 'All' || exercise.difficulty === difficulty
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Exercises</h1>
      
      {/* Difficulty Filter */}
      <div className="mb-8">
        <label className="mr-4">Filter by difficulty:</label>
        <select 
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="All">All Levels</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Exercise Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredExercises.map(exercise => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  );
};

export default Exercise;