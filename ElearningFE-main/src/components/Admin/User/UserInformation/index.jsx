import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as userService from "../../../../service/admin/userService";
import { formatDate } from "../../../../utils/formatterDate";

const UserInformation = ({ userId, onClose }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userService.getUserById(userId);
        if (res.success) {
          setUser(res.data);
        }
      } catch {
        toast.error("Không lấy được thông tin người dùng");
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  if (!user) return null;

  return (
    <div
      className="fixed inset-0 bg-red/40 backdrop-blur-sm overflow-y-auto flex justify-center py-10 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-6/7 p-6 border border-red-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-xl font-bold mb-4 text-red-500">
          Thông tin người dùng
        </div>

        <div className="border border-red-200 p-4 mb-4 rounded-2xl flex gap-6 items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border border-red-200">
            <img
              src={
                user.avatar ||
                "https://static.vecteezy.com/system/resources/previews/024/766/958/non_2x/default-male-avatar-profile-icon-social-media-user-free-vector.jpg"
              }
              alt=""
            />
          </div>

          <div>
            <div className="flex items-center">
              <div className="font-semibold text-2xl text-red-500 ">
                {" "}
                {user.fullName}
              </div>
              <div
                className={`py-2 px-4 rounded-xl font-semibold w-fit ml-4 ${
                  user.isActive
                    ? "bg-green-200 text-green-700"
                    : "bg-red-200 text-red-700"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </div>
            </div>

            <div className="mt-2 text-gray-500 max-w-[1200px] break-words">
              {user.bio || "Chưa có tiểu sử"}
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-2 mt-4">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <g fill="none" stroke="red" strokeWidth="1.5">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m7 9l5 3.5L17 9"
                      />
                      <path d="M2 17V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" />
                    </g>
                  </svg>
                </div>
                <div>{user.email}</div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="red"
                      d="M19.5 22a1.5 1.5 0 0 0 1.5-1.5V17a1.5 1.5 0 0 0-1.5-1.5c-1.17 0-2.32-.18-3.42-.55a1.51 1.51 0 0 0-1.52.37l-1.44 1.44a14.77 14.77 0 0 1-5.89-5.89l1.43-1.43c.41-.39.56-.97.38-1.53c-.36-1.09-.54-2.24-.54-3.41A1.5 1.5 0 0 0 7 3H3.5A1.5 1.5 0 0 0 2 4.5C2 14.15 9.85 22 19.5 22M3.5 4H7a.5.5 0 0 1 .5.5c0 1.28.2 2.53.59 3.72c.05.14.04.34-.12.5L6 10.68c1.65 3.23 4.07 5.65 7.31 7.32l1.95-1.97c.14-.14.33-.18.51-.13c1.2.4 2.45.6 3.73.6a.5.5 0 0 1 .5.5v3.5a.5.5 0 0 1-.5.5C10.4 21 3 13.6 3 4.5a.5.5 0 0 1 .5-.5"
                    />
                  </svg>
                </div>
                <div>{user.phone || "Chưa cập nhật"}</div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="red"
                      d="M19.5 4h-3V2.5a.5.5 0 0 0-1 0V4h-7V2.5a.5.5 0 0 0-1 0V4h-3A2.503 2.503 0 0 0 2 6.5v13A2.503 2.503 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5v-13A2.5 2.5 0 0 0 19.5 4M21 19.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5V11h18zm0-9.5H3V6.5C3 5.672 3.67 5 4.5 5h3v1.5a.5.5 0 0 0 1 0V5h7v1.5a.5.5 0 0 0 1 0V5h3A1.5 1.5 0 0 1 21 6.5z"
                    />
                  </svg>
                </div>
                <div>{formatDate(user.createdAt)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className=" mx-auto mb-5 flex gap-4">
          <div className="bg-white border border-red-200 rounded-2xl p-6 flex-1">
            <div className="bg-red-200 rounded-lg p-2 w-fit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                viewBox="0 0 21 21"
              >
                <path
                  fill="none"
                  stroke="red"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.5 6.59q-2-1.09-4-1.09c-2 0-2.667.364-4 1.09v9.91q2-1 4-1c2 0 2.667.333 4 1zm-8 0q-2-1.09-4-1.09c-2 0-2.667.364-4 1.09v9.91q2-1 4-1c2 0 2.667.333 4 1z"
                />
              </svg>
            </div>
            <div className="text-2xl font-bold mt-3">12</div>
            <div className="text-gray-500">Các khóa học đã đăng ký</div>
          </div>
          <div className="bg-white border border-red-200 rounded-2xl p-6 flex-1">
            <div className="bg-red-200 rounded-lg p-2 w-fit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="red"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="9" r="7" />
                  <path d="M7 14v6.234a1 1 0 0 0 1.514.857l2.972-1.782a1 1 0 0 1 1.028 0l2.972 1.782A1 1 0 0 0 17 20.234V14" />
                </g>
              </svg>
            </div>
            <div className="text-2xl font-bold mt-3">7</div>
            <div className="text-gray-500">Khóa học đã hoàn thành</div>
          </div>
          <div className="bg-white border border-red-200 rounded-2xl p-6 flex-1">
            <div className="bg-red-200 rounded-lg p-2 w-fit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
              >
                <path
                  fill="red"
                  d="M11.5 3a9.5 9.5 0 0 1 9.5 9.5a9.5 9.5 0 0 1-9.5 9.5A9.5 9.5 0 0 1 2 12.5A9.5 9.5 0 0 1 11.5 3m0 1A8.5 8.5 0 0 0 3 12.5a8.5 8.5 0 0 0 8.5 8.5a8.5 8.5 0 0 0 8.5-8.5A8.5 8.5 0 0 0 11.5 4M11 7h1v5.42l4.7 2.71l-.5.87l-5.2-3z"
                />
              </svg>
            </div>
            <div className="text-2xl font-bold mt-3">156</div>
            <div className="text-gray-500">Giờ học</div>
          </div>
          <div className="bg-white border border-red-200 rounded-2xl p-6 flex-1">
            <div className="bg-red-200 rounded-lg p-2 w-fit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                viewBox="0 0 20 20"
              >
                <path
                  fill="red"
                  d="M17.962 5.309A.5.5 0 0 0 17.5 5h-6a.5.5 0 0 0 0 1h4.793L10.5 11.793L8.354 9.646a.5.5 0 0 0-.708 0l-5.5 5.5a.5.5 0 0 0 .708.708L8 10.707l2.146 2.147a.5.5 0 0 0 .708 0L17 6.707V11.5a.5.5 0 0 0 1 0v-6a.5.5 0 0 0-.038-.191"
                />
              </svg>
            </div>
            <div className="text-2xl font-bold mt-3">15 ngày</div>
            <div className="text-gray-500">Chuỗi hiện tại</div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <div className="border border-red-200 p-4 flex rounded-2xl h-100">
              <div className="font-bold text-2xl text-red-500">
                Cac khoa hoc da dang ky
              </div>
            </div>
          </div>
          <div className="col-span-4 flex flex-col gap-4">
            <div className="border border-red-200 p-4  rounded-2xl">
              <div className="font-bold text-2xl text-red-500">Tai chinh</div>
              <div className="flex gap-4 items-center border-b border-red-200 p-4">
                <div className="border border-red-200 bg-red-200 p-4 rounded-lg mt-2 w-fit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill="red"
                      d="M12.32 8a3 3 0 0 0-2-.7H5.63A1.59 1.59 0 0 1 4 5.69a2 2 0 0 1 0-.25a1.59 1.59 0 0 1 1.63-1.33h4.62a1.59 1.59 0 0 1 1.57 1.33h1.5a3.08 3.08 0 0 0-3.07-2.83H8.67V.31H7.42v2.3H5.63a3.08 3.08 0 0 0-3.07 2.83a2 2 0 0 0 0 .25a3.07 3.07 0 0 0 3.07 3.07h4.74A1.59 1.59 0 0 1 12 10.35a2 2 0 0 1 0 .34a1.59 1.59 0 0 1-1.55 1.24h-4.7a1.59 1.59 0 0 1-1.55-1.24H2.69a3.08 3.08 0 0 0 3.06 2.73h1.67v2.27h1.25v-2.27h1.7a3.08 3.08 0 0 0 3.06-2.73v-.34A3.06 3.06 0 0 0 12.32 8"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-3xl">1.000.000</div>
                  <div className=" text-gray-500 ">Tổng chi tiêu</div>
                </div>
              </div>
              <div className="space-y-2 mt-4 p-4">
                <div className="text-gray-500">Trung bình mỗi khóa học</div>
                <div className="font-bold text-2xl">250.000</div>
              </div>
            </div>

            <div className="bg-white p-6 shadow rounded-2xl border border-red-200">
              <div className="text-2xl font-bold text-red-500 mb-6">
                Thông tin tài khoản
              </div>

              <div className="space-y-4 text-gray-700 text-l">
                <div className="flex justify-between">
                  <span>User ID:</span>
                  <span>1</span>
                </div>

                <div className="flex justify-between">
                  <span>Join Date:</span>
                  <span>2023-01-15</span>
                </div>

                <div className="flex justify-between">
                  <span>Last Active:</span>
                  <span>2 hours ago</span>
                </div>

                <div className="flex justify-between">
                  <span>Account Type:</span>
                  <span>Student</span>
                </div>
              </div>
            </div>

            <div className="border border-red-200 p-4 rounded-2xl">
              <div className="text-2xl text-red-500 font-bold">
                Thao tác nhanh
              </div>
              <button className="border border-red-200 rounded-2xl py-2 w-full mt-4 font-semibold text-red-500 hover:bg-red-200">
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInformation;
