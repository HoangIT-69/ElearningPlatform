import React, { useState } from 'react';
import { updateLesson } from '../../services/apiService';
import styles from './AddLessonModal.module.css'; // Tái sử dụng CSS

const EditLessonModal = ({ lesson, onClose, onSuccess }) => {
    const [lessonData, setLessonData] = useState({
        title: lesson.title,
        videoUrl: lesson.videoUrl || '',
        videoDuration: lesson.videoDuration || 0,
        isFree: lesson.isFree
    });
    const [loading, setLoading] = useState(false);
     const [error, setError] = useState('');

    const handleChange = (e) => {
           const { name, value, type, checked } = e.target;
           setLessonData(prev => ({
               ...prev,
               [name]: type === 'checkbox' ? checked : value
           }));
       };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateLesson(lesson.id, lessonData);
            onSuccess();
            onClose();
        } catch (error) {
            alert('Lỗi khi cập nhật bài học.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Sửa bài học</h2>
                <form onSubmit={handleSubmit}>
                                   <div className={styles.formGroup}>
                                       <label htmlFor="title">Tiêu đề bài học</label>
                                       <input type="text" id="title" name="title" value={lessonData.title} onChange={handleChange} required />
                                   </div>
                                   <div className={styles.formGroup}>
                                       <label htmlFor="videoUrl">URL Video (YouTube)</label>
                                       <input type="text" id="videoUrl" name="videoUrl" value={lessonData.videoUrl} onChange={handleChange} />
                                   </div>
                                   <div className={styles.formGroup}>
                                       <label htmlFor="videoDuration">Thời lượng (giây)</label>
                                       <input type="number" id="videoDuration" name="videoDuration" value={lessonData.videoDuration} onChange={handleChange} />
                                   </div>
                                    <div className={styles.formGroupCheck}>
                                       <input type="checkbox" id="isFree" name="isFree" checked={lessonData.isFree} onChange={handleChange} />
                                       <label htmlFor="isFree">Cho phép xem trước (Miễn phí)</label>
                                   </div>

                                   {error && <p className={styles.errorMessage}>{error}</p>}

                                   <div className={styles.modalActions}>
                                       <button type="button" onClick={onClose} className={styles.cancelButton} disabled={loading}>Hủy</button>
                                       <button type="submit" className={styles.submitButton} disabled={loading}>
                                           {loading ? 'Đang sửa...' : 'Sửa bài học'}
                                       </button>
                                   </div>
                               </form>
            </div>
        </div>
    );
};

export default EditLessonModal;