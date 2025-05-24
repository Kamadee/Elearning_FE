// src/config/apiEndpoints.js
const apiEndpoints = {
  AUTH_TOKEN: '/api/customer/login',
  AUTH_REGISTER: '/api/customer/register',
  VERIFY_EMAIL: 'api/customer/verify',
  GET_PROFILE: '/api/customer/profile',
  UPDATE_PROFILE: '/api/customer/update',
  FORGOT_PASSWORD: "/api/customer/forgot-password",
  RESET_PASSWORD: "/api/customer/reset-password",
  GET_POST_LIST: '/api/post/list',
  GET_POST_DETAIL: '/api/post',
  GET_COURSE_LIST: '/api/course/list',
  GET_COURSE_DETAIL: '/api/course/detail',
  PLAY_VIDEO: '/api/video/vimeo'
  // Thêm các endpoint khác tại đây
};

export default apiEndpoints;