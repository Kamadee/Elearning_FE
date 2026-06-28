<template>
  <div class="card-wrapper">
    <div class="card-course">
      <div class="thumbnail-wrapper">
        <img :src="replaceUrlImage(props.courseData?.thumbnail || '')" :alt="props.courseData?.title || ''" />
      </div>
      <div class="course-content">
        <div class="price-section" v-if="!canWatchVideo">
          <div class="course-price">
            <span class="current-price">{{ formatCurrency(props.courseData.sale_off_price) }}</span>
            <span class="original-price" v-if="props.courseData.original_price > props.courseData.sale_off_price">
              {{ formatCurrency(props.courseData.original_price) }}
            </span>
          </div>
        </div>
        
        <div class="button-section">
          <button 
            v-if="canWatchVideo" 
            @click="onWatchCourse" 
            class="button-watch"
          >
            Xem ngay
          </button>
          <button 
            v-else-if="checkExistCart(props.courseData.id)" 
            v-loading="loadingStates" 
            @click="removeItem(props.courseData.id)" 
            class="button-incart"
          >
            Đã thêm vào giỏ
          </button>
          <button 
            v-else 
            v-loading="loadingStates"  
            @click="addCourse(props.courseData.id)" 
            class="button-cart"
          >
            Đăng ký ngay
          </button>
        </div>
        
        <div class="course-info">
          <div class="info-item">
            <span class="info-label">Giảng viên:</span>
            <span class="info-value">{{ props.courseData.author }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Thời gian:</span>
            <span class="info-value">{{ props.courseData.course_duration }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { replaceUrlImage } from '@/utils/replaceUrlImage'
import { formatCurrency } from '@/utils/formatCurrency'
import useCart from '@/composables/useCart';
import { useNotify } from '@/composables/useNotify';
import  { useCounterStore } from '@/stores/authStore'
import { useRouter, useRoute } from 'vue-router';
import { computed, onMounted, ref, watch } from "vue"
import emitter from '@/utils/eventBus'

const props = defineProps({
  courseData: {
    type: Object,
    required: true
  }
})

const stores = useCounterStore()
const isAuthenticated = computed(() => stores.isLogged)
const router = useRouter()
const route = useRoute()
const id = route.params.idCourse

const loadingStates = ref(false)

const data = ref({
  listCartId: [],
})

const getDataCarts = async () => {
  const response = await useCart().getDataCarts()
  if(response) {
    data.value.listCartId = response.contents.map(content => content.course.id)
  }
  return response.contents
}

onMounted(() => {
  if(isAuthenticated.value) {
    getDataCarts()
  }
})

const checkExistCart = (id) => { return data.value.listCartId.includes(id) }

watch(() => route.params.idCourse, (newId) => {
  checkExistCart(newId)
})

const canWatchVideo = computed(() => {
  return props.courseData.is_bought || props.courseData.sale_off_price == 0
})

const addCourse = async (id) => {
  loadingStates.value = true;
  try {
    if(isAuthenticated.value) {
      const response = await useCart().addCourse(id, 1)
      if(response) {
        stores.setInCart(props.courseData.id)
        await getDataCarts()
      }
    } else {
      router.push('/login')
    }
  } finally {
    setTimeout(() => {
      loadingStates.value = false;
    }, 2000);
  }
}

const removeItem = async (id) => {
  loadingStates.value = true
  try {
    const contents = await getDataCarts()
    const cartId = contents.filter((content) => content.course.id == id).map((content) => content.id)
    const response = await useCart().removeItem(cartId)
    if(response) {
      stores.deleteInCart(props.courseData.id)
      await getDataCarts()
    }
  } finally {
    setTimeout(() => {
      loadingStates.value = false
    }, 2000);
  }
}

const onWatchCourse = async () => {
  if(isAuthenticated.value) {
    router.push(`/playCourse/${id}`)
  } else {
    router.push('/login')
  }
}
</script>

<style scoped>
.card-wrapper {
  width: 100%;
}

.card-course {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: 100%;
}

.card-course:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
  border-color: #d1d1d1;
}

.thumbnail-wrapper {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #f7f9fa;
}

.thumbnail-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card-course:hover .thumbnail-wrapper img {
  transform: scale(1.05);
}

.course-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.price-section {
  display: flex;
  flex-direction: column;
}

.course-price {
  display: flex;
  align-items: center;
  gap: 8px;
}

.current-price {
  font-size: 24px;
  font-weight: 700;
  color: #1c1d1f;
}

.original-price {
  font-size: 16px;
  color: #6a6f73;
  text-decoration: line-through;
}

.button-section {
  width: 100%;
}

.button-cart,
.button-incart,
.button-watch {
  position: relative;
  width: 100%;
  padding: 14px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  text-transform: none;
  letter-spacing: normal;
}

.button-cart {
  background-color: #6d28d2;
  color: #fff;
}

.button-cart:hover {
  background-color: #5b21b6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(109, 40, 210, 0.4);
}

.button-cart:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(109, 40, 210, 0.3);
}

.button-incart {
  background-color: #2563eb;
  color: #fff;
}

.button-incart:hover {
  background-color: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.button-incart:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
}

.button-watch {
  background-color: #10b981;
  color: #fff;
}

.button-watch:hover {
  background-color: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.button-watch:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
}

.course-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  line-height: 1.5;
}

.info-label {
  font-weight: 600;
  color: #1c1d1f;
  min-width: 80px;
  flex-shrink: 0;
}

.info-value {
  color: #6a6f73;
  flex: 1;
}

@media screen and (max-width: 767px) {
  .card-course {
    height: auto;
  }
  
  .thumbnail-wrapper {
    display: none;
  }
  
  .course-content {
    padding: 16px;
    gap: 12px;
  }
  
  .current-price {
    font-size: 20px;
  }
  
  .original-price {
    font-size: 14px;
  }
  
  .button-cart,
  .button-incart,
  .button-watch {
    padding: 12px 20px;
    font-size: 14px;
  }
  
  .info-item {
    font-size: 13px;
  }
  
  .info-label {
    min-width: 70px;
  }
}
</style>