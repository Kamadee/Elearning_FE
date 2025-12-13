<template>
  <div class="card-wrapper">
    <div class="card-course" @click="handleClickCard">
      <div class="thumbnail-wrapper">
        <img :src="replaceUrlImage(course?.thumbnail || '')" :alt="course.title" />
      </div>
      <div class="course-content">
        <h3 class="course-title">{{ course.title }}</h3>
        <div class="course-rating" v-if="course.rating_average">
          <StarOutlined class="star-icon" />
          <span class="rating-value">{{ formatRating(course.rating_average) }}</span>
        </div>
        <p class="course-instructor">{{ course.author }}</p>
        <div class="course-price">
          <span class="current-price">{{ formatCurrency(course.sale_off_price) }}</span>
          <span class="original-price" v-if="course.original_price > course.sale_off_price">
            {{ formatCurrency(course.original_price) }}
          </span>
        </div>
        <div class="course-badges" v-if="course.course_categories && course.course_categories.length > 0">
          <span 
            class="badge" 
            v-for="(category, index) in course.course_categories.slice(0, 2)" 
            :key="index"
          >
            {{ category.category_name }}
          </span>
        </div>
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

const formatRating = (rating) => {
  if (!rating || rating === "0.00") return '0'
  return parseFloat(rating).toFixed(1)
}
</script>

<style scoped>
.card-wrapper {
  width: 100%;
}

.card-course {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.card-course:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
  border-color: #d1d1d1;
}

.thumbnail-wrapper {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #f7f9fa;
}

.thumbnail-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card-course:hover .thumbnail-wrapper img {
  transform: scale(1.05);
}

.course-content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 2px !important;
  flex: 1;
}

.course-title {
  font-size: 16px;
  font-weight: 700;
  color: #1c1d1f;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 0 2px 0 !important;
  min-height: 44px;
}

.course-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 2px 0;
}

.star-icon {
  font-size: 14px;
  color: #fbbf24;
  display: flex;
  align-items: center;
  fill: #fbbf24;
}

.rating-value {
  font-size: 13px;
  font-weight: 600;
  color: #1c1d1f;
  line-height: 1.4;
}

.course-instructor {
  font-size: 13px;
  color: #6a6f73;
  margin: 0;
  line-height: 1.4;
}

.course-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.current-price {
  font-size: 16px;
  font-weight: 700;
  color: #1c1d1f;
}

.original-price {
  font-size: 14px;
  color: #6a6f73;
  text-decoration: line-through;
}

.course-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.badge {
  background-color: #f3f4f5;
  color: #1c1d1f;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.4;
}
</style>