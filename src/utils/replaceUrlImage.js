const stripApiPath = (apiUrl) => apiUrl.replace(/\/+$/, '').replace(/\/api$/, '')

export const resolveImageUrl = (url, apiUrl) => {
  const imageUrl = String(url ?? '').trim()

  if (!imageUrl) return ''

  try {
    new URL(imageUrl)
    return imageUrl
  } catch {
    const baseUrl = stripApiPath(apiUrl)
    return `${baseUrl}/${imageUrl.replace(/^\/+/, '')}`
  }
}

export const replaceUrlImage = (url) =>
  resolveImageUrl(url, import.meta.env.VITE_API_URL || 'http://localhost:8081')
