import axios from "axios";
import { getToken } from "../utils/getToken";
import { jwtDecode } from "jwt-decode";
const token = getToken();
export const getUserProfile = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateProfile = async (profileData) => {
  const decoded = jwtDecode(token);
  const userId = decoded.userId;

  const res = await axios.put(
    `${import.meta.env.VITE_API_URL}/users/profile/${userId}`,
    profileData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const changePassword = async ({ oldPassword, newPassword }) => {
  const token = getToken();
  if (!token) return null;

  const decoded = jwtDecode(token);
  const userId = decoded.userId;

  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/users/profile/${userId}/change-password`,
    { oldPassword, newPassword },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const myCourse = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/enrollments/my-courses`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export const getEnrollmentContent = async (slug) => {
  const token = getToken();
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/enrollments/${slug}/content`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
