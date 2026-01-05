import { useEffect, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Lock,
  PlayCircle,
  CheckSquare,
  Square,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as courseService from "../../service/courseService";
import { useQueryClient } from "@tanstack/react-query";

const CourseModules = ({ data, isEnrolled, courseSlug, courseId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [optimisticCompleted, setOptimisticCompleted] = useState({});

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const totalLessons = data.lessons?.length || 0;

  const toggleLesson = async (lesson) => {
    const nextCompleted = !lesson.completed;

    setOptimisticCompleted((prev) => ({
      ...prev,
      [lesson.id]: nextCompleted,
    }));

    try {
      await courseService.updateLessonProgress({
        courseId,
        lessonId: lesson.id,
        completed: nextCompleted,
      });

      queryClient.invalidateQueries({
        queryKey: ["enrollmentContent", courseSlug],
      });

      queryClient.invalidateQueries({
        queryKey: ["myCourses"],
      });
    } catch (err) {
      toast.error("Cập nhật tiến độ thất bại");
    }
  };

  useEffect(() => {
    if (!data?.lessons || !data?.completedLessonIds) return;

    const completedSet = new Set(data.completedLessonIds);
    const completedMap = {};

    data.lessons.forEach((lesson) => {
      completedMap[lesson.id] = completedSet.has(lesson.id);
    });

    setOptimisticCompleted(completedMap);
  }, [data.lessons, data.completedLessonIds]);

  const handleLessonClick = (lesson) => {
    const isFree = lesson.isFree === true || lesson.isFree === "true";

    if (isEnrolled || isFree) {
      navigate(`/learning/${courseSlug}?lessonId=${lesson.id}`);
    } else {
      toast.info("Bạn cần mua khóa học để xem bài này!");
    }
  };

  return (
    <div className="border border-red-200 my-3 rounded-lg">
      <div
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-red-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-red-500" />
          <div>
            <h3 className="font-semibold text-gray-800">{data.title}</h3>
            <p className="text-sm text-gray-500">{totalLessons} bài học</p>
          </div>
        </div>

        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </div>

      {isOpen && (
        <div className="px-6 pb-3">
          {data.lessons?.map((lesson) => {
            const isFree = lesson.isFree === true || lesson.isFree === "true";
            const canLearn = isEnrolled || isFree;

            const isCompleted =
              optimisticCompleted[lesson.id] ?? lesson.completed;

            return (
              <div key={lesson.id} className="flex items-center gap-3 py-2">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLesson(lesson);
                  }}
                  className="cursor-pointer"
                >
                  {isCompleted ? (
                    <CheckSquare className="w-4 h-4 text-red-500" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                {canLearn ? (
                  <PlayCircle className="w-4 h-4 text-red-500" />
                ) : (
                  <Lock className="w-4 h-4 text-gray-400" />
                )}

                <span
                  onClick={() => canLearn && handleLessonClick(lesson)}
                  className={`text-sm font-medium ${
                    canLearn ? "text-gray-700 cursor-pointer" : "text-gray-400"
                  }`}
                >
                  {lesson.title}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseModules;
