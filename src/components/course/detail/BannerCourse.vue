<template>
  <div class="course-banner">
    <div class="title-box">
      <p class="title-course"><span>Fitness | </span>{{ props.courseData.title }}</p>
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
span {
  text-decoration: underline;
}
p {
  margin-bottom: 0;
  text-decoration: underline;
}
.course-banner {
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
  height: 30px;
  display: flex;
  align-items: center;
  padding: 20px;
}

.title-course {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
}
@media screen and (max-width:767px) {
  .banner-image {
    height: 180px;
  }
}
</style>
