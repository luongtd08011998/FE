import React from 'react';
import {
    FaFacebook,
    FaTwitter,
    FaLinkedin,
    FaWhatsapp,
    FaTelegram,
    FaCopy,
    FaTimes,
    FaLink
} from 'react-icons/fa';

const ShareModal = ({ isOpen, onClose, article }) => {
    if (!isOpen) return null;

    const shareUrl = window.location.href;
    const shareTitle = article?.title || '';
    const shareDescription = article?.description || '';

    const shareToFacebook = () => {
        const url = encodeURIComponent(shareUrl);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=500');
    };

    const shareToTwitter = () => {
        const url = encodeURIComponent(shareUrl);
        const text = encodeURIComponent(shareTitle);
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}&hashtags=TanHoaWater`, '_blank', 'width=600,height=400');
    };

    const shareToLinkedIn = () => {
        const url = encodeURIComponent(shareUrl);
        const title = encodeURIComponent(shareTitle);
        const summary = encodeURIComponent(shareDescription);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`, '_blank', 'width=600,height=500');
    };

    const shareToWhatsApp = () => {
        const url = encodeURIComponent(shareUrl);
        const text = encodeURIComponent(`${shareTitle} - ${shareUrl}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    const shareToTelegram = () => {
        const url = encodeURIComponent(shareUrl);
        const text = encodeURIComponent(shareTitle);
        window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            // Có thể thêm toast notification ở đây
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Chia sẻ bài viết</h3>
                    <button
                        onClick={onClose}
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
                        <p className="text-sm text-gray-600 break-all">{shareUrl}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal; 