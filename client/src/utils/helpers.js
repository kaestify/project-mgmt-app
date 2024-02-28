import Cookies from "js-cookie";

export const isAuth = () => {
  return sessionStorage.getItem("isLoggedIn") === "true" ? true : false;
};

//sign out
export const handleLogout = () => {
  // localStorage.clear();
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  Cookies.remove("accessTokenExpiry");
  sessionStorage.clear();
  window.href = "/login";
  window.location.reload();
};

export const isUserAdmin = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userRoleisAdmin") == "true" ? true : false;
  }
};
