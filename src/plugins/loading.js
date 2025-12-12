const elLoading = `
  <div id="getting" class="v-loading-overlay">
    <div class="v-loading-spinner">
      <div class="spinner-circle"></div>
    </div>
  </div>
`;

const loadingStyles = `
  <style id="v-loading-styles">
    .v-loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(1px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      transition: opacity 0.2s ease;
    }
    
    .v-loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    
    .spinner-circle {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f4f5;
      border-top-color: #6d28d2;
      border-radius: 50%;
      animation: v-loading-spin 0.8s linear infinite;
    }
    
    @keyframes v-loading-spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    
    @media (prefers-reduced-motion: reduce) {
      .spinner-circle {
        animation: none;
      }
    }
  </style>
`;

// Inject styles once
if (typeof document !== 'undefined' && !document.getElementById('v-loading-styles')) {
  document.head.insertAdjacentHTML('beforeend', loadingStyles);
}

export default {
  mounted(el, binding) {
    // Khi binding.value là true, hiển thị loading
    if (binding.value && !el.querySelector('#getting')) {
      el.style.position = 'relative';
      el.insertAdjacentHTML('beforeend', elLoading);
    }
  },
  
  updated(el, binding) {
    // Kiểm tra khi giá trị binding thay đổi
    if (binding.value === binding.oldValue) return;

    // Nếu binding.value là true, thêm loading, ngược lại thì xóa
    const loadingEl = el.querySelector('#getting');
    
    if (binding.value && !loadingEl) {
      el.style.position = 'relative';
      el.insertAdjacentHTML('beforeend', elLoading);
    } else if (!binding.value && loadingEl) {
      loadingEl.style.opacity = '0';
      setTimeout(() => {
        if (loadingEl.parentNode) {
          el.removeChild(loadingEl);
        }
      }, 200);
    }
  },

  // Tùy chỉnh cho SSR (Server-side rendering) nếu cần
  getSSRProps(binding, vnode) {
    return {};
  }
};
