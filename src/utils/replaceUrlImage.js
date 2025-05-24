export const replaceUrlImage = (url) => {
  const isAbsoluteUrl = /^https?:\/\/(www\.)?([\w-]+\.)+\w+/.test(url);
  const baseUrl = import.meta.env.VITE_API_BASE_LOCAL || 'http://localhost:8010/';

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
