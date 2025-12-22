import React, { useState } from 'react';
import { updateChapter } from '../../services/apiService';
import styles from './AddLessonModal.module.css'; // Tái sử dụng CSS

const EditChapterModal = ({ chapter, onClose, onSuccess }) => {
    const [title, setTitle] = useState(chapter.title);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateChapter(chapter.id, { title });
            onSuccess();
            onClose();
        } catch (error) {
            alert('Lỗi khi cập nhật chương.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Sửa tiêu đề chương</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title">Tiêu đề chương</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className={styles.modalActions}>
                        <button type="button" onClick={onClose} className={styles.cancelButton} disabled={loading}>Hủy</button>
                        <button type="submit" className={styles.submitButton} disabled={loading}>
                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditChapterModal;