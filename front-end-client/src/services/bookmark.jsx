import axiosInstance from "../config/ConfigAxios";

export const addBookmark = async (userId, articlesId) => {

    try {
        const response = await axiosInstance.post(`/api/v1/bookmark`, {
            userId,
            articlesId
        });
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
};

export const deleteBookmark = async (userId, articlesId) => {
    try {
        const response = await axiosInstance.delete(`/api/v1/bookmark`, {
            data: {
                userId,
                articlesId
            }
        });
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
};
