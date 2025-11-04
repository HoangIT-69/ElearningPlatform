import React, { useState, useEffect } from 'react';
import { getMyEnrolledCourses } from '../services/apiService';
import { Link } from 'react-router-dom';
import styles from './MyLearningPage.module.css'; // Sẽ tạo file CSS

const MyLearningPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                const response = await getMyEnrolledCourses();
                if (response.data.success) {
                    setCourses(response.data.data);
                }
            } catch (err) {
                console.error("Lỗi khi tải khóa học của tôi:", err);
                setError("Không thể tải danh sách khóa học của bạn.");
            } finally {
                setLoading(false);
            }
        };
        fetchMyCourses();
    }, []);

    if (loading) return <div className={styles.message}>Đang tải...</div>;
    if (error) return <div className={`${styles.message} ${styles.error}`}>{error}</div>;

    return (
        <div className={styles.container}>
            <h1>Khóa học của tôi</h1>

            {courses.length === 0 ? (
                <p className={styles.message}>Bạn chưa đăng ký khóa học nào.</p>
            ) : (
                <div className={styles.courseGrid}>
                    {courses.map(course => (
                        // Link sẽ trỏ đến trang "học" (learning page) của khóa học
                        <Link to={`/learn/${course.slug}`} key={course.id} className={styles.courseCard}>
                            <img className={styles.thumbnail} src={course.thumbnail} alt={course.title} />
                            <div className={styles.cardContent}>
                                <h3 className={styles.courseTitle}>{course.title}</h3>
                                <p className={styles.instructorName}>{course.instructorName}</p>
                                <div className={styles.progressBar}>
                                    <div className={styles.progress} style={{ width: `0%` }}></div> 
                                    {/* TODO: Lấy progress từ API */}
                                </div>
                                <span className={styles.progressText}>0% hoàn thành</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyLearningPage;