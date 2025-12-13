/**
 * Format thời gian từ ISO string sang định dạng yy/mm/dd hh:mm:ss
 * @param {string} isoString - Chuỗi thời gian dạng ISO (ví dụ: 2025-12-10T15:15:02.000000Z)
 * @returns {string} - Chuỗi thời gian đã format (ví dụ: 25/12/10 15:15:02)
 */
export const formatTime = (isoString) => {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return '—';
    }
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return '—';
  }
};

