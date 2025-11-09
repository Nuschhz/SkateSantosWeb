// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ENDPOINT,
  headers: {
    // 👇 ADICIONE ESTA LINHA 👇
    'x-api-key': process.env.NEXT_PUBLIC_SKATE_API
  }
});

// Seus interceptors de log (para debug) podem continuar aqui
api.interceptors.request.use(
  (config) => {
    console.log("✈️ ENVIANDO REQUISIÇÃO:");
    console.log("URL:", `${config.baseURL}${config.url}`);
    console.log("Headers:", config.headers); // Bom para ver se a key está indo
    return config;
  },
  (error) => {
    console.error("Erro na requisição:", error);
    return Promise.reject(error);
  }
);

export default api;