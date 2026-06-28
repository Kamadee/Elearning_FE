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
        <div class="course-price" v-if="!hidePrice">
          <span class="current-price">{{ formatCurrency(course.sale_off_price) }}</span>
          <span class="original-price" v-if="course.original_price > course.sale_off_price">
            {{ formatCurrency(course.original_price) }}
          </span>
        </div>
        <div ref="badgesContainer" class="course-badges" v-if="course.course_tags && course.course_tags.length > 0">
          <span 
            class="badge badge-tag" 
            v-for="(tag, index) in course.course_tags" 
            :key="index"
            v-show="isExpanded || index < limitIndex"
          >
            {{ tag.tag_name }}
          </span>
          <span 
            v-if="hasOverflow" 
            class="badge badge-more" 
            @click.stop="toggleExpand"
          >
            {{ isExpanded ? 'Ẩn bớt' : '...' }}
          </span>
        </div>
        
        <!-- Progress Bar -->
        <div v-if="showProgress && course.progress_percent !== undefined && course.progress_percent !== null" class="progress-container">
          <div class="progress-bar-wrapper">
            <div class="progress-bar-fill" :style="{ width: course.progress_percent + '%' }"></div>
          </div>
          <span class="progress-text">{{ course.progress_percent }}% đã hoàn thành</span>
        </div>
      </div>
    </div>
  </div></template>

<script setup>
import { replaceUrlImage } from '@/utils/replaceUrlImage'
import { formatCurrency } from '@/utils/formatCurrency'
import { defineProps, defineEmits, ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

const props = defineProps({
  course: {
    type: Object,
    required: true
  },
  hidePrice: {
    type: Boolean,
    default: false
  },
  showProgress: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['ClickCard'])
const handleClickCard = () => {
  emit('ClickCard', props.course.id)
}

const badgesContainer = ref(null)
const isExpanded = ref(false)
const hasOverflow = ref(false)
const limitIndex = ref(999)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const checkOverflow = () => {
  if (!badgesContainer.value || !props.course.course_tags || props.course.course_tags.length === 0) {
    hasOverflow.value = false
    limitIndex.value = 999
    return
  }

  // 1. Reset to measure natural size
  limitIndex.value = 999
  hasOverflow.value = false

  nextTick(() => {
    const container = badgesContainer.value
    if (!container) return

    const containerWidth = container.clientWidth
    const children = container.querySelectorAll('.badge-tag')
    if (children.length === 0) return

    let totalWidth = 0
    const gap = 6 // gap: 6px
    let overflowDetected = false

    // Width of '...' button badge is roughly 24px + 6px gap = 30px
    const moreBtnWidth = 30

    for (let i = 0; i < children.length; i++) {
      const childWidth = children[i].getBoundingClientRect().width
      const itemWidth = childWidth + (i > 0 ? gap : 0)

      if (totalWidth + itemWidth > containerWidth) {
        overflowDetected = true
        break
      }
      totalWidth += itemWidth
    }

    if (overflowDetected) {
      hasOverflow.value = true
      let currentWidth = 0
      let countWithMore = 0
      for (let i = 0; i < children.length; i++) {
        const childWidth = children[i].getBoundingClientRect().width
        const itemWidth = childWidth + (i > 0 ? gap : 0)
        if (currentWidth + itemWidth + gap + moreBtnWidth > containerWidth) {
          break
        }
        currentWidth += itemWidth
        countWithMore++
      }
      limitIndex.value = Math.max(1, countWithMore)
    } else {
      hasOverflow.value = false
      limitIndex.value = 999
    }
  })
}

onMounted(() => {
  checkOverflow()
  window.addEventListener('resize', checkOverflow)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkOverflow)
})

watch(() => props.course.course_tags, () => {
  checkOverflow()
}, { deep: true })

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

.badge-more {
  background-color: #e0e0e0;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.badge-more:hover {
  background-color: #d1d7dc;
  color: #5624d0;
}

.progress-container {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.progress-bar-wrapper {
  width: 100%;
  height: 6px;
  background-color: #f3f4f5;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background-color: #34a853; /* green */
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 11px;
  font-weight: 600;
  color: #155724;
}
</style>