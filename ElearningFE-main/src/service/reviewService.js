import axios from "axios";
import { getToken } from "../utils/getToken";



export const createReview = async (reviewData) => {
    const token = getToken();
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/reviews`,
    reviewData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getReviewsByCourseId = async (courseId) => {
  const token = getToken();

  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/reviews/course/${courseId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

