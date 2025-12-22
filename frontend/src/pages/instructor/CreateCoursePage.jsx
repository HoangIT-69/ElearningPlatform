import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse,getCategoryTree, addCategoryToCourse } from '../../services/apiService';
import styles from './CourseForm.module.css'; // Tái sử dụng CSS từ EditCoursePage

const CreateCoursePage = () => {
    // State cho dữ liệu khóa học cơ bản
    const [courseData, setCourseData] = useState({
        title: '',
        shortDescription: '',
        description: '',
        thumbnail: '',
        previewVideo: '',
        level: 'BEGINNER',
        price: 0,
        isFree: true,
        requirements: '',
        objectives: ''
    });

    // State riêng để quản lý các category được chọn
   const [categoryTree, setCategoryTree] = useState([]); // Lưu toàn bộ cây
   const [selectedParentId, setSelectedParentId] = useState(''); // Lưu ID cha đang được chọn
   const [childCategories, setChildCategories] = useState([]); // Lưu danh sách con để hiển thị
   const [selectedCategoryId, setSelectedCategoryId] = useState(''); // ID cuối cùng được chọn để gửi đi


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
            const fetchCategoryTree = async () => {
                try {
                    const response = await getCategoryTree();
                    if (response.data.success) {
                        setCategoryTree(response.data.data);
                    }
                } catch (error) { console.error("Lỗi khi tải cây danh mục:", error); }
            };
            fetchCategoryTree();
        }, []);

     const handleChange = (e) => {
            const { name, value, type, checked } = e.target;
            setCourseData(prev => {
                const newData = { ...prev, [name]: type === 'checkbox' ? checked : value };
                if (name === 'isFree' && checked) {
                    newData.price = 0;
                }
                return newData;
            });
        };

        // Hàm xử lý khi chọn danh mục CHA
        const handleParentCategoryChange = (e) => {
            const parentId = e.target.value;
            setSelectedParentId(parentId);
            setSelectedCategoryId(''); // Reset lựa chọn con

            if (parentId) {
                // Tìm các con tương ứng trong cây đã tải về
                const parent = categoryTree.find(cat => cat.id === parseInt(parentId));
                setChildCategories(parent ? parent.children : []);
            } else {
                setChildCategories([]); // Nếu không chọn cha, danh sách con rỗng
            }
        };

        // Hàm xử lý khi chọn danh mục CON
        const handleChildCategoryChange = (e) => {
            setSelectedCategoryId(e.target.value);
        };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // BƯỚC 1: Tạo khóa học trước
            const courseResponse = await createCourse(courseData);

            if (courseResponse.data.success) {
                const newCourseId = courseResponse.data.data.id;

                // BƯỚC 2: Gán các category đã chọn cho khóa học vừa tạo
                if (selectedCategoryIds.length > 0) {
                    // Tạo một mảng các promise, mỗi promise là một lời gọi API
                    const categoryPromises = selectedCategoryIds.map(categoryId =>
                        addCategoryToCourse({ courseId: newCourseId, categoryId: categoryId })
                    );

                    // Chờ cho TẤT CẢ các API gán category hoàn thành
                    await Promise.all(categoryPromises);
                }

                alert('Tạo khóa học và gán danh mục thành công!');
                navigate('/instructor/courses');
            } else {
                setError(courseResponse.data.message || 'Không thể tạo khóa học.');
            }
        } catch (err) {
            console.error("Lỗi khi tạo khóa học:", err);
            setError(err.response?.data?.message || 'Đã xảy ra lỗi.');
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
                                        <label>Danh mục</label>
                                        <div className={styles.categorySelectGroup}>
                                            {/* Select Box 1: Danh mục cha */}
                                            <select onChange={handleParentCategoryChange} value={selectedParentId} required>
                                                <option value="">-- Chọn danh mục chính --</option>
                                                {categoryTree.map(parent => (
                                                    <option key={parent.id} value={parent.id}>{parent.name}</option>
                                                ))}
                                            </select>

                                            {/* Select Box 2: Danh mục con (chỉ hiển thị khi đã chọn cha) */}
                                            {selectedParentId && childCategories.length > 0 && (
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