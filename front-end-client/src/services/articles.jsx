import axios from "axios";
import axiosInstance from "../config/ConfigAxios";

const BASE_URL = "http://localhost:8080";

export const getAllArticles = async (limit = 10, offset = 0, sortBy = "id", order = "desc") => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/articles/all`, {
            params: {
                limit,
                offset,
                sortBy,
                order
            }
        });
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
};

export const increaseView = async (articleId) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/v1/articles/${articleId}/view`);
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
};

export const getArticleBySlug = async (slug) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/api/v1/articles/slug/${slug}`);
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
};


export const searchArticles = async (query, limit = 10, offset = 0, sortBy = "createAt", order = "desc") => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/articles/all`, {
            params: {
                title: query,
                limit,
                offset,
                sortBy,
                order
            }
        });
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
};

export const getArticleByCategoryIdLimit4 = async (categoryId) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/articles/by-category/${categoryId}`);
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
};