<template>
   <div class="banner-course" :style="{ backgroundImage: `url(${bannerUrl})` }"
></div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const bannerUrl = ref('')
const bannerMap = {
  fitness: '/images/fitness-banner.jpg',
  yoga: '/images/yoga-banner.jpg',
  nutrition: '/images/nutrition-banner.jpg',
  pilates: '/images/pilates-banner.png',
  dance: '/images/dance-banner.jpg',
};

watch(() => route.params.category, (newCategory) => {
  bannerUrl.value = bannerMap[newCategory] || '/images/default-banner.jpg'
  
}, { immediate: true })
</script>

<style scoped>
.banner-course {
  width: 100%;
  height: 380px;
  /* object-fit: contain; */
  background-size: cover;
  background-position: center;
}
</style>