import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CourseDetailPage from  './pages/CourseDetailPage'
import Navbar from './components/Navbar';

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
          {/* Bạn có thể thêm các route khác ở đây sau này */}
          {/* Ví dụ: <Route path="/courses/:courseSlug" element={<CourseDetailPage />} /> */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;