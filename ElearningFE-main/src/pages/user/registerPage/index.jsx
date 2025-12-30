import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft } from "lucide-react";
import Logo from "../../../assets/user/Logo.svg";
import { useNavigate } from "react-router-dom";
import * as authService from "../../../service/authService";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmpassword: "",
    fullName: "",
    phone: "",
  });

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmpassword) {
        toast.error("Mật khẩu xác nhận không khớp!");
      }
      setIsLoading(true);
      const res = await authService.register(
        formData.email,
        formData.password,
        formData.fullName,
        formData.phone
      );
      if (res.success === true) {
        toast.success(res.message);
        navigate("/login");
      }
      setIsLoading(false);
      return res;
    } catch (e) {
      toast.error(e.response.data.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-300 via-white to-red-100 relative px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-red-200">
        <div className="text-center mb-8">
          <img
            src={Logo}
            alt=""
            className="w-[160px] h-[60px] cursor-pointer mx-auto"
          />
          <p className="text-gray-500 text-sm">
            Nền tảng học tập trực tuyến hàng đầu
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-800 font-medium mb-1">
              Họ và tên
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                name="fullName"
                onChange={handleOnChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-1">
              Số điện thoại
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="phone"
                placeholder="0123456789"
                name="phone"
                onChange={handleOnChange}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="your@email.com"
                name="email"
                onChange={handleOnChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleOnChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-1">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                name="confirmpassword"
                onChange={handleOnChange}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-red-400 text-white font-semibold rounded-lg hover:scale-[1.02] hover:shadow-lg transition-all"
          >
            {isLoading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Hoặc</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="border py-2.5 rounded-lg hover:bg-red-100 hover:border-red-400 hover:scale-[1.05] transition-all">
            Google
          </button>
          <button className="border py-2.5 rounded-lg hover:bg-red-100 hover:border-red-400 hover:scale-[1.05] transition-all">
            Facebook
          </button>
        </div>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Đã có tài khoản?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-red-600 font-semibold hover:underline cursor-pointer"
          >
            Đăng nhập
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
