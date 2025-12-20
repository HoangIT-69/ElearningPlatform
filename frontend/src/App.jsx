import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import các Pages và Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CourseDetailPage from './pages/CourseDetailPage';
import AccountSettingsPage from './pages/AccountSettingPage';
import CartPage from './pages/CartPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailedPage from './pages/PaymentFailedPage';
import MyLearningPage from './pages/MyLearningPage';
import LearnPage from './pages/LearnPage';
import Navbar from './components/Navbar';
import PurchaseHistoryPage from './pages/PurchaseHistoryPage';

//import instructor pages
import InstructorDashboardLayout from './pages/instructor/InstructorDashboardLayout'; // Layout mới
import MyCoursesPage from './pages/instructor/MyCoursesPage'; // Trang DS khóa học
import CreateCoursePage from './pages/instructor/CreateCoursePage';
import EditCoursePage from './pages/instructor/EditCoursePage';
import CurriculumPage from './pages/instructor/CurriculumPage';

// --- Component Layout chung cho các trang public ---
const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};


function App() {
  return (
    <Router>
      <Routes>

        {/* === NHÓM 1: CÁC LAYOUT ĐẶC BIỆT (ƯU TIÊN CAO NHẤT) === */}

        {/* Route cho trang học (không có navbar) */}
        <Route path="/learn/:slug" element={<LearnPage />} />

        {/* Route cho instructor (layout riêng có sidebar) */}
        <Route path="/instructor" element={<InstructorDashboardLayout />}>
            <Route index element={<Navigate to="courses" replace />} />
            <Route path="courses" element={<MyCoursesPage />} />
            <Route path="courses/new" element={<CreateCoursePage />} />
            <Route path="courses/:courseId/edit" element={<EditCoursePage />} />
             <Route path="courses/:courseId/curriculum" element={<CurriculumPage />} />
        </Route>

        {/* === NHÓM 2: LAYOUT CHUNG (ƯU TIÊN THẤP HƠN) === */}
        {/* Route này sẽ chỉ được xét đến nếu các route ở trên không khớp */}
        <Route path="/*" element={
          <MainLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="course/:slug" element={<CourseDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="account-settings/*" element={<AccountSettingsPage />} />
              <Route path="my-learning" element={<MyLearningPage />} />
              <Route path="payment-success" element={<PaymentSuccessPage />} />
              <Route path="payment-failed" element={<PaymentFailedPage />} />
              <Route path="purchase-history" element={<PurchaseHistoryPage />} />

              {/* Route bắt lỗi 404 cho các trang trong MainLayout */}
              <Route path="*" element={<div>404 - Trang không tồn tại</div>} />
            </Routes>
          </MainLayout>
        } />

      </Routes>
    </Router>
  );
}

export default App;