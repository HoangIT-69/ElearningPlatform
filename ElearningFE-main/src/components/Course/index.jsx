import { Star, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Course = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/detailCourse/${data.id}`)}
      className="overflow-hidden rounded-2xl shadow-lg bg-white hover:shadow-2xl hover:scale-[1.03] transition-all cursor-pointer border border-red-200"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            data.thumbnail ||
            "https://via.placeholder.com/300x200?text=No+Image"
          }
          alt="title"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-5 space-y-3">
        <h3 className="font-bold text-lg text-gray-900 leading-tight trancate overflow-hidden whitespace-nowrap">
          {data.title}
        </h3>
        <p className="text-sm text-gray-500">{data.instructorName}</p>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 font-semibold text-sm">{data.averageRating}</span>
          </div>
          <span className="text-xs text-gray-500">{data.enrollmentCount}</span>
        </div>

        <div className="flex items-center gap-5 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>{data.totalDuration || 0}h học</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-red-200">
          <p className="text-lg font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
            {data.isFree ? "Miễn phí" : `${data.price.toLocaleString()}đ`}
          </p>
          <button className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-400 text-white px-4 py-2 rounded-md text-sm font-semibold hover:shadow-md transition">
            Xem <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Course;
