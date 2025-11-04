import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './PaymentResultPage.module.css';

const PaymentFailedPage = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={`${styles.icon} ${styles.failed}`}>✗</div>
                <h1 className={styles.title}>Thanh toán thất bại</h1>
                <p className={styles.message}>
                    Đã có lỗi xảy ra trong quá trình thanh toán cho đơn hàng #{orderId}. Vui lòng thử lại.
                </p>
                <div className={styles.actions}>
                    <Link to="/cart" className={styles.primaryBtn}>
                        Thử lại với giỏ hàng
                    </Link>
                    <Link to="/" className={styles.secondaryBtn}>
                        Quay về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailedPage;