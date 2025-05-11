<template>
  <div class="blog-container">
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :md="8" v-for="(blog, index) in data.blogList" :key="index" style="display:flex;">
        <ItemCard :blog="blog" v-loading="loadingStates[blog.id]" @clickCard="handleClickCard"/>
      </a-col>
    </a-row>
    <a-pagination
      :current="Number(data.page)"
      :page-size="Number(data.per_page)"
      :total="Number(data.total)"
      @change="handlePageChange"
      style="margin-top: 30px; text-align: center"
    />
  </div>
</template>


<script setup>
import  useBlog from '@/composables/useBlog';
import ItemCard from '@/components/serviceType/blog/ItemCard.vue'
import { ref } from 'vue';

const data = ref({
  blogList: [],
  page: 1,
  per_page: 12,
  total: 0
})

const filterData = { postCategories: [] }
const getDataBlogs = async () => {
  const response = await useBlog().getDataBlogs(data.value.page, data.value.per_page, filterData)
  if(response) {
    data.value.blogList = response.data
    data.value.page = response.page
    data.value.per_page = response.per_page
    data.value.total = response.total
  }
}
getDataBlogs()

const handlePageChange = (page) => {
  getDataBlogs(page)
}

const loadingStates = ref({})
const handleClickCard = async (id) => {
  loadingStates.value[id] = true
  try {
    window.location.href = `/blog/${id}`
  } finally {
    setTimeout(() => {
      loadingStates.value[id] = false
    }, 2000);
  }
}
</script>

<style scoped>
.blog-container {
  margin: 50px 120px;
}
</style>