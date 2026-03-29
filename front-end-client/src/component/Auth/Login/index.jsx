import React, { useState } from "react";
import { Button, Card, Form, Input, Typography, Divider, Checkbox } from "antd";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../../helper/filebase";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import URL from "../../../utils/url";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { login, oauthLogin } from "../../../services/auth";
import { showToast } from "../../../utils/toast";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/action/userAction";
import { getCurrentUser } from "../../../services/user";

const { Title, Text } = Typography;



export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dataLogin, setDataLogin] = useState({
    username: "",
    password: "",
  });

  const [configLoadding, setConfigLoadding] = useState({
    loginLoaddingUserNamePassword: false,
    loginLoaddingGoogle: false,
    loginLoaddingGithub: false,
  });

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const handleLoginWithGoogle = () => {
    setConfigLoadding({ ...configLoadding, loginLoaddingGoogle: true });
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const id_token = await result.user.getIdToken();
        const provider = result.providerId;
        const email = result.user.email;
        const username = result.user.displayName;
        const avatar = result.user.photoURL;
        const data = {
          id_token,
          provider,
          email,
          username,
          avatar,
        };

        const response = await oauthLogin(data);

        if (response?.status === 200) {
          const { accessToken, refreshToken, userId } = response;

          Cookies.set("accessToken", accessToken, { expires: 1 / 24 }); // 1 giờ
          Cookies.set("refreshToken", refreshToken, { expires: 14 }); // 14 ngày
          const user = await getCurrentUser();

          if (user?.status === 200) {
            dispatch(setUser(user?.data, true));
            setTimeout(() => {
              setConfigLoadding({ ...configLoadding, loginLoaddingGoogle: false });
              showToast.success("Đăng nhập thành công");
              navigate("/");
            }, 1000);
          } else {
            showToast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin");
            setConfigLoadding({ ...configLoadding, loginLoaddingGoogle: false });
          }

        } else {
          setConfigLoadding({ ...configLoadding, loginLoaddingGoogle: false });
          showToast.error(
            "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin"
          );
        }
      })
      .catch((error) => {
        setConfigLoadding({ ...configLoadding, loginLoaddingGoogle: false });

        if (error.code === "auth/account-exists-with-different-credential") {
          showToast.error(
            "Tài khoản đã tồn tại với nhà cung cấp khác. Vui lòng thử lại với tài khoản khác."
          );
        } else {
          showToast.error(
            "Đã xảy ra lỗi bất ngờ khi đăng nhập. Vui lòng thử lại sau"
          );
        }
      });
    setConfigLoadding({ ...configLoadding, loginLoaddingGoogle: false });
  };


  const handleOnChangeLogin = (e) => {
    setDataLogin({ ...dataLogin, [e.target.name]: e.target.value });
  };


  const handleLogin = async () => {
    setConfigLoadding({ ...configLoadding, loginLoaddingUserNamePassword: true });
    const response = await login(dataLogin);

    if (response?.status === 200) {
      Cookies.set("accessToken", response.accessToken);
      Cookies.set("refreshToken", response.refreshToken);

      const user = await getCurrentUser(response.userId);
      if (user?.status === 200) {
        dispatch(setUser(user?.data, true));
        setTimeout(() => {
          setConfigLoadding({ ...configLoadding, loginLoaddingUserNamePassword: false });
          showToast.success("Đăng nhập thành công");
          navigate("/");
        }, 1500);

      } else {
        showToast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.");
        setConfigLoadding({ ...configLoadding, loginLoaddingUserNamePassword: false });
      }
    } else {
      showToast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.");
    }
    setConfigLoadding({ ...configLoadding, loginLoaddingUserNamePassword: false });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-700/90 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
          alt="Login Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center">
            <h1 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
              Chào mừng đến với
              <br />
              <span className="text-yellow-300">Công ty Cổ phần Cấp nước Tân Hòa</span>
            </h1>
            <p className="text-xl opacity-90 mb-8 leading-relaxed">
              Nước Sạch Cho Mọi Nhà - Cung cấp dịch vụ cấp nước chất lượng cao,
              tin tức và thông báo mới nhất về hệ thống cấp nước
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold">50K+</div>
                <div className="opacity-80">Khách hàng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="opacity-80">Dịch vụ</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">100%</div>
                <div className="opacity-80">Nước sạch</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phần bên phải - Form đăng nhập */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          <Card
            className="shadow-2xl border-0 rounded-2xl overflow-hidden"
            bodyStyle={{ padding: "48px 40px" }}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <UserOutlined className="text-white text-2xl" />
              </div>
              <Title level={2} className="!mb-2 !text-gray-800">
                Chào mừng trở lại
              </Title>
              <Text className="text-gray-500 text-base">
                Đăng nhập để tiếp tục
              </Text>
            </div>

            <Form
              name="login"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              className="space-y-1">
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên đăng nhập!",
                  },
                ]}>
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Tên đăng nhập hoặc email"
                  name="username"
                  value={dataLogin.username}
                  onChange={handleOnChangeLogin}
                  className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500 py-3"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu!",
                  },
                ]}>
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Mật khẩu"
                  name="password"
                  value={dataLogin.password}
                  onChange={handleOnChangeLogin}
                  className="rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-500 py-3"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <div className="flex justify-between items-center mb-6">

                <Link
                  to={URL.AUTH.FORGOT_PASSWORD}
                  className="text-blue-500 hover:text-blue-700 font-medium">
                  Quên mật khẩu?
                </Link>
              </div>

              <Form.Item className="!mb-6">
                <Button
                  loading={configLoadding.loginLoaddingUserNamePassword}
                  onClick={handleLogin}
                  type="primary"
                  htmlType="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 border-0 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>

            <Divider className="!my-8">
              <Text className="text-gray-400 font-medium px-4">
                Hoặc tiếp tục với
              </Text>
            </Divider>

            <div className="space-y-3">
              <Button
                loading={configLoadding.loginLoaddingGoogle}
                onClick={handleLoginWithGoogle}
                className="w-full h-12 flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-red-400 hover:text-red-500 hover:shadow-md transition-all duration-300"
                icon={<FcGoogle size={24} />}>
                Đăng nhập với Google
              </Button>

            </div>

            <div className="text-center mt-8 pt-6 border-t border-gray-100">
              <Text className="text-gray-500">
                Chưa có tài khoản?{" "}
                <Link
                  to={URL.AUTH.REGISTER}
                  className="text-blue-500 hover:text-blue-700 font-semibold">
                  Đăng ký miễn phí
                </Link>
              </Text>
            </div>
          </Card>

          <div className="text-center mt-6">
            <Text className="text-gray-400 text-sm">
              Bằng việc đăng nhập, bạn đồng ý với{" "}
              <Link className="text-gray-600 hover:text-blue-500">
                Điều khoản sử dụng
              </Link>{" "}
              và{" "}
              <Link href="#" className="text-gray-600 hover:text-blue-500">
                Chính sách bảo mật
              </Link>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
