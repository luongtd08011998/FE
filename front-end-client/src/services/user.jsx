import axiosInstance from "../config/ConfigAxios";

export const getCurrentUser = async () => {
    try {
        const response = await axiosInstance.get("/api/v1/user/current");
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
};

export const updatePassword = async (password, passwordNew) => {
    try {
        const response = await axiosInstance.put("/api/v1/user/change-password", { password, passwordNew });
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
}

export const updateInfo = async (avatar, username) => {
    try {
        const formData = new FormData();

        // Thêm file vào FormData (nếu có)
        if (avatar && avatar instanceof File) {
            formData.append('avatar', avatar);
        }

        // Thêm username vào FormData
        if (username) {
            formData.append('username', username);
        }

        const response = await axiosInstance.put("/api/v1/user/change-info", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
}


export const getAllBookMarkByUser = async () => {
    try {
        const response = await axiosInstance.get("/api/v1/bookmark/all-by-user");
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
}

export const getAllLikeByUser = async () => {
    try {
        const response = await axiosInstance.get("/api/v1/like/all-like-by-user");
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
}
