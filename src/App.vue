<template>
  <div id="app">
    <AuthLayout v-if="isAuthLayout"/>
    <FullScreenLayout v-else-if="isFullScreenLayout" />
    <DefaultLayout v-else />
  </div>
</template>
<script setup>
import AuthLayout from '@/layouts/AuthLayout.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import FullScreenLayout from '@/layouts/FullScreenLayout.vue';
import { computed, onMounted } from "vue";
import { useRoute } from 'vue-router';

onMounted(() => {
  console.log(document.getElementById('app'))
})

const route = useRoute();
const isAuthLayout = computed(() => {
  // chỉ định luôn những page nào sẽ dùng authLayout
  return ['login', 'register', 'forgot-password', 'verifi-register'].includes(route.name);
})
const isFullScreenLayout = computed(() => {
  return ['play-course'].includes(route.name)
})
</script>