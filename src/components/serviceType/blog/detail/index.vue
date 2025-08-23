<template>
  <div class="detail-wrapper">
    <div class="back-list">
      <div class="create-blog">{{ new Date(data.createdAt).toLocaleDateString('vi-VN') }}</div>
    </div>
    <div class="blog-container">
      <div class="blog-content">
        <div class="blog-title"><h1>{{ data.title }}</h1></div>
        <div class="blog-thumbnail">
          <img :src="replaceUrlImage(data.thumbnail)" alt="">
        </div>
        <div style="display: flex; justify-content: space-between;">
          <div style="display: flex; gap: 8px">
            <div class="blog-tag"
              v-for="(tag, index) in data.tags"
              :key="index"
              >#{{ tag.tag_name }}</div>
          </div>
          
        </div>
        <div class="content" v-html="data.content"></div>
      </div>
      <div class="related-container"><RelatedBlog :postCategories="data.postCategories" /></div>
    </div>
  </div>
</template>

<script setup>
import RelatedBlog from '@/components/serviceType/blog/RelatedBlog.vue'
import { replaceUrlImage } from '@/utils/replaceUrlImage'
import { ref, onMounted, watchEffect } from 'vue';
import useBlog from '@/composables/useBlog';
import { useRoute } from 'vue-router';
import router from '@/router';

const route = useRoute()
const blogId = route.params.idBlog

const data = ref({
  title: "",
  thumbnail: "",
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
    data.value.thumbnail = response.thumbnail
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

const backBlog = () => {
  router.push('/blog')
}
</script>

<style scoped>
.detail-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 60px;

}
.back-list {
  display: flex;
  gap: 650px;
}

.icon-back {
  display: flex;
  align-items: center;
}

.back-list:hover {
  background-color: transparent !important;
}

.blog-container {
  display: flex;
  gap: 35px;
  
}

.blog-title h1 {
  font-size: 40px;
  font-weight: 700;
}

.blog-thumbnail {
  object-fit: cover;
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

@media screen and (max-width:767px) {
  .detail-wrapper {
    padding: 15px;
  }
  .icon-back {
    display: none !important;
  }
  .blog-container {
    display: flex;
    flex-direction: column;
  }
  .blog-title {
    font-size: 20px !important;
    font-weight: 700;
  }
  .blog-thumbnail img {
    height: 240px;
    width: 100%;
    object-fit: cover;
  }
}
</style>