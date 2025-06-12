import './assets/main.css'
import { createApp } from 'vue'
import { pinia } from './stores/pinia'

import App from './App.vue'
import router from './router'
import http from "./utils/http.js";
import 'bootstrap/dist/css/bootstrap.min.css';  
import './assets/fonts.css';
import loadingDirective from './plugins/loading.js'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import { Carousel } from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.css';
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

//Responsive CSS
import './assets/css/nav-bar-responsive.css'
import './assets/css/content-default-layout.css'

import {
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  DeleteOutlined,
  LeftOutlined,
  MenuOutlined,
  CloseCircleOutlined
} from '@ant-design/icons-vue'
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App)
const options = {
  // Các tùy chọn tùy chỉnh
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  draggable: true,
  draggablePercent: 0.6,
  progress: true,
};

// app.prototype.$http = http;
app.config.globalProperties.$http = http;
// app.config.globalProperties.$jwtDecode = jwt_decode;
app.use(Toast, options);
app.use(Carousel);

app.use(pinia)
app.use(router)
app.directive('loading', loadingDirective);

app.use(Antd);
app.component('ShoppingCartOutlined', ShoppingCartOutlined)
app.component('UserOutlined', UserOutlined)
app.component('SearchOutlined', SearchOutlined)
app.component('ArrowLeftOutlined', ArrowLeftOutlined)
app.component('EyeOutlined', EyeOutlined)
app.component('EyeInvisibleOutlined', EyeInvisibleOutlined)
app.component('DeleteOutlined', DeleteOutlined)
app.component('LeftOutlined', LeftOutlined)
app.component('MenuOutlined', MenuOutlined)
app.component('CloseCircleOutlined', CloseCircleOutlined)

app.mount('#app')
