import { Link, useNavigate } from "react-router-dom";
import * as profileService from "../../../service/profileService";
import { useQuery } from "@tanstack/react-query";
import TabSelect from "../../../components/Profile/TabSelect";
import { useEffect, useState } from "react";
import InfoUser from "../../../components/Profile/InfoUser";
import OrderHistory from "../../../components/Profile/OrderHistory";
import MyCourse from "../../../components/Profile/MyCourse";
import { toast } from "react-toastify";
import { getToken } from "../../../utils/getToken";
import { jwtDecode } from "jwt-decode";

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const handleOnTabChange = (tab) => {
    setActiveTab(tab);
  };

  const fetchProfile = async () => {
    const res = await profileService.getUserProfile();
    return res;
  };
  const { data: userProfile = [] } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchProfile,
  });
  useEffect(() => {
    if (userProfile.data) {
      setFormData({
        fullName: userProfile.data.fullName || "",
        phone: userProfile.data.phone || "",
        bio: userProfile.data.bio || "",
      });
    }
  }, [userProfile]);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    bio: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleUpdateProfile = async () => {
    try {
      const checkPhone = /^(?:\+84|0)(3|5|7|8|9)\d{8}$/;
      if (formData.phone && !checkPhone.test(formData.phone)) {
        toast.error("Số điện thoại không hợp lệ!");
        return;
      }
      const res = await profileService.updateProfile(formData);
      if (res.success === true) {
        toast.success("Cập nhật hồ sơ thành công!");
      } else {
        toast.error("Cập nhật hồ sơ thất bại!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const [formPass, setFormPass] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: "",
  });

  const handleChangePass = (e) => {
    setFormPass({ ...formPass, [e.target.name]: e.target.value });
  };

  const handleSubmitPass = async () => {
    if (formPass.newPass !== formPass.confirmPass) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const token = getToken();
      const decoded = jwtDecode(token);

      const res = await profileService.changePassword({
        oldPassword: formPass.oldPass,
        newPassword: formPass.newPass,
      });

      toast.success("Đổi mật khẩu thành công!");
      navigate("/profile");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data?.message || "Đổi mật khẩu thất bại!");
      } else if (error.request) {
        toast.error("Không nhận được phản hồi từ server!");
      } else {
        toast.error("Lỗi khi gửi yêu cầu đổi mật khẩu!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 bg-gradient-to-br from-red-300 via-white to-red-100">
      <div className="max-w-7xl mx-auto mb-5 flex gap-4">
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

      <div className="max-w-7xl mx-auto">
        {/* <div className="flex items-center gap-6">
          <div>
            <h1 className="text-2xl font-bold">{userProfile.fullName}</h1>
            <p className="text-gray-600">{userProfile.email}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <p>
            <span className="font-medium">Số điện thoại:</span>{" "}
            {userProfile.phone}
          </p>
          <p>
            <span className="font-medium">Tiểu sử:</span>{" "}
            {userProfile.bio || "Chưa có mô tả"}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <Link
            to="/profile/edit"
            className="block text-center py-2.5 rounded-lg border border-red-200 hover:bg-red-200"
          >
            Chỉnh sửa hồ sơ
          </Link>
          <Link
            to="/profile/change-password"
            className="block text-center py-2.5 rounded-lg border border-red-200 hover:bg-red-200"
          >
            Đổi mật khẩu
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="text-3xl md:text-2xl font-bold text-foreground mb-4 text-red-500">
            Các khóa học của tôi
          </h2>
        </div> */}
        <div className="flex gap-x-[10px]">
          <div className="min-w-[300px] bg-white p-4 rounded-xl shadow-md border border-red-200">
            <div className="my-6 text-center">
              <img
                className="w-24 h-24 rounded-full mx-auto mb-4 border border-red-200"
                src={
                  userProfile.data?.avatar ||
                  "https://static.vecteezy.com/system/resources/previews/024/766/958/non_2x/default-male-avatar-profile-icon-social-media-user-free-vector.jpg"
                }
                alt=""
              />
              <div className="text-xl font-bold">
                {userProfile.data?.fullName}
              </div>
              <div className="text-gray-500">{userProfile.data?.email}</div>
            </div>

            <TabSelect
              activeTab={activeTab}
              handleOnTabChange={handleOnTabChange}
            />
          </div>
          <div className="w-full bg-white p-4 rounded-xl shadow-md border border-red-200">
            {activeTab === "info" && (
              <InfoUser
                userProfile={userProfile}
                formData={formData}
                handleOnChange={handleOnChange}
                handleUpdateProfile={handleUpdateProfile}
                formPass={formPass}
                handleChangePass={handleChangePass}
                handleSubmitPass={handleSubmitPass}
              />
            )}
            {activeTab === "history" && <OrderHistory />}
            {activeTab === "mycourse" && <MyCourse />}
          </div>
        </div>
      </div>
    </div>
  );
}
