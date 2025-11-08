import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseBySlug } from '../services/apiService';
import styles from './LearnPage.module.css';

// --- Component Chính ---
const LearnPage = () => {
    const { slug } = useParams();
    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null); // State cho bài học đang được xem
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await getCourseBySlug(slug);
                if (response.data?.success) {
                    const courseData = response.data.data;
                    setCourse(courseData);

                    // Tự động chọn bài học đầu tiên để hiển thị khi tải trang
                    if (courseData.chapters?.[0]?.lessons?.[0]) {
                        setActiveLesson(courseData.chapters[0].lessons[0]);
                    }
                } else {
                    setError('Không tìm thấy khóa học.');
                }
            } catch (err) {
                setError('Lỗi kết nối.');
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [slug]);

    const handleLessonClick = (lesson) => {
        setActiveLesson(lesson);
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
    if (error) return <div className={styles.message}>{error}</div>;
    if (!course) return <div className={styles.message}>Không có dữ liệu.</div>;

    return (
        <div className={styles.learnPage}>
            {/* --- CỘT PHỤ BÊN PHẢI: CHƯƠNG TRÌNH HỌC --- */}
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
                                        <input type="checkbox" readOnly />
                                        <span>{lesson.title}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </aside>

            {/* --- CỘT CHÍNH BÊN TRÁI: NỘI DUNG BÀI HỌC --- */}
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
                    {/* TODO: Thêm các tab Nội dung, Hỏi đáp, Ghi chú... ở đây */}
                </div>
            </main>
        </div>
    );
};

export default LearnPage;