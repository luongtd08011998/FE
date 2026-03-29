import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getPostByCategory } from '../../services/category';
import Pagination from '../Pagination';
import { Link } from 'react-router-dom';

const CategoryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const articlesPerPage = 10;

  // Parse category and subcategory from pathname
  useEffect(() => {
    const pathname = location.pathname;
    setCategory(pathname.replace('/', ''));
  }, [location.pathname]);

  // Get current page from URL params
  useEffect(() => {
    const page = parseInt(searchParams.get('page')) || 1;
    setCurrentPage(page);
  }, [searchParams]);

  // Fetch articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      if (!category) return;

      setLoading(true);
      try {
        const offset = (currentPage - 1) * articlesPerPage;
        const response = await getPostByCategory(
          category,
          articlesPerPage,
          offset
        );

        if (response.status === 200) {
          // Map API response to component state
          const mappedArticles = response?.data.map((article) => ({
            id: article.id,
            title: article.title,
            excerpt:
              article.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
            image: article.thumbnail,
            date: new Date(article.createAt).toISOString().split('T')[0],
            author: article.author.username,
            category: article.category.name,
            subcategory: article.category.name,
            views: article.view,
            slug: article.slug,
            tags: article.tags || [],
          }));

          setArticles(mappedArticles);
          setTotalPages(response.totalPages);
          setTotalItems(response.totalItems);
          setLoading(false);
        } else {
          console.error('Error fetching articles:', response.message);
          setArticles([]);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [category, currentPage]);

  const categoryNames = {
    'tin-tuc': 'Tin tức',
    'the-thao': 'Thể thao',
    'cong-nghe': 'Công nghệ',
    'kinh-doanh': 'Kinh doanh',
    'giai-tri': 'Giải trí',
    'doi-song': 'Đời sống',
    'gioi-thieu': 'Giới Thiệu',
  };

  const subcategoryNames = {
    'gioi-thieu': 'Giới Thiệu',
    'moi-nhat': 'Mới nhất',
    'tin-nong': 'Tin nóng',
    'trong-nuoc': 'Trong nước',
    'quoc-te': 'Quốc tế',
    'bong-da': 'Bóng đá',
    'bong-ro': 'Bóng rổ',
    tennis: 'Tennis',
    khac: 'Khác',
    'dien-thoai': 'Điện thoại',
    laptop: 'Laptop',
    'ai-tech': 'AI & Tech',
    gaming: 'Gaming',
    'chung-khoan': 'Chứng khoán',
    'ngan-hang': 'Ngân hàng',
    'bat-dong-san': 'Bất động sản',
    'khoi-nghiep': 'Khởi nghiệp',
    'phim-anh': 'Phim ảnh',
    'am-nhac': 'Âm nhạc',
    'sao-viet': 'Sao Việt',
    'thoi-trang': 'Thời trang',
    'suc-khoe': 'Sức khỏe',
    'gia-dinh': 'Gia đình',
    'am-thuc': 'Ẩm thực',
    'du-lich': 'Du lịch',
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Update URL with page parameter
    const newSearchParams = new URLSearchParams(searchParams);
    if (page === 1) {
      newSearchParams.delete('page');
    } else {
      newSearchParams.set('page', page.toString());
    }

    const newUrl = `${location.pathname}${
      newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''
    }`;
    navigate(newUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageError = (e) => {
    e.target.src =
      "data:image/svg+xml,%3Csvg width='400' height='250' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%23374151' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <span className="text-gray-600 font-medium">Đang tải...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Trang chủ
            </Link>
            <span>›</span>
            <Link
              to={`/${category}`}
              className="hover:text-blue-600 transition-colors"
            >
              {categoryNames[category]}
            </Link>
            {subcategory && (
              <>
                <span>›</span>
                <span className="text-gray-900 font-medium">
                  {subcategoryNames[subcategory]}
                </span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {subcategory
              ? subcategoryNames[subcategory]
              : categoryNames[category]}
          </h1>
          <p className="text-gray-600 mt-2">
            {totalItems} bài viết được tìm thấy
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {articles.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-20 h-20 mx-auto"
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
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Chưa có bài viết nào
            </h3>
            <p className="text-gray-500">
              Danh mục này chưa có bài viết nào được đăng.
            </p>
          </div>
        ) : (
          <>
            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <Link to={`/tin-tuc/${article.slug}`} className="block">
                    <div className="aspect-w-16 aspect-h-9 rounded-t-lg overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        onError={handleImageError}
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {article.category}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(article.date).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      <Link
                        to={`/tin-tuc/${article.slug}`}
                        className="no-underline"
                        style={{
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                          overflow: 'hidden',
                        }}
                      >
                        {article.title}
                      </Link>
                    </h3>
                    <p
                      className="text-gray-600 text-sm mb-3"
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                        overflow: 'hidden',
                      }}
                    >
                      {article.excerpt}
                    </p>
                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {article.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors"
                            title={tag.description}
                          >
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Bởi {article.author}</span>
                      <div className="flex items-center space-x-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <span>{article.views.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
