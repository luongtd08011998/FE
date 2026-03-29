import React, { useEffect } from "react";
import { useRoutes, Navigate, useLocation } from "react-router-dom";
import publicRoutes from "./publicRouter";
import privateRoutes from "./privateRouter";
import { useSelector } from "react-redux";
import { selectIsLogin } from "../redux/slice/useSlice";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
};

const PublicRoute = ({ element }) => element;
const PrivateRoute = ({ element }) => {
  const isLogin = useSelector(selectIsLogin);
  return isLogin ? element : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const routes = [
    ...publicRoutes.map((route) => ({
      ...route,
      element: <PublicRoute element={route.element} />,
    })),
    ...privateRoutes.map((route) => ({
      ...route,
      element: <PrivateRoute element={route.element} />,
    })),
  ];

  const element = useRoutes(routes);

  return (
    <>
      <ScrollToTop />
      {element}
    </>
  );
};

export default AppRoutes;
