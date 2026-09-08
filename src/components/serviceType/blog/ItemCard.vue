<template>
  <div class="card-wrapper">
    <div class="card-blog" @click="handleClickCard">
      <div class="thumbnail-blog">
        <img
          :src="replaceUrlImage(blog.thumbnail)"
          :alt="blog.title || 'Blog thumbnail'"
          loading="lazy"
          decoding="async"
        >
      </div>
      <div class="title-blog">{{ blog.title }}</div>
  </div>
  </div>
</template>

<script setup>
import { replaceUrlImage } from '@/utils/replaceUrlImage'

const { blog } = defineProps({
  blog: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['clickCard'])
const handleClickCard = () => {
  emit('clickCard', blog.id)
}
</script>

<style scoped>
.card-wrapper {
  width: 100%;
  height: 250px;
}
.card-blog {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: 1px solid rgb(171, 169, 169);
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s;
  padding: 12px;
}

.card-blog:hover {
  box-shadow: 0 8px 10px rgba(62, 62, 62, 0.1);
}

.thumbnail-blog {
  flex: 0 0 66.6666%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-blog img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
  transition: transform 0.3s ease;
}

.thumbnail-blog img:hover {
  transform: scale(1.15);
}

.title-blog {
  font-weight: bold;
  font-size: 16px;
  margin-top: 8px;
  line-height: 1.4;
  color: #333;
}

.description-blog {
  font-size: 14px;
  margin-top: 4px;
  color: #666;
  flex-grow: 1;
}

.description-blog {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  max-height: calc(1.5em * 2);
  line-height: 1.5em;
}

</style>
