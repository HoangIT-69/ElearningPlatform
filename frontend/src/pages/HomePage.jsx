import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Đảm bảo đã import Link
import { getAllCourses } from '../services/apiService';
import styles from './HomePage.module.css';

const HomePage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        page: 0,
        size: 12,
        search: '',
        level: '',
        isFree: null
    });

    const [pageInfo, setPageInfo] = useState({ totalPages: 0, totalElements: 0 });

    const fetchCourses = useCallback(async () => {
        // Không set loading ở đây để tránh nhấp nháy khi debounce
        try {
            const response = await getAllCourses(filters);
            if (response.data && response.data.success) {
                const { content, totalPages, totalElements } = response.data.data;
                setCourses(content);
                setPageInfo({ totalPages, totalElements });
            } else {
                setError("Không thể tải dữ liệu khóa học.");
            }
        } catch (err) {
            console.error("Lỗi khi tải khóa học:", err);
            setError("Đã có lỗi xảy ra khi kết nối tới server.");
        } finally {
            setLoading(false); // Chỉ set loading false sau khi API hoàn tất
        }
    }, [filters]);

    useEffect(() => {
        setLoading(true); // Set loading true ngay khi bắt đầu debounce
        const handler = setTimeout(() => {
            fetchCourses();
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [fetchCourses]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;
        if (name === 'isFree') {
            if (value === 'true') processedValue = true;
            else if (value === 'false') processedValue = false;
            else processedValue = null;
        }
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: processedValue,
            page: 0
        }));
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Khám phá các Khóa học</h1>

            <div className={styles.filterBar}>
                {/* ... Thanh tìm kiếm và lọc giữ nguyên ... */}
                 <div className={styles.searchForm}>
                    <input
                        type="text"
                        name="search"
                        placeholder="Tìm kiếm khóa học..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        className={styles.searchInput}
                    />
                </div>
                <div className={styles.filters}>
                    <select name="level" value={filters.level} onChange={handleFilterChange} className={styles.filterSelect}>
                        <option value="">Tất cả cấp độ</option>
                        <option value="BEGINNER">Mới bắt đầu</option>
                        <option value="INTERMEDIATE">Trung bình</option>
                        <option value="ADVANCED">Nâng cao</option>
                    </select>
                    <select name="isFree" value={filters.isFree === null ? '' : String(filters.isFree)} onChange={handleFilterChange} className={styles.filterSelect}>
                        <option value="">Tất cả giá</option>
                        <option value="true">Miễn phí</option>
                        <option value="false">Trả phí</option>
                    </select>
                </div>
            </div>

            {/* --- PHẦN HIỂN THỊ KẾT QUẢ --- */}
            {loading ? <div className={styles.message}>Đang tìm kiếm...</div> :
                error ? <div className={`${styles.message} ${styles.error}`}>{error}</div> :
                courses.length > 0 ? (
                    <div className={styles.courseGrid}>
                        {courses.map(course => (
                            // **SỬA LỖI NẰM Ở ĐÂY**
                            // `key` phải nằm ở thẻ <Link> ngoài cùng
                            <Link to={`/course/${course.slug}`} key={course.id} className={styles.courseCardLink}>
                                <div className={styles.courseCard}>
                                    <img className={styles.thumbnail} src={course.thumbnail || 'https://via.placeholder.com/400x225'} alt={course.title} />
                                    <div className={styles.cardContent}>
                                        <h3 className={styles.courseTitle}>{course.title}</h3>
                                        <p className={styles.instructorName}>
                                            Giảng viên: {course.instructorName || 'Chưa cập nhật'}
                                        </p>
                                        <div className={styles.priceContainer}>
                                            <span className={styles.price}>
                                                {course.isFree ? 'Miễn phí' : `${course.price.toLocaleString('vi-VN')} VNĐ`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className={styles.message}>Không tìm thấy khóa học nào phù hợp.</div>
                )
            }
        </div>
    );
};

export default HomePage;