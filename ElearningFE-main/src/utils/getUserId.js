import { jwtDecode } from "jwt-decode";

export const getUserId = () => {
  const token = localStorage.getItem("accessToken");
  const decode = jwtDecode(token);
  return decode.userId;
};
