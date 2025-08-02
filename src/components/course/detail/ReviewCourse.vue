<template>
  <div class="review-container" v-loading="loadingStates.review">
    <div class="review-rating">
      <h4>Đánh giá khóa học</h4>
      <div class="detail-rating">
        <div class="point-rating text-center">
          <span class="display-4 font-weight-bolder">{{ data.average }}</span><br>
          <p>trên 5 <StarOutlined /></p>
        </div>
        <div id="rating-value" class="flex-grow-1" style="margin-left: 40px">
          <div class="row align-items-center" v-for="(rating, index) in data.ratingData" :key="index"> 
            <div class="col-8">
              <div class="progress" style="height: 10px;">
                <div class="progress-bar" role="progressbar" :style="{ width: rating.percent + '%' }" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
            <div class="col-4 text-right d-flex" style="gap: 20px; align-items: center; font-size: 15px">
              <a-rate :value="rating.rate" class="star" disabled />
              <div>{{ rating.percent }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <a-form class="my-review" v-if="isAuthenticated && data.isReviewed" :model="data" ref="formRef" :rules="rules" @submit.prevent="addReview()">
      <a-form-item class="comment" name="comment">
        <a-input class="comment-input" type="textarea" :autoSize="{ minRows: 3, maxRows: 6 }" v-model:value="data.comment" placeholder="Nhập đánh giá" />
      </a-form-item>
      <a-form-item name="rating">
        <a-select
          v-model:value="data.rating"
          placeholder="Chọn số sao"
          
          :options="ratingOptions"
          option-label-prop="label"
        >
          <template #option="{ value }">
            <span>
              <span style="margin-left: 8px;">{{ value }}</span>
            </span>
          </template>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" size="medium" :disabled="loadingStates.review">
          Gửi đánh giá
        </a-button>
      </a-form-item>
    </a-form>
    <div>
    <div v-if="data.dataReview.length > 0">
      <div v-if="isMobile">
        <div class="slide-container">
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
      </div>
      <div class="list-review" v-else>
        <div v-for="(review, index) in data.dataReview" :key="index">
          <ItemReview :reviewData="review" />
        </div>
      </div>
    </div>
    <div class="non-review" v-else>
      <img src="/images/rating-star.png" alt="">
      Chưa có lượt đánh giá nào
    </div>
  </div>
  </div>
</template>

<script setup>
import ItemReview from '@/components/course/review/ItemReview.vue'
import { computed, ref, onMounted, onBeforeMount } from "vue"
import useCourse from '@/composables/useCourse';
import { useNotify } from '@/composables/useNotify';
import { useRoute } from 'vue-router';
import  { useCounterStore } from '@/stores/authStore'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'

const data = ref({
  rating: null,
  comment: "",
  dataReview: [],
  isReviewed: true,
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

const ratingOptions = [
  { value: 1, label: '1 sao' },
  { value: 2, label: '2 sao' },
  { value: 3, label: '3 sao' },
  { value: 4, label: '4 sao' },
  { value: 5, label: '5 sao' },
]

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
      console.log(data.value.isReviewed);
      
    } else {
      console.log(111);
    }
  }
}

onMounted(() => {
  getDataReview()
  window.addEventListener('resize', updateReviewList)
})

onBeforeMount(() => {
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
  margin-top: 30px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.detail-rating {
  display: flex;
  justify-content: center;
}

.my-review {
  position: relative;
  display: flex;
  gap: 10px;
}
.comment {
  flex: 5;
}

.comment-input  {
  width: 100%;
  height: auto;
}

.rate {
  flex: 1;
  display: flex;
  gap: 10px;
}

.progress {
  width: 350px;
}

.star {
  font-size: 10px;
  display: flex;
}

.list-review {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 25px !important;;
}

.non-review {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 25px;
  margin-top: 35px;
}
@media screen and (max-width:767px) {
  #rating-value {
    display: none;
  }
  .review-rating {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .review-rating h4 {
    display: none;
  }
  .point-ratin {
    display: flex;
    justify-content: center;
  }
  .swiper-slide {
    display: flex;
    justify-content: center;
  }
}
</style>