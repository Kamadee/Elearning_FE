<template>
  <div class="course-container">
    <h3 style="text-align: center; margin-bottom: 40px;">DANH SÁCH KHÓA HỌC ĐÃ MUA</h3>
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :md="6" v-for="(course, index) in paginatedCourses" :key="index" style="display:flex;">
        <ItemCourse :course="course" v-loading="loadingStates[course.id]" @clickCard="handleClickCard"/>
      </a-col>
    </a-row>
    <a-pagination
      :current="Number(data.page)"
      :page-size="Number(data.per_page)"
      :total="Number(total)"
      @change="handlePageChange"
      style="margin-top: 30px; text-align: center"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ItemCourse from '@/components/course/ItemCourse.vue'

const data = ref({
  page: 1,
  per_page: 8,
})

const props = defineProps({
  courseData: {
    type: Object,
    required: true
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
    window.location.href = `/search/${courseId}`
  } finally {
    setTimeout(() => {
      loadingStates.value[courseId] = false
    }, 2000);
  }
}
</script>
