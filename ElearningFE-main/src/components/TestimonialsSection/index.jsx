import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Nguyễn Tuấn Anh",
    role: "Frontend Developer",
    avatar: "https://i.pravatar.cc/150?img=32",
    review:
      "Khóa học rất dễ hiểu, giảng viên nhiệt tình. Mình đã tự tin apply và được nhận vào vị trí mới.",
  },
  {
    name: "Khương Văn Cương",
    role: "UI/UX Designer",
    avatar: "https://i.pravatar.cc/150?img=21",
    review:
      "Lộ trình rõ ràng, học đến đâu áp dụng được ngay. Cộng đồng học viên hỗ trợ rất tốt.",
  },
  {
    name: "Đinh Nhật Hoàng",
    role: "Backend Engineer",
    avatar: "https://i.pravatar.cc/150?img=14",
    review:
      "Học xong mình tự tin hơn rất nhiều. Mentor trả lời câu hỏi rất nhanh và chi tiết.",
  },
];

export default function TestimonialsSection() {
  return (
    <div className="py-12 md:py-20 bg-white border-b border-red-200">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-8 md:mb-12 text-red-500">
          Cảm nhận học viên
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 px-5 md:px-20">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="p-6 md:p-8 border border-red-200 rounded-xl shadow-sm hover:shadow-lg transition"
            >
              <p className="text-gray-600 mb-4 text-sm italic">
                "{item.review}"
              </p>
              <h3 className="font-semibold text-lg text-gray-800">
                {item.name}
              </h3>
              <p className="text-gray-500 text-sm">{item.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
