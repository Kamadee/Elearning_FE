<template>
  <div class="review-container" v-loading="loadingStates.review">
    <h2 class="section-title">Đánh giá học viên</h2>
    
    <div class="rating-summary" v-if="data.average">
      <div class="rating-overview">
        <div class="average-rating">
          <span class="rating-number">{{ data.average }}</span>
          <div class="rating-stars-large">
            <a-rate :value="Math.round(parseFloat(data.average))" disabled allow-half />
          </div>
          <p class="rating-label">
            Đánh giá trung bình
            <span class="review-count">({{ data.total || data.dataReview.length }} đánh giá)</span>
          </p>
        </div>
      </div>
    </div>

    <div class="review-form-section" v-if="isAuthenticated && !data.isReviewed && canReview">
      <h3 class="form-title">Viết đánh giá của bạn</h3>
      <a-form class="review-form" :model="data" ref="formRef" :rules="rules" @submit.prevent="addReview()">
        <a-form-item name="rating" class="rating-form-item">
          <label class="form-label">Đánh giá của bạn</label>
          <a-rate v-model:value="data.rating" :count="5" />
        </a-form-item>
        <a-form-item name="comment" class="comment-form-item">
          <label class="form-label">Nhận xét</label>
          <a-input 
            v-model:value="data.comment" 
            type="textarea"
            placeholder="Chia sẻ trải nghiệm của bạn về khóa học này..."
            class="comment-textarea"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" size="large" :disabled="loadingStates.review" class="submit-button">
            Gửi đánh giá
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="reviews-section">
      <div v-if="data.dataReview.length > 0">
        <div v-if="isMobile" class="mobile-reviews">
          <swiper
            :slides-per-view="slidesPerView"
            :space-between="spaceBetween"
            :modules="[Navigation]"
            :breakpoints="breakpoints"
          >
            <swiper-slide v-for="(review, index) in data.dataReview" :key="index">
              <ItemReview :reviewData="review" />
            </swiper-slide>
          </swiper>
        </div>
        <div class="reviews-list" v-else>
          <div v-for="(review, index) in data.dataReview" :key="index" class="review-item-wrapper">
            <ItemReview :reviewData="review" />
          </div>
        </div>
      </div>
      <div class="no-reviews" v-else>
        <div class="no-reviews-content">
          <img src="/images/rating-star.png" alt="No reviews" class="no-reviews-image" />
          <p class="no-reviews-text">Chưa có đánh giá nào</p>
          <p class="no-reviews-subtext">Hãy là người đầu tiên đánh giá khóa học này</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ItemReview from '@/components/course/review/ItemReview.vue'
import { computed, ref, onMounted, onUnmounted } from "vue"
import useCourse from '@/composables/useCourse';
import { useNotify } from '@/composables/useNotify';
import { useRoute } from 'vue-router';
import  { useCounterStore } from '@/stores/authStore'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'

const props = defineProps({
  courseData: {
    type: [Object, String],
    default: () => ({})
  }
})

const canReview = computed(() => {
  if (!props.courseData) return false
  return props.courseData.is_bought || Number(props.courseData.sale_off_price) === 0
})

const data = ref({
  rating: null,
  comment: "",
  dataReview: [],
  isReviewed: false,
  page: 1,
  per_page: 12,
  total: 0,
  ratingData: [],
  average: ""
})

const isMobile = ref(false)

const breakpoints = {
  640: {
    slidesPerView: 1,
    spaceBetween: 0,
  },
  768: {
    slidesPerView: 1,
    spaceBetween: 0,
  }
}
const slidesPerView = ref(1);
const spaceBetween = ref(0);

const rules = {
  comment: [
    { required: true, message: "Vui lòng nhập đánh giá", trigger: ['blur', 'change'] }
  ],
  rating: [
    { required: true, message: "Vui lòng chọn sao", trigger: ['blur', 'change'] }
  ]
}
let loadingStates = ref({
  review: false,
})

const stores = useCounterStore()
const isAuthenticated = computed(() => stores.isLogged)
const route = useRoute()
const addReview = async () => {
  loadingStates.value.review = true
  try {
    const response = await useCourse().addReview(data.value.rating, data.value.comment, route.params.idCourse)
    if(response) {
      data.value.comment = ""
      data.value.rating = ""
      await getDataReview()
      const { notify } = useNotify()
      notify(`Đánh giá thành công`, 'success')
    }
  } finally {
    setTimeout(() => {
      loadingStates.value.review = false
    }, 2000)
  }
}

const getDataReview = async () => {
  const response = await useCourse().getDataReview(route.params.idCourse, data.value.page, data.value.per_page)
  if(response) {
    data.value.dataReview = response.list.data
    const customerInfo = stores.getUser
    data.value.ratingData = response.rate
    data.value.average = response.average
    if(customerInfo) {
      data.value.isReviewed = data.value.dataReview.some((review) => review.customer_id == customerInfo.id) ? true : false
    }
  }
}

onMounted(() => {
  getDataReview()
  window.addEventListener('resize', updateReviewList)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateReviewList)
})

const updateReviewList = () => {
  if(window.innerWidth < 768) {
    isMobile.value = true
  } else {
    isMobile.value = false
  }
}
</script>

<style scoped>
.review-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 40px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1c1d1f;
  margin: 0;
  line-height: 1.2;
}

/* Rating Summary */
.rating-summary {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.rating-overview {
  display: flex;
  justify-content: center;
  align-items: center;
}

.average-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.rating-number {
  font-size: 48px;
  font-weight: 700;
  color: #1c1d1f;
  line-height: 1;
  margin-bottom: 8px;
}

.rating-stars-large {
  margin-bottom: 8px;
}

.rating-stars-large :deep(.ant-rate) {
  font-size: 20px;
}

.rating-label {
  font-size: 14px;
  color: #6a6f73;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.review-count {
  font-size: 13px;
  color: #6a6f73;
  font-weight: 400;
}

/* Review Form */
.review-form-section {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.form-title {
  font-size: 20px;
  font-weight: 700;
  color: #1c1d1f;
  margin-bottom: 20px;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 5px !important;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1c1d1f;
  margin-bottom: 8px;
}

.rating-form-item :deep(.ant-form-item-control) {
  width: 100%;
}

.rating-form-item :deep(.ant-rate) {
  font-size: 24px;
}

.comment-form-item :deep(.ant-form-item-control) {
  width: 100%;
}

.comment-textarea {
  width: 100%;
}

.comment-textarea :deep(.ant-input),
.comment-textarea :deep(textarea),
.comment-textarea :deep(.ant-input-textarea textarea) {
  height: 140px !important;
  max-height: 320px !important;
  overflow-y: auto !important;
  resize: none !important;
  border-radius: 4px;
  border-color: #d1d1d1;
  box-sizing: border-box;
}

.comment-textarea :deep(.ant-input:focus) {
  border-color: #6d28d2;
  box-shadow: 0 0 0 2px rgba(109, 40, 210, 0.1);
}

.submit-button {
  background-color: #6d28d2;
  border-color: #6d28d2;
  font-weight: 600;
  height: 44px;
  padding: 0 24px;
}

.submit-button:hover {
  background-color: #5b21b6;
  border-color: #5b21b6;
}

/* Reviews List */
.reviews-section {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.reviews-title {
  font-size: 20px;
  font-weight: 700;
  color: #1c1d1f;
  margin-bottom: 24px;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review-item-wrapper {
  padding-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
}

.review-item-wrapper:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.no-reviews {
  padding: 60px 20px;
  text-align: center;
}

.no-reviews-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.no-reviews-image {
  width: 120px;
  height: 120px;
  opacity: 0.5;
}

.no-reviews-text {
  font-size: 18px;
  font-weight: 600;
  color: #1c1d1f;
  margin: 0;
}

.no-reviews-subtext {
  font-size: 14px;
  color: #6a6f73;
  margin: 0;
}

.mobile-reviews {
  width: 100%;
}

@media screen and (max-width: 1024px) {
  .rating-overview {
    justify-content: center;
  }
}

@media screen and (max-width: 767px) {
  .section-title {
    font-size: 20px;
  }
  
  .rating-summary,
  .review-form-section,
  .reviews-section {
    padding: 16px;
  }
  
  .rating-number {
    font-size: 36px;
  }
  
  .rating-stars-large :deep(.ant-rate) {
    font-size: 18px;
  }
  
  .form-title,
  .reviews-title {
    font-size: 18px;
  }
  
  .swiper-slide {
    display: flex;
    justify-content: center;
  }
}
</style>