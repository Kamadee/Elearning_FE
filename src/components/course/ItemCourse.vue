<template>
  <div class="card-wrapper">
    <div class="card-course" @click="handleClickCard">
      <div class="thumbnail-course"><img :src="replaceUrlImage(course?.thumbnail || '')"></div>
      <div class="title-course">{{ course.title }}</div>
      <div class="author-course">{{ course.author }}</div>
      <div class="price">
        <div class="sale-price">{{ formatCurrency(course.sale_off_price) }}</div>
        <div class="original-price"><del>{{ formatCurrency(course.original_price) }}</del></div>
      </div>
      <div class="category-list">
        <div class="category-course" v-for="(category, index) in course.course_categories" :key="index">{{ category.category_name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { replaceUrlImage } from '@/utils/replaceUrlImage'
import { formatCurrency } from '@/utils/formatCurrency'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['ClickCard'])
const handleClickCard = () => {
  emit('ClickCard', props.course.id)
}
</script>

<style scoped>
.card-wrapper {
  width: 100%;
  height: 380px;
}
.card-course {
  height: 100%;
  display: flex;
  flex-direction: column;
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
  flex: 0 0 66.6666%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-course img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
  transition: transform 0.3s ease;
}

.thumbnail-course img:hover {
  transform: scale(1.15);
}

.title-course {
  font-weight: bold;
  font-size: 16px;
  margin-top: 8px;
  line-height: 1.4;
  color: #333;
}

.author-course {
  color: gray;
  font-size: 12px;
}

.price {
  display: flex;
  gap: 10px;
}

.sale-price {
  font-weight: bold;
}

.original-price {
  color: gray;
}

.category-list {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.category-course {
  background-color: rgba(8, 239, 46, 0.2);
  color: rgb(71, 16, 147);
  padding: 4px 4px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 10px;
}

.category-course:hover {
  transform: scale(1.05);
}
</style>