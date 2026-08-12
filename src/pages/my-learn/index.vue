<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="my-learn-container" v-loading="isLoading">
    <div class="my-learn-wrapper">
      <div class="page-header">
        <h1>My Learn</h1>
        <p>Tiếp tục hành trình học tập của bạn</p>
      </div>

      <OwnCourses :courseData="data.ownCourseData" title="Khóa học đã mua" />
      <OwnCourses :courseData="data.freeCourseData" title="Khóa học miễn phí đang học" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import OwnCourses from '@/components/course/OwnCourses.vue'
import useCart from '@/composables/useCart'
import useCourse from '@/composables/useCourse'
import { getFreeLearningCourses } from '@/composables/courseQueryUtils'

const isLoading = ref(false)
const data = ref({
  ownCourseData: [],
  freeCourseData: [],
})

const getMyCourses = async () => {
  const response = await useCourse().getDataCourses({ my_courses: true })
  return response?.data ?? []
}

const getPurchasedCourses = async (orders) => {
  const completedOrderIds = (orders ?? [])
    .filter((order) => order.status === 3)
    .map((order) => order.id)

  if (completedOrderIds.length === 0) return []

  const details = await Promise.all(
    completedOrderIds.map((orderId) => useCart().getHistoryDetail(orderId)),
  )
  return details.flatMap((detail) => detail?.courses ?? [])
}

const loadLearningData = async () => {
  isLoading.value = true
  try {
    const [history, myCourses] = await Promise.all([
      useCart().getPaymentHistoryList(),
      getMyCourses(),
    ])

    const purchasedCourses = await getPurchasedCourses(history?.orders)
    const progressByCourseId = new Map(myCourses.map((course) => [course.id, course.progress_percent]))

    data.value.ownCourseData = purchasedCourses.map((course) => ({
      ...course,
      progress_percent: progressByCourseId.get(course.id) ?? course.progress_percent,
    }))
    data.value.freeCourseData = getFreeLearningCourses(myCourses)
  } catch (error) {
    console.error('Error fetching learning courses:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(loadLearningData)
</script>

<style>
.my-learn-container { min-height: 100vh; background: #f7f7fb; }
.my-learn-wrapper { max-width: 1180px; margin: 0 auto; padding: 42px 24px 72px; }
.page-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px; border-bottom: 0; padding-bottom: 0; }
.eyebrow { color: #8064c9; font-size: 11px; font-weight: 700; letter-spacing: .12em; }
.browse-link { border-radius: 8px; padding: 11px 16px; background: #6d28d2; color: #fff; font-size: 13px; text-decoration: none; }
.browse-link:hover { background: #5b21b6; color: #fff; }
.learning-section { overflow: hidden; margin-top: 20px; border: 1px solid #e7e7ee; border-radius: 16px; background: #fff; box-shadow: 0 10px 28px rgba(28, 29, 31, .05); padding: 1px 24px 24px; }
.learning-section :deep(.course-container) { margin-top: 28px; }
.learning-section :deep(.section-title) { color: #292b39; font-size: 20px; }
.page-header h1 { margin: 0 0 8px; color: #1c1d1f; font-size: 32px; font-weight: 700; }
.page-header p { margin: 0; color: #6a6f73; font-size: 15px; }
@media screen and (max-width: 768px) {
  .my-learn-wrapper { padding: 24px 16px 48px; }
  .page-header { align-items: flex-start; flex-direction: column; gap: 18px; }
  .page-header h1 { font-size: 26px; }
  .learning-section { padding-inline: 14px; }
}
</style>
