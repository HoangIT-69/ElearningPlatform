import React, { useState } from 'react';
import { loginUser } from '../services/apiService';
import { useNavigate, Link } from 'react-router-dom';
import styles from './AuthForm.module.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn form tự reload trang
        setError('');
        setLoading(true); // Bắt đầu quá trình tải, vô hiệu hóa nút bấm

        try {
            const response = await loginUser({ email, password });

            // Backend trả về cấu trúc { success, message, data: { accessToken, fullName, ... } }
            const { accessToken, fullName, role, userId } = response.data.data;

            // Lưu các thông tin cần thiết vào localStorage để sử dụng sau này
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('userFullName', fullName);
            localStorage.setItem('userRole', role);
            localStorage.setItem('userId', userId);

            // Chuyển hướng người dùng về trang chủ
            navigate('/');
            window.location.reload(); // Tải lại toàn bộ trang để Navbar cập nhật trạng thái đăng nhập
        } catch (err) {
            // Lấy thông báo lỗi từ response của backend nếu có
            setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng.');
        } finally {
            setLoading(false); // Kết thúc quá trình tải, kích hoạt lại nút bấm
        }
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.formWrapper}>
                <h2 className={styles.formTitle}>Đăng nhập</h2>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email" id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password" id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>
                <p className={styles.redirectText}>
                    Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;