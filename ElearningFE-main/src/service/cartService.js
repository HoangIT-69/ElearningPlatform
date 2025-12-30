import axios from "axios";
import { getToken } from "../utils/getToken";
import { toast } from "react-toastify";

const token = getToken();

export const addCourseToCart = async (courseId) => {
  if (!token) {
    toast.error("Vui lòng đăng nhập để thực hiện chức năng");
  } else {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/cart`,
      { courseId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  }
};

export const getCartItems = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const removeCartItem = async (cartItemId) => {
  const res = await axios.delete(
    `${import.meta.env.VITE_API_URL}/cart/${cartItemId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
