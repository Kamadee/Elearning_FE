<template>
  <div class="sidebar-mobile">
    <div class="sidebar-user">
      <a-menu v-if="isAuthenticated">
        <a-menu-item v-for="(link, i) in links" :key="i">
          <router-link :to="link.path" class="link-item">{{ link.name }}</router-link>
        </a-menu-item>
        <a-menu-item @click="logOut()">Đăng xuất</a-menu-item>
      </a-menu>
      <router-link v-else class="link-item" to="/login">Đăng nhập</router-link>
    </div>

    <div class="sidebar-menu">
      <div class="navbar-link">Khóa học</div>
      <a-menu>
        <a-menu-item v-for="(category, i) in categories" :key="i">
          <router-link class="link-item" :to="category.path">{{ category.name }}</router-link>
        </a-menu-item>
      </a-menu>

      <router-link to="/blog" class="navbar-link">Bài viết</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, ref  } from "vue"
import  { useCounterStore } from '@/stores/authStore'
// import useAuth from '@/composables/useAuth';
// // import  useCourse from '@/composables/useCourse';
import { useRouter } from 'vue-router';
// import useCart from "@/composables/useCart";
// import useCourse from "@/composables/useCourse";

const links = ref([
  { name: 'profile', path: '/profile'},
  { name: 'history', path: '/history'},
]);

const categories = ref([
  { name: 'Fitness', path: '/courses/fitness'},
  { name: 'Yoga', path: '/courses/yoga'},
  { name: 'Nutrition', path: '/courses/nutrition'},
  { name: 'Pilates', path: '/courses/pilates'},
  { name: 'Dance', path: '/courses/dance'},
]);

const stores = useCounterStore()
const isAuthenticated = computed(() => stores.isLogged)
</script>


<style scoped>
.sidebar-mobile {
  display: flex;
  flex-direction: column;
  gap: 30px;
  position: relative;
  background-color: #fff;
  color: black;
  width: 281px;
  height: 100vh;
  padding: 20px;
  top: 0px;
}
.sidebar-user .user-icon {
  font-size: 20px;
  cursor: pointer;
  border-bottom: 1px solid gray;
}
.navbar-link {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
  cursor: pointer;
  border-bottom: 1px solid gray;
  text-decoration: none;
}
.navbar-link:hover {
  color: #1890ff;
}
.link-item {
  text-decoration: none;
  color: black;
}
.close-circle {
  position: absolute;
  right: -50px;
  top: 30px;
  font-size: 40px;
}
</style>