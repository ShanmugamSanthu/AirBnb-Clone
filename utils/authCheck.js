// for vue
import { apiFetch } from "../api.js";
export const authNCheck = async (url, router) => {
  const response = await apiFetch(url, {
    credentials: "include",
  });

  if (response.url.includes("/user/loginpage")) {
    router.push("/user/loginpage");
    return null;
  }

  return response;
};

export const userAuthInfo = async (userInfo, router) => {
  if (userInfo === null || userInfo === undefined) {
    router.push("/user/loginpage");
    return null;
  }
};
