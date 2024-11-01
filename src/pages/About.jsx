// src/pages/About.jsx
import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giới Thiệu về Trợ Lý Phục Hồi Chức Năng</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Sứ Mệnh của Chúng Tôi</h2>
          <p className="text-gray-600">
            Chúng tôi hướng đến việc giúp người cao tuổi duy trì và cải thiện
            sức khỏe thể chất thông qua các bài tập phục hồi chức năng có hướng dẫn.
            Hệ thống của chúng tôi sử dụng công nghệ nhận dạng tư thế tiên tiến để
            cung cấp phản hồi theo thời gian thực và đảm bảo các bài tập được
            thực hiện đúng cách.
          </p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Cách Thức Hoạt Động</h2>
          <ol className="list-decimal pl-4 space-y-2 text-gray-600">
            <li>Chọn một bài tập từ danh sách được tuyển chọn</li>
            <li>Làm theo hướng dẫn trên màn hình</li>
            <li>Nhận phản hồi về tư thế theo thời gian thực</li>
            <li>Theo dõi tiến độ của bạn theo thời gian</li>
          </ol>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">An Toàn là Trên Hết</h2>
          <p className="text-gray-600">
            Tất cả các bài tập được thiết kế với ưu tiên về tính an toàn và
            phù hợp cho người cao tuổi. Vui lòng tham khảo ý kiến của nhà cung cấp
            dịch vụ chăm sóc sức khỏe của bạn trước khi bắt đầu bất kỳ
            chương trình tập luyện mới nào.
          </p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Liên Hệ Với Chúng Tôi</h2>
          <p className="text-gray-600">
            Nếu bạn có bất kỳ câu hỏi hoặc phản hồi nào, xin đừng ngần ngại
            liên hệ với chúng tôi tại:
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
