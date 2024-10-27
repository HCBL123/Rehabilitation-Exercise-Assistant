// src/components/Loading.jsx
import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600" />
    </div>
  );
};

export default Loading;