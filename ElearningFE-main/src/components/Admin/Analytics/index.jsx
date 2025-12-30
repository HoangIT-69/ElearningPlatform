import { Search } from "lucide-react";

const Analytics = () => {
  return (
    <div>
      <div className=" p-4 border-b border-red-200 shadow-sm flex items-center justify-between">
        <div className="font-bold text-2xl text-red-500">Analytics</div>
        <div className="flex items-center border border-red-400 rounded-full px-3 py-4 hover:bg-red-50 focus-within:!bg-white focus-within:ring-2 focus-within:ring-red-500 mx-4 cursor-pointer ">
          <Search className="text-gray-500 me-2 " size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="flex-1 outline-none text-sm"
          />
        </div>
      </div>

      <div className="p-6">
        <div className="p-4 border border-red-200 rounded-2xl">
          <div className="text-sembold text-xl text-red-500 ">
            Revenue Overview
          </div>
          <div className="bg-red-50 h-70 text-gray-500 flex items-center justify-center rounded-2xl mt-3">
            Chart visualization will be displayed here
          </div>
        </div>

        <div className="flex mt-6 gap-6">
          <div className="p-4 border border-red-200 rounded-2xl flex-1">
            <div className="text-sembold text-xl text-red-500 ">
              User Growth
            </div>
            <div className="bg-red-50 h-60 text-gray-500 flex items-center justify-center rounded-2xl mt-3">
              User growth chart
            </div>
          </div>

          <div className="p-4 border border-red-200 rounded-2xl flex-1">
            <div className="text-sembold text-xl text-red-500 ">
              Course Performance
            </div>
            <div className="bg-red-50 h-60 text-gray-500 flex items-center justify-center rounded-2xl mt-3">
              Course performance chart
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
