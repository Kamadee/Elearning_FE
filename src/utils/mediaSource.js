const escapeHtmlAttribute = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const isHttpUrl = (value) => /^https?:\/\//i.test(value);

export const normalizeVideoSource = (source) => {
  if (!source || typeof source !== 'string') return '';

  const normalizedSource = source.trim();
  if (!normalizedSource) return '';

  // Backend may return Vimeo iframe or an already-built R2 <video> element.
  if (normalizedSource.startsWith('<')) return normalizedSource;

  // Backend may also return only the public R2 URL.
  if (isHttpUrl(normalizedSource)) {
    return `<video controls autoplay controlsList="nodownload" playsinline style="width:100%;height:100%;object-fit:contain;" src="${escapeHtmlAttribute(normalizedSource)}"></video>`;
  }

  return '';
};
