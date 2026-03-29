export const setUser = (user, isLogin) => ({
  type: "SET_USER",
  payload: { user, isLogin },
});

export const logout = () => ({
  type: "LOGOUT",
});
