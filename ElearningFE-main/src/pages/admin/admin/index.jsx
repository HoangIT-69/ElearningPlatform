import { useState } from "react";
import TabSelect from "../../../components/Admin/TabSelect";
import Dashboard from "../../../components/Admin/Dashboard";
import Courses from "../../../components/Admin/Courses";
import Users from "../../../components/Admin/User";
import Orders from "../../../components/Admin/Orders";
import Analytics from "../../../components/Admin/Analytics";
import Categories from "../../../components/Admin/Categories";
import CreateCourse from "../../../components/Admin/CreateCourse";
import * as profileService from "../../../service/profileService";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");

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
            <div className="text-xl font-bold">{userProfile.data?.fullName}</div>
            <div className="text-gray-500">{userProfile.data?.email}</div>
          </div>

          <TabSelect
            activeTab={activeTab}
            handleOnTabChange={handleOnTabChange}
          />
        </div>

        <div className="w-full bg-white  rounded-xl shadow-md border border-red-200">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "courses" && <Courses />}
          {activeTab === "users" && <Users />}
          {activeTab === "orders" && <Orders />}
          {activeTab === "analytics" && <Analytics />}
          {activeTab === "categories" && <Categories />}
          {activeTab == "createCourse" && <CreateCourse/>}
        </div>
      </div>
    </div>
  );
}
