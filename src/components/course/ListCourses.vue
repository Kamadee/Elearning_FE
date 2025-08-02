<template>
  <div class="course-list">
    <div class="row-course">
      <div class="card-course" v-for="(course, index) in data.courseList" :key="index">
        <ItemCourse :course="course" v-loading="loadingStates[course.id]" @clickCard="handleClickCard" />
      </div>
    </div>
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
    }, 2000)
  }
}
</script>

<style scoped>
.course-list {
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.row-course {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.card-course {
  flex: 0 0 calc((100% - 3 * 16px) / 4);
}

@media screen and (max-width: 1024px) {
  .card-course {
    flex: 1 0 calc((100% - 2 * 16px) / 3);
  }
}
@media screen and (max-width: 768px) {
  .card-course {
    flex: 0 0 calc(100%);
  }
}
</style>
