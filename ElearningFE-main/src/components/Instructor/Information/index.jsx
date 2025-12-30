import { memo } from "react";
import { getUserId } from "../../../utils/getUserId";

const Information = ({
  userProfile,
  handleOnChange,
  handleUpdateProfile,
  formData,
  formPass,
  handleChangePass,
  handleSubmitPass,
}) => {
    const userId = getUserId();
    

  return (
    <div>
      <div className="p-6 border-b border-red-200">
        <div className="flex justify-between items-center mb-6">
          <div className="font-bold text-2xl text-red-500">
            Thông tin cá nhân
          </div>
          <div className="bg-red-500 rounded-xl text-white p-2 hover:bg-red-600 cursor-pointer" onClick={handleUpdateProfile}>
            Lưu chỉnh sửa
          </div>
        </div>

        <div className="">
          <div>
            <div className="text-l font-bold">Tên người dùng</div>
            <input
              type="text"
              className="w-full border border-red-200 rounded-md py-3 pl-6 mt-2 mb-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
              placeholder="Tên của bạn..."
              name="fullName"
              onChange={handleOnChange}
              value={formData.fullName || ""}
            />
          </div>

          <div>
            <div className="text-l font-bold">Email</div>
            <input
              type="text"
              name="email"
              className="w-full border border-red-200 rounded-md py-3 pl-6 mt-2 mb-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
              placeholder="Email của bạn..."
              onChange={handleOnChange}
              value={userProfile.data?.email || ""}
            />
          </div>

          <div>
            <div className="text-l font-bold">Số điện thoại</div>
            <input
              type="text"
              className="w-full border border-red-200 rounded-md py-3 pl-6 mt-2 mb-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
              placeholder="Số điện thoại của bạn..."
              name="phone"
              onChange={handleOnChange}
              value={formData.phone || ""}
            />
          </div>

          <div>
            <div className="text-l font-bold">Tiểu sử</div>
            <textarea
              rows={3}
              type="text"
              className="w-full border border-red-200 rounded-md py-3 pl-6 mt-2 mb-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
              placeholder="Nhập tiểu sử của bạn..."
              name="bio"
              onChange={handleOnChange}
              value={formData.bio || ""}
            />
          </div>
        </div>
      </div>

      <div className="p-6 mt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitPass();
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="font-bold text-2xl text-red-500">Đổi mật khẩu</div>

            <button
              type="submit"
              className="bg-red-500 rounded-xl text-white p-2 hover:bg-red-600"
            >
              Cập nhật mật khẩu
            </button>
          </div>

          <div>
            <div className="text-l font-bold">Mật khẩu hiện tại</div>
            <input
              type="password"
              name="oldPass"
              onChange={handleChangePass}
              autoComplete="current-password"
              className="w-full border border-red-200 rounded-md py-3 pl-6 mt-2 mb-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
              placeholder="Mật khẩu hiện tại"
            />
          </div>

          <div>
            <div className="text-l font-bold">Mật khẩu mới</div>
            <input
              type="password"
              name="newPass"
              onChange={handleChangePass}
              autoComplete="new-password"
              className="w-full border border-red-200 rounded-md py-3 pl-6 mt-2 mb-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
              placeholder="Mật khẩu mới"
            />
          </div>

          <div>
            <div className="text-l font-bold">Nhập lại mật khẩu mới</div>
            <input
              type="password"
              name="confirmPass"
              onChange={handleChangePass}
              autoComplete="new-password"
              className="w-full border border-red-200 rounded-md py-3 pl-6 mt-2 mb-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
              placeholder="Xác nhận mật khẩu"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(Information);
