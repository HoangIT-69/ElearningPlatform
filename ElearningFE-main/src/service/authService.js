import axios from "axios";
import { getToken } from "../utils/getToken";
import { jwtDecode } from "jwt-decode";

export const register = async (email, password, fullName, phone) => {
  console.log("Registering user:", { email, fullName, phone });
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/register`,
    {
      email,
      password,
      fullName,
      phone,
    }
  );
  return res.data;
};

export const login = async (email, password) => {
  const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
    email,
    password,
  });
  return res.data;
};

export const getUserProfile = async () => {
  const token = getToken();
  if (!token) return null;

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data?.data;
};

export const updateProfile = async (profileData) => {
  const token = getToken();
  if (!token) return null;

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
