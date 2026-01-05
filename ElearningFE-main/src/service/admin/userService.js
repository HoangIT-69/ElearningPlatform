import axios from "axios";
import { getToken } from "../../utils/getToken";

const token = getToken();

export const getAllUsers = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getUserById = async (userId) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const updateUser = async (userId, data) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_URL}/users/admin/${userId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export const getPopularInstructors = async (limit = 4) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/instructors/popular`, {
    params: {
        limit: limit
    },
  });
  return res.data;
}
