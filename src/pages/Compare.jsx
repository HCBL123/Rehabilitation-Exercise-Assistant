import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getExerciseById } from '../data/exercises';
import EnhancedExerciseComparison from '../components/ExerciseComparison';
import Loading from '../components/Loading';

const Compare = () => {
  const { exerciseId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [exercise, setExercise] = useState(null);

  React.useEffect(() => {
    const loadExercise = async () => {
      try {
        const exerciseData = getExerciseById(exerciseId);
        if (!exerciseData) {
          throw new Error('Không tìm thấy bài tập');
        }
        setExercise(exerciseData);
      } catch (error) {
        console.error('Lỗi khi tải bài tập:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExercise();
  }, [exerciseId]);

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{exercise?.name}</h1>
      <EnhancedExerciseComparison exercise={exercise} />
    </div>
  );
};

export default Compare;
