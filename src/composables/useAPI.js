// src/composables/useAPI.js
import axios from 'axios'
import { useNotify } from '@/composables/useNotify'
import qs from 'qs'
import { useCounterStore } from '@/stores/authStore'
import { pinia } from '@/stores/pinia'
import { clearCustomerStreakState } from '@/composables/streakSessionCleanup'
import { authTokenStore } from '@/utils/authTokenStorage'

const getAPIURL = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:8081/'
}

const API_URL = getAPIURL()

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'ngrok-skip-browser-warning': 'true',
  },
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'brackets' })
})

// function lấy token
const getToken = () => authTokenStore.get()
const store = useCounterStore(pinia)

export const refreshAccessToken = async () => {
  const response = await apiClient.post('/api/customer/refresh', {})
  const accessToken = response?.access_token
  if (!accessToken) throw new Error('Refresh token did not return an access token')

  store.setToken(accessToken)
  if (response.user) store.setUser(response.user)
  return accessToken
}

// Request Interceptor
apiClient.interceptors.request.use(config => {
  const requiresAuth = config.headers?.['X-Requires-Auth'] === 'true'

  const token = getToken()

  if (requiresAuth) {
    // Bắt buộc phải có token hợp lệ
    if (!token) {
      const { notify } = useNotify()
      notify('Phiên đăng nhập đã hết hạn', 'info')

      store.removeToken()

      window.location.href = '/login'
      return Promise.reject('Token expired')
    }

    config.headers = config.headers || {};
    config.headers['Authorization'] = token
  } else {
    // Không bắt buộc, nhưng nếu có thì thêm vào
    if (token) {
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
    const originalRequest = error.config
    const isRefreshRequest = originalRequest?.url?.includes('/customer/refresh')
    const isLoginRequest = originalRequest?.url?.includes('/customer/login')

    if (error.response?.status === 401 && !originalRequest?._retry && !isRefreshRequest && !isLoginRequest) {
      originalRequest._retry = true
      return refreshAccessToken()
        .then(accessToken => {
          originalRequest.headers = originalRequest.headers || {}
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return apiClient(originalRequest)
        })
        .catch(() => {
          const customerId = store.getUser?.id
          clearCustomerStreakState(customerId).catch(() => { })
          store.removeToken()
          if (window.location.pathname !== '/login') window.location.href = '/login'
          return Promise.resolve(null)
        })
    }

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
