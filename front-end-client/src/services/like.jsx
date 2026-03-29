import axiosInstance from "../config/ConfigAxios";

export const additionalLike = async (userId, articlesId) => {
    try {
        const response = await axiosInstance.post(`/api/v1/like`, {
            userId,
            articlesId
        });
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
};

export const unLike = async (userId, articlesId) => {
    try {
        const response = await axiosInstance.delete(`/api/v1/like`, {
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