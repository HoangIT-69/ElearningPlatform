import axios from "axios";
import { getToken } from "../../utils/getToken";

const token = getToken();
console.log("Token in categoryService:", token);

export const createCategory = async (name, parentId) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/categories`,
    {
      name: name,
      parentId: parentId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getAllCategoriesTree = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/categories/tree`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getAllCategories = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteCategory = async (categoryId) => {
  const res = await axios.delete(
    `${import.meta.env.VITE_API_URL}/categories/${categoryId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getCategoryById = async (id) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/categories/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export const updateCategory = async (id, payload) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_URL}/categories/${id}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}