export const capitalizeWords = (str) => {
    return str
        ?.toLowerCase()
        ?.split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

// Helper function to format date with time and timezone +7
export const formatDate = (dateString) => {
    console.log("dateString", dateString);
    if (!dateString) return '';

    // Tạo Date object từ chuỗi ISO
    const date = new Date(dateString);

    // Sử dụng toLocaleString với timezone Asia/Ho_Chi_Minh thay vì cộng tay
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