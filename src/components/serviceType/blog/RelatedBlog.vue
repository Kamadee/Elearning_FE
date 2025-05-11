<template>
  <div class="related-wrapper">
    <h4>Bài viết liên quan</h4>
    <div class="related-container"
      v-for="(blog, index) in data.relatedBlogs" :key="index">
      <div class="card-related" @click="handleClickCard(blog.id)" v-loading="loadingStates[blog.id]">
        <div class="blog-thumbnail">
          <img :src="replaceUrlImage(blog.thumbnail)" alt="">
        </div>
        <div class="blog-content">
          <span class="blog-title">{{ blog.title }}</span>
          <div class="create-blog">{{ new Date(blog.created_at).toLocaleDateString('vi-VN') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import useBlog from '@/composables/useBlog';
import { replaceUrlImage } from '@/utils/replaceUrlImage'
import { useRouter } from 'vue-router';

const props = defineProps({
  postCategories: {
    type: Array,
    required: true
  }
})

const data = ref({
  relatedBlogs: [],
})

const getBlogRelated = async () => {
  const filterData = { postCategories: props.postCategories }
  const response = await useBlog().getDataBlogs(null, null, filterData)
  if(response) {
    data.value.relatedBlogs = response.data.slice(0, 4)
  }
}

// Theo dõi khi props.postCategories có giá trị
watch(
  () => props.postCategories,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      getBlogRelated()
    }
  },
  { immediate: true } // cũng gọi khi vừa mounted nếu có sẵn data
)

const router = useRouter()
const loadingStates = ref({})
const handleClickCard = async (id) => {
  loadingStates.value[id] = true
  try {
    router.push(`/blog/${id}`)
  } finally {
    setTimeout(() => {
      loadingStates.value[id] = false
    }, 500);
  }
}
</script>

<style scoped>
.related-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-related {
  height: 113px;
  width: 100%;
  display: flex;
  gap: 30px;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s;
  padding: 12px;
}

.card-related:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  border-color: #ddd;
  background-color: #fafafa;
}

.blog-content {
  display: flex;
  flex-direction: column;
}

.blog-thumbnail img {
  height: 64px;
  width: 106px;
  object-fit: cover;
  border-radius: 10px;
}

.blog-thumbnail {
  display: flex;
  align-items: center;
}

.blog-title {
  font-weight: 600;
  transition: color 0.2s;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  max-height: calc(1.5em * 2);
  line-height: 1.5em;
}

.card-related:hover .blog-title {
  color: #1e90ff;
}


</style>