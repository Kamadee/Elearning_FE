<template>
  <div class="card-wrapper">
    <div class="card-course">
      <div class="thumbnail-course"><img :src="replaceUrlImage(props.courseData?.thumbnail || '')"></div>
      <div>
        <button v-if="canWatchVideo" @click="onWatchCourse" class="button-watch">Xem ngay</button>
        <div v-else>
          <div class="sale-price">{{ formatCurrency(props.courseData.sale_off_price) }}</div>
          <button class="button-incart" v-if="checkExistCart(props.courseData.id)" v-loading="loadingStates" @click="removeItem(props.courseData.id)">Đã thêm vào giỏ</button>
          <button class="button-cart" v-else v-loading="loadingStates"  @click="addCourse(props.courseData.id)">Đăng ký ngay</button>
        </div>
      </div>
      
      <div class="author-course">Giảng viên: {{ props.courseData.author }}</div>
      <div class="title-course">Thời gian: {{ props.courseData.course_duration }}</div>
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
      console.log(id);
      const response = await useCart().addCourse(id, true)
      console.log(response);
      
      if(response) {
        const { notify } = useNotify()
        notify(`${response.message}: Thêm giỏ hàng thành công`, 'success')
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
      const { notify } = useNotify()
      notify(`${response.message}: Xóa khỏi giỏ thành công`, 'success')
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
  height: 400px;
}
.card-course {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s;
  padding: 12px;
}

.card-course:hover {
  box-shadow: 0 8px 10px rgba(62, 62, 62, 0.1);
}

.thumbnail-course {
  /* flex: 0 0 66.6666%; */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-course img {
  width: 100%;
  height: 187px;
  object-fit: cover;
  border-radius: 6px;
}

/* .thumbnail-course img:hover {
  transform: scale(1.15);
} */

.title-course {
  font-weight: bold;
  font-size: 16px;
  margin-top: 8px;
  line-height: 1.4;
  color: #333;
}

.author-course {
  font-weight: bold;
}

.price {
  display: flex;
  gap: 10px;
}

.sale-price {
  font-weight: bold;
  margin-bottom: 10px;
}

.original-price {
  color: gray;
}

.category-list {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.button-cart {
  position: relative;
  align-items: center;
  display: inline-flex;
  background-color: #892de1;
  cursor: pointer;
  padding: 11px 40px;
  border: none;
  color: #fff;
  width: 100%;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.button-incart {
  position: relative;
  align-items: center;
  display: inline-flex;
  background-color: royalblue;
  cursor: pointer;
  padding: 11px 40px;
  border: none;
  color: #fff;
  width: 100%;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.button-watch {
  align-items: center;
  display: inline-flex;
  background-color: #28a745;
  cursor: pointer;
  padding: 11px 40px;
  border: none;
  color: #fff;
  width: 100%;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.button-cart:hover {
  background-color: rgba(137, 45, 225, 0.8);
  /* transform: scale(1.05); */
  box-shadow: 0 4px 20px rgba(137, 45, 225, 0.5);
}
@media screen and (max-width:767px) {
  .card-course {
    height: 50%;
  }
  .thumbnail-course {
    display: none;
  }
}
</style>