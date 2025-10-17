import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseBySlug } from '../services/apiService';
import styles from './CourseDetailPage.module.css'; // Import file CSS

// Component con để hiển thị một chương
const ChapterItem = ({ chapter }) => {
    const [isOpen, setIsOpen] = useState(false); // State để quản lý việc đóng/mở chương

    const totalChapterDuration = chapter.lessons?.reduce((sum, lesson) => sum + (lesson.videoDuration || 0), 0);
    const formatDuration = (seconds) => {
        if (!seconds) return '0 phút';
        const minutes = Math.floor(seconds / 60);
        return `${minutes} phút`;
    };

    return (
        <div className={styles.chapter}>
            <div className={styles.chapterHeader} onClick={() => setIsOpen(!isOpen)}>
                <span>{chapter.title}</span>
                <span>{chapter.lessons?.length} bài học • {formatDuration(totalChapterDuration)}</span>
            </div>
            {isOpen && (
                <ul className={styles.lessonList}>
                    {chapter.lessons?.map(lesson => (
                        <li key={lesson.id} className={styles.lessonItem}>
                            <span className={styles.lessonTitle}>{lesson.title}</span>
                            <span className={styles.lessonDuration}>{formatDuration(lesson.videoDuration)}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


const CourseDetailPage = () => {
    const { slug } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                const response = await getCourseBySlug(slug);
                if (response.data && response.data.success) {
                    setCourse(response.data.data);
                } else {
                    setError('Không tìm thấy khóa học.');
                }
            } catch (err) {
                setError('Lỗi kết nối đến server.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetail();
    }, [slug]);

    if (loading) return <div className={styles.message}>Đang tải chi tiết khóa học...</div>;
    if (error) return <div className={`${styles.message} ${styles.error}`}>{error}</div>;
    if (!course) return <div className={styles.message}>Không có dữ liệu khóa học.</div>;

    // Helper function để chuyển đổi giây thành giờ, phút
    const formatTotalDuration = (seconds) => {
        if (!seconds || seconds === 0) return "Chưa cập nhật";
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        let result = '';
        if (hours > 0) result += `${hours} giờ `;
        if (minutes > 0) result += `${minutes} phút`;
        return result.trim();
    };

    return (
        <div className={styles.pageContainer}>
            {/* --- Phần Hero Banner (màu đen) --- */}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1 className={styles.courseTitle}>{course.title}</h1>
                    <p className={styles.courseShortDescription}>{course.shortDescription}</p>
                    <div className={styles.instructorInfo}>
                        <span>Tạo bởi</span>
                        <a href="#" className={styles.instructorNameLink}>{course.instructorName}</a>
                    </div>
                    {/* Thêm các thông tin khác như rating, số lượng học viên... nếu có */}
                </div>
            </section>

            {/* --- Phần nội dung chính --- */}
            <div className={styles.mainContent}>
                {/* Phần "Bạn sẽ học được gì?" */}
                {course.objectives && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Bạn sẽ học được gì?</h2>
                        <div className={styles.description} dangerouslySetInnerHTML={{ __html: course.objectives }} />
                    </section>
                )}

                {/* Phần "Nội dung khóa học" (Chương trình học) */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Nội dung khóa học</h2>
                    <div className={styles.courseMeta}>
                        <span>{course.chapters?.length || 0} chương</span> •
                        <span>{course.totalLessons || 0} bài học</span> •
                        <span>Tổng thời lượng {formatTotalDuration(course.totalDuration)}</span>
                    </div>
                    {course.chapters?.map(chapter => (
                        <ChapterItem key={chapter.id} chapter={chapter} />
                    ))}
                </section>

                {/* Phần "Yêu cầu" */}
                {course.requirements && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Yêu cầu</h2>
                        <div className={styles.requirements} dangerouslySetInnerHTML={{ __html: course.requirements }} />
                    </section>
                )}

                {/* Phần "Mô tả" */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Mô tả</h2>
                    <div className={styles.description} dangerouslySetInnerHTML={{ __html: course.description }} />
                </section>

                {/* Phần "Giảng viên" */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Giảng viên</h2>
                    <div>
                        <img
                            src={course.instructorAvatar || 'https://via.placeholder.com/100'}
                            alt={course.instructorName}
                            className={styles.instructorAvatar}
                        />
                        <a href="#" className={styles.instructorNameLink}>{course.instructorName}</a>
                        <p className={styles.instructorBio}>{course.instructorBio || 'Chưa có thông tin giới thiệu.'}</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CourseDetailPage;