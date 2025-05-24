<template>
  <div class="content-wrapper">
    <a-carousel
      autoplay
      :autoplay-speed="10000"
    >
      <div>
        <img class="banner" src="/images/banner-dashboard(1).jpg" alt="banner1" />
      </div>
      <div>
        <img class="banner" src="/images/banner-dashboard(2).jpg" alt="banner2" />
      </div>
    </a-carousel>

    <div class="content-first">
      <div class="let-start">
        <h2>Let's start learning</h2>
        <span>My learning</span>
      </div>

      <div class="explore">
        <h3>Explore our course collection</h3>
        <p>Choose from a vast selection of courses on the latest in-demand skills to achieve your goals.</p>
        <button><span>Explore courses</span></button>
      </div>

      <div class="training">
        <p><span>Training 2 or more people?</span>Get your team access to Udemy's top 27,000+ courses</p>
        <div style="display: flex; gap: 8px">
          <button class="udemy">Get Udemy Business</button>
          <button class="dismiss">Dismiss</button>
        </div>
      </div>

      <div class="top-course">
        <h2>Top course</h2>
        <div class="slide-container">
          <swiper
            :slides-per-view="4"
            space-between="16"
            :modules="[Navigation]"
            navigation
          >
            <swiper-slide v-for="(course, index) in data.hotList" :key="index">
              <ItemHot :course="course" v-loading="loadingStates[course.id]" @clickCard="handleClickCard" />
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ItemHot from '@/components/course/ItemHot.vue'
import { onMounted, ref } from 'vue'
import useCourse from '@/composables/useCourse'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'

const data = ref({
  hotList: [],
})

const getCourseTop = async () => {
  const response = await useCourse().getCourseTop()
  if(response) {
    data.value.hotList = response.data.map(item => item.course)
  }
}

onMounted(() => {
  getCourseTop()
})

const loadingStates = ref({})
const handleClickCard = async (id) => {
  loadingStates.value[id] = true
  try {
    window.location.href = `/search/${id}`
  } finally {
    setTimeout(() => {
      loadingStates.value[id] = false
    }, 2000);
  }
  
}
</script>


<style scoped>
.banner {
  width: 100%;
  height: 400px;
  object-fit: contain;
}

:deep(.ant-carousel .slick-slide) {
  text-align: center;
  height: 400px; /* Bằng với banner */
  line-height: 400px;
  overflow: hidden;
}

.content-first {
  margin: 80px 35px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.let-start {
  display: flex;
  justify-content: space-between;
}

.let-start h2 {
  font-family: SuisseWorks;
  font-size: 35px;
  font-weight: 700;
  line-height: 39px;
}

.let-start span {
  color: #6d28d2;
  font-weight: 700;
  font-size: 18px;
  font-family: Udemy Sans;
  text-decoration: #6d28d2;
}

.explore {
  border: 1px solid #d1d2e0;
  height: 162px;
  padding: 24px;
  margin-bottom: 30px;
}

.explore h3 {
  font-family: Udemy Sans;
  font-weight: bold;
  font-size: 23px;
}

.explore p {
  font-family: Udemy Sans;
  font-size: 16px;
}

.explore button {
  background-color: #6d28d2;
  padding: 8px 15px;
  border-radius: 4px;
  border: none;
}

.explore button span {
  font-family: Udemy Sans;
  color:#fff;
  font-size: 14px;
  font-weight: 700;
  line-height: 16.8px;
}

.training {
  height: 72px;
  display: flex;
  justify-content: space-between;
  border-radius: 8px;
  background-color: #16161d;
  align-items: center;
  padding: 16px;
}

.training p {
  color: #fff;
  margin-top: 20px;
}

.training span {
  color: #fff;
  font-weight: 700;
  margin-right: 10px;
}

.udemy {
  color: #2a2b3f;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 700;
  border: none;
  padding: 8px 15px;
}

.dismiss {
  color: #fff;
  background-color: #16161d;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 700;
  border: 1px solid #fff;
  padding: 8px 15px;
}

.slide-container {
  width: 100%;
  padding: 20px;
}

.swiper-slide {
  display: flex;
  justify-content: center;
}
</style>