<template>
  <div class="sidebar-mobile">
    <div class="sidebar-user">
      <div class="user-infor" v-if="isAuthenticated">
        <button @click="goProfile" class="link-profile">
          <div class="avatar"><UserOutlined /></div>
          <div class="user-name">Hi {{ userInfo.first_name + '' + userInfo.last_name }}</div>
        </button>
        <div style="padding: 10px" :class="{ 'seleccted-menu': currentPath == 'history' }">
          <router-link to="/history" @click="handleLinkClick" class="navbar-link">History</router-link>
        </div>
        <!-- <a-menu-item @click="logOut()">Đăng xuất</a-menu-item> -->
      </div>
      <div v-else style="display: flex; flex-direction: column;">
        <router-link  class="link-item" to="/login">Đăng nhập</router-link>
        <router-link class="link-item" to="/register">Đăng ký</router-link>
      </div>
    </div>
    <hr>

    <div class="sidebar-menu">
      <div class="navbar-link">Khóa học</div>
      <a-menu>
        <a-menu-item v-for="(category, i) in categories" :key="i" :class="{ 'seleccted-menu': currentTypeCourse == category.name }">
          <router-link class="link-item" :to="category.path" @click="handleLinkClick">{{ category.name }}</router-link>
        </a-menu-item>
      </a-menu>
    </div>
    <hr>
    <div style="padding: 10px;" :class="{ 'seleccted-menu': currentPath == 'blog' }">
      <router-link to="/blog" @click="handleLinkClick" class="navbar-link">Bài viết</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, ref  } from "vue"
import  { useCounterStore } from '@/stores/authStore'
import { useRoute, useRouter } from "vue-router";

const categories = ref([
  { name: 'Fitness', path: '/courses/fitness'},
  { name: 'Yoga', path: '/courses/yoga'},
  { name: 'Nutrition', path: '/courses/nutrition'},
  { name: 'Pilates', path: '/courses/pilates'},
  { name: 'Dance', path: '/courses/dance'},
]);

const stores = useCounterStore()
const router = useRouter()
const route = useRoute()
const isAuthenticated = computed(() => stores.isLogged)
const userInfo = computed(() => stores.getUser)

const handleLinkClick = () => {
  stores.setIsOpenSidebar(false)
}
const goProfile = () => {
  handleLinkClick()
  router.push('/profile')
}
const currentPath = () => {
  route.path.split('/')[1]
}
const currentTypeCourse = () => {
  route.path.split('/')[2]
}
</script>


<style scoped>
.sidebar-mobile {
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #fff;
  color: black;
  width: 281px;
  height: 100vh;
  top: 0px;
}
.sidebar-user .user-icon {
  font-size: 20px;
  cursor: pointer;
}
.user-infor {
  display: flex;
  flex-direction: column;
}
.link-profile {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  align-items: center;
  border: none;
  background-color: rgb(248, 245, 245);
  padding: 10px;
}
.navbar-link {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}
.navbar-link:hover {
  color: #1890ff;
}
.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  color: white;
  border-radius: 100%;
  width: 55px;
  height: 55px;
}
.link-item {
  text-decoration: none;
  color: #A435E0;
  padding: 5px 10px;
}
.sidebar-menu {
  padding: 10px;
}
.close-circle {
  position: absolute;
  right: -50px;
  top: 30px;
  font-size: 40px;
}
hr {
  margin-top: 0;
  margin-bottom: 0;
}
.seleccted-menu {
  color: #A435E0;
  font-weight: bold;
}
</style>