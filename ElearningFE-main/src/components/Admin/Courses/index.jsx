import { Edit, Trash2, MoreVertical, Plus, Star, Search } from "lucide-react";
import AddCourse from "../AddCourse";
import { useState } from "react";
import EditCourse from "../EditCourse";
import CourseInformation from "../CourseInformation";
import * as courseService from "../../../service/courseService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const Courses = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  const [openInfo, setOpenInfo] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const fetchCourses = async (page, size) => {
    const data = await courseService.getAllCourses(page, size);
    return data;
  };

  const { data: courses = [], refetch } = useQuery({
    queryKey: ["admin-courses", page, size],
    queryFn: () => fetchCourses(page, size),
  });

  const courseList = courses?.data?.content || [];
  const totalPages = courses?.data?.totalPages || 1;

  const handleDeleteCourse = async (id) => {
    try {
      const res = await courseService.deleteCourseById(id);
      console.log(res);
      if (res.success === true) {
        toast.success("Xóa khóa học thành công!");
        setOpenEdit(false);
        setOpenInfo(false);
        setSelectedCourseId(null);
        refetch();
      }
    } catch (e) {
      toast.error("Xóa khóa học thất bại!");
    }
  };

  const fCurrency = (n) => "₫" + n.toLocaleString("vi-VN");
  return (
    <div>
      <div className="border-b border-red-200 p-4 justify-between flex items-center">
        <div className="font-bold text-2xl text-red-500 ">Tất cả khoá học</div>
        <div className="flex items-center">
          <div className="flex items-center border border-red-400 rounded-full px-3 py-4 hover:bg-red-50 focus-within:!bg-white focus-within:ring-2 focus-within:ring-red-500 mx-4 cursor-pointer ">
            <Search className="text-gray-500 me-2 " size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="flex-1 outline-none text-sm"
            />
          </div>
          
        </div>
      </div>
      <div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b border-red-200 text-red-400 text-sm">
            <tr>
              <th className="py-3 px-4">Tên khoá học</th>
              <th className="py-3 px-4">Giảng viên</th>
              <th className="py-3 px-4">Học viên</th>
              <th className="py-3 px-4">Giá</th>
              <th className="py-3 px-4">Đánh giá</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-red-200 ">
            {courses?.data?.content.map((c) => (
              <tr key={c.id}>
                <td className="py-3 px-4 flex items-center gap-3">
                  <img
                    src={c.thumbnail}
                    alt=""
                    className="w-10 h-10 rounded-lg border border-red-200"
                  />
                  <span className="font-bold truncate">{c.title}</span>
                </td>
                <td className="py-4 px-4 text-gray-500 truncate">
                  {c.instructorName}
                </td>
                <td className="py-3 px-4 font-semibold">{c.enrollmentCount}</td>
                <td className="py-3 px-4 font-semibold">
                  {fCurrency(c.price)}
                </td>
                <td className="py-3 px-4 align-middle whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Star
                      size={16}
                      className="text-yellow-500 fill-yellow-500"
                    />
                    {c.averageRating}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 rounded-full text-green-700 bg-green-100 text-xs font-medium">
                    {c.status}
                  </span>
                </td>
                
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-3 text-gray-500">
                    <button
                      onClick={() => {
                        setSelectedCourseId(c.id);
                        setOpenEdit(true);
                      }}
                      className="hover:text-red-500"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(c.id)}
                      className="hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCourseId(c.id);
                        setOpenInfo(true);
                      }}
                      className="hover:text-red-700"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center space-x-1 justify-center mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-red-200 disabled:opacity-50"
        >
          Trước
        </button>

        {Array.from({ length: totalPages }, (_, i) => i)
          .filter(
            (n) =>
              n === 0 ||
              n === totalPages - 1 ||
              (n >= page - 2 && n <= page + 2)
          )
          .map((n, idx, arr) => {
            const isEllipsis =
              idx > 0 && n !== arr[idx - 1] + 1;

            return (
              <span key={n} className="flex items-center">
                {isEllipsis && <span className="px-2">...</span>}
                <button
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 rounded ${
                    page === n
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 hover:bg-red-200"
                  }`}
                >
                  {n + 1}
                </button>
              </span>
            );
          })}

        <button
          onClick={() =>
            setPage((p) => Math.min(p + 1, totalPages - 1))
          }
          disabled={page === totalPages - 1}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-red-200 disabled:opacity-50"
        >
          Sau
        </button>
      </div>

      {openAdd && <AddCourse onClose={() => setOpenAdd(false)} onOpenEdit={(id) => {
          setEditCourseId(id);
          setOpenEdit(true);
        }} />}
      {openEdit && (
        <EditCourse
          courseId={selectedCourseId}
          onClose={() => setOpenEdit(false)}
          
        />
      )}
      {openInfo && (
        <CourseInformation
          courseId={selectedCourseId}
          onClose={() => setOpenInfo(false)}
        />
      )}
    </div>
  );
};

export default Courses;
