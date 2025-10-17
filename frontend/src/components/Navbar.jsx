import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css'; // Import CSS Module

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');
    const userFullName = localStorage.getItem('userFullName');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        window.location.reload();
    };

    return (
        <header className={styles.navbar}>
            <nav className={styles.navContainer}>
                <Link to="/" className={styles.logo}>
                    E-Learning
                </Link>
                <div className={styles.navLinks}>
                    <Link to="/" className={styles.navLink}>Trang chủ</Link>
                    {token ? (
                        <>
                            <span className={styles.navLink}>Chào, {userFullName}!</span>
                            <button onClick={handleLogout} className={styles.logoutButton}>
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/register" className={styles.navLink}>
                                Đăng ký
                            </Link>
                            <Link to="/login">
                                <button className={styles.loginButton}>Đăng nhập</button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;