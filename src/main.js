import './assets/main.css'
import { createApp } from 'vue'
import { pinia } from './stores/pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { queryClient } from './plugins/queryClient'
import * as Sentry from "@sentry/vue"

import App from './App.vue'
import router from './router'
import http from "./utils/http.js";
import 'bootstrap/dist/css/bootstrap.min.css';  
import './assets/fonts.css';
import 'font-awesome/css/font-awesome.css';
import loadingDirective from './plugins/loading.js'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import { Carousel } from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.css';
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

// Jquery
// import 'bootstrap-star-rating/css/star-rating.css';
// import 'bootstrap-star-rating/js/star-rating';
// import $ from 'jquery'
// window.$ = window.jQuery = $

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
  CloseCircleOutlined,
  BellOutlined,
  CloseOutlined,
  StarOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
import { Badge } from 'ant-design-vue'
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import './assets/css/toast-custom.css';

const app = createApp(App)

const sentryDsn = import.meta.env.VITE_SENTRY_DSN
if (sentryDsn) {
  Sentry.init({
    app,
    dsn: sentryDsn,
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  })
}
const options = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: true,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  transition: 'Vue-Toastification__fade',
  maxToasts: 4,
  newestOnTop: true,
  filterBeforeCreate: (toast, toasts) => {
    if (toasts.filter(t => t.content === toast.content).length !== 0) {
      return false;
    }
    return toast;
  },
};

// app.prototype.$http = http;
app.config.globalProperties.$http = http;
// app.config.globalProperties.$jwtDecode = jwt_decode;
app.use(Toast, options);
app.use(Carousel);

app.use(pinia)
app.use(VueQueryPlugin, { queryClient })
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
app.component('BellOutlined', BellOutlined)
app.component('CloseOutlined', CloseOutlined)
app.component('StarOutlined', StarOutlined)
app.component('SettingOutlined', SettingOutlined)
app.component('LogoutOutlined', LogoutOutlined)
app.component('AntBadge', Badge)

app.mount('#app')
