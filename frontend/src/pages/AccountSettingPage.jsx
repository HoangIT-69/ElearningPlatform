import React from 'react';
import { Link, Routes, Route, useLocation, Outlet, Navigate } from 'react-router-dom';
import styles from './AccountSettingPage.module.css';

// Import các component con
import ProfileSettings from '../components/ProfileSetting';
import AccountSecurity from '../components/AccountSecurity';
import PaymentMethods from '../components/PaymentMethod'; // <-- Component mới

// Component Layout chứa Sidebar và khu vực nội dung
const AccountSettingsLayout = () => {
    const userFullName = localStorage.getItem('userFullName') || 'User';
    const location = useLocation();

    const getInitials = (name) => {
        if (!name) return '';
        const names = name.split(' ');
        return (names[0]?.charAt(0) + (names.length > 1 ? names[names.length - 1].charAt(0) : '')).toUpperCase();
    };

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.avatar}>{getInitials(userFullName)}</div>
                    <h3>{userFullName}</h3>
                </div>
                <nav>
                    <ul>
                        <li className={location.pathname.endsWith('/profile') ? styles.active : ''}>
                            <Link to="profile">Hồ sơ</Link>
                        </li>
                        <li className={location.pathname.endsWith('/security') ? styles.active : ''}>
                            <Link to="security">Bảo mật</Link>
                        </li>
                        <li className={location.pathname.endsWith('/payment') ? styles.active : ''}>
                            <Link to="payment">Phương thức thanh toán</Link>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className={styles.mainContent}>
                {/* Các component con sẽ được render ở đây */}
                <Outlet />
            </main>
        </div>
    );
};

// Component chính của trang, chịu trách nhiệm định tuyến con
const AccountSettingsPage = () => {
    return (
        <Routes>
            {/* Tất cả các route con đều nằm bên trong layout */}
            <Route path="/" element={<AccountSettingsLayout />}>
                {/* Route mặc định: khi vào /account-settings, tự động chuyển đến 'profile' */}
                <Route index element={<Navigate to="profile" replace />} />

                {/* Định nghĩa các trang con tương đối */}
                <Route path="profile" element={<ProfileSettings />} />
                <Route path="security" element={<AccountSecurity />} />
                <Route path="payment" element={<PaymentMethods />} />
            </Route>
        </Routes>
    );
};

export default AccountSettingsPage;