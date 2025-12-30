import { useState } from "react";
import TabSelect from "../../../components/Instructor/TabSelect";
import Information from "../../../components/Instructor/Information";
import Course from "../../../components/Instructor/Course";
import CreateCourse from "../../../components/Instructor/CreateCourse";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import * as profileService from "../../../service/profileService";
import { toast } from "react-toastify";
import { getToken } from "../../../utils/getToken";
import { jwtDecode } from "jwt-decode";

export default function Instructor() {
  const [activeTab, setActiveTab] = useState("course");

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
      <div className="w-6/7 mx-auto flex gap-x-[10px]">
        <div className="min-w-[300px] bg-white p-4 rounded-xl shadow-md border border-red-200">
          <div className="my-6 text-center">
            <img
              className="w-24 h-24 rounded-full mx-auto mb-4 border border-red-200"
              src={
                userProfile.data?.avatar ||
                "https://static.vecteezy.com/system/resources/previews/024/766/958/non_2x/default-male-avatar-profile-icon-social-media-user-free-vector.jpg"
              }
              alt="avatar"
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

        <div className="w-full bg-white  rounded-xl shadow-md border border-red-200">
          {activeTab === "info" && (
            <Information
              userProfile={userProfile}
              formData={formData}
              handleOnChange={handleOnChange}
              handleUpdateProfile={handleUpdateProfile}
              formPass={formPass}
              handleChangePass={handleChangePass}
              handleSubmitPass={handleSubmitPass}
            />
          )}
          {activeTab === "course" && <Course />}
          {activeTab === "create-course" && <CreateCourse />}
        </div>
      </div>
    </div>
  );
}
