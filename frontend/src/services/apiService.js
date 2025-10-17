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