import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as userService from "../../../../service/admin/userService";

const EditUser = ({ userId, onClose }) => {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    avatar: "",
    bio: "",
    role: "STUDENT",
    isActive: true,
    emailVerified: true,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userService.getUserById(userId);
        if (res.success) {
          setForm(res.data);
        }
      } catch {
        toast.error("Không lấy được thông tin người dùng");
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const res = await userService.updateUser(userId, form);

      if (res.success) {
        toast.success("Cập nhật người dùng thành công");
        onClose();
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Cập nhật thất bại");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-red/40 backdrop-blur-sm overflow-y-auto flex justify-center py-10 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-xl w-5/6 border border-red-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="text-2xl text-red-500 font-bold">
            Chỉnh sửa thông tin người dùng
          </div>
          <button
            onClick={handleUpdate}
            className="bg-red-500 py-2 px-4 font-semibold text-white rounded-2xl hover:bg-red-600"
          >
            Sửa
          </button>
        </div>
        <div className="border border-red-200 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-l font-bold text-red-500">
              Ảnh đại diện
            </label>
            <input
              type="text"
              className="w-full border border-red-200 rounded-md py-3 pl-6 mt-2 mb-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
              placeholder="Avatar URL"
              name="avatar"
              value={form.avatar}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-l font-bold text-red-500">
              Tên người dùng
            </label>
            <input
              type="text"
              className="w-full border border-red-200 rounded-md py-3 pl-6 mt-2 mb-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
              placeholder="Tên người dùng"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-l font-bold text-red-500">
              Số điện thoại
            </label>
            <input
              type="text"
              className="w-full border border-red-200 rounded-md py-3 pl-6 mt-2 mb-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
              placeholder="Số điện thoại"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-l font-bold text-red-500">Tiểu sử</label>
            <textarea
              type="text"
              rows={3}
              className="w-full border border-red-200 rounded-md py-3 pl-6 mt-2 mb-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
              placeholder="Tiểu sử"
              name="bio"
              value={form.bio}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-l font-bold text-red-500">Trạng thái</label>
            <select
              value={String(form.isActive)}
              onChange={(e) =>
                setForm((p) => ({ ...p, isActive: e.target.value === "true" }))
              }
              className="w-full border border-red-200 rounded-md py-3 pl-6 mt-2 mb-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="flex-1">
            <div className="text-l font-bold">Vai trò</div>
            <div className="relative">
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="
        w-full
        border
        border-red-500
        rounded-xl
        py-3
        px-4
        mt-2
        mb-4
        text-black
        focus:outline-none
        focus:ring-2
        focus:ring-red-400
        appearance-none
      "
              >
                <option value="" disabled>
                  -- Chọn vai trò --
                </option>
                <option value="STUDENT">STUDENT</option>
                <option value="INSTRUCTOR">INSTRUCTOR</option>
              </select>

              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="2em"
                  height="2em"
                  viewBox="0 0 27 27"
                >
                  <path
                    fill="currentColor"
                    d="M11.475 14.475L7.85 10.85q-.075-.075-.112-.162T7.7 10.5q0-.2.138-.35T8.2 10h7.6q.225 0 .363.15t.137.35q0 .05-.15.35l-3.625 3.625q-.125.125-.25.175T12 14.7t-.275-.05t-.25-.175"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
