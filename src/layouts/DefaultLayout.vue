<template>
  <div class="wrapper">
    <div class="navbar"><TopNavbar /></div>
    <div class="main"><router-view /></div>
    <div class="footer"><Footer /></div>
  </div>
</template>

<script setup>
import TopNavbar from '../components/dashboard/TopNavbar.vue';
import Footer from '../components/dashboard/Footer.vue';

</script>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  flex-shrink: 0;
}

.main {
  flex: 1;
  overflow-y: auto;
}

.footer {
  flex-shrink: 0;
}
</style>