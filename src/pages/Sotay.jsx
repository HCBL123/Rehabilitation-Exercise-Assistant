import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

const exerciseData = [
  {
    id: 1,
    category: "Khớp vai",
    title: "Bài tập Nâng vai",
    instructions: [
      "Ngồi thẳng lưng trên ghế",
      "Nâng hai vai lên từ từ",
      "Giữ 5 giây",
      "Hạ vai xuống từ từ",
      "Lặp lại 10 lần"
    ],
    warning: "Không gắng sức quá mức. Dừng lại nếu cảm thấy đau.",
    imageUrl: "/api/placeholder/400/320"
  },
  {
    id: 2,
    category: "Khớp gối",
    title: "Bài tập Gấp duỗi gối",
    instructions: [
      "Ngồi trên ghế, chân đặt thẳng",
      "Gấp gối từ từ về phía ngực",
      "Giữ 3 giây",
      "Duỗi thẳng chân từ từ",
      "Thực hiện 15 lần mỗi chân"
    ],
    warning: "Thực hiện động tác chậm và đều. Tránh các động tác giật cục.",
    imageUrl: "/api/placeholder/400/320"
  },
  {
    id: 3,
    category: "Khớp cổ tay",
    title: "Bài tập Xoay cổ tay",
    instructions: [
      "Ngồi thoải mái, đặt cẳng tay lên bàn",
      "Xoay cổ tay theo chiều kim đồng hồ",
      "Xoay 10 vòng",
      "Đổi chiều ngược kim đồng hồ",
      "Xoay thêm 10 vòng"
    ],
    warning: "Không gắng sức nếu cảm thấy đau hoặc khó chịu.",
    imageUrl: "/api/placeholder/400/320"
  },
  {
    id: 4,
    category: "Cột sống",
    title: "Bài tập Co duỗi cột sống",
    instructions: [
      "Nằm ngửa trên thảm tập",
      "Kéo hai đầu gối về phía ngực",
      "Giữ 5 giây",
      "Thả lỏng trở về tư thế ban đầu",
      "Lặp lại 8-10 lần"
    ],
    warning: "Thực hiện nhẹ nhàng, tránh các động tác đột ngột có thể gây chấn thương.",
    imageUrl: "/api/placeholder/400/320"
  },
  {
    id: 5,
    category: "Khớp mắt cá",
    title: "Bài tập Gập duỗi mắt cá chân",
    instructions: [
      "Ngồi trên ghế, chân duỗi thẳng",
      "Gập mũi bàn chân lên trên",
      "Giữ 3 giây",
      "Duỗi mũi bàn chân xuống dưới",
      "Thực hiện 20 lần mỗi chân"
    ],
    warning: "Không gắng sức quá mức, đặc biệt nếu có tiền sử chấn thương mắt cá chân.",
    imageUrl: "/api/placeholder/400/320"
  }
];

const ExerciseCard = ({ exercise, isOpen, onToggle }) => {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-800">{exercise.title}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="mt-2 p-4 bg-white rounded-lg shadow">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            {exercise.category}
          </span>

          <img
            src={exercise.imageUrl}
            alt={exercise.title}
            className="w-full max-w-lg h-64 object-cover rounded-lg mx-auto mb-4"
          />

          <div className="space-y-2 mb-4">
            {exercise.instructions.map((instruction, index) => (
              <div key={index} className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm flex-shrink-0 mr-3">
                  {index + 1}
                </div>
                <p className="text-gray-700">{instruction}</p>
              </div>
            ))}
          </div>

          <div className="flex items-start space-x-2 p-3 bg-red-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{exercise.warning}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const Sotay = () => {
  const [openExercise, setOpenExercise] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sổ tay Bài tập Phục hồi chức năng
          </h1>
          <p className="text-gray-600">
            Hướng dẫn chi tiết các bài tập phục hồi chức năng cơ bản
          </p>
        </div>

        <div className="space-y-4">
          {exerciseData.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              isOpen={openExercise === exercise.id}
              onToggle={() => setOpenExercise(openExercise === exercise.id ? null : exercise.id)}
            />
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Lưu ý chung:</h3>
          <ul className="list-disc pl-5 space-y-1 text-blue-800">
            <li>Tham khảo ý kiến bác sĩ trước khi bắt đầu tập luyện</li>
            <li>Khởi động kỹ trước khi tập</li>
            <li>Thực hiện động tác chậm và đúng kỹ thuật</li>
            <li>Dừng ngay nếu cảm thấy đau hoặc khó chịu</li>
            <li>Tập luyện đều đặn và kiên trì</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sotay; 
