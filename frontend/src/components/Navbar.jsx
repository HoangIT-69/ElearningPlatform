import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyCart } from '../services/apiService'; // Import API giỏ hàng
import styles from './Navbar.module.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [itemCount, setItemCount] = useState(0);
    const dropdownRef = useRef(null);

    // Lấy thông tin người dùng từ localStorage
    const token = localStorage.getItem('accessToken');
    const userFullName = localStorage.getItem('userFullName');
    const userEmail = localStorage.getItem('userEmail');
    const userAvatar = localStorage.getItem('userAvatar');

    // Hàm để tải lại giỏ hàng
    const refetchCart = async () => {
        if (!token) {
            setItemCount(0);
            return;
        }
        try {
            const response = await getMyCart();
            if (response.data.success) {
                setItemCount(response.data.data.length);
            }
        } catch (error) {
            console.error("Navbar: Lỗi khi tải giỏ hàng", error);
            setItemCount(0);
        }
    };

    // useEffect chính để quản lý cập nhật
    useEffect(() => {
        // 1. Tải giỏ hàng lần đầu khi component mount hoặc khi token thay đổi (đăng nhập/đăng xuất)
        refetchCart();

        // 2. Lắng nghe sự kiện "cartUpdated" từ các component khác
        const handleCartUpdate = () => {
            refetchCart();
        };
        window.addEventListener('cartUpdated', handleCartUpdate);

        // 3. Xử lý click outside cho dropdown
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        // 4. Dọn dẹp tất cả listeners khi component bị unmount
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [token]); // Phụ thuộc vào token, sẽ chạy lại khi người dùng đăng nhập hoặc đăng xuất

    const handleLogout = () => {
        localStorage.clear();
        setIsDropdownOpen(false);
        navigate('/login');
    };

    const getInitials = (name) => {
        if (!name) return '..';
        const names = name.split(' ');
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    // Component con để render Avatar, giúp code gọn hơn
    const UserAvatar = ({ isLarge = false }) => {
        const className = isLarge ? styles.avatarLarge : styles.avatar;
        if (userAvatar && userAvatar !== 'null') {
            return <img src={userAvatar} alt={userFullName} className={className} />;
        } else {
            return <div className={className}>{getInitials(userFullName)}</div>;
        }
    };

    return (
        <header className={styles.navbar}>
            <nav className={styles.navContainer}>
                <Link to="/" className={styles.logo}>E-Learning</Link>
                <div className={styles.navLinks}>
                    <Link to="/" className={styles.navLink}>Trang chủ</Link>

                    {token ? (
                        <>
                            {/* --- Icon Giỏ hàng --- */}
                            <Link to="/cart" className={styles.cartIconWrapper}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                                {itemCount > 0 && (
                                    <span className={styles.cartBadge}>{itemCount}</span>
                                )}
                            </Link>

                            {/* --- Dropdown Người dùng --- */}
                            <div className={styles.profileContainer} ref={dropdownRef}>
                                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={styles.profileButton}>
                                    <UserAvatar />
                                </button>
                                {isDropdownOpen && (
                                    <div className={styles.dropdownMenu}>
                                        <div className={styles.dropdownHeader}>
                                            <UserAvatar isLarge={true} />
                                            <div className={styles.userInfo}>
                                                <p className={styles.userName}>{userFullName}</p>
                                                <p className={styles.userEmail}>{userEmail}</p>
                                            </div>
                                        </div>
                                        <div className={styles.dropdownSection}>
                                            <Link to="/my-learning" className={styles.dropdownLink}>Khóa học của tôi</Link>
                                            <Link to="/cart" className={styles.dropdownLink}>Giỏ hàng</Link>
                                            <Link to="/wishlist" className={styles.dropdownLink}>Danh sách yêu thích</Link>
                                        </div>
                                        <div className={styles.dropdownSection}>
                                            <Link to="/account-settings" className={styles.dropdownLink}>Cài đặt tài khoản</Link>
                                            <Link to="/purchase-history" className={styles.dropdownLink}>Lịch sử mua hàng</Link>
                                        </div>
                                        <div className={styles.dropdownSection}>
                                            <button onClick={handleLogout} className={styles.dropdownLink}>Đăng xuất</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/register" className={styles.navLink}>Đăng ký</Link>
                            <Link to="/login"><button className={styles.loginButton}>Đăng nhập</button></Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;