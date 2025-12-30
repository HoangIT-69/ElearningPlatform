import axios from "axios";

export const getCategoryTree = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/categories/tree`)
    return res.data;        
}; 
