<template>
  <div class="wrapper">
    <div class="navbar"><TopNavbar @send-data="handleDataFromNav"/></div>
    <div
      v-if="isOpenSidebar"
      class="overlay"
      @click="handleDataFromNav(false)"
    ></div>
    <div class="sidebar"><SideBar v-if="isOpenSidebar"/></div>
    <div class="main"><router-view :key="$route.fullPath"/></div>
    <div class="footer"><Footer /></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TopNavbar from '../components/dashboard/TopNavbar.vue';
import Footer from '../components/dashboard/Footer.vue';
import SideBar from '../components/dashboard/SideBar.vue';

const isOpenSidebar = ref(false)

const handleDataFromNav = (value) => {
  isOpenSidebar.value = value
  if(isOpenSidebar.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}
</script>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}

.navbar {
  flex-shrink: 0;
}

.sidebar {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  transition: 2.5s;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
}

.main {
  flex: 1;
  overflow-y: auto;
}

.footer {
  flex-shrink: 0;
}

</style>