// src/composables/useAPI.js
import axios from 'axios'
import { useNotify } from '@/composables/useNotify'
import qs from 'qs'
import { useCounterStore } from '@/stores/authStore'
import { pinia } from '@/stores/pinia'

const getAPIURL = () => {
  const envUrl = import.meta?.env?.VITE_API_URL
  if (envUrl) return envUrl
  return import.meta?.env?.PROD ? 'https://www.elearning-cms.site' : 'http://localhost:8081/'
}

const API_URL = getAPIURL()

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'ngrok-skip-browser-warning': 'true',
  },
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'brackets' })
})

// function lấy token
const getToken = () => localStorage.getItem('Authorization')
const store = useCounterStore(pinia)

const isTokenExpired = () => {
  const expiryTime = localStorage.getItem('tokenExpiry')
  return expiryTime && Date.now() >= Number(expiryTime)
};

// Request Interceptor
apiClient.interceptors.request.use(config => {
  const requiresAuth = config.headers?.['X-Requires-Auth'] === 'true'

  const token = getToken()

  if (requiresAuth) {
    // Bắt buộc phải có token hợp lệ
    if (!token || isTokenExpired()) {
      const { notify } = useNotify()
      notify('Phiên đăng nhập đã hết hạn', 'info')

      localStorage.removeItem('Authorization')
      localStorage.removeItem('tokenExpiry')
      store.removeToken()

      window.location.href = '/login'
      return Promise.reject('Token expired')
    }

    config.headers = config.headers || {};
    config.headers['Authorization'] = token
  } else {
    // Không bắt buộc, nhưng nếu có thì thêm vào
    if (token && !isTokenExpired()) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = token
    }
  }

  // Xoá custom header để không gửi lên server
  delete config.headers['X-Requires-Auth']

  return config;
}, error => Promise.reject(error));


// Response Interceptor (Xử lý lỗi toàn cục)
apiClient.interceptors.response.use(
  response => {
    if (response.data?.statusCode === '200') return response.data.data
    else return response.data
  },
  error => {
    // const shouldRedirect = error.config?.headers?.['X-Redirect-On-401'] !== 'false'

    if (error.response?.status === 401) {
      const shouldRedirect = error.config?.headers?.['X-Redirect-On-401'] !== 'false'
      
      if (shouldRedirect) {
        // const { notify } = useNotify()
        // notify('Phiên đăng nhập không hợp lệ', 'error')
        // localStorage.removeItem('Authorization')
        // localStorage.removeItem('tokenExpiry')
        // if (window.location.pathname !== '/login') {
        //   window.location.href = '/login'
        // }
      }
      return Promise.resolve(null)
    }
    

    return Promise.reject(error)
  }
);


// API wrapper
const useAPI = () => {
  const _get = async (url, queryParams = {}, config = {}) => {
    const finalConfig = {
      ...config,
      headers: {
        ...(config.headers || {})
      },
      params: {
        ...(config.params || {}),
        ...(queryParams || {})  // Query nằm riêng, không bị nhầm với headers
      }
    };
  
    return apiClient.get(url, finalConfig)
  }
  
  const _post = async (url, data = {}, config = {}) => {
    return apiClient.post(url, data, config)
  };

  const _put = async (url, data = {}, config = {}) => {
    return apiClient.put(url, data, config)
  };

  const _patch = async (url, data = {}, config = {}) => {
    return apiClient.patch(url, data, config)
  };

  const _delete = async (url, config = {}) => {
    return apiClient.delete(url, config)
  };

  return {
    _get,
    _post,
    _put,
    _patch,
    _delete,
  };
};

export default useAPI;
