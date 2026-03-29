import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Pagination from "../Pagination";
import { searchArticles } from "../../services/articles";
import { FaSearch, FaNewspaper, FaCalendarAlt, FaEye } from "react-icons/fa";

export default function SearchResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("createAt");
    const [order, setOrder] = useState("desc");

    const itemsPerPage = 10;

    // Get search term from URL params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('q');
        if (query) {
            setSearchTerm(query);
            performSearch(query, 1, sortBy, order);
        }
    }, [location.search]);

    // Helper function to format date with time and timezone +7
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        // Add 7 hours for Vietnam timezone
        const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000));

        return vietnamTime.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const performSearch = async (query, page = 1, sortBy = "createAt", order = "desc") => {
        if (!query.trim()) return;

        try {
            setLoading(true);
            setError(null);

            const offset = (page - 1) * itemsPerPage;
            const response = await searchArticles(query, itemsPerPage, offset, sortBy, order);

            if (response && response.status === 200) {
                setSearchResults(response.data);
                setTotalItems(response.totalItems);
                setTotalPages(Math.ceil(response.totalItems / itemsPerPage));
            } else {
                setError('Không thể tìm kiếm bài viết');
            }
        } catch (err) {
            setError('Lỗi khi tìm kiếm');
            console.error('Error searching articles:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        performSearch(searchTerm, page, sortBy, order);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSortChange = (newSortBy, newOrder) => {
        setSortBy(newSortBy);
        setOrder(newOrder);
        setCurrentPage(1);
        performSearch(searchTerm, 1, newSortBy, newOrder);
    };

    const handleNewSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newSearchTerm = formData.get('search');
        if (newSearchTerm.trim()) {
            navigate(`/tim-kiem?q=${encodeURIComponent(newSearchTerm)}`);
        }
    };

    const handleImageError = (e) => {
        e.target.src = "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%23374151' text-anchor='middle' dy='.3em'%3EHình ảnh%3C/text%3E%3C/svg%3E";
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-6 items-center">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                <FaSearch className="inline mr-2" />
                                Kết quả tìm kiếm
                            </h1>
                            {searchTerm && (
                                <p className="text-gray-600">
                                    Tìm kiếm cho: <span className="font-semibold text-blue-600">"{searchTerm}"</span>
                                    {totalItems > 0 && (
                                        <span className="text-gray-500 ml-2">
                                            ({totalItems} kết quả)
                                        </span>
                                    )}
                                </p>
                            )}
                        </div>

                        {/* Search Form */}
                        <form onSubmit={handleNewSearch} className="flex-shrink-0">
                            <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Tìm kiếm bài viết..."
                                    defaultValue={searchTerm}
                                    className="px-4 py-2 bg-transparent border-none outline-none w-64"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors"
                                >
                                    <FaSearch />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sort Options */}
                {!loading && searchResults.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                        <div className="flex flex-wrap items-center gap-4">
                            <span className="text-gray-600 font-medium">Sắp xếp theo:</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleSortChange("createAt", "desc")}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${sortBy === "createAt" && order === "desc"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                >
                                    Mới nhất
                                </button>
                                <button
                                    onClick={() => handleSortChange("createAt", "asc")}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${sortBy === "createAt" && order === "asc"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                >
                                    Cũ nhất
                                </button>
                                <button
                                    onClick={() => handleSortChange("title", "asc")}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${sortBy === "title" && order === "asc"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                >
                                    A-Z
                                </button>
                                <button
                                    onClick={() => handleSortChange("view", "desc")}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${sortBy === "view" && order === "desc"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                >
                                    Xem nhiều
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Content */}
                <div className="bg-white rounded-lg shadow-md">
                    {loading && (
                        <div className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-600">Đang tìm kiếm...</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-8 text-center">
                            <div className="text-red-500 mb-4">
                                <FaSearch className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-semibold">{error}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Vui lòng thử lại sau
                                </p>
                            </div>
                        </div>
                    )}

                    {!loading && !error && searchResults.length === 0 && searchTerm && (
                        <div className="p-8 text-center">
                            <FaNewspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Không tìm thấy kết quả nào
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Không có bài viết nào khớp với từ khóa "{searchTerm}"
                            </p>
                            <div className="text-sm text-gray-400">
                                <p>Gợi ý:</p>
                                <ul className="mt-2 space-y-1">
                                    <li>• Kiểm tra lại chính tả</li>
                                    <li>• Thử từ khóa khác</li>
                                    <li>• Sử dụng từ khóa ngắn gọn hơn</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {!loading && !error && searchResults.length > 0 && (
                        <div className="p-6">
                            <div className="space-y-6">
                                {searchResults.map((article) => (
                                    <div
                                        key={article.id}
                                        className="flex gap-4 pb-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 p-4 rounded-lg transition-colors"
                                    >
                                        <div className="flex-shrink-0">
                                            <img
                                                src={article?.thumbnail || ""}
                                                alt={article.title}
                                                className="w-32 h-24 object-cover rounded-lg"
                                                onError={handleImageError}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <Link
                                                    to={`/${article.slugCategory}/${article.slug || article.id}`}
                                                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors block"
                                                >
                                                    <div className="line-clamp-2">
                                                        {article.title}
                                                    </div>
                                                </Link>
                                            </div>

                                            <div
                                                className="text-gray-600 text-sm mb-3 line-clamp-2"
                                                dangerouslySetInnerHTML={{
                                                    __html: article.content || "Không có mô tả"
                                                }}
                                            />

                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                {article.tags && article.tags.length > 0 && article.tags.map((tag) => (
                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                                        {tag.name}
                                                    </span>
                                                ))}

                                                <div className="flex items-center gap-1">
                                                    <FaCalendarAlt className="w-3 h-3" />
                                                    <span>{formatDate(article.createAt)}</span>
                                                </div>

                                                {article.view !== undefined && (
                                                    <div className="flex items-center gap-1">
                                                        <FaEye className="w-3 h-3" />
                                                        <span>{article.view} lượt xem</span>
                                                    </div>
                                                )}

                                                {article.author && (
                                                    <div className="flex items-center gap-1">
                                                        <span>Bởi {article.author.username}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && !error && searchResults.length > 0 && totalPages > 1 && (
                        <div className="border-t border-gray-200">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                itemsPerPage={itemsPerPage}
                                totalItems={totalItems}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 