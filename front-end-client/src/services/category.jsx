import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const getAllCategories = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/category/all`);
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
};


export const getPostByCategory = async (slug, limit = 10, offset = 0) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/category/by-articles?slug=${slug}&limit=${limit}&offset=${offset}`);
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
};

export const getPostWithCategoryAndArticle = async (categoryId, articlesId) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/category/by-detail-articles?categoryId=${categoryId}&articlesId=${articlesId}`);
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
}
