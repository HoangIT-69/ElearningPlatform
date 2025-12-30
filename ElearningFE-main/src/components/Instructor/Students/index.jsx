import { useQuery } from "@tanstack/react-query";
import * as courseService from "../../../service/admin/courseService";

const Students = ({ onClose, courseId }) => {
  const fetchStudents = async () => {
    if (!courseId) return [];
    const res = await courseService.getStudentsByCourseId(courseId);
    return res.data || [];
  };

  const { data: students = [] } = useQuery({
    queryKey: ["course-students", courseId],
    queryFn: fetchStudents,
    enabled: Boolean(courseId),
  });

  return (
    <div
      className="fixed inset-0 bg-red/40 backdrop-blur-sm overflow-y-auto flex justify-center py-10 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-xl w-5/6 border border-red-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-bold text-lg text-red-500 border-b border-red-200 pb-4 mb-6">
          Học viên của khoá học
        </div>
        <div>
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b border-red-200 text-red-400 text-sm">
              <tr>
                <th className="py-3 px-4">Tên học viên</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Số điện thoại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-200">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-500">
                    Chưa có học viên đăng ký
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id}>
                    <td className="py-3 px-4 font-bold text-red-500 truncate">
                      {s.fullName}
                    </td>

                    <td className="py-3 px-4 text-gray-500 truncate">
                      {s.email}
                    </td>

                    <td className="py-3 px-4 text-gray-500 truncate">
                      {s.phone}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;
