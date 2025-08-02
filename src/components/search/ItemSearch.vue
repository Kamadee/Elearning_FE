<template>
  <!-- Layout Mobile -->
  <div v-if="isMobile" class="card-course">
    <div class="right-card" @click="handleClickCard"> 
      <div>
        <img :src="replaceUrlImage(props.dataSearch.thumbnail)" class="thumbnail-course">
      </div>
      <div>
        <div class="title-course">{{ props.dataSearch.title }}</div>
        <div class="author-course">{{ props.dataSearch.author }}</div>
        <div class="price-course">
          <div class="price-sale">{{ formatCurrency(props.dataSearch.sale_off_price) }}</div>
          <div class="price-original"><del>{{ formatCurrency(props.dataSearch.original_price) }}</del></div>
        </div>
        <div class="left-card">
          <button class="btn-watch" v-if="canWatchVideo" @click.stop="onWatchCourse">Xem ngay</button>
          <div v-else>
            <button class="btn-exist-cart" v-if="isAuthenticated && checkExistCart(props.dataSearch.id)">Đã thêm giỏ hàng</button>
            <button class="btn-cart" v-else @click.stop="addCourse(props.dataSearch.id)">Thêm giỏ hàng</button>
          </div>
        </div>
      </div>
    </div>
    
  </div>

  <!-- Layout PC -->
  <div v-else class="card-course">
    <div class="right-card" @click="handleClickCard"> 
      <div>
        <img :src="replaceUrlImage(props.dataSearch.thumbnail)" class="thumbnail-course">
      </div>
      <div>
        <div class="title-course">{{ props.dataSearch.title }}</div>
        <div class="description-course">{{ props.dataSearch.description }}</div>
        <div class="author-course">{{ props.dataSearch.author }}</div>
        <div class="price-course">
          <div class="price-sale">{{ formatCurrency(props.dataSearch.sale_off_price) }}</div>
          <div class="price-original"><del>{{ formatCurrency(props.dataSearch.original_price) }}</del></div>
        </div>
      </div>
    </div>
    <div class="left-card">
      <button class="btn-watch" v-if="canWatchVideo" @click="onWatchCourse">Xem ngay</button>
      <div v-else>
        <button class="btn-exist-cart" v-if="isAuthenticated && checkExistCart(props.dataSearch.id)">Đã thêm giỏ hàng</button>
        <button class="btn-cart" v-else @click="addCourse(props.dataSearch.id)">Thêm giỏ hàng</button>
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
import { computed, ref, onMounted, onBeforeMount } from "vue"
import { useRouter } from 'vue-router';

const props = defineProps({
  dataSearch: {
    type: Object,
    required: true
  },
})

const data = ref({
  listCartId: []
})

const stores = useCounterStore()
const isAuthenticated = computed(() => stores.isLogged);
const isMobile = ref(false)
const updateLayout = () => {
  if(window.innerWidth < 768) {
    isMobile.value = true
  } else {
    isMobile.value = false
  }
}

const getDataCarts = async () => {
  if(isAuthenticated.value) {
    const response = await useCart().getDataCarts()
    if(response) {
      data.value.listCartId = response.contents.map(content => content.course.id)
    }
  } else {
    data.value.listCartId = []
  }
}

const checkExistCart = (id) => { return data.value.listCartId.includes(id) } 

onMounted(() => {
  if(isAuthenticated.value) {
    getDataCarts()
  }
  window.addEventListener('resize', updateLayout)
})

onBeforeMount(() => {
  window.removeEventListener('resize', updateLayout)
})

const emit = defineEmits(['ClickCard'])
const handleClickCard = () => {
  const categoryArr = props.dataSearch.course_categories.map(category => category.category_name)
  const id = props.dataSearch.id
  if(categoryArr.length > 0) {
    const categoryName = categoryArr[0]
    emit('ClickCard', categoryName, id)
  }
}

const router = useRouter();
const addCourse = async (id) => {
  if(isAuthenticated.value) {
    const response = await useCart().addCourse(id, true)
    if(response) {
      const { notify } = useNotify()
      notify(`${response.message}: Thêm giỏ hàng thành công`, 'success')
      router.push('/cart')
    }
  } else {
    router.push('/login')
  }
}

const canWatchVideo = computed(() => {
  return props.dataSearch.is_bought || props.dataSearch.sale_off_price == 0
})

const onWatchCourse = async () => {
  if(isAuthenticated.value) {
    router.push(`/playCourse/${props.dataSearch.id}`)
  } else {
    router.push('/login')
  }
}
</script>


<style scoped>
.card-course {
  display: flex;
  justify-content: space-between;
  gap: 140px;
  border-top: 1px solid #d3d3d3;
  padding: 15px 15px;
  border: 1px solid rgb(210, 210, 210);
  border-radius: 10px;
}

.card-course:hover {
  background-color: rgb(231, 226, 226);
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.right-card {
  display: flex;
  gap: 10px;
  flex: 4;
}

.description-course {
  font-size: 12px;
}

.thumbnail-course {
  object-fit: cover;
  width: 120px;
  height: 70px;
}

.title-course {
  font-weight: bold;
  font-size: 18px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.left-card {
  display: inline-flex;
  justify-content: space-between;
  gap: 20px;
  flex: 1;
}

.price-course {
  display: flex;
  flex-direction: column;
}

.price-sale {
  font-weight: bold;
}

.price-original {
  color: gray;
}

.btn-cart {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(230, 197, 9);
  padding: 18px 14px;
  height: 32px;
  width: 190px;
  border-radius: 8px;
  background-color: #fff;
}

.btn-watch {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 18px 14px;
  height: 32px;
  width: 190px;
  border-radius: 8px;
  color: #fff;
  background-color: #28a745;
}

.btn-exist-cart {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 18px 14px;
  height: 32px;
  width: 190px;
  border-radius: 8px;
  color: #fff;
  background-color: rgb(230, 197, 9);
}

.btn-cart:hover {
  background-color: rgb(230, 197, 9);
  color: black;
}
@media screen and (max-width:767px) {
  .card-course {
    display: flex;
    justify-content: flex-start;
    gap: 140px;
    border-top: 1px solid #d3d3d3;
    padding: 15px 15px;
    border: 1px solid rgb(210, 210, 210);
    border-radius: 10px;
  }
  .thumbnail-course {
    width: 70px;
    height: 70px;
  }
}
</style>