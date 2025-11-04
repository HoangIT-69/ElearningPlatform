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
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await loginUser({ email, password });
            if (response.data && response.data.success) {
                const { accessToken, fullName, role, userId, email: userEmail, avatar } = response.data.data;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('userFullName', fullName);
                localStorage.setItem('userRole', role);
                localStorage.setItem('userId', String(userId));
                localStorage.setItem('userEmail', userEmail);

                if (avatar) {
                    localStorage.setItem('userAvatar', avatar);
                } else {
                    localStorage.removeItem('userAvatar');
                }

                navigate('/');
                window.location.reload();
            } else {
                setError(response.data.message || 'Đã có lỗi xảy ra.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng.');
        } finally {
            setLoading(false);
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
                            // SỬA LẠI Ở ĐÂY: từ e.g.value -> e.target.value
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