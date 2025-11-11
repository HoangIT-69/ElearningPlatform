import React, { useState, useEffect , useCallback} from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCourseBySlug, addToCart , getReviewsForCourse, postReview } from '../services/apiService';
import styles from './CourseDetailPage.module.css';

// --- Component con cho một chương (chỉ hiển thị) ---
const StarRating = ({ rating }) => {
            const totalStars = 5;
            let stars = [];
            for (let i = 1; i <= totalStars; i++) {
                if (i <= rating) {
                    stars.push(<span key={i} className={styles.starFilled}>★</span>);
                } else if (i - 0.5 <= rating) {
                    stars.push(<span key={i} className={styles.starHalf}>★</span>);
                } else {
                    stars.push(<span key={i} className={styles.starEmpty}>★</span>);
                }
            }
            return <div className={styles.starRating}>{stars}</div>;
        };

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

const ReviewSection = ({ courseId, isEnrolled }) => {
    // Lấy thông tin người dùng trực tiếp từ localStorage
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    const userFullName = localStorage.getItem('userFullName');

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // State cho form gửi review
    const [myRating, setMyRating] = useState(0);
    const [myComment, setMyComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reviewMessage, setReviewMessage] = useState({ type: '', text: '' });

    const fetchReviews = useCallback(async () => {
        try {
            const response = await getReviewsForCourse(courseId);
            if (response.data.success) {
                setReviews(response.data.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải review:", error);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (myRating === 0) {
            setReviewMessage({ type: 'error', text: 'Vui lòng chọn số sao đánh giá.' });
            return;
        }
        setIsSubmitting(true);
        try {
            await postReview({ courseId, rating: myRating, comment: myComment });
            setReviewMessage({ type: 'success', text: 'Cảm ơn bạn đã đánh giá!' });
            fetchReviews(); // Tải lại danh sách review
        } catch (error) {
            setReviewMessage({ type: 'error', text: error.response?.data?.message || 'Gửi đánh giá thất bại.' });
        } finally {
            setIsSubmitting(false);
        }
    };
         const getInitials = (name) => {
                if (!name) return '?';
                const names = name.split(' ');
                if (names.length === 1) return names[0].charAt(0).toUpperCase();
                return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
            };

    return (
        <section id="reviews" className={styles.section}>
            <h2 className={styles.sectionTitle}>{reviews.length} đánh giá cho khóa học này</h2>

            {/* Sửa lại điều kiện hiển thị: dùng 'token' thay cho 'user' */}
            {token && isEnrolled && (
                <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
                    <h4>Để lại đánh giá của bạn</h4>
                    <div className={styles.starRatingInput}>
                        {/* Cập nhật StarRating để có thể click được */}
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={star <= myRating ? styles.starFilled : styles.starEmpty}
                                onClick={() => setMyRating(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <textarea
                        placeholder="Viết bình luận của bạn ở đây..."
                        rows="4"
                        value={myComment}
                        onChange={(e) => setMyComment(e.target.value)}
                        className={styles.reviewTextarea}
                    />
                    {reviewMessage.text && <p className={`${styles.messageBox} ${styles[reviewMessage.type]}`}>{reviewMessage.text}</p>}
                    <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                        {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </button>
                </form>
            )}

            {/* Danh sách các review đã có */}
           <div className={styles.reviewList}>
                           {loading ? <p>Đang tải...</p> :
                               reviews.map(review => (
                                   <div key={review.id} className={styles.reviewItem}>
                                       <div className={styles.reviewAuthor}>
                                           {/* --- SỬA LẠI PHẦN AVATAR --- */}
                                           {review.userAvatar ? (
                                               <img src={review.userAvatar} alt={review.userFullName} className={styles.authorAvatarImg} />
                                           ) : (
                                               <div className={styles.authorAvatar}>{getInitials(review.userFullName)}</div>
                                           )}
                                           <span className={styles.authorName}>{review.userFullName || 'Người dùng ẩn danh'}</span>
                                       </div>
                                       <div className={styles.reviewContent}>
                                           <StarRating rating={review.rating} />
                                           <p className={styles.reviewComment}>{review.comment}</p>
                                       </div>
                        </div>
                    ))
                }
            </div>
        </section>
    );
};


// --- Component chính của trang ---
const CourseDetailPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchCourseDetail = async () => {
            setLoading(true);
            try {
                // Chỉ cần gọi MỘT API duy nhất
                // Backend sẽ tự động kiểm tra và trả về trường 'enrolled'
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

   const handleAddToCart = async () => {
       // 1. Kiểm tra xem người dùng đã đăng nhập chưa
       if (!token) {
           alert("Vui lòng đăng nhập để thêm khóa học vào giỏ hàng.");
           navigate('/login'); // Điều hướng đến trang đăng nhập
           return;
       }
       if (!course) return;

       setIsAdding(true);
       try {
           // 2. Gọi API để thêm vào giỏ hàng (áp dụng cho cả khóa miễn phí và trả phí)
           await addToCart(course.id);
           alert('Đã thêm vào giỏ hàng thành công!');

           // 3. Phát ra một sự kiện toàn cục để thông báo cho Navbar cập nhật
           window.dispatchEvent(new CustomEvent('cartUpdated'));


       } catch (error) {
           // Hiển thị lỗi từ backend (ví dụ: "Khóa học đã có trong giỏ hàng")
           alert(error.response?.data?.message || 'Không thể thêm khóa học vào giỏ hàng.');
       } finally {
           setIsAdding(false);
       }
   };

    const getEmbedUrl = (url) => {
        if (!url) return null;
        try {
            const urlObj = new URL(url);
            let videoId;
            if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
                videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
                return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            }
            if (urlObj.hostname.includes('vimeo.com')) {
                videoId = urlObj.pathname.split('/').pop();
                return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
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
                                    <Link to={`/?categoryId=${cat.id}`}>{cat.name}</Link>
                                    {index < course.categories.length - 1 && (
                                        <span className={styles.breadcrumbSeparator}>&gt;</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )}

                    <h1 className={styles.courseTitle}>{course.title}</h1>
                    <p className={styles.courseShortDescription}>{course.shortDescription}</p>
                     <div className={styles.courseMetaHero}>
                                            <span className={styles.bestsellerTag}>Bestseller</span>
                                            <span className={styles.ratingValue}>{course.averageRating}</span>
                                            <StarRating rating={course.averageRating} />
                                            <a href="#reviews" className={styles.ratingCount}>({course.reviewCount} đánh giá)</a>
                                            <span>{course.enrollmentCount} học viên</span>
                                        </div>
                    <div className={styles.instructorInfo}>
                        <span>Tạo bởi</span>
                        <Link to={`/instructor/${course.instructorId}`} className={styles.instructorNameLinkHero}>
                            {course.instructorName}
                        </Link>
                    </div>
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
                     <ReviewSection courseId={course.id} isEnrolled={course.enrolled} />
                </div>

                {/* Cột phải "dính lại" khi cuộn trang */}
                <div className={styles.rightColumn}>
                    <div className={styles.floatingCard}>
                        {isPreviewing && videoToDisplayUrl ? (
                            <div className={styles.videoPlayerWrapper}>
                                <iframe
                                    src={videoToDisplayUrl}
                                    title="Giới thiệu khóa học"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className={styles.videoPlayer}
                                ></iframe>
                            </div>
                        ) : (
                            <div className={styles.thumbnailWrapper} onClick={() => videoToDisplayUrl && setIsPreviewing(true)}>
                                <img src={course.thumbnail || 'https://via.placeholder.com/400x225'} alt={course.title} className={styles.cardThumbnail} />
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

                            {course.enrolled ? (
                                <Link to={`/learn/${course.slug}`} className={styles.goToCourseButton}>
                                    Đến học
                                </Link>
                            ) : (
                                <button
                                    className={styles.addToCartButton}
                                    onClick={handleAddToCart}
                                    disabled={isAdding}
                                >
                                    {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                                </button>
                            )}

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