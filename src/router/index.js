import { createRouter, createWebHistory } from 'vue-router'
import { useCounterStore } from '@/stores/authStore';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import Login from '@/pages/auth/login.vue';
import Register from '@/pages/auth/register.vue';
import Cart from '@/pages/cart/index.vue';
import Profile from '@/pages/profile/index.vue';
import HistoryOrder from '@/pages/history/index.vue';
import ForgotPassword from '@/pages/auth/forgot-password/index.vue';
import PasswordReset from '@/pages/auth/password-reset/index.vue';
import BlogPage from '@/pages/blog/index.vue';
// import { el } from 'element-plus/es/locale';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/components/dashboard/Content.vue'),
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryOrder,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('@/pages/order/index.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogPage,
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/blog/:idBlog',
      name: 'blog-detail',
      component: () => import('@/pages/blog/[idBlog].vue'),
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/courses/:category',
      name: 'course-category',
      component: () => import('@/pages/courses/CategoryCourses.vue'),
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/courses/:category/:idCourse',
      name: 'course-detail',
      component: () => import('@/pages/courses/[category]/[idCourse].vue'),
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/search',
      name: 'search-course',
      component: () => import('@/pages/search/index.vue'),
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/search/:idCourse',
      name: 'search-detailcourse',
      component: () => import('@/pages/search/[idCourse].vue'),
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/verifi-register',
      name: 'verifi-register',
      component: () => import('@/pages/auth/verifi-register.vue'),
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPassword,
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/password-reset',
      name: 'password-reset',
      component: PasswordReset,
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/playCourse/:idCourse',
      name: 'play-course',
      component: () => import('@/pages/playCourse/[idCourse].vue'),
      meta: {
        requiresAuth: true,
      }
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const stores = useCounterStore()
  
  const isTokenExpired = () => {
    if(localStorage.getItem('tokenExpiry')) {
      const expiryTime = localStorage.getItem('tokenExpiry');
      return expiryTime && Date.now() >= Number(expiryTime);
    }
  };

  if(isTokenExpired()) {
    localStorage.removeItem('Authorization');
    localStorage.removeItem('tokenExpiry');
    stores.removeToken();
  }
  const isLogged = stores.isLogged; 
  // next-line: check if route ("to" object) needs authenticated
  if (to.matched.some((record) => record.meta.requiresAuth) && !isLogged) {
    next({ name: "login" });
  } else if (isLogged) {
    switch (to.name) {
      case "login":
        next({ name: "dashboard" }); // Chuyển hướng đến trang mặc định
        break;
      case "register":
        next({ name: "dashboard" });
        break;
      case "resetPassword":
        next({ name: "dashboard" });
        break;
      default:
        next(); // Tiếp tục điều hướng
        break;
    }
  } else {
    next();
  }
});

export default router
