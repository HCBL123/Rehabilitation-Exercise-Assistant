import React from 'react';
import { Smartphone, Shield, Activity, Clock, Award, Users, Mail, ArrowRight } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-start gap-4">
      <div className="p-3 bg-primary-50 rounded-lg">
        <Icon className="w-6 h-6 text-primary-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  </div>
);

const BenefitItem = ({ title, description }) => (
  <div className="flex items-center gap-3">
    <div className="flex-shrink-0">
      <ArrowRight className="w-5 h-5 text-primary-600" />
    </div>
    <div>
      <h4 className="font-medium">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            Trợ Lý Phục Hồi Chức Năng Thông Minh
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto text-primary-100">
            Giải pháp công nghệ hiện đại hỗ trợ phục hồi chức năng tại nhà cho người cao tuổi
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Mission Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Sứ Mệnh của Chúng Tôi</h2>
          <p className="text-lg text-gray-700 text-center">
            Chúng tôi cam kết mang đến giải pháp phục hồi chức năng hiện đại,
            an toàn và hiệu quả cho người cao tuổi tại Việt Nam. Thông qua việc
            kết hợp công nghệ trí tuệ nhân tạo với kinh nghiệm y tế, chúng tôi
            giúp người dùng tập luyện đúng cách ngay tại nhà.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={Smartphone}
            title="Dễ Dàng Sử Dụng"
            description="Giao diện thân thiện, hướng dẫn chi tiết bằng tiếng Việt, phù hợp với người cao tuổi"
          />
          <FeatureCard
            icon={Shield}
            title="An Toàn Tối Đa"
            description="Các bài tập được thiết kế bởi chuyên gia phục hồi chức năng với độ an toàn cao"
          />
          <FeatureCard
            icon={Activity}
            title="Theo Dõi Thời Gian Thực"
            description="Công nghệ AI phân tích và đưa ra phản hồi ngay lập tức về tư thế tập luyện"
          />
          <FeatureCard
            icon={Clock}
            title="Linh Hoạt Thời Gian"
            description="Tập luyện mọi lúc mọi nơi, phù hợp với thời gian biểu của người cao tuổi"
          />
          <FeatureCard
            icon={Award}
            title="Chất Lượng Đảm Bảo"
            description="Được chứng nhận về độ chính xác và hiệu quả bởi các chuyên gia y tế"
          />
          <FeatureCard
            icon={Users}
            title="Hỗ Trợ Tận Tình"
            description="Đội ngũ hỗ trợ chuyên nghiệp, sẵn sàng giải đáp mọi thắc mắc"
          />
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Lợi Ích Khi Sử Dụng Hệ Thống</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <BenefitItem
              title="Tiết Kiệm Chi Phí"
              description="Giảm thiểu chi phí di chuyển và tập luyện so với phương pháp truyền thống"
            />
            <BenefitItem
              title="Tập Luyện Tại Nhà"
              description="Không cần đến trung tâm phục hồi chức năng, phù hợp trong mùa dịch"
            />
            <BenefitItem
              title="Theo Dõi Tiến Độ"
              description="Ghi nhận và đánh giá sự tiến bộ qua từng buổi tập"
            />
            <BenefitItem
              title="Tùy Chỉnh Linh Hoạt"
              description="Điều chỉnh cường độ và thời gian tập phù hợp với thể trạng"
            />
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-primary-50 rounded-xl p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Liên Hệ Với Chúng Tôi</h2>
            <p className="text-gray-600 mb-6">
              Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi:
            </p>
            <div className="flex items-center justify-center gap-4">
              <Mail className="w-6 h-6 text-primary-600" />
              <a
                href="mailto:hoangcongbaolong23a5@lqddn.edu.vn"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                hoangcongbaolong23a5@lqddn.edu.vn
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
