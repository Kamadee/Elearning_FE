// src/utils/axios.js
import axios from 'axios';

const http = axios.create({
  baseURL: 'https://academycms.vfl.vn/', // Thay đổi URL này thành API của bạn
  timeout: 10000, // Thời gian chờ
});

// Thêm interceptor nếu cần
http.interceptors.request.use(config => {
  // Thêm token hoặc các thông tin khác vào header nếu cần
  return config;
}, error => {
  return Promise.reject(error);
});

http.interceptors.response.use(response => {
  return response.data; // Trả về chỉ dữ liệu
}, error => {
  return Promise.reject(error);
});

export default http;