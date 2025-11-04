import React, { useState } from 'react';
import { changePassword } from '../services/apiService';
import styles from './AccountSecurity.module.css'; // Sẽ tạo file CSS này

const AccountSecurity = () => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');

    // State cho các trường của form đổi mật khẩu
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setPasswordData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // 1. Kiểm tra mật khẩu mới có khớp không
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Xác nhận mật khẩu mới không khớp.' });
            return;
        }

        // 2. Kiểm tra độ dài mật khẩu mới
        if (passwordData.newPassword.length < 8) {
            setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 8 ký tự.' });
            return;
        }

        setLoading(true);

        try {
            // 3. Gọi API, chỉ gửi đi mật khẩu cũ và mới
            await changePassword(userId, {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });

            setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });

            // 4. Xóa các trường input sau khi thành công
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });

        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Bảo mật tài khoản</h1>
            <p className={styles.subtitle}>Chỉnh sửa cài đặt bảo mật và thay đổi mật khẩu của bạn tại đây.</p>

            <form onSubmit={handleSubmit} className={styles.formSection}>
                {/* Email không cho phép sửa, chỉ hiển thị */}
                <div className={styles.inputGroup}>
                    <label>Email</label>
                    <div className={styles.emailDisplay}>
                        <span>{userEmail}</span>
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="oldPassword">Mật khẩu cũ</label>
                    <input
                        type="password"
                        id="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="newPassword">Mật khẩu mới</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={passwordData.newPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                {message.text && (
                    <p className={`${styles.message} ${styles[message.type]}`}>
                        {message.text}
                    </p>
                )}

                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? 'Đang lưu...' : 'Đổi mật khẩu'}
                </button>
            </form>
        </div>
    );
};

export default AccountSecurity;