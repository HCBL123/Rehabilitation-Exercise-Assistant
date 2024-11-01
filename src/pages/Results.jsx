// src/pages/Results.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExerciseById } from '../data/exercises';

const Results = () => {
  const { exerciseId } = useParams();
  const exercise = getExerciseById(exerciseId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Kết Quả Bài Tập</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Tổng Kết Bài Tập</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Tên Bài Tập</p>
              <p className="font-medium">{exercise?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600">Thời Gian</p>
              <p className="font-medium">5:30 phút</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mt-8">
        <Link
          to={`/compare/${exerciseId}`}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Thử Lại
        </Link>
        <Link
          to="/exercises"
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
        >
          Chọn Bài Tập Khác
        </Link>
      </div>
    </div>
  );
};

export default Results;
