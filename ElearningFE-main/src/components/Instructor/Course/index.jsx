import { Edit, Trash2, MoreVertical, Search, Star } from "lucide-react";
import { useState } from "react";
import EditCourse from "../EditCourse";
import CourseInformation from "../CourseInformation";
import * as courseService from "../../../service/courseService";
import { getMyInstructorCourses } from "../../../service/courseService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Students from "../Students";

const Course = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [openEdit, setOpenEdit] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [openStudents, setOpenStudents] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const instructorId = localStorage.getItem('userId');

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ["instructor-courses", instructorId, page, size],
    queryFn: async () => {
      if (!instructorId) return null;
      const res = await getMyInstructorCourses(instructorId);
      console.log("Dữ liệu API trả về:", res); // Bạn hãy F12 xem log này để check cấu trúc
      return res;
    },
    enabled: !!instructorId,
  });

  const courseList = response?.data?.content || response?.data || [];
  const totalPages = response?.data?.totalPages || 1;

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khóa học này?")) return;
    try {
      await courseService.deleteCourseById(id);
      toast.success("Xóa khóa học thành công!");
      refetch();
    } catch (e) {
      toast.error("Xóa khóa học thất bại!");
    }
  };

  if (isLoading) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

  return (
    <div>
      <div className="border-b border-red-200 p-4 justify-between flex items-center">
        <div className="font-bold text-2xl text-red-500 ">Khóa học của tôi</div>
        <div className="flex items-center">
          <div className="flex items-center border border-red-400 rounded-full px-3 py-2 hover:bg-red-50 mx-4">
            <Search className="text-gray-500 me-2 " size={18} />
            <input type="text" placeholder="Tìm kiếm" className="outline-none text-sm" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b border-red-200 text-red-400 text-sm">
            <tr>
              <th className="py-3 px-4">Khoá học</th>
              <th className="py-3 px-4">Giảng viên</th>
              <th className="py-3 px-4">Đánh giá</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4 text-center">Hành động</th>
              <th className="py-3 px-4">Học viên</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-red-200">
            {courseList.length > 0 ? (
              courseList.map((c) => (
                <tr key={c.id} className="hover:bg-red-50 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={c.thumbnail || "https://via.placeholder.com/40"}
                      className="w-10 h-10 rounded-lg border border-red-200 object-cover"
                      alt=""
                    />
                    <span className="font-bold truncate max-w-[200px]">{c.title}</span>
                  </td>
                  <td className="py-4 px-4 text-gray-500">{c.instructorName || "Bạn"}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      {c.averageRating || 0}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 rounded-full text-green-700 bg-green-100 text-xs font-medium">
                      {c.status || "Hoạt động"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-3 text-gray-500">
                      <button onClick={() => { setSelectedCourseId(c.id); setOpenEdit(true); }} className="hover:text-red-500">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteCourse(c.id)} className="hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                      <button onClick={() => { setSelectedCourseId(c.id); setOpenInfo(true); }} className="hover:text-red-700">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => { setSelectedCourseId(c.id); setOpenStudents(true); }}
                      className="font-semibold text-sm text-white bg-red-500 hover:bg-red-600 rounded-full px-4 py-1"
                    >
                      Học viên
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-400">Bạn chưa có khóa học nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center space-x-1 justify-center mt-6 mb-10">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
          >
            Trước
          </button>
          <span className="px-4 py-2 font-medium">Trang {page + 1} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            disabled={page === totalPages - 1}
            className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}

      {openEdit && <EditCourse courseId={selectedCourseId} onClose={() => { setOpenEdit(false); refetch(); }} />}
      {openInfo && <CourseInformation courseId={selectedCourseId} onClose={() => setOpenInfo(false)} />}
      {openStudents && <Students courseId={selectedCourseId} onClose={() => setOpenStudents(false)} />}
    </div>
  );
};

export default Course;