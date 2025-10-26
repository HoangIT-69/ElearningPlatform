import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseBySlug } from '../services/apiService';
import styles from './CourseDetailPage.module.css';

// --- Component con cho một chương (chỉ hiển thị) ---
const ChapterItem = ({ chapter }) => {
    const [isOpen, setIsOpen] = useState(true);

    const totalChapterDuration = chapter.lessons?.reduce((sum, lesson) => sum + (lesson.videoDuration || 0), 0) || 0;

    const formatDuration = (seconds) => {
        if (!seconds || seconds === 0) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.chapter}>
            <div className={styles.chapterHeader} onClick={() => setIsOpen(!isOpen)}>
                <span className={styles.chapterTitle}>{chapter.title}</span>
                <div className={styles.chapterMeta}>
                    <span>{chapter.lessons?.length || 0} bài học</span>
                    <span>{formatDuration(totalChapterDuration)}</span>
                </div>
            </div>
            {isOpen && (
                <ul className={styles.lessonList}>
                    {chapter.lessons?.map(lesson => (
                        <li key={lesson.id} className={styles.lessonItem}>
                            <div className={styles.lessonTitleWrapper}>
                                <span className={styles.lessonIcon}>▶️</span>
                                <span className={styles.lessonTitle}>{lesson.title}</span>
                            </div>
                            <span className={styles.lessonDuration}>{formatDuration(lesson.videoDuration)}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


// --- Component chính của trang ---
const CourseDetailPage = () => {
    const { slug } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isPreviewing, setIsPreviewing] = useState(false);

    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                const response = await getCourseBySlug(slug);
                if (response.data?.success) {
                    setCourse(response.data.data);
                } else {
                    setError('Không tìm thấy khóa học.');
                }
            } catch (err) {
                setError('Lỗi kết nối đến server.');
                console.error("Lỗi khi tải chi tiết khóa học:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseDetail();
    }, [slug]);

    const getEmbedUrl = (url) => {
        if (!url) return null;
        try {
            const urlObj = new URL(url);
            let videoId;
            if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
                videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
                return `https://www.youtube.com/embed/${videoId}`;
            }
            if (urlObj.hostname.includes('vimeo.com')) {
                videoId = urlObj.pathname.split('/').pop();
                return `https://player.vimeo.com/video/${videoId}`;
            }
            return url;
        } catch (error) {
            console.warn("Invalid video URL:", url);
            return null;
        }
    };

    const formatTotalDuration = (seconds) => {
        if (!seconds || seconds === 0) return "Chưa cập nhật";
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        let result = '';
        if (hours > 0) result += `${hours} giờ `;
        if (minutes > 0) result += `${minutes} phút`;
        return result.trim() || "Dưới 1 phút";
    };

    if (loading) return <div className={styles.message}>Đang tải chi tiết khóa học...</div>;
    if (error) return <div className={`${styles.message} ${styles.error}`}>{error}</div>;
    if (!course) return <div className={styles.message}>Không có dữ liệu khóa học.</div>;

    const videoToDisplayUrl = getEmbedUrl(course.previewVideo);

    return (
        <div className={styles.pageContainer}>
            {/* --- Hero Section --- */}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    {course.categories && course.categories.length > 0 && (
                        <div className={styles.breadcrumb}>
                            {course.categories.map((cat, index) => (
                                <React.Fragment key={cat.id}>
                                    <Link to={`/courses?categoryId=${cat.id}`}>{cat.name}</Link>
                                    {index < course.categories.length - 1 && (
                                        <span className={styles.breadcrumbSeparator}>&gt;</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )}

                    <h1 className={styles.courseTitle}>{course.title}</h1>
                    <p className={styles.courseShortDescription}>{course.shortDescription}</p>
                    <div className={styles.instructorInfo}>
                        <span>Tạo bởi</span>
                        <Link to={`/instructor/${course.instructorId}`} className={styles.instructorNameLinkHero}>
                            {course.instructorName}
                        </Link>
                    </div>
                    {/* TODO: Thêm thông tin rating, số lượng học viên... */}
                </div>
            </section>

            {/* --- Bố cục chính với 2 cột --- */}
            <div className={styles.mainLayout}>
                {/* Cột trái chứa nội dung chi tiết */}
                <div className={styles.leftColumn}>
                    {course.objectives && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Bạn sẽ học được gì?</h2>
                            <div className={styles.objectivesList} dangerouslySetInnerHTML={{ __html: course.objectives }} />
                        </section>
                    )}

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Nội dung khóa học</h2>
                        <div className={styles.courseMeta}>
                            <span>{course.chapters?.length || 0} chương</span> •
                            <span>{course.totalLessons || 0} bài học</span> •
                            <span>Tổng thời lượng {formatTotalDuration(course.totalDuration)}</span>
                        </div>
                        {course.chapters?.length > 0 ? course.chapters.map(chapter => (
                            <ChapterItem key={chapter.id} chapter={chapter} />
                        )) : <p>Chương trình học đang được cập nhật.</p>}
                    </section>

                    {course.requirements && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Yêu cầu</h2>
                            <div className={styles.requirements} dangerouslySetInnerHTML={{ __html: course.requirements }} />
                        </section>
                    )}

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Mô tả</h2>
                        <div className={styles.description} dangerouslySetInnerHTML={{ __html: course.description }} />
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Giảng viên</h2>
                        <div>
                            <img
                                src={course.instructorAvatar || 'https://via.placeholder.com/100'}
                                alt={course.instructorName}
                                className={styles.instructorAvatar}
                            />
                            <Link to={`/instructor/${course.instructorId}`} className={styles.instructorNameLink}>{course.instructorName}</Link>
                            <p className={styles.instructorBio}>{course.instructorBio || 'Chưa có thông tin giới thiệu.'}</p>
                        </div>
                    </section>
                </div>

                {/* Cột phải "dính lại" khi cuộn trang */}
                <div className={styles.rightColumn}>
                    <div className={styles.floatingCard}>
                        {isPreviewing && videoToDisplayUrl ? (
                            <div className={styles.videoPlayerWrapper}>
                                <iframe
                                    src={videoToDisplayUrl + "?autoplay=1"} // Thêm autoplay
                                    title="Giới thiệu khóa học"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className={styles.videoPlayer}
                                ></iframe>
                            </div>
                        ) : (
                            <div className={styles.thumbnailWrapper} onClick={() => videoToDisplayUrl && setIsPreviewing(true)}>
                                <img src={course.thumbnail} alt={course.title} className={styles.cardThumbnail} />
                                {videoToDisplayUrl && (
                                    <>
                                        <div className={styles.playButtonOverlay}>▶️</div>
                                        <p className={styles.previewText}>Xem trước khóa học</p>
                                    </>
                                )}
                            </div>
                        )}

                        <div className={styles.cardBody}>
                            <p className={styles.cardPrice}>{course.isFree ? 'Miễn phí' : `${course.price?.toLocaleString('vi-VN')} VNĐ`}</p>
                            <button className={styles.addToCartButton}>Thêm vào giỏ hàng</button>
                            <button className={styles.buyNowButton}>Mua ngay</button>
                            <div className={styles.cardIncludes}>
                                <p><strong>Khóa học này bao gồm:</strong></p>
                                <ul>
                                    <li>🎥 {formatTotalDuration(course.totalDuration)} video theo yêu cầu</li>
                                    <li>📚 {course.totalLessons || 0} bài học</li>
                                    <li>... các thông tin khác ...</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;