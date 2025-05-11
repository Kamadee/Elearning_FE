<template>
  <div class="course-container">
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :md="6" v-for="(course, index) in data.courseList" :key="index" style="display:flex;">
        <ItemCourse :course="course" v-loading="loadingStates[course.id]" @clickCard="handleClickCard"/>
      </a-col>
    </a-row>
    <a-pagination
      :current="Number(data.page)"
      :page-size="Number(data.per_page)"
      :total="Number(data.total)"
      @change="handlePageChange"
      style="margin-top: 30px; text-align: center"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import useCourse from '@/composables/useCourse';
import { useRoute } from 'vue-router';
import ItemCourse from '@/components/course/ItemCourse.vue'

const data = ref({
  courseList: [],
  page: 1,
  per_page: 12,
  total: 0
})

// const router = useRouter()
const route = useRoute()
const categoryName = route.params.category

const getDataCourses = async (category, page = data.value.page) => {
  data.value.page = page;
  const filterData = {
    category_name: [category],
    page: data.value.page,
    per_page: data.value.per_page
  }
  
  const response = await useCourse().getDataCourses(filterData)
  if(response) {
    data.value.courseList = response.data
    data.value.page = response.current_page
    data.value.per_page = response.per_page
    data.value.total = response.total
  }
}

watch(() => route.params.category, async (newCategory) => {
  data.value.page = 1
  await getDataCourses(newCategory, 1)
}, { immediate: true })

const handlePageChange = (page) => {
  getDataCourses(page)
}

const loadingStates = ref({})

const handleClickCard = async (courseId) => {
  loadingStates.value[courseId] = true
  try {
    window.location.href = `/courses/${categoryName}/${courseId}`
  } finally {
    setTimeout(() => {
      loadingStates.value[courseId] = false
    }, 2000);
  }
}
</script>
