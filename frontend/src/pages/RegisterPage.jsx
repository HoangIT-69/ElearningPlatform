import React, { useState } from 'react';
import { registerUser } from '../services/apiService';
import { useNavigate, Link } from 'react-router-dom';
import styles from './AuthForm.module.css'; // Dùng chung file CSS với Login

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Kiểm tra mật khẩu đơn giản
        if (formData.password.length < 8) {
            setError('Mật khẩu phải có ít nhất 8 ký tự.');
            setLoading(false);
            return;
        }

        try {
            await registerUser(formData);
            setSuccess('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');

            // Chờ 2 giây để người dùng đọc thông báo, sau đó chuyển hướng
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.');
            setLoading(false); // Chỉ set loading false khi có lỗi
        }
        // Khi thành công, nút sẽ bị vô hiệu hóa cho đến khi chuyển trang
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.formWrapper}>
                <h2 className={styles.formTitle}>Tạo tài khoản mới</h2>
                {error && <p className={styles.errorMessage}>{error}</p>}
                {success && <p className={styles.successMessage}>{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="fullName">Họ và tên</label>
                        <input type="text" id="fullName" onChange={handleChange} required />
                    </div>
                     <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" onChange={handleChange} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Mật khẩu (ít nhất 8 ký tự)</label>
                        <input type="password" id="password" onChange={handleChange} required />
                    </div>
                     <div className={styles.inputGroup}>
                        <label htmlFor="phone">Số điện thoại</label>
                        <input type="tel" id="phone" onChange={handleChange} required />
                    </div>
                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? 'Đang tạo...' : 'Đăng ký'}
                    </button>
                </form>
                <p className={styles.redirectText}>
                    Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;