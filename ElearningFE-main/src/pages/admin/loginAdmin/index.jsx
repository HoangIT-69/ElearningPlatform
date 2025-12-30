import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Logo from "../../../assets/user/Logo.svg";
import { useNavigate } from "react-router-dom";
import * as authService from "../../../service/authService";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await authService.login(formData.email, formData.password);
      if (res.success === true) {
        toast.success(res.message);
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("userId", user.id);
              localStorage.setItem("userEmail", user.email);
              localStorage.setItem("userFullName", user.fullName || user.name);
              localStorage.setItem("userRole", user.role);
              localStorage.setItem("userAvatar", user.avatar || "");
        Cookies.set("refreshToken", res.data.refreshToken, {
          expires: 7,
          secure: false,
          sameSite: "Strict",
        });
        navigate("/admin");
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
            alt="Logo"
            className="w-[160px] h-[60px] cursor-pointer mx-auto"
          />
          <p className="text-gray-500 text-sm">
            Nền tảng học tập trực tuyến hàng đầu
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Đăng nhập admin
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-gray-800 font-medium mb-1"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                name="email"
                onChange={handleOnChange}
                placeholder="your@email.com"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-red-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-800 font-medium mb-1"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                name="password"
                onChange={handleOnChange}
                required
                className="w-full pl-10 pr-10 py-2.5 border border-red-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-red-400 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;
