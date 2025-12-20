import React, { useState } from 'react';
import { createLesson } from '../../services/apiService';
import styles from './AddLessonModal.module.css';

const AddLessonModal = ({ chapterId, onClose, onSuccess }) => {
    const [lessonData, setLessonData] = useState({
        title: '',
        videoUrl: '',
        videoDuration: 0,
        isFree: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
        setError('');
        try {
            await createLesson({ ...lessonData, chapterId });
            onSuccess(); // Báo cho cha đã thành công
            onClose();   // Đóng modal
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi tạo bài học.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Thêm bài học mới</h2>
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
                            {loading ? 'Đang tạo...' : 'Tạo bài học'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLessonModal;