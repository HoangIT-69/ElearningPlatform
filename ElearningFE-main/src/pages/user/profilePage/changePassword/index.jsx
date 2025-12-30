import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { changePassword } from "../../../../service/authService";
export default function ChangePassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (form.newPass !== form.confirmPass) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      await changePassword({
        oldPassword: form.oldPass,
        newPassword: form.newPass,
      });

      toast.success("Đổi mật khẩu thành công!");
      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 bg-gradient-to-br from-red-300 via-white to-red-100">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow p-8 border border-red-200">
        <h2 className="text-2xl font-bold mb-6 text-red-500">Đổi mật khẩu</h2>

        <div className="space-y-4">
          <input
            type="password"
            name="oldPass"
            onChange={handleChange}
            className="w-full border border-red-200 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
            placeholder="Mật khẩu hiện tại"
          />
          <input
            type="password"
            name="newPass"
            onChange={handleChange}
            className="w-full border border-red-200 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
            placeholder="Mật khẩu mới"
          />
          <input
            type="password"
            name="confirmPass"
            onChange={handleChange}
            className="w-full border border-red-200 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
            placeholder="Xác nhận mật khẩu"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-red-500 text-white py-2.5 rounded-lg hover:bg-red-600"
        >
          Đổi mật khẩu
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
