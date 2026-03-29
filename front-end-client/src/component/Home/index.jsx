import React, { useState, useEffect } from 'react';
import Pagination from '../Pagination';
import {
  getAllArticles,
  getArticleByCategoryIdLimit4,
} from '../../services/articles';
import { capitalizeWords, formatDate } from '../../helper/format';
import { Link } from 'react-router-dom';
import { FaHeadset, FaFileInvoice, FaCreditCard } from 'react-icons/fa';

export default function Home() {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem('categories')
      ? JSON.parse(localStorage.getItem('categories'))[0]?.id
      : 0
  );

  // Pagination states
  const [categories, setCategories] = useState([]);
  const [sidebarPage, setSidebarPage] = useState(1);
  const [newsListPage, setNewsListPage] = useState(1);
  const [popularNewsPage, setPopularNewsPage] = useState(1);
  const [postOutstandings, setPostOutstandings] = useState([]);

  // Pagination constants - đặt ở đầu component để tránh nhầm lẫn
  const ITEMS_PER_PAGE = 5;
  const SIDEBAR_ITEMS_PER_PAGE = 7;
  // API states
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalLatestNews, setTotalLatestNews] = useState(0);
  const [totalPostOutstandings, setTotalPostOutstandings] = useState(0);

  // New state for tab articles
  const [tabArticles, setTabArticles] = useState([]);
  const [tabLoading, setTabLoading] = useState(false);
  const [tabError, setTabError] = useState(null);

  // New state for popular news tab
  const [activePopularTab, setActivePopularTab] = useState('views');

  // Fetch latest news from API
  const fetchLatestNews = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const offset = (page - 1) * SIDEBAR_ITEMS_PER_PAGE;
      const response = await getAllArticles(
        SIDEBAR_ITEMS_PER_PAGE,
        offset,
        'createAt',
        'desc'
      );
      if (response && response.status === 200) {
        setLatestNews(response?.data);
        setTotalLatestNews(response.totalItems);
      } else {
        setError('Không thể tải tin mới nhất');
      }
    } catch (err) {
      setError('Lỗi khi tải dữ liệu');
      console.error('Error fetching latest news:', err);
    } finally {
      setLoading(false);
    }
  };
  const fetchPostOutstandings = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const offset = (page - 1) * ITEMS_PER_PAGE;
      const response = await getAllArticles(
        ITEMS_PER_PAGE,
        offset,
        'view',
        'desc'
      );
      if (response && response.status === 200) {
        setPostOutstandings(response?.data);
        setTotalPostOutstandings(response.totalItems);
      }
    } catch (err) {
      console.error('Error fetching post outstandings:', err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch data when component mounts or page changes
  useEffect(() => {
    fetchLatestNews(sidebarPage);
  }, [sidebarPage]);

  useEffect(() => {
    fetchPostOutstandings(popularNewsPage);
  }, [popularNewsPage]);

  useEffect(() => {
    const fetchCategory = async () => {
      if (localStorage.getItem('categories')) {
        const formatCategory = JSON.parse(
          localStorage.getItem('categories')
        )?.map((item) => ({
          id: item?.id,
          name: `${
            item?.name != null && item?.name.toLowerCase() !== 'tin tức'
              ? capitalizeWords(`Tin tức ${item?.name.toLowerCase()}`)
              : capitalizeWords(item?.name?.toLowerCase())
          }`,
          slug: item?.slug,
        }));
        formatCategory.pop();
        setCategories(formatCategory);
      }
    };
    fetchCategory();
  }, []);

  // Fetch initial tab data when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && activeTab) {
      fetchTabArticles(activeTab);
    }
  }, [categories, activeTab]);

  const handleImageError = (e) => {
    e.target.src =
      "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%23374151' text-anchor='middle' dy='.3em'%3EHình ảnh%3C/text%3E%3C/svg%3E";
  };

  // Expanded sidebar news data
  const allSidebarNews = [
    {
      id: 1,
      title: 'Đảm bảo cấp nước sạch trong mùa mưa',
      date: '04/07/2025',
      category: 'Tin tức',
      slug: 'dam-bao-cap-nuoc-sach-trong-mua-mua',
    },
    {
      id: 2,
      title:
        'Đại hội đại biểu Đảng bộ Tổng Công ty Cấp nước Sài Gòn lần thứ V, nhiệm kỳ 2025-2030',
      date: '27/06/2025',
      category: 'Hoạt động',
      slug: 'dai-hoi-dai-bieu-dang-bo-tong-cong-ty-cap-nuoc-sai-gon',
    },
    {
      id: 3,
      title: 'Nhấn mạnh các sáng kiến đảm bảo công tác cấp nước an toàn',
      date: '18/06/2025',
      category: 'Công nghệ',
      slug: 'nhan-manh-cac-sang-kien-dam-bao-cong-tac-cap-nuoc-an-toan',
    },
    {
      id: 4,
      title: 'Chuẩn hóa quy trình cấp nước',
      date: '18/06/2025',
      category: 'Quy định',
      slug: 'chuan-hoa-quy-trinh-cap-nuoc',
    },
    {
      id: 5,
      title: 'Sự hài lòng của khách hàng là thước đo hiệu quả',
      date: '18/06/2025',
      category: 'Dịch vụ',
      slug: 'su-hai-long-cua-khach-hang-la-thuoc-do-hieu-qua',
    },
    {
      id: 6,
      title:
        "Công ty CPCN Gia Định tổ chức lớp đào tạo 'Ứng dụng AI trong công việc'",
      date: '06/06/2025',
      category: 'Đào tạo',
      slug: 'cong-ty-cpcn-gia-dinh-to-chuc-lop-dao-tao-ung-dung-ai',
    },
    {
      id: 7,
      title:
        'SAWACO: Đổi mới sáng tạo và chuyển đổi số phục vụ cung cấp nước sạch',
      date: '06/06/2025',
      category: 'Chuyển đổi số',
      slug: 'sawaco-doi-moi-sang-tao-va-chuyen-doi-so-phuc-vu-cung-cap-nuoc-sach',
    },
    {
      id: 8,
      title: 'Triển khai công nghệ IoT trong hệ thống cấp nước',
      date: '05/06/2025',
      category: 'Công nghệ',
      slug: 'trien-khai-cong-nghe-iot-trong-he-thong-cap-nuoc',
    },
    {
      id: 9,
      title: 'Quy trình xử lý nước thải sinh hoạt mới',
      date: '04/06/2025',
      category: 'Môi trường',
      slug: 'quy-trinh-xu-ly-nuoc-thai-sinh-hoat-moi',
    },
    {
      id: 10,
      title: 'Chương trình tiết kiệm nước cho cộng đồng',
      date: '03/06/2025',
      category: 'Cộng đồng',
      slug: 'chuong-trinh-tiet-kiem-nuoc-cho-cong-dong',
    },
    {
      id: 11,
      title: 'Hệ thống giám sát chất lượng nước tự động',
      date: '02/06/2025',
      category: 'Công nghệ',
      slug: 'he-thong-giam-sat-chat-luong-nuoc-tu-dong',
    },
    {
      id: 12,
      title: 'Kế hoạch mở rộng hệ thống cấp nước năm 2025',
      date: '01/06/2025',
      category: 'Dự án',
      slug: 'ke-hoach-mo-rong-he-thong-cap-nuoc-nam-2025',
    },
    {
      id: 13,
      title: 'Đào tạo kỹ thuật viên vận hành hệ thống cấp nước',
      date: '31/05/2025',
      category: 'Đào tạo',
      slug: 'dao-tao-ky-thuat-vien-van-hanh-he-thong-cap-nuoc',
    },
    {
      id: 14,
      title: 'Ứng dụng trí tuệ nhân tạo trong quản lý nước',
      date: '30/05/2025',
      category: 'AI',
      slug: 'ung-dung-tri-tue-nhan-tao-trong-quan-ly-nuoc',
    },
    {
      id: 15,
      title: 'Chính sách hỗ trợ người dân sử dụng nước sạch',
      date: '29/05/2025',
      category: 'Chính sách',
      slug: 'chinh-sach-ho-tro-nguoi-dan-su-dung-nuoc-sach',
    },
  ];

  // Expanded news list data
  const allNewsList = [
    {
      id: 1,
      title:
        "Thư mời chào giá dự án 'Sửa chữa, lớp mai tôn khu vực chứa máy lý tâm 2 tại Nhà máy bể tông...'",
      date: '08/07/2025',
      image: 'https://picsum.photos/300/200?random=10',
      category: 'Dự án',
      slug: 'thu-moi-chao-gia-du-an-sua-chua-lop-mai-ton',
    },
    {
      id: 2,
      title:
        'Hội nghị Ban Thường vụ Hội Cấp Thoát nước Việt Nam nhiệm kỳ VI (2020 -2025)',
      date: '07/07/2025',
      image: 'https://picsum.photos/300/200?random=11',
      category: 'Hội nghị',
      slug: 'hoi-nghi-ban-thuong-vu-hoi-cap-thoat-nuoc-viet-nam',
    },
    {
      id: 3,
      title: 'Lễ phát thường học sinh giỏi và trao học bổng Nguyễn Thị Định',
      date: '07/07/2025',
      image: 'https://picsum.photos/300/200?random=12',
      category: 'Giáo dục',
      slug: 'le-phat-thuong-hoc-sinh-gioi-va-trao-hoc-bong-nguyen-thi-dinh',
    },
    {
      id: 4,
      title: 'Kỷ niệm 55 năm thực hiện di chúc của Chủ tịch Hồ Chí Minh',
      date: '15/05/2025',
      image: 'https://picsum.photos/300/200?random=13',
      category: 'Kỷ niệm',
      slug: 'ky-niem-55-nam-thuc-hien-di-chuc-cua-chu-tich-ho-chi-minh',
    },
    {
      id: 5,
      title: 'Triển khai dự án cấp nước sạch cho vùng nông thôn',
      date: '14/05/2025',
      image: 'https://picsum.photos/300/200?random=14',
      category: 'Dự án',
      slug: 'trien-khai-du-an-cap-nuoc-sach-cho-vung-nong-thon',
    },
    {
      id: 6,
      title: 'Công nghệ lọc nước tiên tiến mới nhất năm 2025',
      date: '13/05/2025',
      image: 'https://picsum.photos/300/200?random=15',
      category: 'Công nghệ',
      slug: 'cong-nghe-loc-nuoc-tien-tien-moi-nhat-nam-2025',
    },
    {
      id: 7,
      title: 'Hệ thống cấp nước thông minh cho thành phố tương lai',
      date: '12/05/2025',
      image: 'https://picsum.photos/300/200?random=16',
      category: 'Smart City',
      slug: 'he-thong-cap-nuoc-thong-minh-cho-thanh-pho-tuong-lai',
    },
    {
      id: 8,
      title: 'Chương trình bảo vệ nguồn nước cho thế hệ tương lai',
      date: '11/05/2025',
      image: 'https://picsum.photos/300/200?random=17',
      category: 'Môi trường',
      slug: 'chuong-trinh-bao-ve-nguon-nuoc-cho-the-he-tuong-lai',
    },
    {
      id: 9,
      title: 'Đào tạo nguồn nhân lực chuyên nghiệp trong ngành cấp nước',
      date: '10/05/2025',
      image: 'https://picsum.photos/300/200?random=18',
      category: 'Đào tạo',
      slug: 'dao-tao-nguon-nhan-luc-chuyen-nghiep-trong-nganh-cap-nuoc',
    },
    {
      id: 10,
      title: 'Ứng dụng blockchain trong quản lý chất lượng nước',
      date: '09/05/2025',
      image: 'https://picsum.photos/300/200?random=19',
      category: 'Blockchain',
      slug: 'ung-dung-blockchain-trong-quan-ly-chat-luong-nuoc',
    },
    {
      id: 11,
      title: 'Giải pháp tiết kiệm nước thông minh cho hộ gia đình',
      date: '08/05/2025',
      image: 'https://picsum.photos/300/200?random=20',
      category: 'Giải pháp',
      slug: 'giai-phap-tiet-kiem-nuoc-thong-minh-cho-ho-gia-dinh',
    },
    {
      id: 12,
      title: 'Hội thảo quốc tế về công nghệ xử lý nước',
      date: '07/05/2025',
      image: 'https://picsum.photos/300/200?random=21',
      category: 'Hội thảo',
      slug: 'hoi-thao-quoc-te-ve-cong-nghe-xu-ly-nuoc',
    },
  ];

  // Expanded popular news data
  const allPopularNews = [
    {
      id: 1,
      title: 'Định mức tiền nước theo nhân khẩu: Có lợi hơn cho người dân',
      date: '08/07/2025',
      image: 'https://picsum.photos/300/200?random=30',
      views: '1.2K',
      slug: 'dinh-muc-tien-nuoc-theo-nhan-khau-co-loi-hon-cho-nguoi-dan',
    },
    {
      id: 2,
      title: 'Quy trình xử lý nước thải công nghiệp mới nhất',
      date: '07/07/2025',
      image: 'https://picsum.photos/300/200?random=31',
      views: '980',
      slug: 'quy-trinh-xu-ly-nuoc-thai-cong-nghiep-moi-nhat',
    },
    {
      id: 3,
      title: 'Công nghệ lọc nước tiên tiến nhất hiện nay',
      date: '06/07/2025',
      image: 'https://picsum.photos/300/200?random=32',
      views: '756',
      slug: 'cong-nghe-loc-nuoc-tien-tien-nhat-hien-nay',
    },
    {
      id: 4,
      title: 'Hệ thống cấp nước thông minh cho thành phố',
      date: '05/07/2025',
      image: 'https://picsum.photos/300/200?random=33',
      views: '645',
      slug: 'he-thong-cap-nuoc-thong-minh-cho-thanh-pho',
    },
    {
      id: 5,
      title: 'Ứng dụng AI trong kiểm soát chất lượng nước',
      date: '04/07/2025',
      image: 'https://picsum.photos/300/200?random=34',
      views: '532',
      slug: 'ung-dung-ai-trong-kiem-soat-chat-luong-nuoc',
    },
    {
      id: 6,
      title: 'Mô hình quản lý nước bền vững cho đô thị',
      date: '03/07/2025',
      image: 'https://picsum.photos/300/200?random=35',
      views: '489',
      slug: 'mo-hinh-quan-ly-nuoc-ben-vung-cho-do-thi',
    },
    {
      id: 7,
      title: 'Tiêu chuẩn nước sạch mới theo WHO 2025',
      date: '02/07/2025',
      image: 'https://picsum.photos/300/200?random=36',
      views: '423',
      slug: 'tieu-chuan-nuoc-sach-moi-theo-who-2025',
    },
    {
      id: 8,
      title: 'Hệ thống cảnh báo sớm ô nhiễm nguồn nước',
      date: '01/07/2025',
      image: 'https://picsum.photos/300/200?random=37',
      views: '398',
      slug: 'he-thong-canh-bao-som-o-nhiem-nguon-nuoc',
    },
    {
      id: 9,
      title: 'Giải pháp xử lý nước nhiễm mặn hiệu quả',
      date: '30/06/2025',
      image: 'https://picsum.photos/300/200?random=38',
      views: '367',
      slug: 'giai-phap-xu-ly-nuoc-nhiem-man-hieu-qua',
    },
    {
      id: 10,
      title: 'Công nghệ nano trong xử lý nước thải',
      date: '29/06/2025',
      image: 'https://picsum.photos/300/200?random=39',
      views: '345',
      slug: 'cong-nghe-nano-trong-xu-ly-nuoc-thai',
    },
    {
      id: 11,
      title: 'Kế hoạch phát triển hạ tầng cấp nước 2025-2030',
      date: '28/06/2025',
      image: 'https://picsum.photos/300/200?random=40',
      views: '321',
      slug: 'ke-hoach-phat-trien-ha-tang-cap-nuoc-2025-2030',
    },
    {
      id: 12,
      title: 'Đổi mới công nghệ trong ngành cấp nước Việt Nam',
      date: '27/06/2025',
      image: 'https://picsum.photos/300/200?random=41',
      views: '298',
      slug: 'doi-moi-cong-nghe-trong-nganh-cap-nuoc-viet-nam',
    },
  ];

  // Pagination logic
  const getSidebarNews = () => {
    const startIndex = (sidebarPage - 1) * SIDEBAR_ITEMS_PER_PAGE;
    const endIndex = startIndex + SIDEBAR_ITEMS_PER_PAGE;
    return allSidebarNews.slice(startIndex, endIndex);
  };

  const getNewsList = () => {
    const startIndex = (newsListPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return allNewsList.slice(startIndex, endIndex);
  };

  const getPopularNews = () => {
    const startIndex = (popularNewsPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return allPopularNews.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const sidebarTotalPages = Math.ceil(
    allSidebarNews.length / SIDEBAR_ITEMS_PER_PAGE
  );
  const newsListTotalPages = Math.ceil(allNewsList.length / ITEMS_PER_PAGE);
  const popularNewsTotalPages = Math.ceil(
    allPopularNews.length / ITEMS_PER_PAGE
  );

  // Fetch articles by category for tabs
  const fetchTabArticles = async (categoryId) => {
    try {
      setTabLoading(true);
      setTabError(null);

      const response = await getArticleByCategoryIdLimit4(categoryId);

      if (response && response.status === 200) {
        // Map API response to component format
        const mappedArticles = response.data.map((article) => ({
          id: article.id,
          title: article.title,
          image: article.thumbnail,
          date: formatDate(article.createAt),
          category: article.category.name,
          slug: article.slug,
          tags: article.tags || [],
          slugCategory: article.slugCategory,
        }));

        setTabArticles(mappedArticles);
      } else {
        setTabError('Không thể tải bài viết');
        setTabArticles([]);
      }
    } catch (error) {
      setTabError('Lỗi khi tải dữ liệu');
      setTabArticles([]);
      console.error('Error fetching tab articles:', error);
    } finally {
      setTabLoading(false);
    }
  };

  const handleClickTab = async (categoryId) => {
    setActiveTab(categoryId);
    await fetchTabArticles(categoryId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Content - Hero Slider */}
          <div className="lg:col-span-3">
            {/* Hero Slider */}
            <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 rounded-lg shadow-xl overflow-hidden mb-6 border-4 border-yellow-400 relative">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                  alt="Hero Tin Tức 24/7"
                  className="w-full h-80 object-cover"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
                  <h2 className="text-4xl font-extrabold mb-3 drop-shadow-lg">
                    Cấp nước Tóc Tiên - Nước sạch cho mọi nhà
                  </h2>
                  <p className="text-lg text-yellow-200 mb-4 font-semibold drop-shadow">
                    Cấp nước Tóc Tiên đã góp phần cung cấp nước sạch cho toàn bộ
                    khu công nghiệp Phú Mỹ và các khu dân cư Phường Phú Mỹ,
                    Phường Tân Phước TP Hồ Chí Minh.
                  </p>
                  <div className="flex items-center gap-4 text-base font-medium">
                    <span className="bg-yellow-400 text-blue-900 px-4 py-1 rounded-full shadow">
                      Tin Nổi Bật
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full">
                      {new Date().toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
                <div className="absolute top-6 right-6 bg-yellow-400 text-blue-900 px-4 py-2 rounded-full font-bold shadow-lg text-lg z-20 animate-bounce">
                  Cấp nước Tóc Tiên
                </div>
              </div>

              {/* Thanh điều hướng nhỏ các tin nổi bật */}
              {/* <div className="flex gap-2 p-4 bg-gradient-to-r from-yellow-100 via-white to-blue-100">
                {heroNews.map((news, index) => (
                  <div key={news.id} className="flex-1 cursor-pointer group transition-transform hover:scale-105">
                    <a href={`/tin-tuc/${news.slug || news.id}`}>
                      <img
                        src={news.image}
                        alt=""
                        className="w-full h-16 object-cover rounded"
                        onError={handleImageError}
                      />
                      <p className="text-xs mt-1 text-gray-600 line-clamp-2">{news.title}</p>
                    </a>
                  </div>
                ))}
              </div> */}
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="flex border-b overflow-x-auto">
                {categories?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => handleClickTab(tab?.id)}
                    className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                      activeTab === tab?.id
                        ? 'border-blue-600 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab?.name}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {tabLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <span className="text-gray-600">Đang tải...</span>
                    </div>
                  </div>
                ) : tabError ? (
                  <div className="text-center py-8">
                    <div className="text-red-500 mb-2">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600">{tabError}</p>
                  </div>
                ) : tabArticles?.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600">Chưa có bài viết nào</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tabArticles?.map((news) => (
                      <div
                        key={news.id}
                        className="flex gap-4 group cursor-pointer"
                      >
                        <Link
                          to={`/${news?.slugCategory}/${news.slug}`}
                          className="flex gap-4 w-full"
                        >
                          <img
                            src={news?.thumbnail || ''}
                            alt=""
                            className="w-20 h-16 object-cover rounded flex-shrink-0"
                            onError={handleImageError}
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {news.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                              <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                                {news.category}
                              </span>
                              <span>{news.date}</span>
                            </div>
                            {/* Tags */}
                            {news.tags && news.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {news.tags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag.id}
                                    className="bg-blue-100 text-blue-700 px-1 py-0.5 rounded text-xs"
                                    title={tag.description}
                                  >
                                    #{tag.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Giới thiệu Website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
                <h3 className="font-bold text-lg mb-2">
                  Chào mừng bạn đến với Website Công ty TNHH Cấp nước Tóc Tiên
                </h3>
                <p className="text-sm opacity-90">
                  Chúng tôi cung cấp dịch vụ cấp nước sạch, an toàn và ổn định
                  cho khu vực Tóc Tiên và các vùng lân cận.
                </p>
                <p className="text-sm opacity-90">
                  Website giúp quý khách tra cứu thông tin dịch vụ, theo dõi
                  thông báo ngừng nước, và liên hệ hỗ trợ nhanh chóng.
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <h3 className="font-bold text-lg mb-2">
                  Dễ dàng kết nối & sử dụng dịch vụ
                </h3>
                <p className="text-sm opacity-90">
                  Đăng ký tài khoản để nhận thông báo mới nhất, quản lý thông
                  tin sử dụng nước và nhận hỗ trợ từ đội ngũ kỹ thuật.
                </p>
                <div className="mt-4">
                  <div className="bg-white w-16 h-16 rounded flex items-center justify-center text-blue-600 font-bold text-xl">
                    <span>
                      H<sub>2</sub>O
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-900">
                  Tin mới nhất
                </h3>
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <span className="text-gray-600">Đang tải...</span>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8">
                      <div className="text-red-500 mb-2">
                        <svg
                          className="w-12 h-12 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-600">{error}</p>
                    </div>
                  ) : latestNews?.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-2">
                        <svg
                          className="w-12 h-12 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-600">Chưa có tin mới</p>
                    </div>
                  ) : (
                    latestNews?.map((news) => (
                      <div key={news.id} className="group cursor-pointer">
                        <Link to={`/${news?.slugCategory}/${news.slug}`}>
                          <div className="flex items-start gap-2 mb-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-sm line-clamp-2">
                              {news.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2 ml-4 text-xs text-gray-500">
                            {news.category && (
                              <>
                                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                                  {news?.tags?.length > 0
                                    ? news?.tags
                                        ?.map((tag) => tag.name)
                                        .join(', ')
                                    : ''}
                                </span>
                                <span>•</span>
                              </>
                            )}
                            <span>{formatDate(news?.createAt)}</span>
                          </div>
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Sidebar Pagination */}
              {!loading && !error && (
                <div className="border-t border-gray-200">
                  <Pagination
                    currentPage={sidebarPage}
                    totalPages={Math.ceil(
                      totalLatestNews / SIDEBAR_ITEMS_PER_PAGE
                    )}
                    onPageChange={setSidebarPage}
                    itemsPerPage={SIDEBAR_ITEMS_PER_PAGE}
                    totalItems={totalLatestNews}
                  />
                </div>
              )}
            </div>

            {/* Banner bổ sung - Cập nhật nội dung mới */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-4 shadow-md">
                <h4 className="font-bold text-white mb-2">
                  THÔNG BÁO QUAN TRỌNG
                </h4>
                <p className="text-sm text-white opacity-90">
                  Lịch bảo trì hệ thống cấp nước toàn tỉnh vào ngày 15/07/2024.
                  Quý khách vui lòng dự trữ nước và theo dõi thông báo mới nhất
                  trên website.
                </p>
              </div>
              <div className="bg-gradient-to-r from-pink-500 to-pink-700 rounded-lg p-4 shadow-md">
                <h4 className="font-bold text-white mb-2">
                  CHƯƠNG TRÌNH KHUYẾN MÃI
                </h4>
                <p className="text-sm text-white opacity-90">
                  Giảm 10% cho khách hàng đăng ký dịch vụ nước trực tuyến trong
                  tháng 7. Đăng ký ngay để nhận ưu đãi!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white py-8 px-4 rounded-lg shadow-md mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Hỗ trợ trực tuyến */}
            <div>
              <div className="flex justify-center mb-2">
                <span className="text-4xl text-yellow-600">
                  <FaHeadset />
                </span>
              </div>
              <div className="text-orange-500 font-semibold text-sm mb-1">
                Hotline 0865379119
              </div>
              <div className="font-bold mb-1">HỖ TRỢ TRỰC TUYẾN</div>
              <div className="text-gray-600 text-sm mb-2">
                Tư vấn trực tuyến, hỗ trợ đăng ký lắp đặt, sửa chữa nước. Hỗ trợ
                sử dụng và bảo hành đồng hồ. Tư vấn điều chỉnh giá bán, giải đáp
                mọi thắc mắc.
              </div>
            </div>
            {/* Tra cứu hóa đơn điện tử */}
            <div>
              <div className="flex justify-center mb-2">
                <span className="text-4xl text-yellow-600">
                  <FaFileInvoice />
                </span>
              </div>
              <div className="font-bold mb-1">TRA CỨU HÓA ĐƠN ĐIỆN TỬ</div>
              <div className="text-gray-600 text-sm">
                Từ 2024, Công ty Tóc Tiên đã triển khai sử dụng hóa đơn điện tử
                thay thế hóa đơn giấy. Khách hàng tra cứu trực tuyến hóa đơn
                tiền nước tại địa bàn tỉnh Bà Rịa-Vũng Tàu.
              </div>
            </div>
            {/* Thanh toán trực tuyến */}
            <div>
              <div className="flex justify-center mb-2">
                <span className="text-4xl text-yellow-600">
                  <FaCreditCard />
                </span>
              </div>
              <div className="font-bold mb-1">THANH TOÁN TRỰC TUYẾN</div>
              <div className="text-gray-600 text-sm">
                Khách hàng Tóc Tiên có thể thanh toán hóa đơn nước trực tuyến,
                qua các ngân hàng liên kết hoặc ví điện tử VNPAY/Pay
                Bills/Website của nhà cung cấp.
              </div>
            </div>
          </div>
        </div>

        {/* Bài viết phổ biến chiếm toàn bộ chiều ngang */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-blue-600">
                Bài viết phổ biến
              </h3>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => {
                    setActivePopularTab('views');
                    setPopularNewsPage(1);
                  }}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    activePopularTab === 'views'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Xem nhiều
                  </span>
                </button>
                <button
                  onClick={() => {
                    setActivePopularTab('likes');
                    setPopularNewsPage(1);
                  }}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    activePopularTab === 'likes'
                      ? 'bg-red-600 text-white'
                      : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Được yêu thích
                  </span>
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <span className="text-gray-600">Đang tải...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="text-red-500 mb-2">
                    <svg
                      className="w-12 h-12 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600">{error}</p>
                </div>
              ) : postOutstandings && postOutstandings.length > 0 ? (
                postOutstandings.map((news) => (
                  <div
                    key={news.id}
                    className="flex gap-4 group cursor-pointer pb-4 border-b border-gray-100 last:border-b-0"
                  >
                    <Link
                      to={`/${news?.slugCategory}/${news.slug || news.id}`}
                      className="flex gap-4 w-full"
                    >
                      <img
                        src={news?.thumbnail || ''}
                        alt={news?.title || 'Ảnh bài viết'}
                        className="w-24 h-18 object-cover rounded flex-shrink-0"
                        onError={handleImageError}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                          {news.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{formatDate(news?.createAt)}</span>
                          <span>•</span>
                          <span
                            className={`flex items-center gap-1 ${
                              activePopularTab === 'views'
                                ? 'text-blue-600 font-medium'
                                : ''
                            }`}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {news?.view || 0}
                          </span>
                          <span>•</span>
                          <span
                            className={`flex items-center gap-1 ${
                              activePopularTab === 'likes'
                                ? 'text-red-600 font-medium'
                                : ''
                            }`}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {news?.quantityLike || 0}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <svg
                      className="w-12 h-12 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600">Không có bài viết nào</p>
                </div>
              )}
            </div>
          </div>

          {/* Phân trang bài viết phổ biến */}
          {!loading && !error && totalPostOutstandings > 0 && (
            <Pagination
              currentPage={popularNewsPage}
              totalPages={Math.ceil(totalPostOutstandings / ITEMS_PER_PAGE)}
              onPageChange={setPopularNewsPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={totalPostOutstandings}
            />
          )}
        </div>
      </div>
    </div>
  );
}
