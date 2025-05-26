<template>
  <main>
    <BannerCategory />
    <div class="category-course">
      <h1 class="course-title">Khóa học {{ data }}</h1>
      <ListCourses />
    </div>
  </main>
</template>

<script setup>
import ListCourses from '@/components/course/ListCourses.vue'
import BannerCategory from '@/components/course/BannerCategory.vue'
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const data = ref(null)
const route = useRoute()

watch(() => route.params.category, (newCategory) => {
  var categoryCourse = newCategory.charAt(0).toUpperCase() + newCategory.slice(1);
  data.value = categoryCourse
})
</script>
<style scoped>
.category-course {
  padding: 40px 80px;
}

.course-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Arial', sans-serif;
  padding-bottom: 20px;
}
</style>