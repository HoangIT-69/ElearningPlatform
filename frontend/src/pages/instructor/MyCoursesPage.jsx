import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyInstructorCourses, deleteCourse, publishCourse, unpublishCourse } from '../../services/apiService';
import styles from './MyCoursesPage.module.css';

const MyCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

   const fetchCourses = async () => {
           setLoading(true);
           try {
               const response = await getMyInstructorCourses();
               if (response.data.success) {
                   setCourses(response.data.data);
               }
           } catch (err) {
               console.error("Lỗi khi tải khóa học:", err);
               setError("Không thể tải danh sách khóa học của bạn.");
           } finally {
               setLoading(false);
           }
       };

        useEffect(() => {
            fetchCourses();
            }, []);


      const handleDelete = async (courseId, courseTitle) => {
            // Hỏi lại người dùng để xác nhận
            if (window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn khóa học "${courseTitle}" không? Hành động này không thể hoàn tác.`)) {
                try {
                    await deleteCourse(courseId);
                    alert('Xóa khóa học thành công!');
                    // Tải lại danh sách khóa học để cập nhật giao diện
                    fetchCourses();
                } catch (error) {
                    console.error("Lỗi khi xóa khóa học:", error);
                    alert(error.response?.data?.message || 'Đã xảy ra lỗi khi xóa khóa học.');
                }
            }
        };


    // --- HÀM MỚI ĐỂ XỬ LÝ PUBLISH/UNPUBLISH ---
    const handleTogglePublish = async (course) => {
        const isPublished = course.status === 'PUBLISHED';
        const action = isPublished ? unpublishCourse : publishCourse;
        const confirmMessage = isPublished
            ? `Bạn có chắc muốn bỏ xuất bản khóa học "${course.title}"? Khóa học sẽ không còn hiển thị cho học viên mới.`
            : `Bạn có chắc muốn xuất bản khóa học "${course.title}"?`;

        if (window.confirm(confirmMessage)) {
            try {
                await action(course.id);
                // Cập nhật lại trạng thái của khóa học đó trong danh sách
                setCourses(prevCourses => prevCourses.map(c =>
                    c.id === course.id
                        ? { ...c, status: isPublished ? 'DRAFT' : 'PUBLISHED' }
                        : c
                ));
            } catch (error) {
                console.error("Lỗi khi thay đổi trạng thái publish:", error);
                alert('Đã xảy ra lỗi.');
            }
        }
    };

   if (loading) return <p>Đang tải...</p>;
   if (error) return <p style={{color: 'red'}}>{error}</p>;

    return (
        <div className={styles.container}>
                    <div className={styles.header}>
                        <h1>Khóa học của tôi</h1>
                        <Link to="/instructor/courses/new" className={styles.createButton}>
                            + Tạo khóa học mới
                        </Link>
                    </div>

            <table className={styles.coursesTable}>
                <thead>
                    <tr>
                        <th>Khóa học</th>
                        <th>Trạng thái</th>
                        <th>Học viên</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => (
                         <tr key={course.id}>
                             <td>
                                 <div className={styles.courseInfo}>
                                     <img src={course.thumbnail || 'https://via.placeholder.com/100x56'} alt={course.title} />
                                      <span>{course.title}</span>
                                  </div>
                             </td>
                             <td>
                                 <span className={`${styles.status} ${styles[course.status.toLowerCase()]}`}>
                                     {course.status}
                                 </span>
                             </td>
                             <td>{course.enrollmentCount}</td>


                            <td className={styles.actionsCell}>
                                <Link to={`/instructor/courses/${course.id}/edit`} className={styles.actionButton}>Sửa</Link>
                                <button onClick={() => handleDelete(course.id, course.title)} className={`${styles.actionButton} ${styles.deleteButton}`}>Xóa</button>

                                 <Link to={`/instructor/courses/${course.id}/curriculum`} className={styles.actionButton}>
                                         Nội dung
                                 </Link>

                                {/* --- NÚT PUBLISH/UNPUBLISH MỚI --- */}
                                <button
                                    onClick={() => handleTogglePublish(course)}
                                    className={`${styles.actionButton} ${course.status === 'PUBLISHED' ? styles.unpublishButton : styles.publishButton}`}
                                >
                                    {course.status === 'PUBLISHED' ? 'Bỏ xuất bản' : 'Xuất bản'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyCoursesPage;