// src/utils/utils.js

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
  }).format(amount);
};