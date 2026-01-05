import { Link } from "react-router-dom";

const MyCourseCard = ({ course }) => {
  const { id, title, thumbnail, level, instructorName, progress = 0 } = course;
  

  return (
    <Link to={`/detailCourse/${id}`} className="block h-full">
      <div className="border border-red-200 rounded-xl w-full overflow-hidden">
        <div className="w-full h-35 overflow-hidden">
          <img className="w-full h-full" src={thumbnail} alt="" />
        </div>

        <div className="p-3">
          <span className="bg-red-500 py-1 px-3 rounded-xl font-semibold text-white">
            {level}
          </span>

          <h2 className="text-xl font-semibold text-gray-900 mt-2 truncate">
            {title}
          </h2>

          <p className="text-gray-500 text-sm">Giảng viên: {instructorName}</p>

          <div className="flex justify-between items-center mt-4 mb-1">
            <span className="text-gray-700 font-medium">Tiến độ</span>
            <span className="text-red-600 font-semibold">{progress}%</span>
          </div>

          <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MyCourseCard;
