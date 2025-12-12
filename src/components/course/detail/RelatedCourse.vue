<template>
  <div class="related-course-container">
    <h2 class="section-title">Khóa học liên quan</h2>
    <div v-if="data.relatedCourses.length > 0">
      <!-- Mobile: List dọc -->
      <div class="mobile-list-container" v-if="isMobile">
        <div 
          class="mobile-course-item" 
          v-for="(course, index) in displayedCourses" 
          :key="course.id"
          @click="handleClickCard(course.id)"
        >
          <div class="mobile-thumbnail">
            <img :src="replaceUrlImage(course?.thumbnail || '')" :alt="course.title" />
          </div>
          <div class="mobile-course-info">
            <h3 class="mobile-course-title">{{ course.title }}</h3>
            <div class="mobile-course-meta">
              <span class="mobile-duration" v-if="course.duration">{{ course.duration }} total hours</span>
              <span class="mobile-updated" v-if="course.updated_at">{{ formatDate(course.updated_at) }}</span>
            </div>
            <div class="mobile-course-stats">
              <div class="mobile-rating" v-if="course.rating">
                <span class="rating-value">{{ course.rating }}</span>
                <span class="rating-star">★</span>
              </div>
              <div class="mobile-students" v-if="course.students_count">
                <span class="students-count">{{ formatNumber(course.students_count) }}</span>
              </div>
            </div>
            <div class="mobile-course-price">
              <span class="mobile-current-price">{{ formatCurrency(course.sale_off_price) }}</span>
              <span class="mobile-original-price" v-if="course.original_price > course.sale_off_price">
                {{ formatCurrency(course.original_price) }}
              </span>
            </div>
            <div class="mobile-badge" v-if="course.is_bestseller">
              <span class="bestseller-badge">Bestseller</span>
            </div>
          </div>
        </div>
        <div class="toggle-button-container" v-if="data.relatedCourses.length > 4">
          <button class="toggle-button" @click="toggleShowAll">
            {{ showAll ? 'Ẩn bớt' : 'Xem thêm' }}
          </button>
        </div>
      </div>
      
      <!-- Desktop: Swiper -->
      <div class="slide-container" v-else>
        <swiper
          :modules="[Navigation]"
          navigation
          :breakpoints="breakpoints"
        >
          <swiper-slide v-for="(course, index) in data.relatedCourses" :key="index">
            <ItemCourse 
              :course="course" 
              v-loading="loadingStates[course.id]" 
              @ClickCard="handleClickCard" 
            />
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div class="no-courses" v-else>
      <p>Không có khóa học liên quan</p>
    </div>
  </div>
</template>

<script setup>
import { replaceUrlImage } from '@/utils/replaceUrlImage'
import { formatCurrency } from '@/utils/formatCurrency'
import useCourse from '@/composables/useCourse';
import ItemCourse from '@/components/course/ItemCourse.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';

import 'swiper/css'
import 'swiper/css/navigation'

const props = defineProps({
  categoryList: {
    type: Array,
    required: true
  }
})

const data = ref({
  page: 1,
  per_page: 12,
  total: 0,
  relatedCourses: [],
})

const getCoursesRelated = async (page = data.value.page) => {
  data.value.page = page
  const filterData = { 
    category_name: props.categoryList,
    page: data.value.page,
    per_page: data.value.per_page
  }
  const response = await useCourse().getDataCourses(filterData)
  if(response) {
    data.value.relatedCourses = response.data
    data.value.page = response.current_page
    data.value.per_page = response.per_page
    data.value.total = response.total
  }
}
// Theo dõi khi props.categoryList có giá trị
watch(
  () => props.categoryList,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      data.value.page = 1
      getCoursesRelated(1)
    }
  },
  { deep: true } // cũng gọi khi vừa mounted nếu có sẵn data
)

// const route = useRoute()
// const categoryName = route.params.category

const breakpoints = {
  320: {
    slidesPerView: 1,
    spaceBetween: 12,
  },
  640: {
    slidesPerView: 2,
    spaceBetween: 16,
  },
  768: {
    slidesPerView: 3,
    spaceBetween: 16,
  },
  1024: {
    slidesPerView: 4,
    spaceBetween: 16,
  },
}

const loadingStates = ref({})
const isMobile = ref(false)
const showAll = ref(false)

const displayedCourses = computed(() => {
  if (!isMobile.value || showAll.value) {
    return data.value.relatedCourses
  }
  return data.value.relatedCourses.slice(0, 4)
})

const toggleShowAll = () => {
  showAll.value = !showAll.value
}

const handleClickCard = async (id) => {
  loadingStates.value[id] = true
  try {
    window.location.href = `/search/${id}`
  } finally {
    setTimeout(() => {
      loadingStates.value[id] = false
    }, 2000);
  }
}

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 767
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${month}/${year}`
}

const formatNumber = (num) => {
  if (!num) return ''
  return new Intl.NumberFormat('vi-VN').format(num)
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>
<style scoped>
.related-course-container {
  width: 100%;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1c1d1f;
  margin-bottom: 24px;
  line-height: 1.2;
}

.slide-container {
  width: 100%;
}

:deep(.swiper) {
  width: 100% !important;
  padding-bottom: 8px;
}

:deep(.swiper-wrapper) {
  width: 100% !important;
}

:deep(.swiper-slide) {
  box-sizing: border-box;
  height: auto;
  display: flex;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #1c1d1f;
  background-color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  margin-top: 0;
  top: 50%;
  transform: translateY(-50%);
}

:deep(.swiper-button-next:after),
:deep(.swiper-button-prev:after) {
  font-size: 16px;
  font-weight: 700;
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background-color: #f7f9fa;
}

:deep(.swiper-button-disabled) {
  opacity: 0.35;
}

.no-courses {
  text-align: center;
  padding: 40px 20px;
  color: #6a6f73;
}

/* Mobile List Styles */
.mobile-list-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mobile-course-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-course-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: #d1d1d1;
}

.mobile-thumbnail {
  flex-shrink: 0;
  width: 160px;
  height: 90px;
  border-radius: 4px;
  overflow: hidden;
  background: #f7f9fa;
}

.mobile-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mobile-course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.mobile-course-title {
  font-size: 14px;
  font-weight: 700;
  color: #1c1d1f;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mobile-course-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6a6f73;
}

.mobile-duration,
.mobile-updated {
  font-size: 12px;
  color: #6a6f73;
}

.mobile-course-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.mobile-rating {
  display: flex;
  align-items: center;
  gap: 2px;
  color: #b4690e;
  font-weight: 600;
}

.rating-value {
  font-size: 12px;
  font-weight: 700;
}

.rating-star {
  font-size: 12px;
  color: #f3ca8c;
}

.mobile-students {
  color: #6a6f73;
}

.students-count {
  font-size: 12px;
}

.mobile-course-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.mobile-current-price {
  font-size: 16px;
  font-weight: 700;
  color: #1c1d1f;
}

.mobile-original-price {
  font-size: 14px;
  color: #6a6f73;
  text-decoration: line-through;
}

.mobile-badge {
  margin-top: 4px;
}

.bestseller-badge {
  display: inline-block;
  background-color: #eceb98;
  color: #3d3c0a;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.toggle-button-container {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.toggle-button {
  background: transparent;
  border: 1px solid #1c1d1f;
  color: #1c1d1f;
  padding: 10px 24px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-button:hover {
  background-color: #f7f9fa;
}

@media screen and (max-width: 767px) {
  .section-title {
    font-size: 20px;
    margin-bottom: 16px;
  }
  
  .slide-container {
    display: none;
  }
  
  .mobile-thumbnail {
    width: 120px;
    height: 68px;
  }
  
  .mobile-course-title {
    font-size: 13px;
  }
  
  .mobile-current-price {
    font-size: 14px;
  }
}

@media screen and (min-width: 768px) {
  .mobile-list-container {
    display: none;
  }
}
</style>