import axios from "axios";
import Cookies from "js-cookie";

let resetTimerFn = null;

export const setAxiosInactivityHandler = (resetFn) => {
  resetTimerFn = resetFn;
};

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});

let isAlertShown = false;

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (resetTimerFn) {
      resetTimerFn();
    }

    return config;
  },
  (err) => Promise.reject(err)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) {
        return Promise.reject(err);
      }

      Cookies.remove("accessToken");

      try {
        const res = await axios.get(
          "http://localhost:8080/api/v1/auth/access_token_by_refresh_token",
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const newAccessToken = res.data?.access_token;
        if (!newAccessToken) {
          throw new Error("Không nhận được access token mới");
        }

        Cookies.set("accessToken", newAccessToken, {
          sameSite: "None",
          secure: true,
        });

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        if (!isAlertShown) {
          isAlertShown = true;

          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");

          document.location.href = "/dang-nhap";
          Cookies.remove("refreshToken");
          Cookies.remove("user");
        }

        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
