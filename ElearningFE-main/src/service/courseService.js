import axios from "axios";
import { getToken } from "../utils/getToken";

const token = getToken();

export const getAllCourses = async (page, size, filters = {}) => {
  const params = { page, size, ...filters };

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/courses`, {
    params,
  });

  return res.data;
};


/**
 * Lấy danh sách các khóa học của một instructor cụ thể.
 * @param {number} instructorId - ID của giảng viên cần lấy khóa học.
 */
export const getMyInstructorCourses = async (instructorId) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/courses/my-courses`, {
    params: {
      instructorId: instructorId 
    }
  });

  return res.data;
};


export const getCourseById = async (id) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/courses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data?.data || null;
};

export const deleteCourseById = async (id) => {
  const res = await axios.delete(
    `${import.meta.env.VITE_API_URL}/courses/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const updateCourseById = async (id, courseData) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_URL}/courses/${id}`,
    courseData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data?.data || null;
};

export const getPopularCourses = async (limit = 8) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/courses/popular`,
    {
      params: { limit }
    }
  );
  return res.data?.data || [];
};

export const updateLessonProgress = async ({
  courseId,
  lessonId,
  completed,
}) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/progress/lesson`,
    { courseId, lessonId, completed },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

