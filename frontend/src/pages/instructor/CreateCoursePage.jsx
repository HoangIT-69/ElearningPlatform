import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse } from '../../services/apiService';
import styles from './CourseForm.module.css'; // Tái sử dụng CSS từ EditCoursePage

const CreateCoursePage = () => {
    // State để quản lý toàn bộ dữ liệu của form
    const [courseData, setCourseData] = useState({
        title: '',
        shortDescription: '',
        description: '',
        thumbnail: '',
        previewVideo: '',
        level: 'BEGINNER', // Giá trị mặc định
        price: 0,
        isFree: true,
        requirements: '',
        objectives: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Hàm xử lý chung cho tất cả các input
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setCourseData(prev => {
            const newData = { ...prev, [name]: type === 'checkbox' ? checked : value };

            // Nếu check vào "Miễn phí", tự động set giá về 0
            if (name === 'isFree' && checked) {
                newData.price = 0;
            }

            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Gửi toàn bộ object courseData lên API
            const response = await createCourse(courseData);

            if (response.data.success) {
                alert('Tạo khóa học thành công!');
                // Chuyển hướng về trang danh sách khóa học của instructor
                navigate('/instructor/courses');
            } else {
                setError(response.data.message || 'Không thể tạo khóa học.');
            }
        } catch (err) {
            console.error("Lỗi khi tạo khóa học:", err);
            setError(err.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Tạo khóa học mới</h1>
            <p className={styles.subtitle}>Điền đầy đủ thông tin để tạo một khóa học hoàn chỉnh.</p>

            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">Tiêu đề</label>
                    <input type="text" id="title" name="title" value={courseData.title} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="shortDescription">Mô tả ngắn</label>
                    <textarea id="shortDescription" name="shortDescription" value={courseData.shortDescription} onChange={handleChange} rows="3"></textarea>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="description">Mô tả chi tiết</label>
                    <textarea id="description" name="description" value={courseData.description} onChange={handleChange} rows="6"></textarea>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="thumbnail">Link ảnh bìa</label>
                    <input type="text" id="thumbnail" name="thumbnail" value={courseData.thumbnail} onChange={handleChange} />
                </div>
                 <div className={styles.formGroup}>
                    <label htmlFor="previewVideo">Link video giới thiệu</label>
                    <input type="text" id="previewVideo" name="previewVideo" value={courseData.previewVideo} onChange={handleChange} />
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="level">Cấp độ</label>
                        <select id="level" name="level" value={courseData.level} onChange={handleChange}>
                            <option value="BEGINNER">Mới bắt đầu</option>
                            <option value="INTERMEDIATE">Trung bình</option>
                            <option value="ADVANCED">Nâng cao</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="price">Giá (VNĐ)</label>
                        <input type="number" id="price" name="price" value={courseData.price} onChange={handleChange} disabled={courseData.isFree} />
                    </div>
                     <div className={styles.formGroupCheck}>
                        <input type="checkbox" id="isFree" name="isFree" checked={courseData.isFree} onChange={handleChange} />
                        <label htmlFor="isFree">Miễn phí</label>
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="requirements">Yêu cầu</label>
                    <textarea id="requirements" name="requirements" value={courseData.requirements} onChange={handleChange} rows="4" placeholder="VD: Kiến thức HTML, CSS cơ bản..."></textarea>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="objectives">Mục tiêu khóa học</label>
                    <textarea id="objectives" name="objectives" value={courseData.objectives} onChange={handleChange} rows="4" placeholder="VD: Xây dựng được trang web hoàn chỉnh..."></textarea>
                </div>

                {error && <p className={styles.errorMessage}>{error}</p>}

                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? 'Đang tạo...' : 'Tạo và xuất bản'}
                </button>
            </form>
        </div>
    );
};

export default CreateCoursePage;