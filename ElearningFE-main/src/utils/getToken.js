import { jwtDecode } from "jwt-decode";

export const getToken = () => {
  const token = localStorage.getItem("accessToken");

  // Must be a non-empty STRING
  if (typeof token !== "string" || token.trim() === "") {
    console.error("Token is not a valid string:", token);
    localStorage.removeItem("accessToken");
    return null;
  }

  // JWT must have 3 parts
  if (token.split(".").length !== 3) {
    console.error("Stored token is not a valid JWT:", token);
    localStorage.removeItem("accessToken");
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    
    const exp = decoded.exp * 1000;
    if (Date.now() > exp) {
      localStorage.removeItem("accessToken");
      return null;
    }

    return token;
  } catch (err) {
    console.error("Invalid token:", err);
    localStorage.removeItem("accessToken");
    return null;
  }
};
