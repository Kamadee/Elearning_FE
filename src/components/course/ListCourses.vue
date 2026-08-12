<template>
  <div class="course-list">
    <div class="row-course">
      <div class="card-course" v-for="course in courseList" :key="course.id">
        <ItemCourse :course="course" v-loading="loadingStates[course.id]" @clickCard="handleClickCard" />
      </div>
    </div>
    <a-pagination
      :current="currentPage"
      :page-size="perPage"
      :total="totalCourses"
      @change="handlePageChange"
      style="margin-top: 30px; text-align: center"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ItemCourse from '@/components/course/ItemCourse.vue'
import { useCategoryCoursesQuery } from '@/composables/courseQuery';

const route = useRoute()
const categoryName = computed(() => route.params.category)
const currentPage = ref(1)
const perPage = ref(12)

const { data: coursesResponse } = useCategoryCoursesQuery({
  category: categoryName,
  page: currentPage,
  perPage,
})

const courseList = computed(() => coursesResponse.value?.data ?? [])
const totalCourses = computed(() => Number(coursesResponse.value?.total ?? 0))

const handlePageChange = (page) => {
  currentPage.value = page
}

watch(categoryName, () => {
  currentPage.value = 1
})

const loadingStates = ref({})

const handleClickCard = async (courseId) => {
  loadingStates.value[courseId] = true
  try {
    window.location.href = `/courses/${categoryName.value}/${courseId}`
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
