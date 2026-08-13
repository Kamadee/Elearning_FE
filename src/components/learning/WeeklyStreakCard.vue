<template>
  <section class="streak-card" aria-label="Weekly learning streak">
    <div v-if="isLoading" class="streak-skeleton" aria-hidden="true"></div>
    <div v-else-if="isError" class="streak-error">
      <div><h2>Không thể tải weekly streak</h2><p>Danh sách khóa học vẫn khả dụng.</p></div>
      <button type="button" @click="refetch">Thử lại</button>
    </div>
    <template v-else>
      <div class="streak-intro">
        <h2>{{ view.heading }}</h2>
        <p v-if="view.watchCompleted">Bạn đã hoàn thành mục tiêu học tuần này.</p>
        <p v-else-if="view.visitCompleted">One ring down! Now, watch your course(s).</p>
        <p v-else>Mở course player và xem 30 phút nội dung để bắt đầu.</p>
        <span v-if="pendingCount" class="sync-status">Đang đồng bộ tiến độ...</span>
      </div>
      <div class="streak-current"><span class="streak-flame" aria-hidden="true">♨</span><div><div class="streak-value"><strong>{{ view.currentStreak }}</strong> weeks</div><span class="streak-label">Current streak · Best {{ view.longestStreak }}</span></div></div>
      <div class="streak-progress">
        <div class="progress-ring" :style="{ '--watch-progress': `${view.watchPercent * 3.6}deg` }" :aria-label="`${view.watchedMinutes} of 30 weekly course minutes`"></div>
        <div class="streak-stats"><div><i class="dot dot-orange"></i><strong>{{ view.watchedMinutes }}/30</strong> course min</div><div><i class="dot" :class="view.visitCompleted ? 'dot-green' : 'dot-gray'"></i><strong>{{ view.visitText }}</strong></div><span>{{ view.dateRange }}</span></div>
        <span class="info-icon" title="Mỗi tuần: mở course player một lần và xem đủ 30 phút nội dung video.">i</span>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useLearningStreakQuery } from '@/composables/streakQuery'
import { useStreakSync } from '@/composables/useStreakSync'
import { createStreakViewModel } from '@/utils/streakViewModel'

const { data, isLoading, isError, refetch } = useLearningStreakQuery()
const { pendingCount, refreshPendingCount } = useStreakSync()
const view = computed(() => createStreakViewModel(data.value))
onMounted(refreshPendingCount)
</script>

<style scoped>
.streak-card { display:grid; grid-template-columns:minmax(280px,1.3fr) minmax(180px,.7fr) minmax(330px,1fr); align-items:center; gap:32px; min-height:142px; margin-top:8px; padding:24px; border:1px solid #cfd3e5; border-radius:16px; background:#fff; }.streak-intro h2 { margin:0 0 7px; color:#18213b; font-size:23px; font-weight:700; }.streak-intro p { margin:0; color:#1d477d; font-size:15px; }.sync-status { display:block; margin-top:8px; color:#8064c9; font-size:13px; }.streak-current { display:flex; align-items:center; justify-content:center; gap:10px; }.streak-flame { color:#b9bfd3; font-size:38px; line-height:1; }.streak-value { color:#18213b; font-size:16px; white-space:nowrap; }.streak-value strong { margin-right:4px; font-size:26px; font-weight:500; }.streak-label { color:#9ba2bb; font-size:14px; }.streak-progress { display:flex; align-items:center; justify-content:flex-end; gap:15px; }.progress-ring { width:64px; height:64px; flex:0 0 64px; border-radius:50%; background:conic-gradient(#1eaa68 var(--watch-progress),#d9dce8 0); position:relative; }.progress-ring::after { content:''; position:absolute; inset:9px; border-radius:50%; background:#fff; }.streak-stats { display:flex; flex-direction:column; gap:4px; color:#1b3766; font-size:14px; line-height:1.35; }.streak-stats strong { color:#18213b; font-weight:700; }.streak-stats > span { color:#1d477d; }.dot { display:inline-block; width:8px; height:8px; margin-right:8px; border-radius:50%; }.dot-orange { background:#f49a0b; }.dot-green { background:#1eaa68; }.dot-gray { background:#b9bfd3; }.info-icon { display:flex; align-items:center; justify-content:center; width:16px; height:16px; border:1px solid #727992; border-radius:50%; color:#727992; font-size:11px; font-style:normal; }.streak-error { grid-column:1/-1; display:flex; align-items:center; justify-content:space-between; gap:16px; }.streak-error h2 { margin:0; font-size:18px; }.streak-error p { margin:6px 0 0; color:#6a6f73; }.streak-error button { border:0; border-radius:8px; padding:10px 14px; background:#6d28d2; color:#fff; }.streak-skeleton { grid-column:1/-1; height:78px; border-radius:12px; background:linear-gradient(90deg,#f1f2f7,#fafafd,#f1f2f7); background-size:200% 100%; animation:shimmer 1.2s infinite; }@keyframes shimmer { to { background-position:-200% 0; } }@media (max-width:768px) { .streak-card { grid-template-columns:1fr; gap:20px; padding:22px 20px; }.streak-current,.streak-progress { justify-content:flex-start; }.streak-error { align-items:flex-start; flex-direction:column; } }
</style>
