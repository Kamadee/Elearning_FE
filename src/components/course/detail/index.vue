<template>
  <div class="detail-container">
    <BannerCourse :courseData="data.courseData"/>
    <div class="main-courses" style="">
      <ContentCourse :courseData="data.courseData"/>
      <hr style="margin-bottom: 0px">
      <div class="related-container">
        <RelatedCourse :categoryList="data.categoryList"/>
      </div>
      <div class="review-contaner">
        <ReviewCourse />
      </div>
    </div>
  </div>
</template>

<script setup>
import BannerCourse from '@/components/course/detail/BannerCourse.vue'
import ContentCourse from '@/components/course/detail/ContentCourse.vue'
import RelatedCourse from '@/components/course/detail/RelatedCourse.vue'
import ReviewCourse from '@/components/course/detail/ReviewCourse.vue'
import useCourse from '@/composables/useCourse';
import { ref, watchEffect, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const courseId = route.params.idCourse

const data = ref({
  courseData: "",
  categoryList: []
})

const getDetailCourse = async (courseId) => {
  const response = await useCourse().getDetailCourse(courseId)
  if(response) {
    data.value.courseData = response
    const categories = response.course_categories
    const categoriesName = categories.map(category => category.category_name)
    data.value.categoryList = categoriesName
  }
}

onMounted(() => {
  getDetailCourse(courseId)
})

watchEffect(() => {
  const id = route.params.idCourse
  if (!id) return
  getDetailCourse(id)
})

// const handleClickCard = async (id) => {
//   router.push(`/course//${id}`)
// }
</script>

<style scoped>
.detail-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.main-courses {
  margin: 40px 100px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.related-container {
  display: flex;
  width: 744px;
}

.review-contaner {
  display: flex;
  width: 744px;
}
</style>