import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate
// Import đầy đủ các hàm cần thiết từ apiService
import { getMyCart, removeFromCart, clearCart, createVnpayPayment } from '../services/apiService';
import styles from './CartPage.module.css';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const navigate = useNavigate(); // Khởi tạo hook để điều hướng

    // Hàm để tải dữ liệu giỏ hàng từ API
    const fetchCart = async () => {
        setLoading(true);
        try {
            const response = await getMyCart();
            if (response.data.success) {
                setCartItems(response.data.data);
            }
        } catch (err) {
            console.error("Lỗi khi tải giỏ hàng:", err);
            setError("Không thể tải giỏ hàng của bạn.");
        } finally {
            setLoading(false);
        }
    };

    // Tải giỏ hàng khi component được render lần đầu
    useEffect(() => {
        fetchCart();
    }, []);

    // Hàm xử lý xóa một item
    const handleRemove = async (courseId, courseTitle) => {
        if (window.confirm(`Bạn có chắc muốn xóa "${courseTitle}" khỏi giỏ hàng?`)) {
            try {
                await removeFromCart(courseId);
                fetchCart(); // Tải lại dữ liệu
                window.dispatchEvent(new CustomEvent('cartUpdated')); // Báo cho Navbar
            } catch (error) {
                alert('Lỗi khi xóa khóa học.');
            }
        }
    };

    // Hàm xử lý xóa tất cả item
    const handleClearCart = async () => {
        if (window.confirm('Bạn có chắc muốn xóa tất cả các khóa học khỏi giỏ hàng?')) {
            try {
                await clearCart();
                fetchCart(); // Tải lại dữ liệu
                window.dispatchEvent(new CustomEvent('cartUpdated')); // Báo cho Navbar
            } catch (error) {
                alert('Lỗi khi dọn dẹp giỏ hàng.');
            }
        }
    };

    // Hàm xử lý khi nhấn nút "Thanh toán"
    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            // Logic đã được xử lý hoàn toàn ở backend
            const response = await createVnpayPayment();

            if (response.data?.success && response.data.data.paymentUrl) {
                // Backend sẽ trả về hoặc link VNPay, hoặc link /payment-success
                // Frontend chỉ cần điều hướng đến URL đó.
                window.location.href = response.data.data.paymentUrl;
            } else {
                alert("Không thể xử lý thanh toán. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi khi thanh toán:", error);
            alert(error.response?.data?.message || "Đã xảy ra lỗi trong quá trình thanh toán.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    // Tính tổng tiền
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

    if (loading) return <div className={styles.message}>Đang tải giỏ hàng...</div>;
    if (error) return <div className={`${styles.message} ${styles.error}`}>{error}</div>;

    return (
        <div className={styles.container}>
            <h1>Giỏ hàng</h1>
            {cartItems.length === 0 ? (
                <div className={styles.emptyCart}>
                    <p>Giỏ hàng của bạn đang trống.</p>
                    <Link to="/" className={styles.keepShoppingBtn}>Tiếp tục mua sắm</Link>
                </div>
            ) : (
                <div className={styles.cartLayout}>
                    <div className={styles.itemList}>
                        <div className={styles.itemListHeader}>
                            <h4>{cartItems.length} khóa học trong giỏ hàng</h4>
                            <button onClick={handleClearCart} className={styles.clearAllBtn}>Xóa tất cả</button>
                        </div>

                        {cartItems.map(item => (
                            <div key={item.courseId} className={styles.cartItem}>
                                <img src={item.courseThumbnail || 'https://via.placeholder.com/120x70'} alt={item.courseTitle} />
                                <div className={styles.itemDetails}>
                                    <Link to={`/course/${item.courseSlug}`} className={styles.itemTitle}>{item.courseTitle}</Link>
                                    <p className={styles.itemInstructor}>bởi {item.instructorName}</p>
                                </div>
                                <div className={styles.itemActions}>
                                    <button onClick={() => handleRemove(item.courseId, item.courseTitle)} className={styles.removeBtn}>Xóa</button>
                                </div>
                                <p className={styles.itemPrice}>
                                    {item.price > 0 ? `${item.price.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}
                                </p>
                            </div>
                        ))}
                    </div>
                    <aside className={styles.summary}>
                        <h4>Tổng cộng:</h4>
                        <p className={styles.totalPrice}>
                            {totalPrice > 0 ? `${totalPrice.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}
                        </p>
                        <button
                            className={styles.checkoutBtn}
                            onClick={handleCheckout}
                            disabled={isCheckingOut} // Chỉ vô hiệu hóa khi đang xử lý
                        >
                            {isCheckingOut ? 'Đang xử lý...' : (totalPrice > 0 ? 'Thanh toán' : 'Đăng ký học')}
                        </button>
                        <p className={styles.promoText}>Phiếu giảm giá sẽ được áp dụng ở bước thanh toán.</p>
                    </aside>
                </div>
            )}
        </div>
    );
};

export default CartPage;