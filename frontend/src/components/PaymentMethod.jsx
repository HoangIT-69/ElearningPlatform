import React from 'react';
import styles from './PaymentMethod.module.css'; // Sẽ tạo file CSS này

const PaymentMethods = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Phương thức thanh toán</h1>
            <p className={styles.subtitle}>Thêm hoặc xóa các phương thức thanh toán của bạn.</p>

            <div className={styles.cardList}>
                {/* Đây là ví dụ, sau này bạn sẽ map qua dữ liệu thật */}
                <div className={styles.cardItem}>
                    <span>Visa **** **** **** 1234</span>
                    <button className={styles.removeButton}>Xóa</button>
                </div>
            </div>

            <button className={styles.addButton}>+ Thêm phương thức mới</button>
        </div>
    );
};

export default PaymentMethods;