<template>
  <div class="content-wrapper">
    <div class="banner">
      <img :src="imageSrc" alt="banner1" />
    </div>

    <div class="content-first"> 
      <div class="training">
        <p>Đào tạo 2 người trở lên? Cho phép nhóm của bạn tiếp cận hơn 27.000 khóa học hàng đầu của Udemy</p>
        <div class="double-btn">
          <button class="udemy">Nhận Udemy Business</button>
          <button class="dismiss">Học viên</button>
        </div>
      </div>

      <div class="top-course">
        <h2>Top khóa học hàng đầu</h2>
        <div class="slide-container">
          <swiper
            :modules="[Navigation]"
            navigation
            :breakpoints="breakpoints"
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
import { onBeforeMount, onMounted, ref } from 'vue'
import useCourse from '@/composables/useCourse'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'

const data = ref({
  hotList: [],
})

const breakpoints = {
  320: {
    slidesPerView: 1,
    spaceBetween: 12,
  },
  640: {
    slidesPerView: 2,
    spaceBetween: 16,
  },
  768: {
    slidesPerView: 3,
    spaceBetween: 16,
  },
  1024: {
    slidesPerView: 4,
    spaceBetween: 16,
  },
};

const imageSrc = ref('/images/banner-content-desktop.jpg')
const updateImage = () => {
  if(window.innerWidth < 768) {
    imageSrc.value = '/images/banner-content-mobile.jpg'
  } else {
    imageSrc.value = '/images/banner-content-desktop.jpg'
  }
}

const getCourseTop = async () => {
  const response = await useCourse().getCourseTop()
  if(response) {
    data.value.hotList = response.data.map(item => item.course)
  }
}

onMounted(() => {
  getCourseTop()
  window.addEventListener('resize', updateImage)
})

onBeforeMount(() => {
  window.removeEventListener('resize', updateImage)
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
.content-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.banner img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

:deep(.ant-carousel .slick-slide) {
  text-align: center;
  height: 400px; /* Bằng với banner */
  line-height: 400px;
  overflow: hidden;
}

.content-first {
  padding: 40px 35px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.let-start {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  display: flex;
  justify-content: space-between;
  border-radius: 8px;
  background-color: #16161d;
  align-items: center;
  padding: 16px;
  width: 100%;
}

.double-btn {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
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
  width: 180px;
}

.dismiss {
  color: #fff;
  background-color: #16161d;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 700;
  border: 1px solid #fff;
  padding: 8px 15px;
  width: 95px;
}

.top-course h2 {
  font-family: SuisseWorks;
  font-size: 35px;
  font-weight: 700;
  line-height: 39px;
}
:deep(.swiper) {
  width: 100% !important;
}

:deep(.swiper-wrapper) {
  width: 100% !important;
}

:deep(.swiper-slide) {
  box-sizing: border-box;
}
.slide-container {
  width: 100%;
}

.swiper-slide {
  display: flex;
  justify-content: center;
}

@media screen and (max-width:767px) {
  .banner {
    width: 100%;
    object-fit: contain;
  }
  .banner img {
    height: 200px !important;
  }
  .content-first {
    margin-top: -10px;
  }
  .explore-text {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
  .explore-text {
    flex: 1;
  }
  .explore button {
    white-space: nowrap;
    height: fit-content;
    margin-top: 0.5rem;
  }
  .let-start h2 {
    font-size: 25px !important;
  }
  .let-start span {
    font-size: 20px !important;
    margin-top: -12px;
  }
  .training {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
    padding: 10px;
  }
  .training p {
    text-align: center;
  }
  .double-btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .double-btn button {
    width: 70% !important;
  }
}
</style>