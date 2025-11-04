import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './PaymentResultPage.module.css'; // Sẽ tạo file CSS chung

const PaymentSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    // Phát tín hiệu để cập nhật giỏ hàng trên Navbar
    useEffect(() => {
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={`${styles.icon} ${styles.success}`}>✓</div>
                <h1 className={styles.title}>Thanh toán thành công!</h1>
                <p className={styles.message}>
                    Cảm ơn bạn đã mua khóa học. Đơn hàng của bạn (#{orderId}) đã được xác nhận.
                </p>
                <div className={styles.actions}>
                    <Link to="/my-learning" className={styles.primaryBtn}>
                        Vào khóa học của tôi
                    </Link>
                    <Link to="/" className={styles.secondaryBtn}>
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;