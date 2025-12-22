import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, updateCourse, getCategoryTree, addCategoryToCourse, removeCategoryFromCourse } from '../../services/apiService';
import styles from './CourseForm.module.css'; // Tái sử dụng CSS

const EditCoursePage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State cho việc quản lý danh mục
    const [categoryTree, setCategoryTree] = useState([]);
    const [selectedParentId, setSelectedParentId] = useState('');
    const [childCategories, setChildCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [originalCategoryId, setOriginalCategoryId] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [courseRes, categoryRes] = await Promise.all([
                    getCourseById(courseId),
                    getCategoryTree()
                ]);

                if (categoryRes.data.success) {
                    setCategoryTree(categoryRes.data.data);
                }

                if (courseRes.data.success) {
                    const courseData = courseRes.data.data;
                    setCourse(courseData);

                    if (courseData.categories && courseData.categories.length > 0) {
                        const currentCategory = courseData.categories[0];
                        setOriginalCategoryId(currentCategory.id);
                        setSelectedCategoryId(currentCategory.id);

                        const parent = categoryRes.data.data.find(cat => cat.children.some(child => child.id === currentCategory.id));

                        if (parent) { // Nếu nó là category con
                            setSelectedParentId(parent.id);
                            setChildCategories(parent.children);
                        } else { // Nếu nó là category cha
                            setSelectedParentId(currentCategory.id);
                            setChildCategories([]);
                        }
                    }
                } else {
                     setError("Không thể tải thông tin khóa học.");
                }
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
                setError("Đã xảy ra lỗi khi tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [courseId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCourse(prev => {
            const newData = { ...prev, [name]: type === 'checkbox' ? checked : value };
            if (name === 'isFree' && checked) {
                newData.price = 0;
            }
            return newData;
        });
    };

    const handleParentCategoryChange = (e) => {
        const parentId = e.target.value;
        setSelectedParentId(parentId);
        setSelectedCategoryId('');
        if (parentId) {
            const parent = categoryTree.find(cat => cat.id === parseInt(parentId));
            setChildCategories(parent ? parent.children : []);
        } else {
            setChildCategories([]);
        }
    };

    const handleChildCategoryChange = (e) => {
        setSelectedCategoryId(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await updateCourse(courseId, course);

            const newCategoryId = parseInt(selectedCategoryId);
            if (selectedCategoryId && originalCategoryId !== newCategoryId) {
                if (originalCategoryId) {
                    await removeCategoryFromCourse({ courseId: parseInt(courseId), categoryId: originalCategoryId });
                }
                await addCategoryToCourse({ courseId: parseInt(courseId), categoryId: newCategoryId });
            }

            alert('Cập nhật khóa học thành công!');
            navigate('/instructor/courses');
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            setError(error.response?.data?.message || 'Cập nhật thất bại.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p style={{color: 'red'}}>{error}</p>;
    if (!course) return <p>Không tìm thấy khóa học.</p>;

    return (
        <div className={styles.container}>
            <h1>Chỉnh sửa khóa học: <strong>{course.title}</strong></h1>

            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">Tiêu đề</label>
                    <input type="text" id="title" name="title" value={course.title || ''} onChange={handleChange} required />
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
                    <label>Danh mục</label>
                    <div className={styles.categorySelectGroup}>
                        <select onChange={handleParentCategoryChange} value={selectedParentId} required>
                            <option value="">-- Chọn danh mục chính --</option>
                            {categoryTree.map(parent => (
                                <option key={parent.id} value={parent.id}>{parent.name}</option>
                            ))}
                        </select>

                        {(selectedParentId && childCategories.length > 0) && (
                            <select onChange={handleChildCategoryChange} value={selectedCategoryId} required>
                                <option value="">-- Chọn danh mục phụ --</option>
                                {childCategories.map(child => (
                                    <option key={child.id} value={child.id}>{child.name}</option>
                                ))}
                            </select>
                        )}
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

                {error && <p className={styles.errorMessage}>{error}</p>}

                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
            </form>
        </div>
    );
};

export default EditCoursePage;