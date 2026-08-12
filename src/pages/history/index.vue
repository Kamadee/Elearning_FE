<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="history-page">
    <div class="history-shell">
      <div class="history-heading">
        <div><span class="eyebrow">ACCOUNT ACTIVITY</span><h1>Lịch sử mua hàng</h1><p>Theo dõi các giao dịch và trạng thái đơn hàng của bạn.</p></div>
        <div class="history-icon"><HistoryOutlined /></div>
      </div>
      <div v-if="data.historyData.length" class="history-card">
        <div class="history-table-wrap">
          <table class="history-table">
            <thead><tr><th>Mã đơn hàng</th><th>Tổng hóa đơn</th><th>Ngày tạo</th><th>Ngày thanh toán</th><th>Trạng thái</th></tr></thead>
            <tbody>
              <tr v-for="history in data.historyData" :key="history.id || history.code">
                <td><strong>{{ history.code }}</strong></td>
                <td>{{ formatCurrency(history.amount) }}</td>
                <td>{{ formatTime(history.created_at) }}</td>
                <td>{{ formatTime(history.payment_time) }}</td>
                <td><span class="status-badge" :class="`status-${history.status}`">{{ getStatusText(history.status) }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="history-mobile-list">
          <article v-for="history in data.historyData" :key="`mobile-${history.id || history.code}`" class="history-mobile-card">
            <div><span>Mã đơn hàng</span><strong>{{ history.code }}</strong></div>
            <div><span>Tổng hóa đơn</span><strong>{{ formatCurrency(history.amount) }}</strong></div>
            <div><span>Ngày thanh toán</span><strong>{{ formatTime(history.payment_time) }}</strong></div>
            <span class="status-badge" :class="`status-${history.status}`">{{ getStatusText(history.status) }}</span>
          </article>
        </div>
      </div>
      <div v-else class="empty-history"><HistoryOutlined /><h2>Chưa có lịch sử mua hàng</h2><p>Các đơn hàng hoàn tất sẽ xuất hiện ở đây.</p><router-link to="/" class="browse-btn">Khám phá khóa học</router-link></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import useCart from '@/composables/useCart'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatTime } from '@/utils/formatTime'

const data = ref({ historyData: [] })

const getPaymentHistoryList = async () => {
  const response = await useCart().getPaymentHistoryList()
  data.value.historyData = response?.orders ?? []
}

onMounted(getPaymentHistoryList)

const getStatusText = (status) => ({ 1: 'Placed', 2: 'Processing', 3: 'Completed', 4: 'Cancelled' }[status] || 'Unknown')
</script>

<style>
.history-page { min-height: 100vh; background: #f7f7fb; padding: 42px 24px 72px; }
.history-shell { max-width: 1180px; margin: 0 auto; }
.history-heading { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 26px; }
.eyebrow { color: #8064c9; font-size: 11px; font-weight: 700; letter-spacing: .12em; }
.history-heading h1 { margin: 8px 0 7px; color: #222330; font-size: 30px; }
.history-heading p { margin: 0; color: #858899; font-size: 14px; }
.history-icon { display: flex; align-items: center; justify-content: center; width: 52px; height: 52px; border: 1px solid #e6e2f3; border-radius: 14px; background: #f2edff; color: #6d28d2; font-size: 22px; }
.history-card { overflow: hidden; border: 1px solid #e7e7ee; border-radius: 16px; background: #fff; box-shadow: 0 10px 28px rgba(28, 29, 31, .05); }
.history-table { width: 100%; border-collapse: collapse; }
.history-table th { padding: 16px 20px; background: #fafafd; color: #777a8a; font-size: 11px; font-weight: 700; letter-spacing: .04em; text-align: left; text-transform: uppercase; }
.history-table td { padding: 19px 20px; border-top: 1px solid #efeff4; color: #666978; font-size: 13px; }
.history-table td strong { color: #282a38; font-weight: 600; }
.history-table tbody tr:hover { background: #fcfbff; }
.status-badge { display: inline-flex; align-items: center; border-radius: 999px; padding: 6px 11px; font-size: 11px; font-weight: 600; }
.status-1, .status-2 { background: #fff5dc; color: #a56b00; }.status-3 { background: #e8f8ef; color: #21864a; }.status-4 { background: #ffedef; color: #b34b5d; }
.history-mobile-list { display: none; }
.empty-history { display: flex; flex-direction: column; align-items: center; padding: 76px 24px; border: 1px dashed #d9d7e6; border-radius: 16px; background: #fff; text-align: center; }
.empty-history :deep(.anticon) { color: #9a82d8; font-size: 38px; }.empty-history h2 { margin: 18px 0 8px; color: #292b39; font-size: 20px; }.empty-history p { margin: 0 0 24px; color: #858899; font-size: 14px; }.browse-btn { border-radius: 8px; padding: 11px 18px; background: #6d28d2; color: #fff; font-size: 13px; text-decoration: none; }
@media (max-width: 760px) { .history-page { padding: 24px 16px 48px; }.history-heading h1 { font-size: 25px; }.history-icon { width: 44px; height: 44px; }.history-table-wrap { display: none; }.history-mobile-list { display: grid; gap: 12px; padding: 14px; }.history-mobile-card { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding: 16px; border: 1px solid #ececf2; border-radius: 12px; }.history-mobile-card div { display: flex; flex-direction: column; gap: 5px; }.history-mobile-card span:not(.status-badge) { color: #9294a1; font-size: 11px; }.history-mobile-card strong { color: #282a38; font-size: 13px; }.history-mobile-card .status-badge { justify-self: start; }.empty-history { padding: 56px 18px; } }
</style>
