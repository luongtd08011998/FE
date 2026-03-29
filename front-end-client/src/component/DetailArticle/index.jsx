import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { selectIsLogin, selectUser } from "../../redux/slice/useSlice";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getArticleBySlug, increaseView } from "../../services/articles";
import { additionalLike, unLike } from "../../services/like";
import { addBookmark, deleteBookmark } from "../../services/bookmark";
import { getCommentByArticleId, addComment, deleteComment } from "../../services/comment";
import { showToast } from "../../utils/toast";
import { capitalizeWords, formatDate } from "../../helper/format";
import { getPostWithCategoryAndArticle } from "../../services/category";
import {
    FaEye,
    FaHeart,
    FaRegHeart,
    FaComment,
    FaBookmark,
    FaRegBookmark,
    FaShare,
    FaChevronRight,
    FaThumbsUp,
    FaReply,
    FaSpinner,
    FaPaperPlane,
    FaUser,
    FaTimes,
    FaFacebook,
    FaTwitter,
    FaLinkedin,
    FaWhatsapp,
    FaTelegram,
    FaCopy,
    FaLink
} from 'react-icons/fa';

// Cấu hình ReactQuill nâng cao
const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
    ],
    clipboard: {
        matchVisual: false,
    }
};

const quillFormats = [
    'header', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'align',
    'link', 'image'
];

export default function DetailArticle() {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [commentLikes, setCommentLikes] = useState({});
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [showShareModal, setShowShareModal] = useState(false);

    const isLogin = useSelector(selectIsLogin);
    const user = useSelector(selectUser);


    // Helper function to format date with timezone +7
    const formatDate = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);

        return date.toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };


    useEffect(() => {
        const increaseViewArticle = async () => {
            if (article) {
                await increaseView(article?.id);
            }
        };
        increaseViewArticle();
    }, [article]);

    // Function to fetch related articles
    const fetchRelatedArticles = async (categoryId, articlesId) => {
        try {
            const response = await getPostWithCategoryAndArticle(categoryId, articlesId);
            if (response && response.status === 200) {
                setRelatedArticles(response.data);
            } else {
                setRelatedArticles([]);
            }
        } catch (error) {
            console.error("Error fetching related articles:", error);
            setRelatedArticles([]);
        }
    };

    // Hàm cập nhật metadata động cho từng bài viết
    const updateMetaTags = (article) => {
        if (!article) return;

        // Cập nhật title
        document.title = `${article.title} - Công ty Cổ phần Cấp nước Tân Hòa`;

        // Cập nhật Open Graph tags
        const ogTags = {
            'og:title': article.title,
            'og:description': article.description || article.content?.replace(/<[^>]*>/g, '').substring(0, 160) + '...',
            'og:image': article.thumbnail || '/logo-news.svg',
            'og:url': window.location.href,
            'og:type': 'article',
            'og:site_name': 'Công ty Cổ phần Cấp nước Tân Hòa',
            'og:locale': 'vi_VN'
        };

        // Cập nhật Twitter tags
        const twitterTags = {
            'twitter:card': 'summary_large_image',
            'twitter:title': article.title,
            'twitter:description': article.description || article.content?.replace(/<[^>]*>/g, '').substring(0, 160) + '...',
            'twitter:image': article.thumbnail || '/logo-news.svg',
            'twitter:url': window.location.href
        };

        // Cập nhật meta tags
        Object.entries(ogTags).forEach(([property, content]) => {
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('property', property);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        });

        Object.entries(twitterTags).forEach(([name, content]) => {
            let meta = document.querySelector(`meta[name="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('name', name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        });
    };

    // Hàm chia sẻ đến Facebook với cải thiện
    const shareToFacebook = () => {
        const url = encodeURIComponent(window.location.href);
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;

        // Mở popup với kích thước lớn hơn
        const popup = window.open(shareUrl, '_blank', 'width=600,height=500,scrollbars=yes,resizable=yes');

        // Focus vào popup
        if (popup) {
            popup.focus();
        }
    };

    // Hàm chia sẻ đến Twitter/X với cải thiện
    const shareToTwitter = () => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(article?.title || '');
        const shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}&hashtags=TanHoaWater,CapNuoc`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    // Hàm chia sẻ đến LinkedIn với cải thiện
    const shareToLinkedIn = () => {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(article?.title || '');
        const summary = encodeURIComponent(article?.description || '');
        const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`;
        window.open(shareUrl, '_blank', 'width=600,height=500');
    };

    // Hàm chia sẻ đến WhatsApp
    const shareToWhatsApp = () => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`${article?.title || ''} - ${window.location.href}`);
        const shareUrl = `https://wa.me/?text=${text}`;
        window.open(shareUrl, '_blank');
    };

    // Hàm chia sẻ đến Telegram
    const shareToTelegram = () => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(article?.title || '');
        const shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
        window.open(shareUrl, '_blank');
    };

    // Hàm copy link
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            showToast.success('Đã sao chép link vào clipboard!');
        } catch (err) {
            showToast.error('Không thể sao chép link');
        }
    };

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setIsLoading(true);
                const response = await getArticleBySlug(slug);
                if (response && response.status === 200) {
                    const articleData = response?.data;
                    setArticle(articleData);
                    setLikeCount(articleData?.quantityLike || 0);
                    setIsLiked(articleData?.like || false);
                    setIsSaved(articleData?.bookmark || false);

                    // Cập nhật metadata cho bài viết
                    updateMetaTags(articleData);

                    await fetchComments(slug);
                    await fetchRelatedArticles(articleData?.category?.id, articleData?.id);
                } else {
                    showToast.error("Không tìm thấy bài viết hoặc đã xảy ra lỗi");
                }
            } catch (error) {
                showToast.error("Đã xảy ra lỗi khi tải bài viết");
                console.error("Error fetching article:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticle();
    }, [slug]);

    // Function to fetch comments
    const fetchComments = async (articleSlug) => {
        try {
            const response = await getCommentByArticleId(articleSlug);
            if (response && response.status === 200) {
                // Map API response to component format
                const mappedComments = response.data.map(comment => ({
                    id: comment.id,
                    user: {
                        name: comment.username || "User",
                        avatar: comment.avatar || "https://picsum.photos/50/50?random=user"
                    },
                    username: comment.username, // Thêm username để kiểm tra quyền xóa
                    content: comment.content,
                    htmlContent: comment.content,
                    createdAt: comment.createdAt, // API mới dùng createdAt
                    likes: 0, // API chưa có likes cho comment
                    replies: comment.replies?.map(reply => ({
                        id: reply.id,
                        user: {
                            name: reply.username || "User",
                            avatar: reply.avatar || "https://picsum.photos/50/50?random=user"
                        },
                        username: reply.username, // Thêm username để kiểm tra quyền xóa
                        content: reply.content,
                        htmlContent: reply.content,
                        createdAt: reply.createdAt, // API mới dùng createdAt
                        likes: 0,
                        parentId: comment.id
                    })) || []
                }));

                setComments(mappedComments);

                // Initialize comment likes
                const likes = {};
                mappedComments.forEach(comment => {
                    likes[comment.id] = comment.likes;
                    comment.replies?.forEach(reply => {
                        likes[reply.id] = reply.likes;
                    });
                });
                setCommentLikes(likes);
            } else {
                // Fallback to mock comments if API fails
                setComments([]);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
            setComments([]);
        }
    };



    const handleLike = async () => {
        if (!isLogin) {
            showToast.error("Vui lòng đăng nhập để thích bài viết!");
            return;
        }

        try {
            if (isLiked) {
                // Unlike
                const response = await unLike(user.id, article.id);
                if (response && response.status === 200) {
                    setIsLiked(false);
                    setLikeCount(prev => prev - 1);
                    showToast.success("Đã bỏ thích bài viết");
                } else {
                    showToast.error("Có lỗi xảy ra khi bỏ thích bài viết");
                }
            } else {
                // Like
                const response = await additionalLike(user.id, article.id);
                if (response && response.status === 200) {
                    setIsLiked(true);
                    setLikeCount(prev => prev + 1);
                    showToast.success("Đã thích bài viết");
                } else {
                    showToast.error("Có lỗi xảy ra khi thích bài viết");
                }
            }
        } catch (error) {
            console.error("Error handling like:", error);
            showToast.error("Có lỗi xảy ra, vui lòng thử lại");
        }
    };

    const handleSave = async () => {
        if (!isLogin) {
            showToast.error("Vui lòng đăng nhập để lưu bài viết!");
            return;
        }

        try {
            if (isSaved) {
                // Remove bookmark
                const response = await deleteBookmark(user.id, article.id);
                if (response && response.status === 200) {
                    setIsSaved(false);
                    showToast.success("Đã bỏ lưu bài viết");
                } else {
                    showToast.error("Có lỗi xảy ra khi bỏ lưu bài viết");
                }
            } else {
                // Add bookmark
                const response = await addBookmark(user.id, article.id);
                if (response && response.status === 200) {
                    setIsSaved(true);
                    showToast.success("Đã lưu bài viết");
                } else {
                    showToast.error("Có lỗi xảy ra khi lưu bài viết");
                }
            }
        } catch (error) {
            console.error("Error handling bookmark:", error);
            showToast.error("Có lỗi xảy ra, vui lòng thử lại");
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!isLogin) {
            showToast.error("Vui lòng đăng nhập để bình luận!");
            return;
        }

        if (newComment.trim()) {
            try {
                // Call API to add comment
                const response = await addComment(null, article.id, newComment);

                if (response && response.status === 201) {
                    showToast.success("Đã thêm bình luận thành công");
                    setNewComment("");
                    // Reload comments to get the latest data
                    await fetchComments(slug);
                } else {
                    showToast.error("Có lỗi xảy ra khi thêm bình luận");
                }
            } catch (error) {
                console.error("Error adding comment:", error);
                showToast.error("Có lỗi xảy ra, vui lòng thử lại");
            }
        }
    };

    const handleReply = async (commentId) => {
        if (!isLogin) {
            showToast.error("Vui lòng đăng nhập để phản hồi!");
            return;
        }

        if (replyContent.trim()) {
            try {
                // Call API to add reply comment
                const response = await addComment(commentId, article.id, replyContent);

                if (response && response.status === 201) {
                    showToast.success("Đã thêm phản hồi thành công");
                    setReplyContent("");
                    setReplyingTo(null);
                    // Reload comments to get the latest data
                    await fetchComments(slug);
                } else {
                    showToast.error("Có lỗi xảy ra khi thêm phản hồi");
                }
            } catch (error) {
                console.error("Error adding reply:", error);
                showToast.error("Có lỗi xảy ra, vui lòng thử lại");
            }
        }
    };

    const handleCommentLike = (commentId) => {
        if (!isLogin) {
            showToast.error("Vui lòng đăng nhập để thích bình luận!");
            return;
        }

        setCommentLikes(prev => ({
            ...prev,
            [commentId]: (prev[commentId] || 0) + 1
        }));
    };

    // Function to delete comment
    const handleDeleteComment = async (commentId) => {
        if (!isLogin) {
            showToast.error("Vui lòng đăng nhập để xóa bình luận!");
            return;
        }

        if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
            try {
                const response = await deleteComment(commentId);

                if (response && response.status === 200) {
                    showToast.success("Đã xóa bình luận thành công");
                    // Reload comments to get the latest data
                    await fetchComments(slug);
                } else {
                    showToast.error("Có lỗi xảy ra khi xóa bình luận");
                }
            } catch (error) {
                console.error("Error deleting comment:", error);
                showToast.error("Có lỗi xảy ra, vui lòng thử lại");
            }
        }
    };

    // Check if current user can delete comment
    const canDeleteComment = (commentUsername) => {
        return isLogin && user?.username === commentUsername;
    };

    const handleImageError = (e) => {
        e.target.src = "data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23374151' text-anchor='middle' dy='.3em'%3EHình ảnh%3C/text%3E%3C/svg%3E";
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Đang tải bài viết...</p>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết</h1>
                    <Link to="/" className="text-blue-600 hover:text-blue-700">
                        Về trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="mb-8 text-sm">
                    <ol className="flex items-center space-x-2 text-gray-500">
                        <li>
                            <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
                        </li>
                        <li>
                            <FaChevronRight className="w-4 h-4" />
                        </li>
                        <li>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {capitalizeWords(article?.category?.name) || "Tin tức"}
                            </span>
                        </li>
                    </ol>
                </nav>

                {/* Article Header */}
                <article className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                    <div className="p-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                            {article?.title}
                        </h1>

                        {/* Article Meta */}
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={article?.author?.avatar || "https://picsum.photos/100/100?random=author1"}
                                    alt={article?.author?.username || "Tác giả"}
                                    className="w-12 h-12 rounded-full"
                                    onError={handleImageError}
                                />
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {article?.author?.username || "Tác giả"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {article?.author?.email || ""}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">
                                    {formatDate(article?.createAt)}
                                </p>
                                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <FaEye className="w-4 h-4 mr-1" />
                                        {article?.view || 0}
                                    </span>
                                    <span className="flex items-center">
                                        <FaHeart className="w-4 h-4 mr-1" />
                                        {likeCount}
                                    </span>
                                    <span className="flex items-center">
                                        <FaComment className="w-4 h-4 mr-1" />
                                        {comments.length}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Article Image */}
                        {/* {article?.thumbnail && (
                            <div className="mb-8">
                                <img
                                    src={article?.thumbnail}
                                    alt={article?.title}
                                    className="w-full h-64 md:h-96 object-cover rounded-lg"
                                    onError={handleImageError}
                                />
                            </div>
                        )} */}

                        {/* Article Content */}
                        <div className="prose prose-lg max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: article?.content || "" }} />
                        </div>

                        {/* Tags */}
                        {article?.tags && article?.tags.length > 0 && (
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <div className="flex flex-wrap gap-2">
                                    {article?.tags.map((tag, index) => (
                                        <span
                                            key={tag.id || index}
                                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                        >
                                            # {tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </article>

                {/* Action Buttons */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleLike}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${isLiked
                                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {isLiked ? <FaHeart className="w-5 h-5" /> : <FaRegHeart className="w-5 h-5" />}
                                <span>{isLiked ? 'Đã thích' : 'Thích'}</span>
                                <span className="bg-white px-2 py-1 rounded-full text-xs">
                                    {likeCount}
                                </span>
                            </button>

                            <button
                                onClick={handleSave}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${isSaved
                                    ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {isSaved ? <FaBookmark className="w-5 h-5" /> : <FaRegBookmark className="w-5 h-5" />}
                                <span>{isSaved ? 'Đã lưu' : 'Lưu'}</span>
                            </button>
                        </div>

                        {/* Thay thế nút chia sẻ hiện tại */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setShowShareModal(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                                <FaShare className="w-5 h-5" />
                                <span>Chia sẻ</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <FaComment className="w-5 h-5 mr-2" />
                        Bình luận ({comments.length})
                    </h3>

                    {/* Comment Form */}
                    {isLogin ? (
                        <form onSubmit={handleComment} className="mb-8">
                            <div className="flex space-x-4">
                                <img
                                    src={user?.avatar || "https://picsum.photos/50/50?random=currentuser"}
                                    alt="Your avatar"
                                    className="w-10 h-10 rounded-full flex-shrink-0"
                                    onError={handleImageError}
                                />
                                <div className="flex-1">
                                    <ReactQuill
                                        theme="snow"
                                        value={newComment}
                                        onChange={setNewComment}
                                        placeholder="Chia sẻ ý kiến của bạn..."
                                        modules={quillModules}
                                        formats={quillFormats}
                                        className="bg-white"
                                    />
                                    <div className="flex justify-end mt-3">
                                        <button
                                            type="submit"
                                            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                                        >
                                            <FaPaperPlane className="w-4 h-4" />
                                            <span>Gửi bình luận</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
                            <p className="text-gray-600 flex items-center justify-center">
                                <FaUser className="w-4 h-4 mr-2" />
                                <Link to="/dang-nhap" className="text-blue-600 hover:text-blue-700 font-medium mr-1 ">
                                    Đăng nhập
                                </Link>
                                {" "} để bình luận
                            </p>
                        </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-6">
                        {comments.length > 0 ? comments.map((comment) => (
                            <div key={comment.id} className="space-y-4">
                                {/* Main Comment */}
                                <div className="flex space-x-4">
                                    <img
                                        src={comment.user.avatar}
                                        alt={comment.user.name}
                                        className="w-10 h-10 rounded-full flex-shrink-0"
                                        onError={handleImageError}
                                    />
                                    <div className="flex-1">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-gray-900">{comment.user.name}</h4>
                                                <span className="text-sm text-gray-500">
                                                    {formatDate(comment.createdAt)}
                                                </span>
                                            </div>
                                            <div
                                                className="text-gray-700 prose prose-sm max-w-none"
                                                dangerouslySetInnerHTML={{ __html: comment.htmlContent }}
                                            />
                                        </div>
                                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                            <button
                                                onClick={() => setReplyingTo(comment.id)}
                                                className="hover:text-blue-600 flex items-center space-x-1 transition-colors"
                                            >
                                                <FaReply className="w-4 h-4" />
                                                <span>Trả lời</span>
                                            </button>
                                            {canDeleteComment(comment.username) && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="hover:text-red-600 flex items-center space-x-1 transition-colors"
                                                >
                                                    <FaTimes className="w-4 h-4" />
                                                    <span>Xóa</span>
                                                </button>
                                            )}
                                        </div>

                                        {/* Reply Form */}
                                        {replyingTo === comment.id && isLogin && (
                                            <div className="mt-4 ml-4 p-4 bg-gray-50 rounded-lg">
                                                <div className="flex space-x-3">
                                                    <img
                                                        src={user?.avatar || "https://picsum.photos/50/50?random=currentuser"}
                                                        alt="Your avatar"
                                                        className="w-8 h-8 rounded-full flex-shrink-0"
                                                        onError={handleImageError}
                                                    />
                                                    <div className="flex-1">
                                                        <ReactQuill
                                                            theme="snow"
                                                            value={replyContent}
                                                            onChange={setReplyContent}
                                                            placeholder="Viết phản hồi..."
                                                            modules={quillModules}
                                                            formats={quillFormats}
                                                            className="bg-white"
                                                        />
                                                        <div className="flex justify-end space-x-2 mt-3">
                                                            <button
                                                                onClick={() => setReplyingTo(null)}
                                                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                                            >
                                                                Hủy
                                                            </button>
                                                            <button
                                                                onClick={() => handleReply(comment.id)}
                                                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                            >
                                                                <FaPaperPlane className="w-3 h-3" />
                                                                <span>Gửi</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Replies */}
                                {comment.replies && comment.replies.length > 0 && (
                                    <div className="ml-14 space-y-4">
                                        {comment.replies.map((reply) => (
                                            <div key={reply.id} className="flex space-x-4">
                                                <img
                                                    src={reply.user.avatar || ""}
                                                    alt={reply.user.name}
                                                    className="w-8 h-8 rounded-full flex-shrink-0"
                                                    onError={handleImageError}
                                                />
                                                <div className="flex-1">
                                                    <div className="bg-blue-50 rounded-lg p-3">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h5 className="font-semibold text-gray-900 text-sm">{reply.user.name}</h5>
                                                            <span className="text-xs text-gray-500">
                                                                {formatDate(reply.createdAt)}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className="text-gray-700 prose prose-sm max-w-none"
                                                            dangerouslySetInnerHTML={{ __html: reply.htmlContent }}
                                                        />
                                                    </div>
                                                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                                        <button
                                                            onClick={() => handleCommentLike(reply.id)}
                                                            className="hover:text-blue-600 flex items-center space-x-1 transition-colors"
                                                        >
                                                            <FaThumbsUp className="w-3 h-3" />
                                                            <span>Thích</span>
                                                            <span>({commentLikes[reply.id] || reply.likes})</span>
                                                        </button>
                                                        {canDeleteComment(reply.username) && (
                                                            <button
                                                                onClick={() => handleDeleteComment(reply.id)}
                                                                className="hover:text-red-600 flex items-center space-x-1 transition-colors"
                                                            >
                                                                <FaTimes className="w-3 h-3" />
                                                                <span>Xóa</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )) : (
                            <div className="text-center text-gray-500">
                                <p>Bạn cần đăng nhập để xem bình luận</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Articles */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Bài viết liên quan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedArticles.length > 0 ? relatedArticles.map((article) => (
                            <Link key={article.id} to={`/${article.slugCategory}/${article.slug}`} className="group cursor-pointer">
                                <img
                                    src={article.thumbnail || ""}
                                    alt={article.title}
                                    className="w-full h-48 object-cover rounded-lg mb-4 group-hover:opacity-75 transition-opacity"
                                    onError={handleImageError}
                                />
                                <div className="space-y-2">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                        {article.category?.name || "Tin tức"}
                                    </span>
                                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {article.title}
                                    </h4>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center space-x-2">
                                            <span>Bởi {article.author?.username || "Admin"}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            <span>{article.view?.toLocaleString() || 0}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(article.createAt)}
                                    </p>
                                </div>
                            </Link>
                        )) : (
                            <div className="col-span-full text-center text-gray-500 py-8">
                                <p>Không có bài viết liên quan</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal chia sẻ */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Chia sẻ bài viết</h3>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Preview của bài viết */}
                        {article && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <h4 className="font-semibold text-gray-900 text-sm mb-1">{article.title}</h4>
                                {article.description && (
                                    <p className="text-gray-600 text-xs mb-2">{article.description}</p>
                                )}
                                {article.thumbnail && (
                                    <img
                                        src={article.thumbnail}
                                        alt={article.title}
                                        className="w-full h-20 object-cover rounded"
                                    />
                                )}
                            </div>
                        )}

                        <div className="space-y-3">
                            <button
                                onClick={shareToFacebook}
                                className="w-full flex items-center space-x-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <FaFacebook className="w-5 h-5" />
                                <span>Chia sẻ trên Facebook</span>
                            </button>

                            <button
                                onClick={shareToTwitter}
                                className="w-full flex items-center space-x-3 p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <FaTwitter className="w-5 h-5" />
                                <span>Chia sẻ trên Twitter/X</span>
                            </button>

                            <button
                                onClick={shareToLinkedIn}
                                className="w-full flex items-center space-x-3 p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                            >
                                <FaLinkedin className="w-5 h-5" />
                                <span>Chia sẻ trên LinkedIn</span>
                            </button>

                            <button
                                onClick={shareToWhatsApp}
                                className="w-full flex items-center space-x-3 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <FaWhatsapp className="w-5 h-5" />
                                <span>Chia sẻ qua WhatsApp</span>
                            </button>

                            <button
                                onClick={shareToTelegram}
                                className="w-full flex items-center space-x-3 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <FaTelegram className="w-5 h-5" />
                                <span>Chia sẻ qua Telegram</span>
                            </button>

                            <button
                                onClick={copyToClipboard}
                                className="w-full flex items-center space-x-3 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <FaCopy className="w-5 h-5" />
                                <span>Sao chép link</span>
                            </button>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center space-x-2">
                                <FaLink className="w-4 h-4 text-gray-400" />
                                <p className="text-sm text-gray-600 break-all">{window.location.href}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 