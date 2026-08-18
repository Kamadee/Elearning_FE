<template>
  <div class="search-container">
    <div class="navbar-search-mobile">
      <a-input
        placeholder="Tìm kiếm khóa học..."
        allow-clear
        size="large"
        class="search-input"
        @keyup.enter="handleClickSearch"
        v-model:value="data.keySearch"
      >
        <template #suffix>
          <SearchOutlined @click="handleClickSearch"/>
        </template>
      </a-input>
      <button @click="closeSeach" class="btn-close"></button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from 'vue-router';
import  { useCounterStore } from '@/stores/authStore'
import useCourse from "@/composables/useCourse"

const data = ref({
  cartData: [],
  keySearch: "",
  dataSearch: [],
  page: 1,
  per_page: 12,
  total: 0,
})

const stores = useCounterStore()
const router = useRouter()

const handleSearch = async (keySearch, page = data.value.page) => {
  try {
    if(typeof keySearch === 'string' && keySearch.trim()) {
      data.value.page = page
      const filterData = {
        keyword: keySearch,
        page: data.value.page,
        per_page: data.value.per_page
      }
      
      const response = await useCourse().getDataCourses(filterData)
      
      if (response) {
        stores.setKeySearch(keySearch)
        stores.setDataSearch(response.data)
      } else {
        stores.setKeySearch(keySearch)
        stores.setDataSearch([])
      }
      closeSeach()
      router.push('/search')
      data.value.keySearch = ''
    }
  } catch(err) {
    console.error('Lỗi:', err);
  }
}
const handleClickSearch = async () => {
  data.value.page = 1
  await handleSearch(data.value.keySearch, 1)
}
const closeSeach = () => {
  stores.setIsOpenSearch(false)
}
</script>


<style scoped>
.navbar-search-mobile {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
}
.search-input {
  border: none !important;
  padding: 20px;
}
.btn-close {
  width: 20px;
  height: 20px;
  border: 1px solid black;
  border-radius: 100%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
</style>
