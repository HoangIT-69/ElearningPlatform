import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CourseDetailPage from  './pages/CourseDetailPage'
import Navbar from './components/Navbar';
import AccountSettingsPage from './pages/AccountSettingPage';
import CartPage from './pages/CartPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailedPage from './pages/PaymentFailedPage';
import MyLearningPage from './pages/MyLearningPage';

function App() {
  return (
    // Bọc toàn bộ ứng dụng trong Router để kích hoạt điều hướng
    <Router>
      {/* Navbar sẽ luôn hiển thị ở tất cả các trang */}
      <Navbar />

      {/* Phần nội dung chính của trang sẽ thay đổi tùy theo URL */}
      <main>
        <Routes>
          {/* Định nghĩa các route */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/course/:slug" element={<CourseDetailPage />} />
          <Route path="/account-settings/*" element={<AccountSettingsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/payment-failed" element={<PaymentFailedPage />} />
          <Route path="/my-learning" element={<MyLearningPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;