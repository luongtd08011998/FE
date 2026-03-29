import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectIsLogin, selectUser } from '../../redux/slice/useSlice';
import { logout } from '../../redux/action/userAction';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FaNewspaper,
  FaSearch,
  FaBars,
  FaTimes,
  FaUser,
  FaChevronDown,
  FaGlobeAmericas,
  FaBolt,
  FaPhone,
} from 'react-icons/fa';
import { getAllCategories } from '../../services/category';
import { searchArticles as searchArticlesAPI } from '../../services/articles';
import { Link } from 'react-router-dom';

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [dataCategories, setDataCategories] = useState([]);
  // Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const isLogin = useSelector(selectIsLogin);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userMenuRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  // Search function using real API
  const searchArticles = async (term) => {
    if (!term.trim()) return [];

    try {
      const response = await searchArticlesAPI(term, 5, 0, 'createAt', 'desc');
      if (response && response.status === 200) {
        return response.data || [];
      }
      return [];
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  };

  // Debounce search with loading
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchTerm.trim()) {
        setIsSearchLoading(true);
        setIsSearchOpen(true);
        setSelectedIndex(-1);

        try {
          const results = await searchArticles(searchTerm);
          setSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearchLoading(false);
        }
      } else {
        setSearchResults([]);
        setIsSearchOpen(false);
        setIsSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    const fetchDataCategories = async () => {
      if (
        localStorage.getItem('categories') &&
        JSON.parse(localStorage.getItem('categories')).length > 0
      ) {
        setDataCategories(JSON.parse(localStorage.getItem('categories')));
      } else {
        const response = await getAllCategories();
        console.log('>>', response);
        if (response?.data) {
          setDataCategories(response?.data);
          localStorage.setItem('categories', JSON.stringify(response?.data));
        }
      }
    };
    fetchDataCategories();
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSelectedIndex(-1);
        setIsSearchExpanded(false);
        setSearchTerm('');
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isSearchOpen || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          window.location.href = `/tin-tuc/${searchResults[selectedIndex].slug}`;
        }
        break;
      case 'Escape':
        setIsSearchOpen(false);
        setSelectedIndex(-1);
        setIsSearchExpanded(false);
        setSearchTerm('');
        break;
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Chuyển đến trang search với query
      window.location.href = `/tim-kiem?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    dispatch(logout());
    navigate('/dang-nhap');
  };

  const handleImageError = (e) => {
    e.target.src =
      "data:image/svg+xml,%3Csvg width='100' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' fill='%23374151' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
  };

  const userMenuItems = [
    {
      title: 'Bài viết đã lưu',
      path: '/bai-viet-da-luu',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      ),
    },
    {
      title: 'Bài viết đã thích',
      path: '/bai-viet-da-thich',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
    {
      title: 'Quản lý tài khoản',
      path: '/quan-ly-tai-khoan',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      title: 'Đăng xuất',
      onClick: handleLogout,
      path: '/dang-nhap',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      ),
      isLogout: true,
    },
  ];

  const handleMouseEnter = (index) => {
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top Section - Logo, Company Info, Search, Contact */}
        <div className="flex items-center justify-between py-3">
          {/* Left Section - Logo and Company Info */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <Link to="/" className="flex items-center no-underline group">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <img
                  src="/z6838744741305_a9a0407315b3348d84d18b1d941ee3ad.jpg"
                  alt="Logo Công ty Cổ phần Cấp nước Toc TIen"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml,%3Csvg width='48' height='48' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='6' fill='%23374151' text-anchor='middle' dy='.3em'%3ELogo%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            </Link>

            {/* Company Info */}
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-blue-800 leading-tight">
                CÔNG TY TNHH CẤP NƯỚC TÓC TIÊN
              </h1>
              <p className="text-xs font-semibold text-red-600 leading-tight">
                Nước Sạch Cho Mọi Nhà
              </p>
            </div>
          </div>

          {/* Right Section - Search and Contact */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <div
                className={`flex items-center transition-all duration-300 ${
                  isSearchExpanded
                    ? 'bg-white rounded-lg shadow-md border border-gray-200'
                    : ''
                }`}
              >
                {isSearchExpanded ? (
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center"
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Tìm kiếm tin tức..."
                      className="bg-transparent border-none text-gray-900 px-3 py-2 text-sm outline-none placeholder-gray-500 w-48"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => searchTerm && setIsSearchOpen(true)}
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-3 py-2 flex items-center hover:bg-blue-700 transition-all duration-300"
                    >
                      <FaSearch className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={handleSearchClick}
                    className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 transition-all duration-300"
                  >
                    <FaSearch className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {isSearchOpen && isSearchExpanded && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl z-50 max-h-80 overflow-y-auto border border-gray-200">
                  <div className="p-3">
                    <div className="text-xs text-gray-500 font-medium mb-2">
                      Kết quả tìm kiếm cho "{searchTerm}"
                    </div>

                    {/* Loading State */}
                    {isSearchLoading && (
                      <div className="py-6">
                        <div className="flex items-center justify-center">
                          <div className="relative">
                            <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            Đang tìm kiếm...
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Results List */}
                    {!isSearchLoading && searchResults.length > 0 && (
                      <>
                        <ul className="list-none m-0 p-0">
                          {searchResults.map((article, index) => (
                            <li key={article.id} className="mb-1">
                              <Link
                                to={`/${article.slugCategory}/${
                                  article.slug || article.id
                                }`}
                                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 hover:bg-gray-50 no-underline ${
                                  selectedIndex === index
                                    ? 'bg-blue-50 border-l-4 border-blue-500'
                                    : ''
                                }`}
                              >
                                <img
                                  src={article?.thumbnail || ''}
                                  alt={article.title}
                                  className="w-10 h-10 object-cover rounded-md flex-shrink-0"
                                  onError={handleImageError}
                                />
                                <div className="flex-1 min-w-0">
                                  <p
                                    className="font-medium text-gray-900 text-sm leading-tight"
                                    style={{
                                      display: '-webkit-box',
                                      WebkitBoxOrient: 'vertical',
                                      WebkitLineClamp: 2,
                                      overflow: 'hidden',
                                    }}
                                  >
                                    {article.title}
                                  </p>
                                  <p className="text-blue-600 text-xs mt-1 font-medium">
                                    {article?.tags?.length > 0
                                      ? article?.tags[0]?.name
                                      : ''}
                                  </p>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                        {searchResults.length === 5 && (
                          <div className="border-t border-gray-100 mt-2 pt-2">
                            <Link
                              to={`/tim-kiem?q=${encodeURIComponent(
                                searchTerm
                              )}`}
                              className="block text-center text-blue-600 text-sm font-medium py-2 hover:bg-gray-50 rounded-lg transition-all duration-300 no-underline"
                            >
                              Xem tất cả kết quả tìm kiếm
                            </Link>
                          </div>
                        )}
                      </>
                    )}
                    {/* No Results */}
                    {!isSearchLoading &&
                      searchTerm &&
                      searchResults.length === 0 && (
                        <div className="text-center py-4">
                          <svg
                            className="w-10 h-10 text-gray-400 mx-auto mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <p className="text-gray-500 text-sm">
                            Không tìm thấy kết quả nào cho "{searchTerm}"
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            Thử với từ khóa khác
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>

            {/* Authentication Section */}
            {isLogin ? (
              /* User Menu - When logged in */
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full py-2 px-3 transition-all duration-300 focus:outline-2 focus:outline-yellow-400 focus:outline-offset-2 border border-gray-200"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials(user?.name || user?.email)}
                  </div>
                  <span
                    className="text-gray-700 text-sm hidden lg:block max-w-[120px] truncate"
                    style={{ display: 'inline-block', verticalAlign: 'middle' }}
                    title={user?.username || user?.email || 'User'}
                  >
                    {user?.username || user?.email || 'User'}
                  </span>
                  <FaChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* User Dropdown */}
                <div
                  className={`absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl py-2 transition-all duration-300 z-[9999] ${
                    isUserMenuOpen
                      ? 'opacity-100 visible translate-y-0'
                      : 'opacity-0 invisible -translate-y-3'
                  }`}
                  style={{ overflowX: 'hidden', wordBreak: 'break-word' }}
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p
                      className="text-sm font-medium text-gray-900 max-w-[180px] truncate"
                      style={{ wordBreak: 'break-all' }}
                      title={user?.username || 'User'}
                    >
                      {user?.username || 'User'}
                    </p>
                    <p
                      className="text-sm text-gray-500 max-w-[180px] truncate"
                      title={user?.email}
                      style={{ wordBreak: 'break-all' }}
                    >
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    to="/quan-ly-tai-khoan"
                    className="flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 hover:bg-gray-100 text-gray-700 hover:text-blue-700"
                  >
                    <FaUser className="w-4 h-4" />
                    Tài khoản của tôi
                  </Link>
                  <Link
                    to="/bai-viet-da-luu"
                    className="flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 hover:bg-gray-100 text-gray-700 hover:text-blue-700"
                  >
                    <FaNewspaper className="w-4 h-4" />
                    Bài viết đã lưu
                  </Link>
                  <Link
                    to="/bai-viet-da-thich"
                    className="flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 hover:bg-gray-100 text-gray-700 hover:text-blue-700"
                  >
                    <FaBolt className="w-4 h-4" />
                    Bài viết đã thích
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 hover:bg-red-50 text-red-600 hover:text-red-700"
                  >
                    <FaTimes className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              /* Login/Register Buttons - When not logged in */
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/dang-nhap"
                  className="relative text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-medium transition-all duration-300 focus:outline-2 focus:outline-blue-400 focus:outline-offset-2 group"
                >
                  <span className="relative z-10">Đăng nhập</span>
                  <div className="absolute inset-0 border border-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  to="/dang-ky"
                  className="relative bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 focus:outline-2 focus:outline-blue-400 focus:outline-offset-2 shadow-lg hover:shadow-xl transform hover:scale-105 group overflow-hidden"
                >
                  <span className="relative z-10">Đăng ký</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/30 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                </Link>
              </div>
            )}

            {/* Contact Button */}
            <div className="bg-red-600 text-white px-3 py-2 rounded-lg shadow-md hover:bg-red-700 transition-all duration-300 flex items-center gap-2">
              <FaPhone className="w-3 h-3" />
              <div className="flex flex-col">
                <span className="text-xs font-medium">Tổng đài CSKH</span>
                <span className="text-sm font-bold">02543894894</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="border-t border-gray-200">
          <ul className="flex justify-center items-center gap-4 list-none m-0 py-3">
            {/* Home Menu */}
            <li>
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 no-underline font-medium text-sm transition-all duration-300 flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                TRANG CHỦ
              </Link>
            </li>

            {/* Dynamic Menu from dataCategories */}
            {dataCategories?.slice(0, 6).map((item, index) => (
              <li
                key={index}
                className="relative"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={`/${item.slug}`}
                  className="text-gray-700 hover:text-blue-600 no-underline font-medium text-sm transition-all duration-300"
                >
                  {item?.name?.toUpperCase() || 'TIN TỨC'}
                  {item?.children && (
                    <span
                      className={`ml-1 text-xs transition-transform duration-300 ${
                        activeDropdown === index ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </span>
                  )}
                </Link>
                {item?.children && (
                  <ul
                    className={`absolute top-full left-0 bg-white rounded-lg shadow-2xl list-none m-0 py-2 min-w-[180px] z-50 transition-all duration-300 ${
                      activeDropdown === index
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-3'
                    }`}
                  >
                    {item?.children?.slice(0, 4).map((subItem, subIndex) => (
                      <li key={subIndex} className="m-0">
                        <Link
                          to={`/${subItem.slug}`}
                          className="text-gray-800 no-underline px-4 py-2 block text-sm transition-all duration-300 hover:bg-gray-100 hover:text-blue-700"
                        >
                          {subItem?.name || ''}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Menu Button - Only show on mobile */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <FaTimes className="w-4 h-4" />
            ) : (
              <FaBars className="w-4 h-4" />
            )}
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav
        className={`md:hidden bg-white border-b border-gray-200 transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-[500px]' : 'max-h-0'
        }`}
      >
        <div className="p-4">
          {/* Mobile Search */}
          <div className="mb-4 relative">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center bg-gray-100 rounded-lg overflow-hidden"
            >
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="bg-transparent border-none text-gray-900 px-4 py-2 text-sm w-full outline-none placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm && setIsSearchOpen(true)}
                onKeyDown={handleKeyDown}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2"
              >
                <FaSearch className="w-4 h-4" />
              </button>
            </form>

            {/* Mobile Search Results */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl z-50 max-h-80 overflow-y-auto border border-gray-200">
                <div className="p-3">
                  <div className="text-xs text-gray-500 font-medium mb-3">
                    Kết quả tìm kiếm cho "{searchTerm}"
                  </div>

                  {/* Mobile Loading State */}
                  {isSearchLoading && (
                    <div className="py-6">
                      <div className="flex items-center justify-center">
                        <div className="relative">
                          <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          Đang tìm kiếm...
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Mobile Results List */}
                  {!isSearchLoading && searchResults.length > 0 && (
                    <>
                      <ul className="list-none m-0 p-0">
                        {searchResults.map((article, index) => (
                          <li key={article.id} className="mb-2">
                            <a
                              href={`/${article.slugCategory}/${
                                article.slug || article.id
                              }`}
                              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-gray-50 no-underline ${
                                selectedIndex === index
                                  ? 'bg-blue-50 border-l-4 border-blue-500'
                                  : ''
                              }`}
                            >
                              <img
                                src={
                                  article.thumbnail ||
                                  `https://picsum.photos/100/80?random=${article.id}`
                                }
                                alt={article.title}
                                className="w-10 h-10 object-cover rounded-md flex-shrink-0"
                                onError={handleImageError}
                              />
                              <div className="flex-1 min-w-0">
                                <p
                                  className="font-medium text-gray-900 text-sm leading-tight"
                                  style={{
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 2,
                                    overflow: 'hidden',
                                  }}
                                >
                                  {article.title}
                                </p>
                                <p className="text-blue-600 text-xs mt-1 font-medium">
                                  {article?.tags?.length > 0
                                    ? article?.tags[0]?.name
                                    : ''}
                                </p>
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>
                      {searchResults.length === 5 && (
                        <div className="border-t border-gray-100 mt-3 pt-3">
                          <a
                            href={`/tim-kiem?q=${encodeURIComponent(
                              searchTerm
                            )}`}
                            className="block text-center text-blue-600 text-sm font-medium py-2 hover:bg-gray-50 rounded-lg transition-all duration-300 no-underline"
                          >
                            Xem tất cả kết quả
                          </a>
                        </div>
                      )}
                    </>
                  )}

                  {/* Mobile No Results */}
                  {!isSearchLoading &&
                    searchTerm &&
                    searchResults.length === 0 && (
                      <div className="text-center py-4">
                        <svg
                          className="w-10 h-10 text-gray-400 mx-auto mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="text-gray-500 text-sm">
                          Không tìm thấy kết quả nào cho "{searchTerm}"
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          Thử với từ khóa khác
                        </p>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Authentication */}
          {isLogin ? (
            <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {getInitials(user?.name || user?.email)}
                </div>
                <div>
                  <p className="text-gray-900 font-medium">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-gray-600 text-sm">{user?.email}</p>
                </div>
              </div>
              {userMenuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  onClick={item.isLogout ? handleLogout : undefined}
                  className={`flex items-center gap-3 py-3 text-sm transition-all duration-300 ${
                    item.isLogout
                      ? 'text-red-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </div>
          ) : (
            <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="flex flex-col gap-3">
                <Link
                  to="/dang-nhap"
                  className="text-blue-600 hover:text-blue-700 py-2.5 px-4 text-sm font-medium transition-all duration-300"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/dang-ky"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-bold transition-all duration-300 hover:bg-blue-700"
                >
                  Đăng ký miễn phí
                </Link>
              </div>
            </div>
          )}

          {/* Mobile Menu Items */}
          <ul className="list-none m-0 p-0">
            {/* Home */}
            <li className="mb-3">
              <Link
                to="/"
                className="text-gray-700 no-underline py-3 block text-base font-medium border-b border-gray-100 transition-all duration-300 hover:text-blue-600"
              >
                TRANG CHỦ
              </Link>
            </li>

            {/* Dynamic Menu from dataCategories */}
            {dataCategories?.slice(0, 6).map((item, index) => (
              <li key={index} className="mb-3">
                <Link
                  to={`/${item.slug}`}
                  className="text-gray-700 no-underline py-3 block text-base font-medium border-b border-gray-100 transition-all duration-300 hover:text-blue-600"
                >
                  {item?.name?.toUpperCase() || 'TIN TỨC'}
                </Link>
                {item?.children && (
                  <ul className="list-none ml-4 mt-2 p-0">
                    {item?.children?.slice(0, 4).map((subItem, subIndex) => (
                      <li key={subIndex} className="mb-2">
                        <Link
                          to={`/${subItem.slug}`}
                          className="text-gray-600 no-underline py-2 block text-sm transition-all duration-300 hover:text-blue-600"
                        >
                          {subItem?.name || 'TIN TỨC'}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}

            {/* Contact */}
            <li className="mb-3">
              <Link
                to="/lien-he"
                className="text-gray-700 no-underline py-3 block text-base font-medium border-b border-gray-100 transition-all duration-300 hover:text-blue-600"
              >
                LIÊN HỆ
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
