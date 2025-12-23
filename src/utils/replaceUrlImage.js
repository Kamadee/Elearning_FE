export const replaceUrlImage = (url) => {
  const isAbsoluteUrl = /^https?:\/\/(www\.)?([\w-]+\.)+\w+/.test(url);
  
  // Đồng bộ logic với useAPI.js: ưu tiên VITE_API_URL, sau đó mới dùng PROD
  const getBaseUrl = () => {
    return import.meta.env.VITE_API_URL || 'http://localhost:8081/'
  }
  
  const baseUrl = getBaseUrl()

  if (isAbsoluteUrl) {
    return url;
  }

  if (url.startsWith('/')) {
    return baseUrl.endsWith('/')
      ? baseUrl + url.slice(1)
      : baseUrl + url;
  }

  return baseUrl.endsWith('/')
    ? baseUrl + url
    : baseUrl + '/' + url;
};
