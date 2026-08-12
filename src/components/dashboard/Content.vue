<template>
  <div class="content-wrapper">
    <div class="banner">
      <swiper
        :modules="[Autoplay, Pagination]"
        :slides-per-view="1"
        :loop="true"
        :autoplay="{
          delay: 3000,
          disableOnInteraction: false,
        }"
        :pagination="{
          clickable: true,
        }"
        class="banner-swiper"
      >
        <swiper-slide v-for="(image, index) in currentImageSrc" :key="index">
          <img :src="image" :alt="`banner-${index + 1}`" class="banner-image" />
        </swiper-slide>
      </swiper>
      <div class="banner-overlay">
        <div class="banner-text-box">
          <div class="banner-text-title">Powered by community</div>
          <div class="banner-text-content">Trust ratings and reviews to make a smarter choice. Get started with our top-rated courses.</div>
        </div>
      </div>
    </div>

    <div class="content-first"> 
      <div class="training">
        <p>Đào tạo 2 người trở lên? Cho phép nhóm của bạn tiếp cận hơn 27.000 khóa học hàng đầu của eFitness</p>
        <div class="double-btn">
          <button class="udemy">Nhận eFitness Business</button>
          <button class="dismiss">Học viên</button>
        </div>
      </div>

      <div class="top-course">
        <div class="top-course-title">Top khóa học hàng đầu</div>
        <div class="slide-container">
          <swiper
            :modules="[Navigation]"
            navigation
            :breakpoints="breakpoints"
          >
            <swiper-slide v-for="(course, index) in hotList" :key="index">
              <ItemHot :course="course" v-loading="loadingStates[course.id]" @clickCard="handleClickCard" />
            </swiper-slide>
          </swiper>
        </div>
      </div>

      <div class="top-course">
        <div class="top-course-title">Các khóa học mới nhất</div>
        <div class="slide-container">
          <swiper
            :modules="[Navigation]"
            navigation
            :breakpoints="breakpoints"
          >
            <swiper-slide v-for="(course, index) in hotList" :key="index">
              <ItemHot :course="course" v-loading="loadingStates[course.id]" @clickCard="handleClickCard" />
            </swiper-slide>
          </swiper>
        </div>
      </div>

      <!-- Features Section -->
      <!-- <div class="features-section">
        <h2 class="section-title">Tại sao chọn eFitness?</h2>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">📚</div>
            <h3 class="feature-title">Hơn 27.000 khóa học</h3>
            <p class="feature-description">Thư viện khóa học đa dạng từ các chuyên gia hàng đầu</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎯</div>
            <h3 class="feature-title">Học mọi lúc mọi nơi</h3>
            <p class="feature-description">Truy cập khóa học trên mọi thiết bị, học theo tốc độ của bạn</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">💼</div>
            <h3 class="feature-title">Phát triển sự nghiệp</h3>
            <p class="feature-description">Nâng cao kỹ năng và mở rộng cơ hội nghề nghiệp</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⭐</div>
            <h3 class="feature-title">Chứng chỉ hoàn thành</h3>
            <p class="feature-description">Nhận chứng chỉ sau khi hoàn thành khóa học</p>
          </div>
        </div>
      </div> -->

      <!-- Testimonials Section -->
      <div class="testimonials-section">
        <h2 class="section-title">Học viên nói gì về eFitness</h2>
        <div class="testimonials-grid">
          <div class="testimonial-item">
            <div class="testimonial-rating">
              <span class="star">★★★★★</span>
            </div>
            <p class="testimonial-text">"eFitness đã giúp tôi nâng cao kỹ năng và tự tin hơn trong công việc. Các khóa học rất chất lượng và dễ hiểu."</p>
            <div class="testimonial-author">
              <div class="author-avatar">NV</div>
              <div class="author-info">
                <div class="author-name">Nguyễn Văn</div>
                <div class="author-role">Học viên</div>
              </div>
            </div>
          </div>
          <div class="testimonial-item">
            <div class="testimonial-rating">
              <span class="star">★★★★★</span>
            </div>
            <p class="testimonial-text">"Tôi rất ấn tượng với nội dung khóa học và cách giảng dạy. Đây là nền tảng học tập tốt nhất mà tôi từng sử dụng."</p>
            <div class="testimonial-author">
              <div class="author-avatar">LT</div>
              <div class="author-info">
                <div class="author-name">Lê Thị</div>
                <div class="author-role">Học viên</div>
              </div>
            </div>
          </div>
          <div class="testimonial-item">
            <div class="testimonial-rating">
              <span class="star">★★★★★</span>
            </div>
            <p class="testimonial-text">"Giá cả hợp lý và chất lượng vượt mong đợi. Tôi đã học được rất nhiều điều bổ ích từ các khóa học tại eFitness."</p>
            <div class="testimonial-author">
              <div class="author-avatar">TM</div>
              <div class="author-info">
                <div class="author-name">Trần Minh</div>
                <div class="author-role">Học viên</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <!-- <div class="stats-section">
        <div class="stats-container">
          <div class="stat-item">
            <div class="stat-number">27,000+</div>
            <div class="stat-label">Khóa học</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">500,000+</div>
            <div class="stat-label">Học viên</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">1,500+</div>
            <div class="stat-label">Giảng viên</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">4.7</div>
            <div class="stat-label">Đánh giá trung bình</div>
          </div>
        </div>
      </div> -->
      
    </div>
  </div>
</template>

<script setup>
import ItemHot from '@/components/course/ItemHot.vue'
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useHotCoursesQuery } from '@/composables/courseQuery'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Autoplay, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'
import 'swiper/css/pagination'

const { data: hotCoursesResponse } = useHotCoursesQuery()
const hotList = computed(() => (hotCoursesResponse.value ?? []).map(item => item.course))

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

const imageSrc = ref(['/images/banner-content-desktop.jpg', '/images/udemy_professor.jpg', '/images/girl_udemy.jpg'])
const imageSrcMobile = ref(['/images/mobile/smile_mobile.jpg', '/images/mobile/professor_mobile.png', '/images/mobile/happygirl_mobile.jpg'])
const isMobile = ref(false)

const currentImageSrc = computed(() => {
  return isMobile.value ? imageSrcMobile.value : imageSrc.value
})

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 767
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
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
.banner {
  width: 100%;
  position: relative;
}

.banner-swiper {
  width: 100%;
  height: 400px;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 60px;
  pointer-events: none;
  z-index: 10;
}

.banner-text-box {
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  pointer-events: auto;
}

.banner-text-title {
  font-size: 24px;
  font-weight: 700;
  color: #1c1d1f;
  margin-bottom: 12px;
  line-height: 1.3;
}

.banner-text-content {
  font-size: 16px;
  color: #1c1d1f;
  line-height: 1.5;
}

:deep(.banner-swiper .swiper-pagination) {
  bottom: 20px;
}

:deep(.banner-swiper .swiper-pagination-bullet) {
  width: 12px;
  height: 12px;
  background: #fff;
  opacity: 0.5;
}

:deep(.banner-swiper .swiper-pagination-bullet-active) {
  opacity: 1;
  background: #6d28d2;
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
  max-width: 250px;
}
.udemy:hover {
  background-color: #16161d;
  color: #fff;
  border: 1px solid white;
  transform: none;
}

.dismiss {
  color: #fff;
  background-color: #16161d;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 700;
  border: 1px solid #fff;
  padding: 8px 15px;
  max-width: 250px;
}
.dismiss:hover {
  background-color: #fff;
  color: #16161d;
  border: 1px solid #16161d;
  transform: none;
}

.top-course {
  margin-bottom: 32px;
}

.top-course h2 {
  font-size: 32px;
  font-weight: 700;
  color: #1c1d1f;
  margin-bottom: 32px;
  line-height: 1.2;
}
:deep(.swiper) {
  width: 100% !important;
  padding-bottom: 8px;
}

:deep(.swiper-wrapper) {
  width: 100% !important;
}

:deep(.swiper-slide) {
  box-sizing: border-box;
  height: auto;
  display: flex;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #1c1d1f;
  background-color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  margin-top: 0;
  top: 50%;
  transform: translateY(-50%);
}

:deep(.swiper-button-next:after),
:deep(.swiper-button-prev:after) {
  font-size: 16px;
  font-weight: 700;
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background-color: #f7f9fa;
}

:deep(.swiper-button-disabled) {
  opacity: 0.35;
}

.top-course-title {
  font-size: 22px;
  font-weight: 700;
  color: #1c1d1f;
  margin-bottom: 10px;
  line-height: 1.2;
}

.slide-container {
  width: 100%;
}

.swiper-slide {
  display: flex;
  justify-content: center;
}

/* Features Section */
.features-section {
  margin-top: 64px;
  padding: 48px 0;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: #1c1d1f;
  margin-bottom: 32px;
  line-height: 1.2;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.feature-title {
  font-size: 20px;
  font-weight: 700;
  color: #1c1d1f;
  margin: 0;
  line-height: 1.3;
}

.feature-description {
  font-size: 16px;
  color: #6a6f73;
  margin: 0;
  line-height: 1.5;
}

/* Testimonials Section */
.testimonials-section {
  margin-top: 14px !important;
  padding: 48px 0;
  border-radius: 8px;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.testimonial-item {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.testimonial-rating {
  margin-bottom: 8px;
}

.star {
  color: #f3ca8c;
  font-size: 18px;
  letter-spacing: 2px;
}

.testimonial-text {
  font-size: 16px;
  color: #1c1d1f;
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #6d28d2;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-name {
  font-size: 16px;
  font-weight: 700;
  color: #1c1d1f;
}

.author-role {
  font-size: 14px;
  color: #6a6f73;
}

/* Stats Section */
.stats-section {
  margin-top: 64px;
  padding: 48px 0;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-number {
  font-size: 48px;
  font-weight: 700;
  color: #6d28d2;
  line-height: 1;
}

.stat-label {
  font-size: 18px;
  color: #6a6f73;
  font-weight: 400;
}

@media screen and (max-width:767px) {
  .banner {
    width: 100%;
  }
  
  .banner-swiper {
    height: 200px !important;
  }
  
  .banner-image {
    height: 100%;
  }
  
  .banner-overlay {
    display: none;
  }
  
  .banner-text-box {
    padding: 20px;
    max-width: 100%;
  }
  
  .banner-text-title {
    font-size: 18px;
    margin-bottom: 8px;
  }
  
  .banner-text-content {
    font-size: 14px;
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
  
  .top-course h2,
  .section-title {
    font-size: 24px;
    margin-bottom: 24px;
  }
  
  .features-section,
  .testimonials-section,
  .stats-section {
    margin-top: 48px;
    padding: 32px 0;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .testimonials-section {
    padding: 32px 16px;
  }
  
  .testimonials-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .testimonial-item {
    padding: 20px;
  }
  
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  
  .stat-number {
    font-size: 36px;
  }
  
  .stat-label {
    font-size: 16px;
  }
}
</style>
