const TOKEN_KEY = "auth_token";

// export const saveToken = (token: string) =>
// localStorage.setItem(TOKEN_KEY, token);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
// export const removeToken = () => localStorage.removeItem(TOKEN_KEY);
export const isAuth = () => !!getToken();
export const saveToken = (token: string) => {
  console.log("=== saveToken вызван ===", token);
  localStorage.setItem(TOKEN_KEY, token);
};
export const removeToken = () => {
  console.log("=== removeToken вызван ===");
  localStorage.removeItem(TOKEN_KEY);
};
