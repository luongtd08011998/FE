import Base from "../component/Base";
import Home from "../component/Home";
const privateRouters = [
  {
    path: "/",
    element: <Base />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
];

export default privateRouters;
