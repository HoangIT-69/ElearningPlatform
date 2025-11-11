import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAllCourses, getCategoryTree, getPopularCourses } from '../services/apiService';
import styles from './HomePage.module.css';

// Import thư viện slider và CSS của nó
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// --- Component con cho một dòng lọc danh mục ---

const StarRating = ({ rating }) => {
    const fullStars = Math.round(rating); // Làm tròn đến sao gần nhất
    const emptyStars = 5 - fullStars;
    return (
        <div className={styles.starRating}>
            {[...Array(fullStars)].map((_, i) => <span key={`full_${i}`} className={styles.starFilled}>★</span>)}
            {[...Array(emptyStars)].map((_, i) => <span key={`empty_${i}`} className={styles.starEmpty}>★</span>)}
        </div>
    );
};
const CategoryFilterItem = ({ category, onSelect, selectedCategoryId }) => {
    const isParentSelected = selectedCategoryId === category.id;
    const isChildSelected = category.children.some(child => child.id === selectedCategoryId);

    return (
        <div className={styles.categoryFilterRow}>
            <div className={styles.categoryParent}>
                <input
                    type="radio"
                    id={`cat-${category.id}`}
                    name="categoryFilter"
                    value={category.id}
                    onChange={() => onSelect(category.id)}
                    checked={isParentSelected || isChildSelected}
                />
                <label htmlFor={`cat-${category.id}`}>{category.name}</label>
            </div>
            {category.children && category.children.length > 0 && (
                <div className={styles.categoryChildren}>
                    {category.children.map(child => (
                        <button
                            key={child.id}
                            className={`${styles.categoryTag} ${selectedCategoryId === child.id ? styles.active : ''}`}
                            onClick={() => onSelect(child.id)}
                        >
                            {child.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Component con cho Slider Khóa học Phổ biến ---
const PopularCoursesSlider = ({ courses }) => {
    const settings = {
        dots: true,
        infinite: courses.length > 4, // Chỉ lặp lại nếu có đủ item
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } }
        ]
    };

    return (
        <div className={styles.sliderContainer}>
            <h2 className={styles.sectionTitle}>Các khóa học phổ biến</h2>
            <Slider {...settings}>
                {courses.map(course => (
                    <div key={course.id} className={styles.sliderItem}>
                        <Link to={`/course/${course.slug}`} className={styles.courseCardLink}>
                            <div className={styles.courseCard}>
                                <img className={styles.thumbnail} src={course.thumbnail || 'https://via.placeholder.com/400x225'} alt={course.title} />
                                <div className={styles.cardContent}>
                                    <h3 className={styles.courseTitle}>{course.title}</h3>
                                    <p className={styles.instructorName}>
                                        Giảng viên: {course.instructorName || 'Chưa cập nhật'}
                                    </p>
                                     <div className={styles.courseStats}>
                                         <span className={styles.ratingValue}>{course.averageRating.toFixed(1)}</span>
                                         <StarRating rating={course.averageRating} />
                                         <span className={styles.reviewCount}>({course.reviewCount})</span>
                                     </div>
                                    <div className={styles.priceContainer}>
                                        <span className={styles.price}>
                                            {course.isFree ? 'Miễn phí' : `${course.price.toLocaleString('vi-VN')} VNĐ`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </Slider>
        </div>
    );
};


// --- Component HomePage chính ---
const HomePage = () => {
    const [courses, setCourses] = useState([]);
    const [popularCourses, setPopularCourses] = useState([]);
    const [categoryTree, setCategoryTree] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        page: 0,
        size: 12,
        search: '',
        level: '',
        isFree: null,
        categoryId: ''
    });

    const [pageInfo, setPageInfo] = useState({ totalPages: 0, totalElements: 0 });

    // Lấy dữ liệu ban đầu (danh mục VÀ khóa học phổ biến)
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [categoryRes, popularRes] = await Promise.all([
                    getCategoryTree(),
                    getPopularCourses(8) // Lấy 8 khóa học phổ biến nhất
                ]);

                if (categoryRes.data?.success) setCategoryTree(categoryRes.data.data);
                if (popularRes.data?.success) setPopularCourses(popularRes.data.data);

            } catch (error) {
                console.error("Lỗi khi tải dữ liệu ban đầu:", error);
            }
        };
        fetchInitialData();
    }, []);

    // Hàm gọi API lấy khóa học theo bộ lọc
    const fetchCourses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllCourses(filters);
            if (response.data?.success) {
                const { content, totalPages, totalElements } = response.data.data;
                setCourses(content);
                setPageInfo({ totalPages, totalElements });
            } else {
                setError("Không thể tải dữ liệu khóa học.");
            }
        } catch (err) {
            setError("Đã có lỗi xảy ra khi kết nối tới server.");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Sử dụng debounce để gọi API sau khi người dùng ngừng tương tác
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchCourses();
        }, 500);
        return () => clearTimeout(handler);
    }, [fetchCourses]);

    const handleCategorySelect = (categoryId) => {
        setFilters(prev => ({ ...prev, categoryId: prev.categoryId === categoryId ? '' : categoryId, page: 0 }));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;
        if (name === 'isFree') {
            if (value === 'true') processedValue = true;
            else if (value === 'false') processedValue = false;
            else processedValue = null;
        }
        setFilters(prev => ({ ...prev, [name]: processedValue, page: 0 }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.searchSection}>
                <input
                    type="text" name="search" placeholder="Bạn muốn học gì hôm nay?"
                    value={filters.search} onChange={handleFilterChange}
                    className={styles.mainSearchInput}
                />
            </div>

            {popularCourses.length > 0 && <PopularCoursesSlider courses={popularCourses} />}

            <div className={styles.filterAndContent}>
                <aside className={styles.filterSidebar}>
                    <div className={styles.filterGroup}>
                        <h3 className={styles.filterTitle}>Danh mục</h3>
                        <div className={styles.categoryFilterList}>
                            <button
                                className={`${styles.categoryTag} ${filters.categoryId === '' ? styles.active : ''}`}
                                onClick={() => handleCategorySelect('')}
                            >
                                Tất cả
                            </button>
                            {categoryTree.map(cat => (
                                <CategoryFilterItem
                                    key={cat.id}
                                    category={cat}
                                    onSelect={handleCategorySelect}
                                    selectedCategoryId={filters.categoryId}
                                />
                            ))}
                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <h3 className={styles.filterTitle}>Cấp độ</h3>
                        <select name="level" value={filters.level} onChange={handleFilterChange} className={styles.filterSelect}>
                            <option value="">Tất cả</option>
                            <option value="BEGINNER">Mới bắt đầu</option>
                            <option value="INTERMEDIATE">Trung bình</option>
                            <option value="ADVANCED">Nâng cao</option>
                        </select>
                    </div>

                     <div className={styles.filterGroup}>
                        <h3 className={styles.filterTitle}>Giá cả</h3>
                         <select name="isFree" value={filters.isFree === null ? '' : String(filters.isFree)} onChange={handleFilterChange} className={styles.filterSelect}>
                            <option value="">Tất cả</option>
                            <option value="true">Miễn phí</option>
                            <option value="false">Trả phí</option>
                        </select>
                    </div>
                </aside>

                <main className={styles.contentArea}>
                    <h2 className={styles.sectionTitle}>Tất cả khóa học</h2>
                    {loading ? <div className={styles.message}>Đang tìm kiếm...</div> :
                        error ? <div className={`${styles.message} ${styles.error}`}>{error}</div> :
                        courses.length > 0 ? (
                            <div className={styles.courseGrid}>
                                {courses.map(course => (
                                    <Link to={`/course/${course.slug}`} key={course.id} className={styles.courseCardLink}>
                                        <div className={styles.courseCard}>
                                            <img className={styles.thumbnail} src={course.thumbnail || 'https://via.placeholder.com/400x225'} alt={course.title} />
                                            <div className={styles.cardContent}>
                                                <h3 className={styles.courseTitle}>{course.title}</h3>
                                                <p className={styles.instructorName}>
                                                    Giảng viên: {course.instructorName || 'Chưa cập nhật'}
                                                </p>
                                                <div className={styles.courseStats}>
                                                                                         <span className={styles.ratingValue}>{course.averageRating.toFixed(1)}</span>
                                                                                         <StarRating rating={course.averageRating} />
                                                                                         <span className={styles.reviewCount}>({course.reviewCount})</span>
                                                                                     </div>
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
                </main>
            </div>
        </div>
    );
};

export default HomePage;