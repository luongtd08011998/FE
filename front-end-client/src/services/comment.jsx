import axiosInstance from "../config/ConfigAxios";

export const getCommentByArticleId = async (slug) => {

    try {
        const response = await axiosInstance.get(`/api/v1/comment/article/${slug}`);
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
};

export const addComment = async (parentId, articleId, content) => {
    try {
        const response = await axiosInstance.post(`/api/v1/comment`, {
            parentId,
            articleId,
            content
        });
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
};


export const deleteComment = async (commentId) => {
    try {
        const response = await axiosInstance.delete(
            `/api/v1/comment/${commentId}`);
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
};






