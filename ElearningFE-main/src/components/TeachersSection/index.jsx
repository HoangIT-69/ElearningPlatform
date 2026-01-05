import { useQuery } from "@tanstack/react-query";
import * as userService from "../../service/admin/userService";
import { Users, Star, BookOpen } from "lucide-react"; // Import thêm icon

export default function TeachersSection() {
  const fetchTeachers = async () => {
    return await userService.getPopularInstructors(4);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["popularInstructors"],
    queryFn: fetchTeachers,
  });

  if (isLoading) {
    return <p className="text-center py-10">Đang tải giảng viên...</p>;
  }

  // Backend trả về: { success: true, data: [...] }
  // Nên teachers sẽ lấy data.data
  const teachers = data?.data || [];

  return (
    <div className="py-12 md:py-20 bg-gradient-to-br from-white to-red-50 border-b border-red-200">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-8 md:mb-12 text-red-500">
          Giảng viên tiêu biểu
        </h2>

        {teachers.length === 0 ? (
           <p className="text-gray-500">Chưa có giảng viên nổi bật.</p>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10 px-5 md:px-20">
          {teachers.map((teacher) => (
            <div
              key={teacher.instructorId}
              className="bg-white border border-red-200 rounded-xl p-6 md:p-8 shadow-sm hover:-translate-y-2 transition flex flex-col h-full"
            >
              <img
                src={
                  teacher.avatar ||
                  "https://static.vecteezy.com/system/resources/previews/024/766/958/non_2x/default-male-avatar-profile-icon-social-media-user-free-vector.jpg"
                }
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-red-100"
                alt={teacher.fullName}
              />

              <h3 className="font-bold text-lg mb-2">{teacher.fullName}</h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                {teacher.bio || "Giảng viên nhiệt huyết"}
              </p>

              {/* Phần thống kê thêm Icon cho sinh động */}
              <div className="flex justify-center items-center gap-4 mt-auto pt-4 border-t border-gray-100 text-sm text-gray-500">
                <div className="flex items-center gap-1" title="Số học viên">
                    <Users size={16} className="text-blue-500"/>
                    <span>{teacher.totalStudents}</span>
                </div>
                <div className="flex items-center gap-1" title="Đánh giá trung bình">
                    <Star size={16} className="text-yellow-500 fill-yellow-500"/>
                    <span>{teacher.averageRating}</span>
                </div>
                <div className="flex items-center gap-1" title="Số khóa học">
                    <BookOpen size={16} className="text-red-500"/>
                    <span>{teacher.totalCourses}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}