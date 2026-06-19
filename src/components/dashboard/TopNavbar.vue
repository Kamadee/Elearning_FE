<template>
   <a-layout-header class="custom-navbar">
    <div class="navbar-container">
      <!-- MenuOutlined -->
      <MenuOutlined class="menu-outlined" @click="openSidebar"/>

      <!-- Logo -->
      <router-link to="/" class="navbar-logo">
        <div class="logo">
          <span class="e">e</span><span>Fitness</span>
        </div>
      </router-link>
      
      <!-- Search for PC -->
      <div class="navbar-search">
        <a-input
          placeholder="Tìm kiếm khóa học..."
          allow-clear
          size="large"
          class="search-input"
          @keyup.enter="handleClickSearch"
          v-model:value="data.keySearch"
        >
          <template #suffix>
            <SearchOutlined @click="handleClickSearch"/>
          </template>
        </a-input>
      </div>

      <!-- Menu Items PC -->
      <div class="navbar-menu">
        <a-dropdown class="navbar-dropdown">
          <a class="navbar-link" :class="{ 'active': isActiveMenu('/courses') }">Khóa học</a>
          <template #overlay>
            <a-menu>
              <a-menu-item v-for="(category, i) in categories" :key="i">
                <router-link :to="category.path">{{ category.name }}</router-link>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <router-link to="/blog" class="navbar-link" :class="{ 'active': isActiveMenu('/blog') }">Bài viết</router-link>

        <div class="navbar-notification">
          <AntBadge v-if="isAuthenticated && !isNotificationSeen" :count="1" @click="watchNotification" :show-zero="true" offset="[0, 5]">
            <Notification :coursesNew="data.coursesNew" />
          </AntBadge>
          <Notification v-else :coursesNew="data.coursesNew" />
        </div>
          <!-- Search for Mobile -->
        <SearchOutlined class="icon-search-mobile" @click="toggleOpenSearch" />
      
        <!-- Cart -->
        <router-link to="/cart" class="navbar-cart" :class="{ 'active': isActiveMenu('/cart') }">
          <AntBadge v-if="isAuthenticated" :count="countCart" :show-zero="true" offset="[0, 5]">
            <ShoppingCartOutlined class="icon" />
          </AntBadge>
          <AntBadge v-else offset="[0, 5]">
            <ShoppingCartOutlined class="icon" />
          </AntBadge>
        </router-link>

        <!-- User -->
        <div class="navbar-user">
          <template v-if="isAuthenticated">
            <a-dropdown class="navbar-dropdown">
              <a class="user-avatar-wrapper">
                <div class="user-avatar-circle">
                  <span class="user-avatar-initial">{{ getUserInitials() }}</span>
                </div>
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item v-for="(link, i) in links" :key="i">
                    <router-link :to="link.path">{{ link.name }}</router-link>
                  </a-menu-item>
                  <a-menu-item @click="logOut()">Đăng xuất</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
          <template v-else>
            <a-button type="default" shape="round" size="small" @click="navigateToLogin" class="login-button">Đăng nhập</a-button>
          </template>
        </div>
      </div>
    </div>
  </a-layout-header>
  
</template>

<script setup>
import { computed, ref, onMounted, watch, onUnmounted  } from "vue"
import  { useCounterStore } from '@/stores/authStore'
import useAuth from '@/composables/useAuth'
import { useRouter, useRoute } from 'vue-router'
import useCart from "@/composables/useCart"
import useCourse from "@/composables/useCourse"
import Notification from '@/components/serviceType/notification/index.vue'
import emitter from '@/utils/eventBus'

const userProfile = ref({
  firstName: '',
  lastName: '',
  fullName: ''
})

const stores = useCounterStore()
const isAuthenticated = computed(() => stores.isLogged)

const  emit = defineEmits(['send-data'])
const openSidebar = () => {
  stores.setIsOpenSidebar(true)
  const isOpenSidebar = stores.getIsOpenSidebar
  emit('send-data', isOpenSidebar)
}

const links = ref([
  { name: 'profile', path: '/profile'},
  { name: 'history', path: '/history'},
]);

const categories = ref([]);

const data = ref({
  cartData: [],
  keySearch: "",
  dataSearch: [],
  page: 1,
  per_page: 12,
  total: 0,
  categoryId: "",
  coursesNew: [],
})
const getDataCart = async () => {
  const response = await useCart().getDataCarts()
  if(response) {
    data.value.cartData = response.contents 
  }
}

// Xử lý chức năng Notification khóa học vừa dc thêm mới
const getCategoryBestOfUser = async () => {
  const response = await useCourse().getCategoryBestOfUser()
  if(response) {
    data.value.categoryId = response
  }
}

const getNewCourses = async () => {
  const response = await useCourse().getNewCourses(data.value.categoryId)
  const existingIds = new Set(data.value.coursesNew.map(course => course.id))
  const result = response.filter(course => !existingIds.has(course.id))
  return result
}

const isNotificationSeen = ref(localStorage.getItem('isNotificationSeen') === 'true')

watch(isNotificationSeen, (newVal) => {
  localStorage.setItem('isNotificationSeen', newVal.toString())
})
const pendingCourse = ref([])

const watchNotification = () => {
  isNotificationSeen.value = true
  data.value.coursesNew.push(...pendingCourse.value)
  pendingCourse.value = []
}

const getUserProfile = async () => {
  const response = await useAuth().getDataProfile()
  if(response) {
    userProfile.value.firstName = response.first_name || ''
    userProfile.value.lastName = response.last_name || ''
    userProfile.value.fullName = (response.first_name || '') + ' ' + (response.last_name || '')
  }
}

const getUserInitials = () => {
  if (userProfile.value.firstName && userProfile.value.lastName) {
    return (userProfile.value.firstName.charAt(0) + userProfile.value.lastName.charAt(0)).toUpperCase()
  }
  if (userProfile.value.fullName && userProfile.value.fullName.trim()) {
    const names = userProfile.value.fullName.trim().split(' ').filter(n => n)
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
    }
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase()
    }
  }
  return 'U'
}

onMounted(async () => {
  const cats = await useCourse().getCategories()
  if (cats) {
    categories.value = cats.map(cat => ({
      name: cat.category_name,
      path: `/courses/${cat.category_name}`
    }))
  }

  if(isAuthenticated.value) {
    await getUserProfile()
    await getDataCart()
    await getCategoryBestOfUser()
    await getNewCourses()
    setInterval(async () => {
      const response = await getNewCourses()
      if(response.length > 0) {
        const newObjCourse = response.map((res) => { return { ...res, isSeen: false}})
        pendingCourse.value = [...newObjCourse]
        isNotificationSeen.value = false
      }
    }, 1000)
    emitter.on('updateCountCart', getDataCart)
  }
})

onUnmounted(() => {
  emitter.off('updateCountCart', getDataCart)
})

const countCart = computed(() => stores.getInCart?.length || 0)

const logOut = () => {
  useAuth().logOut()
  const store = useCounterStore();
  store.removeToken();
  location.reload()
}

const router = useRouter();
const route = useRoute();

const isActiveMenu = (path) => {
  if (path === '/blog') {
    return route.path.startsWith('/blog');
  }
  if (path === '/courses') {
    return route.path.startsWith('/courses');
  }
  return route.path === path;
}

const navigateToLogin = () => {
  router.push('/login')
}

const handleSearch = async (keySearch, page = data.value.page) => {
  try {
    if(typeof keySearch === 'string' && keySearch.trim()) {
      data.value.page = page
      const filterData = {
        keyword: keySearch,
        page: data.value.page,
        per_page: data.value.per_page
      }
      
      const response = await useCourse().getDataCourses(filterData)
      
      if (response) {
        stores.setKeySearch(keySearch)
        stores.setDataSearch(response.data)
      } else {
        stores.setKeySearch(keySearch)
        stores.setDataSearch([])
      }
      router.push('/search')
      data.value.keySearch = ''
    }
  } catch(err) {
    console.error('Lỗi:', err);
  }
}

const handleClickSearch = async () => {
  data.value.page = 1
  await handleSearch(data.value.keySearch, 1)
}

const toggleOpenSearch = () => {
  stores.setIsOpenSearch(true)
}
</script>

<style scoped>
.a-input:focus,
.a-input-focused {
  border-color: #6d28d2 !important;
  box-shadow: 0 0 0 3px rgba(109, 40, 210, 0.2) !important; /* màu tím nhạt */
  outline: none;
}
a {
  text-decoration: none;
}
.custom-navbar {
  background: white;
  box-shadow: 0 2px 8px #f0f1f2;
  padding: 0 10px;
  width: 100%;
}
.menu-outlined {
  display: none;
}
.navbar-container {
  display: flex;
  align-items: center;
  height: 64px;
}
.navbar-logo {
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-logo:hover {
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-logo:focus {
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-logo:active {
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-logo img {
 height: 40px; 
}
.navbar-search {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  margin: 0 24px;
}
.icon-search-mobile {
  display: none;
}
.search-input {
  width: 70%;
  border-radius: 999px;
  padding-right: 36px;
}
.mobile-search {
  display: none !important;
}
.navbar-menu {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  height: 100%;
}
.navbar-link {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 100%;
  line-height: 1;
  transition: color 0.3s ease;
  background: transparent !important;
  background-color: transparent !important;
  padding: 0;
  border: none;
}
.navbar-link:hover {
  color: #6d28d2;
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-link:focus {
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-link:active {
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-link.active {
  color: #6d28d2;
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-notification {
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;
  line-height: 1;
  transition: color 0.3s ease;
}
.navbar-notification :deep(.ant-badge) {
  display: flex;
  align-items: center;
  line-height: 1;
}
.navbar-notification :deep(.ant-badge .anticon) {
  font-size: 20px;
  display: flex;
  align-items: center;
  line-height: 1;
  color: #000;
  transition: color 0.3s ease;
}
.navbar-notification:hover :deep(.ant-badge .anticon) {
  color: #6d28d2;
}
.navbar-cart {
  display: flex;
  align-items: center;
  height: 100%;
  line-height: 1;
  transition: color 0.3s ease;
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-cart:hover {
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-cart:focus {
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-cart:active {
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-cart .icon {
  font-size: 20px;
  color: #000;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
}
.navbar-cart:hover .icon {
  color: #6d28d2;
}
.navbar-cart.active .icon {
  color: #6d28d2;
}
.navbar-cart :deep(.ant-badge) {
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-cart :deep(.ant-badge:hover) {
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-user {
  display: flex;
  align-items: center;
  height: 100%;
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-user:hover {
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-user:focus {
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-user:active {
  background: transparent !important;
  background-color: transparent !important;
}
.user-avatar-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent !important;
  background-color: transparent !important;
}

.user-avatar-wrapper:hover {
  background: transparent !important;
  background-color: transparent !important;
}

.user-avatar-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #3e4143;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.user-avatar-circle:hover {
  transform: scale(1.05);
}

.user-avatar-initial {
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  line-height: 1;
}
.navbar-user :deep(.ant-dropdown-trigger) {
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-user :deep(.ant-dropdown-trigger:hover) {
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-user :deep(.ant-dropdown-trigger:focus) {
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-user :deep(.ant-dropdown-trigger:active) {
  background: transparent !important;
  background-color: transparent !important;
}
.icon-search-mobile {
  display: none;
  align-items: center;
  margin-top: 37px;
  height: 100%;
  font-size: 20px;
  cursor: pointer;
  line-height: 1;
  color: #000;
  transition: color 0.3s ease;
}
.icon-search-mobile:hover {
  color: #6d28d2;
}
.icon-search-mobile :deep(.anticon) {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: color 0.3s ease;
}
.navbar-dropdown {
  display: flex;
  align-items: center;
  height: 100%;
}
.navbar-dropdown :deep(.ant-dropdown-trigger) {
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-dropdown :deep(.ant-dropdown-trigger:hover) {
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-dropdown :deep(.ant-dropdown-trigger:focus) {
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-dropdown :deep(.ant-dropdown-trigger:active) {
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-dropdown :deep(.ant-dropdown-open) {
  background: transparent !important;
  background-color: transparent !important;
}
.navbar-dropdown :deep(.ant-dropdown-open:hover) {
  background: transparent !important;
  background-color: transparent !important;
}
.login-button {
  display: flex;
  align-items: center;
}
.logo {
  font-family: 'Montserrat', sans-serif;
  font-size: 35px;
  font-weight: 900;
  display: flex;
  align-items: center;
}
.logo .e {
  position: relative;
  color: #a435f0;
  margin-right: 2px;
}
.logo span {
  color: black;
}

/* Mobile styles */
@media screen and (max-width: 767px) {
  .icon-search-mobile {
    display: flex;
  }
  .navbar-search {
    display: none;
  }
  .navbar-notification {
    display: none;
  }
  .logo {
    font-size: 20px;
  }
  .navbar-user {
    display: none;
  }
}
</style>