import {
  Book,
  Clock,
  Users,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import * as courseService from "../../../service/courseService";
import { useQuery } from "@tanstack/react-query";
import { formatterVND } from "../../../utils/formatterVND";

const CourseInformation = ({ onClose, courseId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openChapterId, setOpenChapterId] = useState(null);

  const fetchCourseDetails = async () => {
    const data = await courseService.getCourseById(courseId);

    return data;
  };

  const { data: courseDetails = {} } = useQuery({
    queryKey: ["course-details", courseId],
    queryFn: fetchCourseDetails,
    enabled: !!courseId,
  });

  const fCurrency = (n) => "₫" + n.toLocaleString("vi-VN");
  return (
    <div
      className="fixed inset-0 bg-red/40 backdrop-blur-sm overflow-y-auto flex justify-center py-10 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-xl w-5/6 border border-red-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="font-bold text-2xl text-red-500">
            Thông tin khoá học
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <div className="border border-red-200 rounded-2xl p-4 space-y-4">
              <div className="font-bold text-red-500 text-2xl">
                Thông tin cơ bản
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-l font-bold">Tên khoá học</div>
                  <div className="font-bold text-2xl text-red-500">
                    {courseDetails.title}
                  </div>
                </div>

                <div>
                  <div className="text-l font-bold">Mô tả ngắn</div>
                  <div className="text-gray-600">
                    {courseDetails.shortDescription}
                  </div>
                </div>

                <div>
                  <div className="text-l font-bold">Mô tả khoá học</div>
                  <div className="text-gray-600">
                    {courseDetails.description}
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="text-l font-bold">Danh mục</div>
                    <div className="bg-red-50 rounded-2xl text-red-500 p-2 font-semibold w-fit">
                      {courseDetails.categories?.length > 0
                        ? courseDetails.categories.map((c) => c.name).join(", ")
                        : "Chưa phân loại"}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="text-l font-bold">Cấp độ</div>
                    <div className="text-gray-600">{courseDetails.level}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-red-200 rounded-2xl p-4 mt-6 space-y-4">
              <div className="text-xl text-red-500 font-bold">Giá</div>

              <div className="text-2xl font-bold">
                {formatterVND(courseDetails.price || 0)}
              </div>

              <div className="bg-red-50 rounded-2xl p-3 w-full">
                <div className="font-semibold">
                  <span className="font-bold text-red-500">Discount:</span> 70%
                  OFF
                </div>
              </div>
            </div>

            <div className="border border-red-200 rounded-2xl p-4 mt-6">
              <div className="flex justify-between items-center">
                <div className="font-bold text-red-500 text-xl">
                  Nội dung khoá học
                </div>
              </div>

              {courseDetails.chapters?.map((chapter) => (
                <div key={chapter.id} className="border rounded-lg mb-3">
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-red-50"
                    onClick={() =>
                      setOpenChapterId(
                        openChapterId === chapter.id ? null : chapter.id
                      )
                    }
                  >
                    <div className="flex gap-3 items-center">
                      <BookOpen className="text-red-500" />
                      <div>
                        <div className="font-semibold">{chapter.title}</div>
                        <div className="text-sm text-gray-500">
                          {chapter.lessons.length} bài học
                        </div>
                      </div>
                    </div>

                    {openChapterId === chapter.id ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </div>

                  {openChapterId === chapter.id && (
                    <div className="px-6 pb-3">
                      {chapter.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex justify-between py-2 border-b"
                        >
                          <span>{lesson.title}</span>
                          <span className="text-sm text-gray-500">
                            {lesson.videoDuration} phút
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="border border-red-200 rounded-2xl p-4 mt-6">
              <div className="flex justify-between items-center">
                <div className="font-bold text-red-500 text-xl">
                  Học viên sẽ học được gì
                </div>
              </div>
              {courseDetails.objectives ? (
                <div className="text-gray-700">{courseDetails.objectives}</div>
              ) : (
                <div className="text-gray-400 italic">
                  Chưa có mục tiêu học tập
                </div>
              )}
            </div>
          </div>

          <div className="col-span-4">
            <div className="border border-red-200 rounded-2xl p-4">
              <div className="font-bold text-red-500 text-xl">
                Hình ảnh khoá học
              </div>
              {courseDetails.thumbnail && (
                <img
                  src={courseDetails.thumbnail}
                  alt="course"
                  className="w-full mt-4 rounded-2xl border border-red-200"
                />
              )}
            </div>

            <div className="border border-red-200 rounded-2xl p-4 mt-3">
              <div className="font-bold text-red-500 text-xl">
                Trạng thái khoá học
              </div>

              <div className="font-semibold text-red-500 bg-red-200 p-2 text-center rounded-2xl w-full mt-4">
                Publish
              </div>
            </div>

            <div className="border border-red-200 rounded-2xl p-4 mt-6 space-y-2">
              <div className="font-bold text-red-500 text-xl">Course Stats</div>
              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  <Book size={16} />
                  Chương
                </span>
                <span>{courseDetails.chapters?.length || 0}</span>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  <Users size={16} />
                  Bài học
                </span>
                <span>
                  {courseDetails.chapters?.reduce(
                    (sum, c) => sum + (c.lessons?.length || 0),
                    0
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  Thời gian
                </span>
                <div>-</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseInformation;
