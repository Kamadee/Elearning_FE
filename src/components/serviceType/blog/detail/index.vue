<template>
  <div class="detail-wrapper">
    <div class="back-list">
      <router-link to="/blog">
        <ArrowLeftOutlined class="back-list"/>Trở về
      </router-link>
    </div>
    <div class="blog-container">
      <div class="blog-content">
        <div class="blog-title"><h1>{{ data.title }}</h1></div>
        <div style="display: flex; justify-content: space-between;">
          <div style="display: flex; gap: 8px">
            <div class="blog-tag"
              v-for="(tag, index) in data.tags"
              :key="index"
              >#{{ tag.tag_name }}</div>
          </div>
          <div class="create-blog">{{ new Date(data.createdAt).toLocaleDateString('vi-VN') }}</div>
        </div>
        <div class="content" v-html="data.content"></div>
      </div>
      <div class="related-container"><RelatedBlog :postCategories="data.postCategories" /></div>
    </div>
  </div>
</template>

<script setup>
import RelatedBlog from '@/components/serviceType/blog/RelatedBlog.vue'
import { ref, onMounted, watchEffect } from 'vue';
import useBlog from '@/composables/useBlog';
import { useRoute } from 'vue-router';

const route = useRoute()
const blogId = route.params.idBlog

const data = ref({
  title: "",
  tags: [],
  content: "",
  createdAt: "",
  updatedAt: "",
  postCategories: []
})

onMounted(async() => {
  const response = await useBlog().getDetailBlog(blogId)
  if(response) {
    data.value.title = response.title
    data.value.tags = response.post_tags
    data.value.content = response.content
    data.value.createdAt = response.created_at
    data.value.updatedAt = response.updated_at
    const categories = response.post_categories

    const categoriesId = categories.map(category => category.id)
    data.value.postCategories = categoriesId
  }
})

watchEffect(() => {
  const id = route.params.idBlog
  if (!id) return
  ;(async () => {
    const response = await useBlog().getDetailBlog(id)
    if (response) {
      data.value.title = response.title
      data.value.tags = response.post_tags
      data.value.content = response.content
      data.value.createdAt = response.created_at
      data.value.updatedAt = response.updated_at
      const categories = response.post_categories

      const categoriesId = categories.map(category => category.id)
      data.value.postCategories = categoriesId
    }
  })()
})
</script>

<style scoped>
.back-list {
  margin-left: 40px;
  margin-top: 20px;
}

.back-list:hover {
  background-color: transparent !important;
}

.blog-container {
  display: flex;
  gap: 35px;
  margin: 30px 100px;
}

.blog-title h1 {
  font-size: 50px;
  font-weight: 700;
}

.blog-content {
  flex: 4;
  overflow: hidden;

}

.content {
  margin-top: 30px;
}

.blog-tag {
  display: flex;
  gap: 10px;
}

.related-container {
  flex: 2;
  overflow: hidden;
}
</style>