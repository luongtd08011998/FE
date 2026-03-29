// userReducer.js
import Cookies from "js-cookie";

const INIT_STATE = {
  user: null, // Lưu thông tin user sau khi đăng nhập
  isLogin: false, // Lưu trạng thái đăng nhập
};

const userReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        isLogin: action.payload.isLogin,
      };

    case "LOGOUT":
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      localStorage.removeItem("user");
      return INIT_STATE;
    default:
      return state;
  }
};

export default userReducer;
