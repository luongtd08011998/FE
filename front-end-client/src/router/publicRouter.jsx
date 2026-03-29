import Base from "../component/Base";
import Login from "../component/Auth/Login";
import Register from "../component/Auth/Register";
import ForgotPassword from "../component/Auth/ForgotPassword";
import Home from "../component/Home";
import CategoryPage from "../component/CategoryPage";
import DetailArticle from "../component/DetailArticle";
import SavedArticles from "../component/SavedArticles";
import LikedArticles from "../component/LikedArticles";
import AccountManagement from "../component/AccountManagement";
import SearchResults from "../component/SearchResults";
import URL from "../utils/url";

const publicRouters = [
  {
    path: "/",
    element: <Base />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/:slug",
        element: <CategoryPage />,
      },
      {
        path: "/:slug/:slug",
        element: <DetailArticle />,
      },
      // User content routes
      {
        path: "/bai-viet-da-luu",
        element: <SavedArticles />,
      },
      {
        path: "/bai-viet-da-thich",
        element: <LikedArticles />,
      },
      {
        path: "/quan-ly-tai-khoan",
        element: <AccountManagement />,
      },
      // Search results route
      {
        path: "/tim-kiem",
        element: <SearchResults />,
      },
    ],
  },
  {
    path: URL.AUTH.LOGIN,
    element: <Login />,
  },
  {
    path: URL.AUTH.REGISTER,
    element: <Register />,
  },
  {
    path: URL.AUTH.FORGOT_PASSWORD,
    element: <ForgotPassword />,
  },
];

export default publicRouters;
