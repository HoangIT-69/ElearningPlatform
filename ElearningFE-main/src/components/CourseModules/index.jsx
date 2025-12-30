import { useState } from "react";
import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Lock,
  PlayCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CourseModules = ({ data, isEnrolled, courseSlug, currentLessonId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLessonClick = (lesson) => {
    const isFree = lesson.isFree === true || lesson.isFree === "true";
    const enrolled = Boolean(isEnrolled);

    if (enrolled || isFree) {
      navigate(`/learning/${courseSlug}?lessonId=${lesson.id}`);
    } else {
      toast.info("Bạn cần mua khóa học để xem bài này!");
    }
  };


  return (
    <div className="border border-red-200  my-3 rounded-lg hover:border-red-500 transition-all">
      <div
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-red-50 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-red-500" />
          <div>
            <h3 className="font-semibold text-gray-800">{data.title}</h3>
            <p className="text-sm text-gray-500">
              {data.lessons?.length || 0} bài học
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {data.totalDuration || 0}h
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </div>
      {isOpen && (
        <div className="px-6 pb-3">
          {data.lessons?.map((lesson) => {
            const isFree = lesson.isFree === true || lesson.isFree === "true";
            const enrolled = isEnrolled === true || isEnrolled === "true";
            const canLearn = enrolled || isFree;

            return (
              <div
                key={lesson.id}
                onClick={() => handleLessonClick(lesson)}
                className={`
                flex justify-between items-center py-3 border-b border-gray-100 rounded-md px-2 transition-all
                ${lesson.id === currentLessonId ? "bg-red-50" : ""}
                ${
                  canLearn
                    ? "cursor-pointer hover:bg-red-50"
                    : "cursor-not-allowed opacity-60 hover:bg-gray-50"
                }
              `}
              >
                <div className="flex items-center gap-3">
                  {lesson.completed ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : canLearn ? (
                    <PlayCircle className="w-4 h-4 text-red-500" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}

                  <span
                    className={`text-sm ${
                      canLearn ? "text-gray-700 font-medium" : "text-gray-500"
                    }`}
                  >
                    {lesson.title}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-500">
                    {lesson.videoDuration}p
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseModules;
