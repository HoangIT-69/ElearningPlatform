import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import * as courseService from "../../../../service/admin/courseService";
import { toast } from "react-toastify";

const CourseCurriculum = ({ course }) => {
  const [modules, setModules] = useState([
    {
      moduleName: "",
      lessons: [{ title: "", videoUrl: "", videoDuration: 0 }],
    },
  ]);

  useEffect(() => {
    if (!course?.chapters) return;

    const mapped = course.chapters.map((ch) => ({
      id: ch.id,
      moduleName: ch.title,
      lessons: ch.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        videoUrl: l.videoUrl || "",
        videoDuration: l.videoDuration || 0,
        isFree: l.isFree ?? false,
      })),
    }));

    setModules(mapped);
  }, [course]);

  const addModule = () => {
    setModules((prev) => [...prev, { id: null, moduleName: "", lessons: [] }]);
  };

  const removeModule = async (index) => {
    const module = modules[index];

    try {
      if (module.id) {
        await courseService.deleteChapter(module.id);
        toast.success("Đã xoá chương");
      }

      setModules((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error(err);
      toast.error("Xoá chương thất bại");
    }
  };

  const addLesson = (moduleIndex) => {
    setModules((prev) =>
      prev.map((m, i) =>
        i === moduleIndex
          ? {
              ...m,
              lessons: [
                ...m.lessons,
                {
                  id: null,
                  title: "",
                  videoUrl: "",
                  videoDuration: 0,
                  isFree: false,
                },
              ],
            }
          : m
      )
    );
  };

  const removeLesson = async (moduleIndex, lessonIndex) => {
    const lesson = modules[moduleIndex].lessons[lessonIndex];

    try {
      if (lesson.id) {
        await courseService.deleteLesson(lesson.id);
        toast.success("Đã xoá bài học");
      }

      setModules((prev) =>
        prev.map((m, i) =>
          i === moduleIndex
            ? {
                ...m,
                lessons: m.lessons.filter((_, l) => l !== lessonIndex),
              }
            : m
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Xoá bài học thất bại");
    }
  };

  const validateCurriculum = () => {
    for (const [mIndex, module] of modules.entries()) {
      if (!module.moduleName.trim()) {
        toast.error(`Chương ${mIndex + 1} chưa có tên`);
        return false;
      }

      for (const [lIndex, lesson] of module.lessons.entries()) {
        if (!lesson.title.trim()) {
          toast.error(
            `Bài học ${lIndex + 1} của chương ${mIndex + 1} chưa có tiêu đề`
          );
          return false;
        }
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!course?.id) {
      toast.error("Chưa tải xong dữ liệu khoá học");
      return;
    }

    if (!validateCurriculum()) return;

    try {
      for (const module of modules) {
        let chapterId = module.id;

        if (!chapterId) {
          const res = await courseService.createChapter({
            title: module.moduleName,
            courseId: course.id,
          });
          chapterId = res.data.id;
        } else {
          await courseService.updateChapter(chapterId, {
            title: module.moduleName,
          });
        }

        for (const lesson of module.lessons) {
          if (!lesson.id) {
            await courseService.createLesson({
              title: lesson.title,
              videoUrl: lesson.videoUrl,
              videoDuration: lesson.videoDuration,
              chapterId,
              isFree: lesson.isFree,
            });
          } else {
            await courseService.updateLesson(lesson.id, {
              title: lesson.title,
              videoUrl: lesson.videoUrl,
              videoDuration: lesson.videoDuration,
              isFree: lesson.isFree,
            });
          }
        }
      }

      toast.success("Lưu chương trình học thành công");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi lưu chương trình học");
    }
  };

  return (
    <div className="p-5 space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-bold text-2xl text-red-500">
            Chương trình giảng dạy
          </div>
          <div className="text-gray-500">
            Hãy thêm chương và bài học cho khoá học của bạn
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={addModule}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 text-white rounded-2xl font-semibold flex items-center gap-2"
          >
            <Plus size={16} />
            Thêm
          </button>
          <button
            onClick={handleSave}
            disabled={!course?.id}
            className={`${
              !course?.id
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            } text-white font-semibold p-2 rounded-2xl px-5`}
          >
            Lưu
          </button>
        </div>
      </div>

      <div>
        {modules.map((module, mIndex) => (
          <div
            key={mIndex}
            className="border border-red-200 rounded-2xl p-4 mt-6"
          >
            <div className="flex gap-2 items-center">
              <div className="font-semibold text-sm whitespace-nowrap">
                Chương {mIndex + 1}:
              </div>
              <input
                type="text"
                className="w-full border border-red-200 rounded-md py-3 pl-6 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
                placeholder="Tên chương"
                name="chapterTitle"
                value={module.moduleName}
                onChange={(e) => {
                  const value = e.target.value;
                  setModules((prev) =>
                    prev.map((m, idx) =>
                      idx === mIndex ? { ...m, moduleName: value } : m
                    )
                  );
                }}
              />
              <div
                onClick={() => removeModule(mIndex)}
                className="hover:bg-red-200 p-2 rounded-sm my-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="red"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M18 6L6 18M6 6l12 12"
                  />
                </svg>
              </div>
            </div>

            <div className="mt-4 pl-10 space-y-4">
              {module.lessons.map((lesson, lIndex) => (
                <div
                  key={lIndex}
                  className="flex gap-2 items-center rounded-2xl bg-red-50 p-2"
                >
                  <div className=" text-sm whitespace-nowrap pr-5 pl-2">
                    {lIndex + 1}.
                  </div>
                  <input
                    type="text"
                    className="w-full border border-red-200 rounded-md py-3 pl-6 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
                    placeholder="Tên bài học"
                    name="lessonTitle"
                    value={lesson.title}
                    onChange={(e) => {
                      const value = e.target.value;

                      setModules((prev) =>
                        prev.map((m, idx) =>
                          idx === mIndex
                            ? {
                                ...m,
                                lessons: m.lessons.map((l, i) =>
                                  i === lIndex ? { ...l, title: value } : l
                                ),
                              }
                            : m
                        )
                      );
                    }}
                  />
                  <input
                    type="text"
                    className="w-full border border-red-200 rounded-md py-3 pl-6 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
                    placeholder="Video URL"
                    value={lesson.videoUrl}
                    name="videoURL"
                    onChange={(e) => {
                      const value = e.target.value;

                      setModules((prev) =>
                        prev.map((m, idx) =>
                          idx === mIndex
                            ? {
                                ...m,
                                lessons: m.lessons.map((l, i) =>
                                  i === lIndex ? { ...l, videoUrl: value } : l
                                ),
                              }
                            : m
                        )
                      );
                    }}
                  />
                  <div
                    onClick={() => removeLesson(mIndex, lIndex)}
                    className="hover:bg-red-200 p-2 rounded-sm my-auto"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="none"
                        stroke="red"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M18 6L6 18M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
              ))}

              <div
                onClick={() => addLesson(mIndex)}
                className="  text-red-500 rounded-2xl font-semibold flex items-center gap-2"
              >
                <Plus size={16} />
                Thêm bài học
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseCurriculum;
