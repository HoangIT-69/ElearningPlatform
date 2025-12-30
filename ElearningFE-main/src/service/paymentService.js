import axios from "axios";
import { getToken } from "../utils/getToken";

const token = getToken();

export const createPayment = async (paymentData) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/payment/create-payment`,
    {
      params: paymentData,  
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const orderHistory = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/orders/my-history`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
}