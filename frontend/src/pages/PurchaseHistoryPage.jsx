import React, { useState, useEffect } from 'react';
import { getPurchaseHistory } from '../services/apiService';
import { Link } from 'react-router-dom';
import styles from './PurchaseHistoryPage.module.css'; // Sẽ tạo file CSS

const PurchaseHistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await getPurchaseHistory();
                if (response.data.success) {
                    setHistory(response.data.data);
                }
            } catch (err) {
                setError('Không thể tải lịch sử mua hàng.');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (loading) return <div className={styles.message}>Đang tải...</div>;
    if (error) return <div className={`${styles.message} ${styles.error}`}>{error}</div>;

    return (
        <div className={styles.container}>
            <h1>Lịch sử mua hàng</h1>

            {history.length === 0 ? (
                <p className={styles.message}>Bạn chưa mua khóa học nào.</p>
            ) : (
                <div className={styles.historyList}>
                    {history.map(order => (
                        <div key={order.orderId} className={styles.orderCard}>
                            <div className={styles.orderHeader}>
                                <div>
                                    <span className={styles.orderDate}>Ngày mua: {formatDate(order.orderDate)}</span>
                                    <span className={styles.orderId}>ĐƠN HÀNG #{order.orderId}</span>
                                </div>
                                <span className={styles.orderTotal}>
                                    Tổng cộng: {order.totalAmount.toLocaleString('vi-VN')} VNĐ
                                </span>
                            </div>
                            <div className={styles.orderItems}>
                                {order.items.map(item => (
                                    <div key={item.courseId} className={styles.orderItem}>
                                        <img src={item.courseThumbnail} alt={item.courseTitle} />
                                        <div className={styles.itemDetails}>
                                            <Link to={`/course/${item.courseSlug}`} className={styles.itemTitle}>{item.courseTitle}</Link>
                                        </div>
                                        <Link to={`/learn/${item.courseSlug}`} className={styles.goToCourseBtn}>Vào học</Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PurchaseHistoryPage;