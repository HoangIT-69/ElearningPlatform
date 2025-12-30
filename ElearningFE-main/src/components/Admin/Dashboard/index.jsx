import { Star, Search } from "lucide-react";

const Dashboard = () => {
  return (
    <div>
      <div className=" p-4 border-b border-red-200 shadow-sm flex items-center justify-between">
        <div className="font-bold text-2xl text-red-500">Dashboard</div>
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
        <div className="flex gap-6">
          <div className="p-3 bg-white border-t-5 border-red-200 rounded-lg flex flex-col items-center gap-2 flex-1 shadow-sm">
            <div className="p-3 bg-red-500 border border-red-200 rounded-lg w-fit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
              >
                <path
                  fill="white"
                  d="M12.32 8a3 3 0 0 0-2-.7H5.63A1.59 1.59 0 0 1 4 5.69a2 2 0 0 1 0-.25a1.59 1.59 0 0 1 1.63-1.33h4.62a1.59 1.59 0 0 1 1.57 1.33h1.5a3.08 3.08 0 0 0-3.07-2.83H8.67V.31H7.42v2.3H5.63a3.08 3.08 0 0 0-3.07 2.83a2 2 0 0 0 0 .25a3.07 3.07 0 0 0 3.07 3.07h4.74A1.59 1.59 0 0 1 12 10.35a2 2 0 0 1 0 .34a1.59 1.59 0 0 1-1.55 1.24h-4.7a1.59 1.59 0 0 1-1.55-1.24H2.69a3.08 3.08 0 0 0 3.06 2.73h1.67v2.27h1.25v-2.27h1.7a3.08 3.08 0 0 0 3.06-2.73v-.34A3.06 3.06 0 0 0 12.32 8"
                />
              </svg>
            </div>
            <div className="font-semibold text-xl">₫45,890,000</div>
            <div className="text-gray-500">Total Revenue</div>
          </div>

          <div className="p-3 bg-white border-t-5 border-red-200 rounded-lg flex flex-col items-center gap-2 flex-1 shadow-sm">
            <div className="p-3 bg-red-500 border border-red-200 rounded-lg w-fit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M21 19.75c0-2.09-1.67-5.068-4-5.727m-2 5.727c0-2.651-2.686-6-6-6s-6 3.349-6 6m9-12.5a3 3 0 1 1-6 0a3 3 0 0 1 6 0m3 3a3 3 0 1 0 0-6"
                />
              </svg>
            </div>
            <div className="font-semibold text-xl">12,458</div>
            <div className="text-gray-500">Active Users</div>
          </div>

          <div className="p-3 bg-white border-t-5 border-red-200 rounded-lg flex flex-col items-center gap-2 flex-1 shadow-sm">
            <div className="p-3 bg-red-500 border border-red-200 rounded-lg w-fit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M2.75 16.401a1.15 1.15 0 0 0 1.16 1.15a16.7 16.7 0 0 1 3.535.333c1.64.204 3.204.81 4.555 1.761V6.442A10.24 10.24 0 0 0 7.445 4.68a16.6 16.6 0 0 0-3.6-.322a1.15 1.15 0 0 0-1.074 1.15zm18.5 0a1.15 1.15 0 0 1-1.16 1.15a16.7 16.7 0 0 0-3.535.333c-1.64.204-3.204.81-4.555 1.761V6.442a10.24 10.24 0 0 1 4.555-1.762a16.6 16.6 0 0 1 3.6-.322a1.15 1.15 0 0 1 1.073 1.15z"
                />
              </svg>
            </div>
            <div className="font-semibold text-xl">115</div>
            <div className="text-gray-500">Active Courses</div>
          </div>

          <div className="p-3 bg-white border-t-5 border-red-200 rounded-lg flex flex-col items-center gap-2 flex-1 shadow-sm">
            <div className="p-3 bg-red-500 border border-red-200 rounded-lg w-fit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1m-9-1a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1M18 6H4.27l2.55 6H15c.33 0 .62-.16.8-.4l3-4c.13-.17.2-.38.2-.6a1 1 0 0 0-1-1m-3 7H6.87l-.77 1.56L6 15a1 1 0 0 0 1 1h11v1H7a2 2 0 0 1-2-2a2 2 0 0 1 .25-.97l.72-1.47L2.34 4H1V3h2l.85 2H18a2 2 0 0 1 2 2c0 .5-.17.92-.45 1.26l-2.91 3.89c-.36.51-.96.85-1.64.85"
                />
              </svg>
            </div>
            <div className="font-semibold text-xl">115</div>
            <div className="text-gray-500">Orders Today</div>
          </div>
        </div>
        <div className="mt-8 flex gap-6">
          <div className="border border-red-200 p-3 rounded-lg bg-white flex-1">
            <div className="flex justify-between items-center mt-3 mb-4">
              <div className="font-semibold text-xl text-red-500">
                Recent Orders
              </div>
              <div className="font-semibold text-sm text-gray-500 hover:text-gray-700">
                View All
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between bg-red-50 rounded-lg p-4 shadow-sm items-center">
                <div>
                  <div className="font-semibold text-xl">#ORD-1234</div>
                  <div className="font-semibold text-sm text-gray-500">
                    Nguyễn Văn An
                  </div>
                  <div className=" text-sm text-gray-500">
                    Web Development Bootcamp
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="font-semibold">₫599,000</div>
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-200 text-green-500">
                    completed
                  </div>
                </div>
              </div>

              <div className="flex justify-between bg-red-50 rounded-lg p-4 shadow-sm items-center">
                <div>
                  <div className="font-semibold text-xl">#ORD-1234</div>
                  <div className="font-semibold text-sm text-gray-500">
                    Nguyễn Văn An
                  </div>
                  <div className=" text-sm text-gray-500">
                    Web Development Bootcamp
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="font-semibold">₫599,000</div>
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-200 text-green-500">
                    completed
                  </div>
                </div>
              </div>

              <div className="flex justify-between bg-red-50 rounded-lg p-4 shadow-sm items-center">
                <div>
                  <div className="font-semibold text-xl">#ORD-1234</div>
                  <div className="font-semibold text-sm text-gray-500">
                    Nguyễn Văn An
                  </div>
                  <div className=" text-sm text-gray-500">
                    Web Development Bootcamp
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="font-semibold">₫599,000</div>
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-200 text-green-500">
                    completed
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-red-200 p-3 rounded-lg bg-white flex-1">
            <div className="flex justify-between items-center mt-3 mb-4">
              <div className="font-semibold text-xl text-red-500">
                Top Courses
              </div>
              <div className="font-semibold text-sm text-gray-500 hover:text-gray-700">
                View All
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between bg-red-50 rounded-lg p-4 shadow-sm items-center">
                <div className="flex gap-4 items-center">
                  <div>
                    <img
                      src="https://i.ibb.co/ydydqjz/web-dev.png"
                      alt=""
                      className="w-15 h-15 rounded-lg border border-red-200"
                    />
                  </div>
                  <div>
                    <div>
                      <div className="font-semibold text-sm truncate w-[280px]">
                        The Complete Web Development Bootcamp 2024
                      </div>
                      <div className="font-semibold text-sm text-gray-500">
                        850 students
                      </div>
                      <div className="flex items-center gap-1">
                        <Star
                          size={16}
                          className="text-yellow-500 fill-yellow-500"
                        />
                        4.7
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="font-semibold">₫599,000</div>
                </div>
              </div>

              <div className="flex justify-between bg-red-50 rounded-lg p-4 shadow-sm items-center">
                <div className="flex gap-4 items-center">
                  <div>
                    <img
                      src="https://i.ibb.co/ydydqjz/web-dev.png"
                      alt=""
                      className="w-15 h-15 rounded-lg border border-red-200"
                    />
                  </div>
                  <div>
                    <div>
                      <div className="font-semibold text-sm truncate w-[280px]">
                        React - The Complete Guide 2024
                      </div>
                      <div className="font-semibold text-sm text-gray-500 ">
                        680 students
                      </div>
                      <div className="flex items-center gap-1">
                        <Star
                          size={16}
                          className="text-yellow-500 fill-yellow-500"
                        />
                        4.6
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="font-semibold">₫599,000</div>
                </div>
              </div>

              <div className="flex justify-between bg-red-50 rounded-lg p-4 shadow-sm items-center">
                <div className="flex gap-4 items-center">
                  <div>
                    <img
                      src="https://i.ibb.co/ydydqjz/web-dev.png"
                      alt=""
                      className="w-15 h-15 rounded-lg border border-red-200"
                    />
                  </div>
                  <div>
                    <div>
                      <div className="font-semibold text-sm truncate w-[280px]">
                        Python for Data Science
                      </div>
                      <div className="font-semibold text-sm text-gray-500">
                        520 students
                      </div>
                      <div className="flex items-center gap-1">
                        <Star
                          size={16}
                          className="text-yellow-500 fill-yellow-500"
                        />
                        4.6
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="font-semibold">₫599,000</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
