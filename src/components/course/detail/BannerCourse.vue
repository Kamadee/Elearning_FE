<template>
  <div class="course-banner">
    <div class="title-box">
      <div class="title-course">{{ props.courseData.title }}</div>
    </div>
    <div class="banner-image" @click="handleClickCard"
    :style="{ backgroundImage: `url(${replaceUrlImage(props.courseData.banner || '')})` }"></div>
  </div>
</template>

<script setup>
import { replaceUrlImage } from '@/utils/replaceUrlImage'
const props = defineProps({
  courseData: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.course-banner {
  padding: 24px 0 0;
  background-color: #313131;
  line-height: 24px;
}

.banner-image {
  width: 100%;
  height: 380px;
  /* object-fit: contain; */
  background-size: cover;
  background-position: center;
}

.title-box {
  display: flex;
  margin: 20px 75px;
  padding: 0 32px;
}

.title-course {
  font-size: 24px;
  font-weight: 500;
  color: #fff;
  text-transform: uppercase;
}
</style>
