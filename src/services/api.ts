import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ENDPOINT,
  headers: {
    'x-api-key': process.env.NEXT_PUBLIC_SKATE_API
  }
});

api.interceptors.request.use(
  (config) => {
    console.log("✈️ ENVIANDO REQUISIÇÃO:");
    console.log("URL:", `${config.baseURL}${config.url}`);
    console.log("Headers:", config.headers);
    return config;
  },
  (error) => {
    console.error("Erro na requisição:", error);
    return Promise.reject(error);
  }
);

export default api;