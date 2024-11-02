// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center"
      style={{ backgroundImage: 'url("/assets/images/26358.jpg")' }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Chào mừng đến với Trợ lý hỗ trợ tập luyện phục hồi chức năng
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Hỗ trợ bạn để tự luyện tập phục hồi chức năng an toàn và hiệu quả
          </p>
          <Link
            to="/exercises"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg shadow-lg hover:shadow-xl"
          >
            Bắt đầu Tập luyện
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            title="Dễ Thực hiện"
            description="Hướng dẫn rõ ràng và phản hồi theo thời gian thực"
            icon={<PhoneIcon />}
          />
          <FeatureCard
            title="Tập luyện An toàn"
            description="Được thiết kế cho người cao tuổi với ưu tiên về an toàn"
            icon={<ShieldIcon />}
          />
          <FeatureCard
            title="Theo dõi Tiến độ"
            description="Giám sát sự cải thiện của bạn theo thời gian"
            icon={<ChartIcon />}
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }) => (
  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-all hover:bg-white/90">
    <div className="text-blue-600 mb-4 flex justify-center">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-700">{description}</p>
  </div>
);

// Custom SVG icons for better visual quality
const PhoneIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <circle cx="12" cy="18" r="2" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L3 7v6a12 12 0 0 0 9 11.66A12 12 0 0 0 21 13V7l-9-5z" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3v18h18" />
    <path d="M18 9l-5 5-2-2-4 4" />
  </svg>
);

export default Home;
