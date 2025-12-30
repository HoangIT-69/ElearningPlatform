const teachers = [
  {
    name: "Nguyễn Hùng Cường",
    title: "Senior Software Engineer",
    avatar: " https://randomuser.me/api/portraits/lego/0.jpg",
    exp: "8 năm kinh nghiệm lập trình và đào tạo",
  },
  {
    name: "Nguyễn Hùng Cường",
    title: "UI/UX Lead Designer",
    avatar: "https://randomuser.me/api/portraits/lego/4.jpg",
    exp: "Đã hướng dẫn hơn 1200 học viên",
  },
  {
    name: "Nguyễn Hùng Cường",
    title: "Data Analyst Mentor",
    avatar: "https://randomuser.me/api/portraits/lego/3.jpg",
    exp: "Chuyên gia phân tích dữ liệu doanh nghiệp",
  },
];

export default function TeachersSection() {
  return (
    <div className="py-12 md:py-20 bg-gradient-to-br from-white to-red-50 border-b border-red-200">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-8 md:mb-12 text-red-500">
          Giảng viên tiêu biểu
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 px-5 md:px-20">
          {teachers.map((teacher, index) => (
            <div
              key={index}
              className="bg-white border border-red-200 rounded-xl p-6 md:p-8 shadow-sm hover:-translate-y-2 transition"
            >
              <img
                src={teacher.avatar}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="font-bold text-lg">{teacher.name}</h3>
              <p className="text-gray-600">{teacher.title}</p>
              <p className="text-sm mt-2 text-gray-500">{teacher.exp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
