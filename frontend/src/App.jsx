import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

// --- TẠO MỘT COMPONENT LAYOUT CHUNG ---
// Component này sẽ chứa Navbar và render các trang con
const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>
        {children}
      </main>
    </>
  );
};


function App() {
  return (
    <Router>
      {/* Routes giờ đây là component cấp cao nhất */}
      <Routes>

        {/* --- ROUTE CHO TRANG HỌC (KHÔNG CÓ NAVBAR) --- */}
        {/* Route này được định nghĩa riêng lẻ ở cấp cao nhất */}
        <Route path="/learn/:slug" element={<LearnPage />} />

        {/* --- CÁC ROUTE CÒN LẠI (CÓ NAVBAR) --- */}
        {/* Tất cả các route khác sẽ được render bên trong MainLayout */}
        <Route path="/*" element={
          <MainLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/course/:slug" element={<CourseDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/account-settings/*" element={<AccountSettingsPage />} />
              <Route path="/my-learning" element={<MyLearningPage />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="/payment-failed" element={<PaymentFailedPage />} />
              {/* Thêm một route bắt lỗi 404 nếu muốn */}
              <Route path="*" element={<div>404 - Trang không tồn tại</div>} />
            </Routes>
          </MainLayout>
        } />

      </Routes>
    </Router>
  );
}

export default App;