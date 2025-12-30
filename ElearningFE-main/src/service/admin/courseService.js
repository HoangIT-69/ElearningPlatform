import axios from "axios";
import { getToken } from "../../utils/getToken";

const token = getToken();

export const createCourse = async (data) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/courses`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const updateCourse = async (id, payload) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_URL}/courses/${id}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export const publishCourse = async (courseId) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/courses/${courseId}/publish`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const createCourseCategory = async (data) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/course-categories`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getCourseById = async (id) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/courses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};


export const createChapter = async (payload) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/chapters`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export const updateChapter = async (chapterId, payload) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_URL}/chapters/${chapterId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const deleteChapter = async (chapterId) => {
  const res = await axios.delete(
    `${import.meta.env.VITE_API_URL}/chapters/${chapterId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const createLesson = async (payload) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/lessons`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export const updateLesson = async (lessonId, payload) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_URL}/lessons/${lessonId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const deleteLesson = async (lessonId) => {
  const res = await axios.delete(
    `${import.meta.env.VITE_API_URL}/lessons/${lessonId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getStudentsByCourseId = async (courseId) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/enrollments/course/${courseId}/students`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}
