<template>
  <div class="review-container" v-loading="loadingStates.review">
    <div class="review-rating">
      <h4>Đánh giá khóa học</h4>
      <div class="d-flex">
        <div class="text-center" style="margin-right: 80px">
          <span class="display-4 font-weight-bolder">{{ data.average }}</span><br>
          <span class="text-black-50">trên 5 sao</span>
        </div>
        <div class="flex-grow-1">
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

    <a-form class="my-review" v-if="isAuthenticated && !data.isReviewed" :model="data" ref="formRef" :rules="rules" @submit.prevent="addReview()">
      <a-form-item class="comment" name="comment">
        <a-input class="comment-input" type="textarea" :autoSize="{ minRows: 3, maxRows: 6 }" v-model:value="data.comment" placeholder="Nhập đánh giá" />
      </a-form-item>
      <div class="rate">
        <a-form-item name="rating">
          <div style="min-width: 120px;">

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
          </div>
        </a-form-item>
        <a-button type="primary" html-type="submit" size="medium" :disabled="loadingStates.review">
          Gửi đánh giá
        </a-button>
      </div>
    </a-form>
    <div v-if="data.dataReview.length > 0">
      <div class="list-review" v-for="(review, index) in data.dataReview" :key="index">
        <ItemReview :reviewData="review" />
      </div>
    </div>
    <div class="non-review" v-else>
      <img src="/images/rating-star.png" alt="">
      Chưa có lượt đánh giá nào
    </div>
  </div>
</template>

<script setup>
import ItemReview from '@/components/course/review/ItemReview.vue'
import { computed, ref, onMounted } from "vue"
import useCourse from '@/composables/useCourse';
import { useNotify } from '@/composables/useNotify';
import { useRoute } from 'vue-router';
import  { useCounterStore } from '@/stores/authStore'

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
    } else {
      console.log(111);
    }
  }
}

onMounted(() => {
  getDataReview()
})
</script>

<style scoped>
.review-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.my-review {
  display: flex;
  gap: 10px;
}
.comment {
  flex: 5;
}

.comment-input  {
  width: 500px;
  height: 50px;
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

.non-review {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 25px;
  margin-top: 75px;
}
</style>