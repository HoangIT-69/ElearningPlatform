import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
// === BẮT ĐẦU SỬA LỖI ===
// Thêm updateLessonProgress vào import
import { getEnrolledCourseContent, updateLessonProgress } from '../services/apiService';
// === KẾT THÚC SỬA LỖI ===
import styles from './LearnPage.module.css';

// --- Component Chính ---
const LearnPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await getEnrolledCourseContent(slug);
                if (response.data?.success) {
                    const courseData = response.data.data;
                    setCourse(courseData);
                    // Lấy danh sách các bài học đã hoàn thành từ API
                    if (courseData.completedLessonIds) {
                        setCompletedLessons(new Set(courseData.completedLessonIds));
                    }
                    // Tự động chọn bài học đầu tiên
                    if (courseData.chapters?.[0]?.lessons?.[0]) {
                        setActiveLesson(courseData.chapters[0].lessons[0]);
                    }
                } else {
                    setError('Không thể tải nội dung khóa học.');
                }
            } catch (err) {
                if (err.response?.status === 403) {
                    setError("Bạn không có quyền truy cập khóa học này.");
                } else if (err.response?.status === 401) {
                    alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                    navigate('/login');
                } else {
                    setError('Lỗi kết nối hoặc khóa học không tồn tại.');
                }
                console.error("Lỗi khi tải nội dung học:", err);
            } finally {
                setLoading(false);
            }
        };

        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert("Vui lòng đăng nhập để vào học.");
            navigate('/login');
            return;
        }

        fetchCourseData();
    }, [slug, navigate]);

    const handleLessonClick = (lesson) => {
        setActiveLesson(lesson);
    };

    const handleToggleComplete = async (lessonId) => {
        const isCompleted = completedLessons.has(lessonId);
        const newCompletedStatus = !isCompleted;

        // Cập nhật giao diện ngay lập tức để có trải nghiệm tốt
        const oldCompletedLessons = new Set(completedLessons);
        const newSet = new Set(completedLessons);
        if (newCompletedStatus) {
            newSet.add(lessonId);
        } else {
            newSet.delete(lessonId);
        }
        setCompletedLessons(newSet);

        try {
            // Gọi API để cập nhật backend
            await updateLessonProgress({
                courseId: course.id,
                lessonId: lessonId,
                completed: newCompletedStatus
            });
            // TODO: Cập nhật lại tổng tiến độ của khóa học
        } catch (error) {
            console.error("Lỗi khi cập nhật tiến độ:", error);
            // Rollback UI nếu có lỗi
            setCompletedLessons(oldCompletedLessons);
            alert("Không thể cập nhật tiến độ. Vui lòng thử lại.");
        }
    };

    const getEmbedUrl = (url) => {
        if (!url) return null;
        try {
            const urlObj = new URL(url);
            let videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        } catch (e) { return null; }
    };

    const videoUrl = getEmbedUrl(activeLesson?.videoUrl);

    if (loading) return <div className={styles.message}>Đang tải nội dung khóa học...</div>;
    if (error) {
        return (
            <div className={styles.errorContainer}>
                <h2 className={styles.errorTitle}>Truy cập bị từ chối</h2>
                <p className={styles.errorMessage}>{error}</p>
                <Link to="/" className={styles.backButton}>Quay về trang chủ</Link>
            </div>
        );
    }
    if (!course) return <div className={styles.message}>Không có dữ liệu.</div>;

    return (
        <div className={styles.learnPage}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <Link to={`/course/${course.slug}`} className={styles.backLink}>&larr; Về trang chi tiết</Link>
                    <h2 className={styles.courseTitleSidebar}>{course.title}</h2>
                </div>
                <div className={styles.curriculum}>
                    {course.chapters?.map(chapter => (
                        <div key={chapter.id} className={styles.chapter}>
                            <h3 className={styles.chapterTitle}>{chapter.title}</h3>
                            <ul className={styles.lessonList}>
                                {chapter.lessons?.map(lesson => (
                                    <li
                                        key={lesson.id}
                                        className={`${styles.lessonItem} ${activeLesson?.id === lesson.id ? styles.active : ''}`}
                                        onClick={() => handleLessonClick(lesson)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={completedLessons.has(lesson.id)}
                                            onChange={() => handleToggleComplete(lesson.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <span>{lesson.title}</span>
                                    </li>

                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </aside>

            <main className={styles.mainContent}>
                <div className={styles.videoPlayerWrapper}>
                    {videoUrl ? (
                        <iframe
                            src={videoUrl}
                            title={activeLesson?.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className={styles.videoPlayer}
                        ></iframe>
                    ) : (
                        <div className={styles.noVideo}>
                            <p>Bài học này không có video.</p>
                            <p>Nội dung bài học: {activeLesson?.content}</p>
                        </div>
                    )}
                </div>
                <div className={styles.lessonContent}>
                    <h1 className={styles.lessonTitleMain}>{activeLesson?.title}</h1>
                </div>
            </main>
        </div>
    );
};

export default LearnPage;