const elLoading = `
  <div id="getting" class="d-flex justify-content-center align-items-center position-absolute w-100 h-100 top-0 start-0" style="background-color: rgba(26, 26, 26, 0.5);">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
`;

export default {
  mounted(el, binding) {
    // Khi binding.value là true, hiển thị loading
    if (binding.value && !el.querySelector('#getting')) {
      el.classList.add('position-relative');
      el.insertAdjacentHTML('beforeend', elLoading);
    }
  },
  
  updated(el, binding) {
    // Kiểm tra khi giá trị binding thay đổi
    if (binding.value === binding.oldValue) return;

    // Nếu binding.value là true, thêm loading, ngược lại thì xóa
    const loadingEl = el.querySelector('#getting');
    
    if (binding.value && !loadingEl) {
      el.classList.add('position-relative');
      el.insertAdjacentHTML('beforeend', elLoading);
    } else if (!binding.value && loadingEl) {
      el.removeChild(loadingEl);
    }
  },

  // Tùy chỉnh cho SSR (Server-side rendering) nếu cần
  getSSRProps(binding, vnode) {
    console.log(binding, vnode);
    return {};
  }
};
