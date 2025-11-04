import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/apiService';
import styles from './ProfileSetting.module.css';

const ProfileSettings = () => {
    const userId = localStorage.getItem('userId');
    const [profile, setProfile] = useState({
        fullName: '',
        bio: '',
        avatar: ''
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getUserProfile();
                if (response.data.success) {
                    setProfile({
                        fullName: response.data.data.fullName || '',
                        bio: response.data.data.bio || '',
                        avatar: response.data.data.avatar || ''
                    });
                }
            } catch (error) {
                setMessage({ type: 'error', text: 'Không thể tải thông tin hồ sơ.' });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
       try {
               await updateUserProfile(userId, profile);
               setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' });

               // Cập nhật lại các giá trị trên localStorage
               localStorage.setItem('userFullName', profile.fullName);
               if (profile.avatar) {
                   localStorage.setItem('userAvatar', profile.avatar);
               } else {
                   // Nếu người dùng xóa link avatar, hãy xóa nó khỏi localStorage
                   localStorage.removeItem('userAvatar');
               }

               // Cần reload để navbar cập nhật thông tin mới
               setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Lỗi khi cập nhật.' });
        }
    };

    if (loading) {
        return <p>Đang tải hồ sơ...</p>;
    }

    return (
        <form onSubmit={handleSubmit} className={styles.formSection}>
            <h1 className={styles.title}>Hồ sơ công khai</h1>
            <p className={styles.subtitle}>Thêm thông tin về bản thân</p>

            <div className={styles.inputGroup}>
                <label htmlFor="fullName">Họ và tên</label>
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="bio">Giới thiệu ngắn</label>
                <textarea
                    id="bio"
                    name="bio"
                    rows="5"
                    placeholder="Giới thiệu về kinh nghiệm, kỹ năng của bạn..."
                    value={profile.bio}
                    onChange={handleChange}
                ></textarea>
            </div>

            {/* TODO: Xử lý upload ảnh cho avatar */}
            <div className={styles.inputGroup}>
                <label htmlFor="avatar">Link ảnh đại diện</label>
                <input
                    type="text"
                    id="avatar"
                    name="avatar"
                    placeholder="https://example.com/your-image.png"
                    value={profile.avatar}
                    onChange={handleChange}
                />
            </div>

            {message.text && <p className={styles[message.type]}>{message.text}</p>}

            <button type="submit" className={styles.submitButton}>Lưu thay đổi</button>
        </form>
    );
};

export default ProfileSettings;