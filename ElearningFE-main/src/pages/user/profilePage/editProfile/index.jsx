import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateProfile } from "../../../../service/authService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getUserProfile } from "../../../../service/authService";

export default function EditProfile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    bio: "",
  });

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
  });

  useEffect(() => {
    if (userProfile) {
      setForm({
        fullName: userProfile.fullName || "",
        phone: userProfile.phone || "",
        bio: userProfile.bio || "",
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateProfile(form);
      queryClient.invalidateQueries(["user-profile"]);
      toast.success("Cập nhật hồ sơ thành công!");
      navigate("/profile");
    } catch (err) {
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 bg-gradient-to-br from-red-300 via-white to-red-100">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow p-8 border border-red-200 ">
        <h2 className="text-2xl font-bold mb-6 text-red-500">
          Chỉnh sửa hồ sơ
        </h2>

        <div className="space-y-4">
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="w-full border border-red-200 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
            placeholder="Họ và tên"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-red-200 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
            placeholder="Số điện thoại"
          />

          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            className="w-full border border-red-200 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
            placeholder="Giới thiệu bản thân"
          ></textarea>
        </div>

        <button
          onClick={handleSave}
          className="mt-6 w-full bg-red-500 text-white py-2.5 rounded-lg hover:bg-red-600"
        >
          Lưu thay đổi
        </button>

        <button
          onClick={() => navigate(-1)}
          className="mt-3 w-full text-gray-600 hover:underline"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
}
