<template>
  <div class="blog-container">
    <div class="card-blog" v-for="(blog, index) in data.blogList" :key="index" style="display:flex;">
      <ItemCard :blog="blog" v-loading="loadingStates[blog.id]" @clickCard="handleClickCard"/>
    </div>
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
  padding: 40px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.card-blog {
  flex: 0 0 calc((100% - 2 * 16px) / 3);
}
@media screen and (max-width: 1024px) {
  .card-blog {
    flex: 1 0 calc((100% - 1 * 16px) / 2);
  }
}
@media screen and (max-width: 768px) {
  .card-blog {
    flex: 0 0 calc(100%);
  }
  .blog-container {
    padding: 60px;
  }
}
</style>