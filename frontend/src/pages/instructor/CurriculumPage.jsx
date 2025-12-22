import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseById, createChapter, deleteChapter, updateChapter, createLesson, deleteLesson, updateLesson } from '../../services/apiService';
import styles from './CurriculumPage.module.css';
import AddLessonModal from '../../components/instructor/AddLessonModal';
import EditChapterModal from '../../components/instructor/EditChapterModal'; // <-- Import
import EditLessonModal from '../../components/instructor/EditLessonModal';
// --- Component con để quản lý một chương ---


const LessonEditor = ({ lesson, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleDeleteLesson = async () => {
        if (window.confirm(`Xóa bài học "${lesson.title}"?`)) {
            try {
                await deleteLesson(lesson.id);
                onUpdate();
            } catch (error) {
                alert("Lỗi khi xóa bài học.");
            }
        }
    };

    return (
        <>
            <li className={styles.lessonItem}>
                <span>{lesson.orderIndex + 1}. {lesson.title}</span>
                <div className={styles.lessonActions}>
                    <button onClick={() => setIsEditing(true)} className={styles.actionButton}>Sửa</button>
                    <button onClick={handleDeleteLesson} className={styles.actionButtonDelete}>Xóa</button>
                </div>
            </li>
            {isEditing && (
                <EditLessonModal
                    lesson={lesson}
                    onClose={() => setIsEditing(false)}
                    onSuccess={onUpdate}
                />
            )}
        </>
    );
};

const ChapterEditor = ({ chapter, onUpdate }) => {
    // State để quản lý việc hiển thị modal
    const [isAddingLesson, setIsAddingLesson] = useState(false);
    const [isEditingChapter, setIsEditingChapter] = useState(false); // <-- Thêm state mới

   const handleDeleteChapter = async () => {
       if (window.confirm(`Bạn có chắc muốn xóa chương "${chapter.title}" không? Tất cả bài học bên trong cũng sẽ bị xóa.`)) {
           try {
               await deleteChapter(chapter.id);
               onUpdate(); // Báo cho cha tải lại dữ liệu
           } catch (error) { alert("Lỗi khi xóa chương."); }
       }
   };
    // Hàm này giờ chỉ mở modal
    const handleAddLesson = () => {
        setIsAddingLesson(true);
    };

    return (
        <>
            <div className={styles.chapterCard}>
                <div className={styles.chapterHeader}>
                    <strong>Chương {chapter.orderIndex + 1}: {chapter.title}</strong>
                    <div className={styles.chapterActions}>
                        <button onClick={handleAddLesson} className={styles.actionButton}>+ Thêm bài học</button>
                        {/* --- THÊM NÚT SỬA CHƯƠNG --- */}
                        <button onClick={() => setIsEditingChapter(true)} className={styles.actionButton}>Sửa</button>
                        <button onClick={handleDeleteChapter} className={styles.actionButtonDelete}>Xóa chương</button>
                    </div>
                </div>
                <ul className={styles.lessonList}>
                    {/* --- SỬ DỤNG COMPONENT LESSONEDITOR MỚI --- */}
                    {chapter.lessons?.map(lesson => (
                        <LessonEditor key={lesson.id} lesson={lesson} onUpdate={onUpdate} />
                    ))}
                </ul>
            </div>

            {/* Render Modal có điều kiện */}
            {isAddingLesson && (
                <AddLessonModal
                    chapterId={chapter.id}
                    onClose={() => setIsAddingLesson(false)}
                    onSuccess={onUpdate}
                />
            )}
            {/* --- THÊM PHẦN RENDER MODAL SỬA CHƯƠNG --- */}
            {isEditingChapter && (
                <EditChapterModal
                    chapter={chapter}
                    onClose={() => setIsEditingChapter(false)}
                    onSuccess={onUpdate}
                />
            )}
        </>
    );
};

// --- Component chính của trang ---
const CurriculumPage = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    // Hàm để tải/tải lại dữ liệu khóa học
    const fetchCourse = useCallback(async () => {
        try {
            const response = await getCourseById(courseId);
            if (response.data.success) {
                setCourse(response.data.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải chương trình học:", error);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchCourse();
    }, [fetchCourse]);

    const handleAddChapter = async () => {
        const title = prompt("Nhập tiêu đề cho chương mới:");
        if (title) {
            try {
                await createChapter({ title, courseId: course.id });
                fetchCourse(); // Tải lại toàn bộ dữ liệu
            } catch (error) {
                alert("Lỗi khi thêm chương.");
            }
        }
    };

    if (loading) return <p>Đang tải...</p>;
    if (!course) return <p>Không tìm thấy khóa học.</p>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <Link to="/instructor/courses" className={styles.backLink}>&larr; Quay lại danh sách khóa học</Link>
                    <h1>Quản lý chương trình học</h1>
                    <h2>{course.title}</h2>
                </div>
                <button onClick={handleAddChapter} className={styles.createButton}>+ Thêm chương mới</button>
            </div>

            <div className={styles.curriculumContainer}>
                {course.chapters?.length > 0 ? (
                    course.chapters.map(chapter => (
                        <ChapterEditor
                            key={chapter.id}
                            chapter={chapter}
                            onUpdate={fetchCourse} // Truyền hàm fetch xuống con
                        />
                    ))
                ) : (
                    <p>Khóa học này chưa có chương nào. Hãy bắt đầu bằng cách thêm một chương mới.</p>
                )}
            </div>
        </div>
    );
};

export default CurriculumPage;