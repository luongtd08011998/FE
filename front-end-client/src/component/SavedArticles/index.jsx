import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectIsLogin, selectUser } from '../../redux/slice/useSlice';
import Pagination from '../Pagination';
import { getAllBookMarkByUser } from '../../services/user';
import { deleteBookmark } from '../../services/bookmark';
import { toast } from 'react-toastify';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const SavedArticles = () => {
    const [articles, setArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const isLogin = useSelector(selectIsLogin);
    const user = useSelector(selectUser);
    const articlesPerPage = 9;

    // Hàm lấy danh sách bookmark từ API
    const fetchBookmarks = async () => {
        try {
            setLoading(true);
            const response = await getAllBookMarkByUser();

            if (response?.status === 200) {
                const bookmarkData = response.data;
                setArticles(bookmarkData);
                setTotalPages(response.totalPages || 1);
                setTotalItems(response.totalItems || bookmarkData.length);
            } else {
                toast.error(response?.message || 'Có lỗi xảy ra khi tải danh sách bookmark');
                setArticles([]);
            }
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
            toast.error('Có lỗi xảy ra khi tải danh sách bookmark');
            setArticles([]);
        } finally {
            setLoading(false);
        }
    };

    // Hàm xóa bookmark với confirm
    const handleRemoveFromSaved = (articleId, articleTitle) => {
        Modal.confirm({
            title: 'Xác nhận bỏ lưu',
            icon: <ExclamationCircleOutlined />,
            content: `Bạn có chắc chắn muốn bỏ lưu bài viết "${articleTitle}"?`,
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            okType: 'danger',
            confirmLoading: confirmLoading,
            onOk: async () => {
                try {
                    setConfirmLoading(true);
                    const response = await deleteBookmark(user?.id, articleId);

                    if (response?.status === 200) {
                        toast.success('Đã bỏ lưu bài viết thành công');
                        // Cập nhật lại danh sách sau khi xóa
                        setArticles(prev => prev.filter(article => article.articlesId !== articleId));
                        setTotalItems(prev => prev - 1);
                    } else {
                        toast.error(response?.message || 'Có lỗi xảy ra khi bỏ lưu bài viết');
                    }
                } catch (error) {
                    console.error('Error removing bookmark:', error);
                    toast.error('Có lỗi xảy ra khi bỏ lưu bài viết');
                } finally {
                    setConfirmLoading(false);
                }
            },
            onCancel() {
                // Không làm gì khi cancel
            },
        });
    };

    useEffect(() => {
        if (isLogin && user?.id) {
            fetchBookmarks();
        } else {
            setArticles([]);
            setLoading(false);
        }
    }, [isLogin, user?.id]);

    // Tính toán phân trang
    const startIndex = (currentPage - 1) * articlesPerPage;
    const currentArticles = articles.slice(startIndex, startIndex + articlesPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleImageError = (e) => {
        e.target.src = "data:image/svg+xml,%3Csvg width='400' height='250' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%23374151' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
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
                    <p className="text-gray-500 mb-4">Vui lòng đăng nhập để xem bài viết đã lưu</p>
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
                        <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
                        <span>›</span>
                        <span className="text-gray-900 font-medium">Bài viết đã lưu</span>
                    </div>
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Bài viết đã lưu</h1>
                            <p className="text-gray-600">
                                {totalItems} bài viết đã được lưu
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {articles.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Chưa có bài viết nào được lưu</h3>
                        <p className="text-gray-500 mb-4">Bắt đầu lưu những bài viết yêu thích để đọc sau</p>
                        <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Khám phá bài viết
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Articles Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {currentArticles.map((article) => (
                                <article key={article.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 relative">
                                    <Link to={`/${article.slugCategory}/${article.slug}`} className="block">
                                        <div className="aspect-w-16 aspect-h-9 rounded-t-lg overflow-hidden">
                                            <img
                                                src={`${article?.thumbnail || 'https://picsum.photos/400/250?random=' + article.articlesId}`}
                                                alt={article.nameArticles}
                                                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                                onError={handleImageError}
                                            />
                                        </div>
                                    </Link>

                                    {/* Remove from saved button */}
                                    <button
                                        onClick={() => handleRemoveFromSaved(article.articlesId, article.nameArticles)}
                                        className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300 flex items-center justify-center shadow-lg"
                                        title="Bỏ lưu bài viết"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                    <div className="p-4">
                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                                            <div className="flex items-center space-x-2">
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                                    {article.categoryName}
                                                </span>
                                                <span>•</span>
                                                <span>{new Date(article.articlesCreateAt).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                                            <Link to={`/${article.slugCategory}/${article.slug}`} className="no-underline" style={{
                                                display: '-webkit-box',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: 2,
                                                overflow: 'hidden'
                                            }}>
                                                {article.nameArticles}
                                            </Link>
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-3" style={{
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: 3,
                                            overflow: 'hidden'
                                        }}>
                                            {/* Tạo excerpt từ content HTML */}
                                            {article.content ?
                                                article.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
                                                : 'Không có mô tả'
                                            }
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span>Bởi {article.author}</span>
                                            <div className="flex items-center space-x-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                <span>{article.view?.toLocaleString() || 0}</span>
                                            </div>
                                        </div>
                                        <div className="mt-2 pt-2 border-t border-gray-100">
                                            <div className="flex items-center text-xs text-gray-500">
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                </svg>
                                                Đã lưu {new Date(article.createAt).toLocaleDateString('vi-VN')}
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

export default SavedArticles; 