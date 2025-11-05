// src/lib/auth.ts
import Cookies from "js-cookie";

const TOKEN_KEY = "token";

export const setToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, { expires: 1 }); // 1 día
};

export const getToken = () => Cookies.get(TOKEN_KEY);

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};
