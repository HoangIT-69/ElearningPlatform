import { Star, Users } from "lucide-react";

const PopularCourse = ({ course }) => {
  return (
    <div className="w-72 rounded-3xl overflow-hidden hover:scale-105 transition-all cursor-pointer bg-white border border-red-200">
      <div className="p-2">
        <img
          src={
            course.thumbnail ||
            "https://placehold.co/400x400?text=No+Thumbnail"
          }
          alt={course.title}
          className="w-full h-56 object-cover rounded-2xl"
        />
      </div>

      <div className="px-5 pb-5">
        <h3 className="text-gray-900 font-semibold text-base truncate">
          {course.title}
        </h3>

        <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {course.enrollmentCount}
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {course.averageRating}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularCourse;
