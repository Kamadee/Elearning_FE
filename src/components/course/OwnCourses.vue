<template>
  <div class="course-container">
    <h2 class="section-title">{{ title }}</h2>
    <div class="courses-grid" v-if="paginatedCourses.length > 0">
      <div 
        v-for="(course, index) in paginatedCourses" 
        :key="index"
        class="course-item"
      >
        <ItemCourse :course="course" :hidePrice="true" :showProgress="true" v-loading="loadingStates[course.id]" @ClickCard="handleClickCard"/>
      </div>
    </div>
    <div class="no-courses" v-else>
      <p>Không có khóa học nào</p>
    </div>
    <div class="pagination-wrapper" v-if="total > data.per_page">
      <a-pagination
        :current="Number(data.page)"
        :page-size="Number(data.per_page)"
        :total="Number(total)"
        @change="handlePageChange"
        class="pagination"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import ItemCourse from '@/components/course/ItemCourse.vue'

const router = useRouter();

const data = ref({
  page: 1,
  per_page: 8,
})

const props = defineProps({
  courseData: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'Khóa học của tôi'
  }
})

// Tổng số item
const total = computed(() => props.courseData.length)

// Lấy dữ liệu đã phân trang
const paginatedCourses = computed(() => {
  const start = (data.value.page - 1) * data.value.per_page
  const end = start + data.value.per_page
  return props.courseData.slice(start, end)
})

const handlePageChange = (page) => {
  data.value.page = page
}

const loadingStates = ref({})

const handleClickCard = async (courseId) => {
  loadingStates.value[courseId] = true
  try {
    await router.push({
      name: 'play-course',
      params: { idCourse: courseId },
    })
  } finally {
    loadingStates.value[courseId] = false
  }
}
</script>

<style scoped>
.course-container {
  width: 100%;
  margin-top: 48px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1c1d1f;
  margin-bottom: 24px;
  line-height: 1.2;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.course-item {
  display: flex;
  width: 100%;
}

.no-courses {
  text-align: center;
  padding: 60px 20px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #6a6f73;
}

.no-courses p {
  font-size: 16px;
  margin: 0;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.pagination {
  display: flex;
  justify-content: center;
}

.pagination :deep(.ant-pagination-item) {
  border-color: #d1d1d1;
}

.pagination :deep(.ant-pagination-item-active) {
  background-color: #6d28d2;
  border-color: #6d28d2;
}

.pagination :deep(.ant-pagination-item-active a) {
  color: #fff;
}

.pagination :deep(.ant-pagination-item:hover) {
  border-color: #6d28d2;
}

.pagination :deep(.ant-pagination-item:hover a) {
  color: #6d28d2;
}

@media screen and (max-width: 1024px) {
  .courses-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }
}

@media screen and (max-width: 767px) {
  .course-container {
    margin-top: 32px;
  }

  .section-title {
    font-size: 20px;
    margin-bottom: 16px;
  }

  .courses-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }
}
</style>
