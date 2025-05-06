import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ENDPOINT,
  timeout: 10000,
  headers: {
    'x-api-key': process.env.NEXT_PUBLIC_SKATE_API,
  }
});

export default api;
