<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="my-learn-container" v-loading="isLoading">
    <div class="my-learn-wrapper">
      <div class="page-header">
        <h1>My Learn</h1>
        <p>Tiếp tục hành trình học tập của bạn</p>
      </div>

      <WeeklyStreakCard />

      <section v-if="false" class="streak-card" aria-label="Weekly learning streak">
        <div class="streak-intro">
          <h2>Start a weekly streak</h2>
          <p>One ring down! Now, watch your course(s).</p>
        </div>
        <div class="streak-current">
          <span class="streak-flame" aria-hidden="true">♨</span>
          <div><div class="streak-value"><strong>0</strong> weeks</div><span class="streak-label">Current streak</span></div>
        </div>
        <div class="streak-progress">
          <div class="progress-ring" aria-label="0 percent weekly progress"></div>
          <div class="streak-stats"><div><i class="dot dot-orange"></i><strong>0/30</strong> course min</div><div><i class="dot dot-green"></i><strong>2/1</strong> visit</div><span>Aug 10 - 17</span></div>
          <span class="info-icon" title="Weekly learning goal">i</span>
        </div>
      </section>

      <OwnCourses :courseData="data.ownCourseData" title="Khóa học đã mua" />
      <OwnCourses :courseData="data.freeCourseData" title="Khóa học miễn phí đang học" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import OwnCourses from '@/components/course/OwnCourses.vue'
import WeeklyStreakCard from '@/components/learning/WeeklyStreakCard.vue'
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
.streak-card { display: grid; grid-template-columns: minmax(280px, 1.3fr) minmax(180px, .7fr) minmax(330px, 1fr); align-items: center; gap: 32px; min-height: 142px; margin-top: 8px; padding: 24px; border: 1px solid #cfd3e5; border-radius: 16px; background: #fff; }
.streak-intro h2 { margin: 0 0 7px; color: #18213b; font-size: 23px; font-weight: 700; }.streak-intro p { margin: 0; color: #1d477d; font-size: 15px; }
.streak-current { display: flex; align-items: center; justify-content: center; gap: 10px; }.streak-flame { color: #b9bfd3; font-size: 38px; line-height: 1; transform: rotate(180deg); }
.streak-value { color: #18213b; font-size: 16px; white-space: nowrap; }.streak-value strong { margin-right: 4px; font-size: 26px; font-weight: 500; }.streak-label { color: #9ba2bb; font-size: 14px; }
.streak-progress { display: flex; align-items: center; justify-content: flex-end; gap: 15px; }.progress-ring { position: relative; display: flex; align-items: center; justify-content: center; width: 64px; height: 64px; flex: 0 0 64px; border: 9px solid #d9dce8; border-radius: 50%; background: #fff; }.progress-ring::before { content: ''; width: 43px; height: 43px; border: 7px solid #1eaa68; border-radius: 50%; }
.streak-stats { display: flex; flex-direction: column; gap: 4px; color: #1b3766; font-size: 14px; line-height: 1.35; }.streak-stats strong { color: #18213b; font-weight: 700; }.streak-stats > span { color: #1d477d; }.dot { display: inline-block; width: 8px; height: 8px; margin-right: 8px; border-radius: 50%; }.dot-orange { background: #f49a0b; }.dot-green { background: #1eaa68; }.info-icon { display: flex; align-items: center; justify-content: center; width: 16px; height: 16px; border: 1px solid #727992; border-radius: 50%; color: #727992; font-size: 11px; font-style: normal; }
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
  .streak-card { grid-template-columns: 1fr; gap: 20px; padding: 22px 20px; }.streak-current, .streak-progress { justify-content: flex-start; }
}
</style>
