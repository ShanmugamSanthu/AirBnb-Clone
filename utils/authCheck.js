// for vue

export const authNCheck = async (url, router) => {
  const response = await fetch(url);
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
