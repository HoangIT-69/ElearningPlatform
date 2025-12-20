import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, updateCourse } from '../../services/apiService';
import styles from './CourseForm.module.css'; // Tái sử dụng CSS từ CreateCoursePage

const EditCoursePage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await getCourseById(courseId);
                if (response.data.success) {
                    setCourse(response.data.data);
                }
            } catch (error) {
                console.error("Lỗi khi tải thông tin khóa học:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCourse(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateCourse(courseId, course);
            alert('Cập nhật khóa học thành công!');
            navigate('/instructor/courses');
        } catch (error) {
            console.error("Lỗi khi cập nhật khóa học:", error);
            alert('Cập nhật thất bại. Vui lòng thử lại.');
        }
    };

    if (loading) return <p>Đang tải...</p>;
    if (!course) return <p>Không tìm thấy khóa học.</p>;

    return (
        <div className={styles.container}>
            <h1>Chỉnh sửa khóa học</h1>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">Tiêu đề</label>
                    <input type="text" id="title" name="title" value={course.title} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="shortDescription">Mô tả ngắn</label>
                    <textarea id="shortDescription" name="shortDescription" value={course.shortDescription || ''} onChange={handleChange} rows="3"></textarea>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="description">Mô tả chi tiết</label>
                    <textarea id="description" name="description" value={course.description || ''} onChange={handleChange} rows="6"></textarea>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="thumbnail">Link ảnh bìa</label>
                    <input type="text" id="thumbnail" name="thumbnail" value={course.thumbnail || ''} onChange={handleChange} />
                </div>
                 <div className={styles.formGroup}>
                    <label htmlFor="previewVideo">Link video giới thiệu</label>
                    <input type="text" id="previewVideo" name="previewVideo" value={course.previewVideo || ''} onChange={handleChange} />
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="level">Cấp độ</label>
                        <select id="level" name="level" value={course.level} onChange={handleChange}>
                            <option value="BEGINNER">Mới bắt đầu</option>
                            <option value="INTERMEDIATE">Trung bình</option>
                            <option value="ADVANCED">Nâng cao</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="price">Giá (VNĐ)</label>
                        <input type="number" id="price" name="price" value={course.price} onChange={handleChange} disabled={course.isFree} />
                    </div>
                     <div className={styles.formGroupCheck}>
                        <input type="checkbox" id="isFree" name="isFree" checked={course.isFree} onChange={handleChange} />
                        <label htmlFor="isFree">Miễn phí</label>
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="requirements">Yêu cầu</label>
                    <textarea id="requirements" name="requirements" value={course.requirements || ''} onChange={handleChange} rows="4"></textarea>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="objectives">Mục tiêu khóa học</label>
                    <textarea id="objectives" name="objectives" value={course.objectives || ''} onChange={handleChange} rows="4"></textarea>
                </div>

                <button type="submit" className={styles.submitButton}>Lưu thay đổi</button>
            </form>
        </div>
    );
};

export default EditCoursePage;

