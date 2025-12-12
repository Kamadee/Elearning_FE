# Elearning Landing Page (Frontend)

Giao diện trang khóa học trực tuyến của nền tảng Elearning. Xây dựng bằng Vue 3 với kiến trúc component-based, hỗ trợ đầy đủ các tính năng từ xem khóa học, quản lý giỏ hàng, đến quản lý hồ sơ người dùng.

## 📋 Giới thiệu dự án

Dự án Elearning Frontend là một ứng dụng web hiện đại được xây dựng để cung cấp trải nghiệm học tập trực tuyến tốt nhất cho người dùng. Hệ thống hỗ trợ:

- **Quản lý khóa học**: Xem danh sách khóa học, tìm kiếm, lọc theo danh mục, xem chi tiết khóa học
- **Học tập**: Phát video khóa học, theo dõi tiến độ học tập
- **Quản lý giỏ hàng**: Thêm/xóa khóa học vào giỏ hàng, thanh toán
- **Quản lý người dùng**: Đăng ký, đăng nhập, quản lý hồ sơ, lịch sử giao dịch
- **Blog**: Đọc và xem chi tiết các bài viết blog
- **Thông báo**: Hệ thống thông báo real-time

## 🛠️ Công nghệ sử dụng

### Core Framework & Build Tools
- **Vue 3** (^3.5.13) - Progressive JavaScript framework
- **Vite** (^6.2.4) - Next generation frontend build tool
- **Vue Router** (^4.5.0) - Official router for Vue.js
- **Pinia** (^3.0.1) - State management library cho Vue

### UI Libraries & Components
- **Ant Design Vue** (^4.2.6) - Enterprise-class UI design language
- **Element Plus** (^2.9.7) - Component library for Vue 3
- **Bootstrap** (^5.3.5) - CSS framework
- **Swiper** (^11.2.6) - Modern touch slider
- **Font Awesome** - Icon library

### Utilities & Helpers
- **Axios** (^1.8.4) - HTTP client
- **Vue Toastification** (^2.0.0-rc.5) - Toast notification plugin
- **Vee-Validate** (^4.15.0) - Form validation
- **JWT Decode** (^4.0.0) - Decode JWT tokens
- **JS Cookie** (^3.0.5) - Cookie manipulation
- **Mitt** (^3.0.1) - Event emitter
- **QS** (^6.14.0) - Query string parser

### Development Tools
- **ESLint** (^9.22.0) - Code linting
- **Prettier** (^3.5.3) - Code formatter
- **Vue DevTools** - Development tools plugin

## 📁 Cấu trúc dự án

```
Elearning_FE/
├── public/                          # Thư mục chứa các file tĩnh
│   ├── images/                      # Hình ảnh (banner, avatar, etc.)
│   └── favicon.ico                  # Favicon
│
├── src/
│   ├── assets/                      # Tài nguyên tĩnh
│   │   ├── css/                     # File CSS tùy chỉnh
│   │   │   ├── content-default-layout.css
│   │   │   ├── nav-bar-responsive.css
│   │   │   └── toast-custom.css
│   │   ├── base.css                 # CSS cơ bản
│   │   ├── main.css                 # CSS chính
│   │   └── fonts.css                # Font chữ
│   │
│   ├── components/                  # Các component tái sử dụng
│   │   ├── cart/                    # Component giỏ hàng
│   │   │   ├── CheckoutCart.vue
│   │   │   └── ItemCart.vue
│   │   ├── course/                  # Component khóa học
│   │   │   ├── detail/              # Chi tiết khóa học
│   │   │   │   ├── BannerCourse.vue
│   │   │   │   ├── ContentCourse.vue
│   │   │   │   ├── PriceInfor.vue
│   │   │   │   ├── RelatedCourse.vue
│   │   │   │   └── ReviewCourse.vue
│   │   │   ├── review/              # Component đánh giá
│   │   │   ├── BannerCategory.vue
│   │   │   ├── ItemCourse.vue
│   │   │   ├── ItemHot.vue
│   │   │   ├── ListCourses.vue
│   │   │   └── OwnCourses.vue
│   │   ├── dashboard/               # Component dashboard
│   │   │   ├── Content.vue
│   │   │   ├── Footer.vue
│   │   │   ├── SideBar.vue
│   │   │   └── TopNavbar.vue
│   │   ├── search/                  # Component tìm kiếm
│   │   │   ├── ItemSearch.vue
│   │   │   └── SearchMobile.vue
│   │   ├── serviceType/             # Component dịch vụ
│   │   │   ├── blog/                # Component blog
│   │   │   │   ├── detail/
│   │   │   │   ├── ItemCard.vue
│   │   │   │   ├── ListBlog.vue
│   │   │   │   ├── MainBlog.vue
│   │   │   │   └── RelatedBlog.vue
│   │   │   └── notification/        # Component thông báo
│   │   │       └── index.vue
│   │   └── NoData.vue               # Component hiển thị khi không có dữ liệu
│   │
│   ├── composables/                 # Vue 3 Composition API hooks
│   │   ├── useAPI.js                # Hook xử lý API
│   │   ├── useAuth.js               # Hook xác thực
│   │   ├── useBlog.js               # Hook blog
│   │   ├── useCart.js               # Hook giỏ hàng
│   │   ├── useCourse.js             # Hook khóa học
│   │   └── useNotify.js             # Hook thông báo
│   │
│   ├── config/                      # File cấu hình
│   │   └── apiEndpoints.js          # Định nghĩa các API endpoints
│   │
│   ├── layouts/                     # Layout templates
│   │   ├── AuthLayout.vue           # Layout cho trang auth
│   │   ├── DashboardLayout.vue      # Layout cho dashboard
│   │   ├── DefaultLayout.vue        # Layout mặc định
│   │   └── FullScreenLayout.vue     # Layout full màn hình
│   │
│   ├── pages/                       # Các trang chính
│   │   ├── auth/                    # Trang xác thực
│   │   │   ├── login.vue
│   │   │   ├── register.vue
│   │   │   ├── verifi-register.vue
│   │   │   ├── forgot-password/
│   │   │   └── password-reset/
│   │   ├── blog/                    # Trang blog
│   │   │   ├── [idBlog].vue         # Chi tiết blog (dynamic route)
│   │   │   └── index.vue
│   │   ├── cart/                    # Trang giỏ hàng
│   │   │   └── index.vue
│   │   ├── courses/                 # Trang khóa học
│   │   │   ├── [category]/          # Khóa học theo danh mục
│   │   │   │   └── [idCourse].vue   # Chi tiết khóa học
│   │   │   └── CategoryCourses.vue
│   │   ├── history/                 # Trang lịch sử
│   │   │   └── index.vue
│   │   ├── order/                   # Trang đơn hàng
│   │   │   └── index.vue
│   │   ├── playCourse/              # Trang phát khóa học
│   │   │   └── [idCourse].vue
│   │   ├── profile/                 # Trang hồ sơ
│   │   │   └── index.vue
│   │   └── search/                  # Trang tìm kiếm
│   │       ├── [idCourse].vue
│   │       └── index.vue
│   │
│   ├── plugins/                     # Vue plugins
│   │   └── loading.js               # Directive loading
│   │
│   ├── router/                      # Cấu hình routing
│   │   └── index.js                 # Định nghĩa routes và navigation guards
│   │
│   ├── stores/                      # Pinia stores (state management)
│   │   ├── authStore.js             # Store quản lý authentication
│   │   └── pinia.js                 # Pinia instance
│   │
│   ├── utils/                       # Utility functions
│   │   ├── eventBus.js              # Event bus cho communication
│   │   ├── formatCurrency.js        # Format tiền tệ
│   │   ├── goRouter.js              # Helper navigation
│   │   ├── http.js                  # HTTP client configuration
│   │   └── replaceUrlImage.js       # Helper xử lý URL hình ảnh
│   │
│   ├── views/                       # View components
│   │   ├── AboutView.vue
│   │   └── HomeView.vue
│   │
│   ├── App.vue                      # Root component
│   └── main.js                      # Entry point của ứng dụng
│
├── .gitignore                       # Git ignore rules
├── eslint.config.js                 # ESLint configuration
├── index.html                       # HTML template
├── jsconfig.json                    # JavaScript configuration
├── package.json                     # Dependencies và scripts
├── vite.config.js                   # Vite configuration
└── README.md                        # Tài liệu dự án
```

### Kiến trúc chính

- **Component-based**: Tổ chức code theo component, dễ bảo trì và tái sử dụng
- **Layout System**: Hệ thống layout linh hoạt (Auth, Default, Dashboard, FullScreen)
- **State Management**: Sử dụng Pinia để quản lý state tập trung
- **Routing**: Vue Router với navigation guards để bảo vệ routes
- **API Integration**: Axios với cấu hình tập trung trong `http.js`
- **Composables**: Tách logic thành các composable functions để tái sử dụng

## 🚀 Cài đặt và khởi động dự án

### Yêu cầu hệ thống

- **Node.js**: >= 16.x
- **npm**: >= 8.x (hoặc yarn/pnpm)

### Bước 1: Clone dự án

```bash
git clone <repository-url>
cd Elearning_FE
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

Lệnh này sẽ cài đặt tất cả các package được liệt kê trong `package.json`.

### Bước 3: Cấu hình môi trường

Tạo file `.env` trong thư mục gốc (nếu cần):

```bash
# .env
VITE_API_BASE_URL=http://your-api-url.com
VITE_BASE_URL=/
```

### Bước 4: Khởi động development server

```bash
npm run dev
```

Sau khi chạy lệnh, ứng dụng sẽ được khởi động tại:
- **Local**: http://localhost:5173 (hoặc port khác nếu 5173 đã được sử dụng)
- Vite sẽ tự động mở trình duyệt

### Bước 5: Build cho production

```bash
npm run build
```

File build sẽ được tạo trong thư mục `dist/`.

### Bước 6: Preview production build

```bash
npm run preview
```

Xem trước bản build production trước khi deploy.

## 📜 Scripts có sẵn

| Script | Mô tả |
|--------|-------|
| `npm run dev` | Khởi động development server với hot-reload |
| `npm run build` | Build ứng dụng cho production |
| `npm run preview` | Preview bản build production |
| `npm run lint` | Chạy ESLint để kiểm tra và sửa lỗi code |
| `npm run format` | Format code bằng Prettier |

## 🔧 Cấu hình bổ sung

### Vite Configuration

File `vite.config.js` đã được cấu hình với:
- Vue plugin
- Vue DevTools plugin
- Path alias `@` trỏ đến thư mục `src`

### ESLint & Prettier

Dự án sử dụng ESLint và Prettier để đảm bảo code quality:
- ESLint config: `eslint.config.js`
- Prettier config: được tích hợp trong ESLint

## 📝 Ghi chú

- Dự án sử dụng Vue 3 Composition API
- State management được quản lý bởi Pinia
- Routing được bảo vệ bởi navigation guards
- API endpoints được định nghĩa tập trung trong `src/config/apiEndpoints.js`
- HTTP client được cấu hình trong `src/utils/http.js`

## 🤝 Đóng góp

Khi đóng góp code, vui lòng:
1. Chạy `npm run lint` để kiểm tra code style
2. Chạy `npm run format` để format code
3. Đảm bảo code tuân thủ các quy tắc đã được định nghĩa

## 📄 License

[Thêm thông tin license nếu có]
