import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectIsLogin, selectUser } from '../../redux/slice/useSlice';
import { showToast } from '../../utils/toast';
import { updatePassword, updateInfo } from '../../services/user';
import { getCurrentUser } from '../../services/user';
import { useDispatch } from 'react-redux';
import { logout, setUser } from '../../redux/action/userAction';
import { useNavigate, Link } from 'react-router-dom';
const AccountManagement = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const isLogin = useSelector(selectIsLogin);
    const user = useSelector(selectUser);
    const nav = useNavigate()
    const dispatch = useDispatch()
    // Profile form state
    const [profileForm, setProfileForm] = useState({
        fullName: '',
        email: '',
        avatar: null,
        avatarFile: null
    });

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Form validation errors
    const [profileErrors, setProfileErrors] = useState({});
    const [passwordErrors, setPasswordErrors] = useState({});

    // Check if user logged in with Google
    const isGoogleLogin = user?.authProviderResponseDTO?.filter(item => item.providerName === 'google.com' && item.active === 'HOAT_DONG').length > 0;

    useEffect(() => {
        if (user) {
            setProfileForm({
                fullName: user?.username || user?.name || '',
                email: user?.email || '',
                avatar: user?.avatar || null,
                avatarFile: user?.avatarFile || null
            });
        }
    }, [user]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (profileErrors[name]) {
            setProfileErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (passwordErrors[name]) {
            setPasswordErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateProfileForm = () => {
        const errors = {};

        if (!profileForm.fullName.trim()) {
            errors.fullName = 'Tên người dùng không được để trống';
        } else if (profileForm.fullName.trim().length < 2) {
            errors.fullName = 'Tên người dùng phải có ít nhất 2 ký tự';
        }

        if (!profileForm.email.trim()) {
            errors.email = 'Email không được để trống';
        } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
            errors.email = 'Email không hợp lệ';
        }

        setProfileErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validatePasswordForm = () => {
        const errors = {};

        if (!passwordForm.currentPassword) {
            errors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
        }

        if (!passwordForm.newPassword) {
            errors.newPassword = 'Vui lòng nhập mật khẩu mới';
        } else if (passwordForm.newPassword.length < 6) {
            errors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
        }

        if (!passwordForm.confirmPassword) {
            errors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
        } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        if (passwordForm.currentPassword === passwordForm.newPassword) {
            errors.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại';
        }

        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        if (!validateProfileForm()) return;

        setLoading(true);
        try {
            let response = null
            // Gửi file thực sự lên server (không phải base64)
            if (profileForm?.fullName !== user?.username) {
                response = await updateInfo(profileForm?.avatarFile, profileForm?.fullName);
            } else {
                response = await updateInfo(profileForm?.avatarFile, null);
            }

            if (response?.status === 200) {
                if (profileForm?.fullName !== user?.username) {
                    showToast.success('Cập nhật thành công, vui lòng đăng nhập lại')
                    nav('/dang-nhap')
                    dispatch(logout())
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    const currentUser = await getCurrentUser();
                    if (currentUser?.status === 200) {
                        dispatch(setUser(currentUser?.data, true));
                        showToast.success('Cập nhật thành công!');
                    } else {
                        showToast.error('Đã có lỗi xảy ra khi cập nhật thông tin!');
                    }
                }

            } else {
                showToast.error('Tên người dùng đã tồn tại, vui lòng chọn tên khác!');
            }

        } catch (error) {
            console.error('Profile update error:', error);
            showToast.error('Có lỗi xảy ra khi cập nhật thông tin!');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (!validatePasswordForm()) return;

        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Here you would call your API to change password
            // await changePassword({
            //   currentPassword: passwordForm.currentPassword,
            //   newPassword: passwordForm.newPassword
            // });
            const response = await updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
            if (response?.status === 200) {
                showToast.success('Đổi mật khẩu thành công!');
            } else {
                showToast.error('Có lỗi xảy ra khi đổi mật khẩu!');
            }

            // Clear form
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

        } catch (error) {
            console.error('Password change error:', error);
            showToast.error('Có lỗi xảy ra khi đổi mật khẩu!');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB
                showToast.error('Kích thước ảnh không được vượt quá 5MB!');
                return;
            }

            // Chỉ đọc file để hiển thị preview, không gửi base64 lên server
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileForm(prev => ({
                    ...prev,
                    avatar: e.target.result, // Chỉ dùng để hiển thị preview
                    avatarFile: file // File thực sự sẽ được gửi lên server
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isLogin) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Bạn cần đăng nhập</h3>
                    <p className="text-gray-500 mb-4">Vui lòng đăng nhập để quản lý tài khoản</p>
                    <div className="space-x-4">
                        <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Đăng nhập
                        </Link>
                        <Link to="/register" className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                            Đăng ký
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                        <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
                        <span>›</span>
                        <span className="text-gray-900 font-medium">Quản lý tài khoản</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                            {profileForm.avatar ? (
                                <img src={profileForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Quản lý tài khoản</h1>
                            <p className="text-gray-600">Xin chào, {profileForm.fullName || 'Người dùng'}</p>
                            {isGoogleLogin && (
                                <div className="flex items-center mt-1">
                                    <svg className="w-4 h-4 text-red-500 mr-1" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span className="text-sm text-gray-500">Đăng nhập bằng Google</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'profile'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>Thông tin cá nhân</span>
                                </div>
                            </button>
                            {!isGoogleLogin && (
                                <button
                                    onClick={() => setActiveTab('password')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'password'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        <span>Đổi mật khẩu</span>
                                    </div>
                                </button>
                            )}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'profile' && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin cá nhân</h2>
                                <form onSubmit={handleProfileSubmit} className="space-y-6">
                                    {/* Avatar Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ảnh đại diện
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                                {profileForm.avatar ? (
                                                    <img src={profileForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                    className="hidden"
                                                    id="avatar-upload"
                                                />
                                                <label
                                                    htmlFor="avatar-upload"
                                                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                                >
                                                    Chọn ảnh
                                                </label>
                                                <p className="text-xs text-gray-500 mt-3">PNG, JPG, GIF tối đa 5MB</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Full Name */}
                                    <div>
                                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                            Tên người dùng *
                                        </label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={profileForm.fullName}
                                            onChange={handleProfileChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${profileErrors.fullName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Nhập tên của bạn"
                                        />
                                        {profileErrors.fullName && (
                                            <p className="text-red-500 text-sm mt-1">{profileErrors.fullName}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={profileForm.email}
                                            onChange={handleProfileChange}
                                            disabled={true}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${profileErrors.email ? 'border-red-500' : 'border-gray-300'
                                                } ${true ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                            readOnly={true}
                                            placeholder="Nhập email của bạn"
                                        />
                                        {profileErrors.email && (
                                            <p className="text-red-500 text-sm mt-1">{profileErrors.email}</p>
                                        )}
                                        {isGoogleLogin && (
                                            <p className="text-gray-500 text-sm mt-1">Email được quản lý bởi Google</p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                        >
                                            {loading && (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            )}
                                            <span>Cập nhật thông tin</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'password' && !isGoogleLogin && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Đổi mật khẩu</h2>
                                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                    {/* Current Password */}
                                    <div>
                                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                            Mật khẩu hiện tại *
                                        </label>
                                        <input
                                            type="password"
                                            id="currentPassword"
                                            name="currentPassword"
                                            value={passwordForm.currentPassword}
                                            onChange={handlePasswordChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Nhập mật khẩu hiện tại"
                                        />
                                        {passwordErrors.currentPassword && (
                                            <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>
                                        )}
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                            Mật khẩu mới *
                                        </label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            value={passwordForm.newPassword}
                                            onChange={handlePasswordChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Nhập mật khẩu mới"
                                        />
                                        {passwordErrors.newPassword && (
                                            <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                            Xác nhận mật khẩu mới *
                                        </label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={passwordForm.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Nhập lại mật khẩu mới"
                                        />
                                        {passwordErrors.confirmPassword && (
                                            <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                                        )}
                                    </div>

                                    {/* Password Requirements */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Yêu cầu mật khẩu:</h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li className="flex items-center">
                                                <span className={`w-2 h-2 rounded-full mr-2 ${passwordForm.newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300'
                                                    }`}></span>
                                                Ít nhất 6 ký tự
                                            </li>
                                            <li className="flex items-center">
                                                <span className={`w-2 h-2 rounded-full mr-2 ${passwordForm.newPassword !== passwordForm.currentPassword && passwordForm.newPassword.length > 0 ? 'bg-green-500' : 'bg-gray-300'
                                                    }`}></span>
                                                Khác mật khẩu hiện tại
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                        >
                                            {loading && (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            )}
                                            <span>Đổi mật khẩu</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountManagement; 