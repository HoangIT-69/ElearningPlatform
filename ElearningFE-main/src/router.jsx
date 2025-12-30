import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import HomePage from "./pages/user/homePage";
import LoginPage from "./pages/user/loginPage";
import RegisterPage from "./pages/user/registerPage";
import DetailCoure from "./pages/user/detailCoure";
import CartPage from "./pages/user/cart";
import ListCourse from "./pages/user/listCourse";
import ProfilePage from "./pages/user/profilePage";
import LessonPage from "./pages/user/lessonPage";
import EditProfile from "./pages/user/profilePage/editProfile";
import ChangePassword from "./pages/user/profilePage/changePassword";
import SuccessfulPayment from "./pages/user/successfulPayment";
import PaymentFailed from "./pages/user/paymentFailed";

import LoginAdmin from "./pages/admin/loginAdmin";
import AdminPage from "./pages/admin/admin";
import MasterLayout from "./pages/user/theme/masterLayout";

import { ROUTERS } from "./utils/router";
import LoginInstructor from "./pages/instructor/loginInstructor";
import Instructor from "./pages/instructor/instructor";

const RouterCustom = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setRole(decoded.role || null);
    } catch (error) {
      console.error("Invalid token:", error);
      setRole(null);
    }

    setLoading(false);
  }, [location.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const userRouter = (
    <MasterLayout>
      <Routes>
        <Route path={ROUTERS.USER.HOME} element={<HomePage />} />
        <Route path={ROUTERS.USER.LOGINPAGE} element={<LoginPage />} />
        <Route path={ROUTERS.USER.REGISTERPAGE} element={<RegisterPage />} />
        <Route path={ROUTERS.USER.LISTCOURSE} element={<ListCourse />} />
        <Route path={ROUTERS.USER.DETAILCOURSE} element={<DetailCoure />} />
        <Route path={ROUTERS.USER.CART} element={<CartPage />} />
        <Route path={ROUTERS.USER.PROFILEPAGE} element={<ProfilePage />} />
        <Route path={ROUTERS.USER.EDITPROFILE} element={<EditProfile />} />
        <Route
          path={ROUTERS.USER.CHANGEPASSWORD}
          element={<ChangePassword />}
        />
        <Route path={ROUTERS.USER.LESSONPAGE} element={<LessonPage />} />
        <Route path={ROUTERS.USER.SUCCESSFULPAYMENT} element={<SuccessfulPayment/>} />
        <Route path={ROUTERS.USER.PAYMENTFAILED} element={<PaymentFailed/>} />
      </Routes>
    </MasterLayout>
  );

  return (
    <Routes>
      

      <Route path={ROUTERS.ADMIN.LOGIN} element={<LoginAdmin />} />
      {role === "ADMIN" ? (
        <Route path="/admin/*" element={<AdminPage />} />
      ) : (
        <Route
          path="/admin/*"
          element={<Navigate to={ROUTERS.ADMIN.LOGIN} replace />}
        />
      )}

      {/* INSTRUCTOR */}
      <Route path={ROUTERS.INSTRUCTOR.LOGIN} element={<LoginInstructor />} />
      {role === "INSTRUCTOR" ? (
        <Route path="/instructor/*" element={<Instructor />} />
      ) : (
        <Route
          path="/instructor/*"
          element={<Navigate to={ROUTERS.INSTRUCTOR.LOGIN} replace />}
        />
      )}

      <Route path="/*" element={userRouter} />
    </Routes>
  );
};

export default RouterCustom;
