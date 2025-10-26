import axios from 'axios';


const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor để tự động đính kèm JWT token vào các request cần bảo vệ
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// =================================================================
// AUTH APIs (từ AuthController)
// =================================================================

/** Đăng ký tài khoản mới */
export const registerUser = (userData) => {
    return apiClient.post('/auth/register', userData);
};

/** Đăng nhập */
export const loginUser = (credentials) => {
    return apiClient.post('/auth/login', credentials);
};

/** API test để kiểm tra kết nối */
export const testApiConnection = () => {
    return apiClient.get('/auth/test');
};

// =================================================================
// COURSE APIs (từ CourseController)
// =================================================================

// --- Các API công khai (Public) ---

/** Lấy tất cả khóa học với phân trang và tìm kiếm */
export const getAllCourses = (filters) => {
    const params = new URLSearchParams();

    // Duyệt qua object filters và chỉ thêm các tham số có giá trị
    Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
            params.append(key, filters[key]);
        }
    });

    return apiClient.get(`/courses?${params.toString()}`);
};

/** Lấy chi tiết khóa học bằng ID */
export const getCourseById = (courseId) => {
    return apiClient.get(`/courses/${courseId}`);
};

/** Lấy chi tiết khóa học bằng Slug */
export const getCourseBySlug = (slug) => {
    return apiClient.get(`/courses/slug/${slug}`);
};


// --- Các API cần xác thực (Protected) ---
// Interceptor sẽ tự động thêm token cho các hàm này

/** Tạo khóa học mới (cần token INSTRUCTOR/ADMIN) */
export const createCourse = (courseData) => {
    return apiClient.post('/courses', courseData);
};

/** Cập nhật khóa học (cần token INSTRUCTOR/ADMIN) */
export const updateCourse = (courseId, courseData) => {
    return apiClient.put(`/courses/${courseId}`, courseData);
};

/** Xóa khóa học (cần token INSTRUCTOR/ADMIN) */
export const deleteCourse = (courseId) => {
    return apiClient.delete(`/courses/${courseId}`);
};

/** Xuất bản khóa học (cần token INSTRUCTOR/ADMIN) */
export const publishCourse = (courseId) => {
    // Endpoint này không cần body, chỉ cần gửi request POST
    return apiClient.post(`/courses/${courseId}/publish`);
};
export const createChapter = (chapterData) => apiClient.post('/chapters', chapterData);
export const updateChapter = (id, data) => apiClient.put(`/chapters/${id}`, data);
export const deleteChapter = (id) => apiClient.delete(`/chapters/${id}`);

export const createLesson = (lessonData) => apiClient.post('/lessons', lessonData);
export const updateLesson = (id, data) => apiClient.put(`/lessons/${id}`, data);
export const deleteLesson = (id) => apiClient.delete(`/lessons/${id}`);


/**
 * Lấy danh sách tất cả các danh mục.
 * Đây là API public.
 */
export const getCategoryTree = () => {
    return apiClient.get('/categories/tree');
};

/* Lấy danh sách tất cả các danh mục (dạng phẳng).*/

export const getAllCategories = () => {
    return apiClient.get('/categories');
};

 /* Tạo một danh mục mới (yêu cầu quyền Admin).
 */
export const createCategory = (categoryData) => {
    return apiClient.post('/categories', categoryData);
};

/**
 * Cập nhật một danh mục (yêu cầu quyền Admin).
 */
export const updateCategory = (id, categoryData) => {
    return apiClient.put(`/categories/${id}`, categoryData);
};

/**
 * Xóa một danh mục (yêu cầu quyền Admin).
 */
export const deleteCategory = (id) => {
    return apiClient.delete(`/categories/${id}`);
};


// =================================================================
// COURSE-CATEGORY APIs - (Gán danh mục cho khóa học)
// =================================================================
export const addCategoryToCourse = (data) => apiClient.post('/course-categories', data);
export const removeCategoryFromCourse = (data) => apiClient.delete('/course-categories', { data });