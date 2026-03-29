import React, { useState, useEffect } from "react";
import { Button, Card, Form, Input, Typography, Divider, Checkbox, Modal, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { FcGoogle } from "react-icons/fc";

const { Title, Text } = Typography;
import URL from "../../../utils/url";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { register, verifyOtpRegister, oauthLogin } from "../../../services/auth";
import { showToast } from "../../../utils/toast";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/action/userAction";
import { getCurrentUser } from "../../../services/user";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../helper/filebase";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dataRegister, setDataRegister] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [configLoadding, setConfigLoadding] = useState({
    registerLoadding: false,
    loginLoaddingGoogle: false,
    otpLoading: false,
  });

  // OTP Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(90);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

  // Countdown effect for OTP
  useEffect(() => {
    let interval = null;
    if (isCountdownActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((countdown) => countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsCountdownActive(false);
    }
    return () => clearInterval(interval);
  }, [isCountdownActive, countdown]);

  const onFinish = async (values) => {
    await handleRegister();
  };

  const handleOnChangeRegister = (e) => {
    setDataRegister({ ...dataRegister, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setConfigLoadding({ ...configLoadding, registerLoadding: true });

    try {
      const response = await register(dataRegister);

      if (response?.status === 200) {
        setIsModalVisible(true);
        setCountdown(90);
        setIsCountdownActive(true);
        showToast.success("Mã OTP đã được gửi đến email của bạn!");
      } else {
        showToast.error(response?.message || "Đăng ký thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      showToast.error("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setConfigLoadding({ ...configLoadding, registerLoadding: false });
    }
  };

  // OTP handling functions
  const handleOtpChange = (index, value) => {
    // Allow both letters and numbers
    if (value.length <= 1 && /^[a-zA-Z0-9]*$/.test(value)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value.toUpperCase(); // Convert to uppercase for consistency
      setOtpValues(newOtpValues);

      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const otpCode = otpValues.join("");
    if (otpCode.length !== 6) {
      showToast.error("Vui lòng nhập đầy đủ 6 ký tự OTP!");
      return;
    }

    setConfigLoadding({ ...configLoadding, otpLoading: true });

    try {
      const response = await verifyOtpRegister(dataRegister.email, otpCode);

      if (response?.status === 200) {
        setIsModalVisible(false);
        showToast.success("Đăng ký tài khoản thành công!");

        // Reset form
        setDataRegister({ email: "", username: "", password: "" });
        setOtpValues(["", "", "", "", "", ""]);
        setIsCountdownActive(false);

        // Redirect to login page after successful registration
        setTimeout(() => {
          navigate(URL.AUTH.LOGIN);
        }, 1500);
      } else {
        showToast.error(response?.message || "Mã OTP không đúng. Vui lòng thử lại!");
      }
    } catch (error) {
      showToast.error("Có lỗi xảy ra khi xác thực OTP!");
    } finally {
      setConfigLoadding({ ...configLoadding, otpLoading: false });
    }
  };

  const handleResendOtp = async () => {
    setConfigLoadding({ ...configLoadding, registerLoadding: true });

    try {
      const response = await register(dataRegister);

      if (response?.status === 200) {
        setCountdown(90);
        setIsCountdownActive(true);
        setOtpValues(["", "", "", "", "", ""]);
        showToast.success("Mã OTP mới đã được gửi!");
      } else {
        showToast.error("Không thể gửi lại mã OTP. Vui lòng thử lại!");
      }
    } catch (error) {
      showToast.error("Có lỗi xảy ra khi gửi lại mã OTP!");
    } finally {
      setConfigLoadding({ ...configLoadding, registerLoadding: false });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
          const user = await getCurrentUser(userId);
          if (user?.status === 200) {
            dispatch(setUser(user?.data, true));
          }
          setTimeout(() => {
            setConfigLoadding({ ...configLoadding, loginLoaddingGoogle: false });
            showToast.success("Đăng nhập thành công");
            navigate("/");
          }, 1000);
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex">
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 to-blue-700/90 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
          alt="Register Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center">
            <h1 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
              Tham gia cộng đồng
              <br />
              <span className="text-yellow-300">Công ty Cổ phần Cấp nước Tân Hòa</span>
            </h1>
            <p className="text-xl opacity-90 mb-8 leading-relaxed">
              Tạo tài khoản miễn phí để trải nghiệm đầy đủ các tính năng và nhận
              tin tức cá nhân hóa
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold">Miễn phí</div>
                <div className="opacity-80">Hoàn toàn</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">30s</div>
                <div className="opacity-80">Đăng ký</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">∞</div>
                <div className="opacity-80">Tin tức</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          <Card
            className="shadow-2xl border-0 rounded-2xl overflow-hidden"
            bodyStyle={{ padding: "48px 40px" }}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <UserOutlined className="text-white text-2xl" />
              </div>
              <Title level={2} className="!mb-2 !text-gray-800">
                Tạo tài khoản mới
              </Title>
              <Text className="text-gray-500 text-base">
                Đăng ký để bắt đầu hành trình
              </Text>
            </div>

            <Form
              name="register"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              className="space-y-1">
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập email!",
                  },
                  {
                    type: "email",
                    message: "Email không hợp lệ!",
                  },
                ]}>
                <Input
                  name={"email"}
                  value={dataRegister.email}
                  onChange={handleOnChangeRegister}
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Địa chỉ email"
                  className="rounded-lg border-gray-200 hover:border-green-400 focus:border-green-500 py-3"
                />
              </Form.Item>

              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên đăng nhập!",
                  },
                  {
                    min: 3,
                    message: "Tên đăng nhập phải có ít nhất 3 ký tự!",
                  },
                ]}>
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Tên đăng nhập"
                  name={"username"}
                  value={dataRegister.username}
                  onChange={handleOnChangeRegister}
                  className="rounded-lg border-gray-200 hover:border-green-400 focus:border-green-500 py-3"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu!",
                  },
                  {
                    min: 6,
                    message: "Mật khẩu phải có ít nhất 6 ký tự!",
                  },
                ]}>
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Mật khẩu"
                  name={"password"}
                  value={dataRegister.password}
                  onChange={handleOnChangeRegister}
                  className="rounded-lg border-gray-200 hover:border-green-400 focus:border-green-500 py-3"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng xác nhận mật khẩu!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu xác nhận không khớp!")
                      );
                    },
                  }),
                ]}>
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Xác nhận mật khẩu"
                  className="rounded-lg border-gray-200 hover:border-green-400 focus:border-green-500 py-3"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <div className="mb-6">
                <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                            new Error("Vui lòng đồng ý với điều khoản!")
                          ),
                    },
                  ]}
                  className="!mb-0">
                  <Checkbox className="text-gray-600">
                    Tôi đồng ý với{" "}
                    <Link
                      href="#"
                      className="text-green-500 hover:text-green-700">
                      Điều khoản sử dụng
                    </Link>{" "}
                    và{" "}
                    <Link
                      href="#"
                      className="text-green-500 hover:text-green-700">
                      Chính sách bảo mật
                    </Link>
                  </Checkbox>
                </Form.Item>
              </div>

              <Form.Item className="!mb-6">
                <Button
                  loading={configLoadding.registerLoadding}
                  type="primary"
                  htmlType="submit"
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-600 border-0 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  Tạo tài khoản
                </Button>
              </Form.Item>
            </Form>

            <div className="text-center mt-8 pt-6 border-t border-gray-100">
              <Text className="text-gray-500">
                Đã có tài khoản?{" "}
                <Link
                  to={URL.AUTH.LOGIN}
                  className="text-green-500 hover:text-green-700 font-semibold">
                  Đăng nhập ngay
                </Link>
              </Text>
            </div>
          </Card>

          <div className="text-center mt-6">
            <Text className="text-gray-400 text-sm">
              Bằng việc đăng ký, bạn đồng ý nhận email thông báo và cập nhật từ
              chúng tôi
            </Text>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <Modal
        title={null}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        width={400}
        className="otp-modal">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <CheckCircleOutlined className="text-white text-2xl" />
          </div>

          <Title level={3} className="!mb-2">
            Xác thực tài khoản
          </Title>

          <Text className="text-gray-500 block mb-6">
            Mã xác thực đã được gửi đến
            <br />
            <strong>{dataRegister.email}</strong>
          </Text>

          <div className="flex justify-center gap-3 mb-6">
            {otpValues.map((value, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                value={value}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold rounded-lg border-2 border-gray-200 focus:border-green-500 uppercase"
                maxLength={1}
                placeholder="•"
              />
            ))}
          </div>

          <div className="mb-6">
            {isCountdownActive ? (
              <Text className="text-gray-500">
                Gửi lại mã sau:{" "}
                <span className="font-bold text-green-600">
                  {formatTime(countdown)}
                </span>
              </Text>
            ) : (
              <Button
                type="link"
                onClick={handleResendOtp}
                loading={configLoadding.registerLoadding}
                className="text-green-500 hover:text-green-700 font-medium p-0">
                Gửi lại mã OTP
              </Button>
            )}
          </div>

          <Button
            type="primary"
            onClick={handleOtpSubmit}
            loading={configLoadding.otpLoading}
            className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-600 border-0 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300">
            Xác thực tài khoản
          </Button>
        </div>
      </Modal>
    </div>
  );
}
