<template>
  <div class="history-wrapper">
    <div style="text-align: center; font-weight: bold; font-size: 20px">Lịch sử mua hàng</div>
    <table class="table">
        <thead>
            <tr>
                <th>#</th>
                <th>Mã code</th>
                <th>Tổng hóa đơn</th>
                <th>Thời gian tạo</th>
                <th>Thời gian thanh toán</th>
                <th>Tình trạng</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(history, index) in data.historyData" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ history.code }}</td>
                <td>{{ formatCurrency(history.amount) }}</td>
                <td>{{ history.created_at }}</td>
                <td>{{ history.payment_time }}</td>
                <td>
                  <span :class="{
                      'is-status-blue': history.status === 1 || history.status === 2,
                      'is-status-green': history.status === 3,
                      'is-status-red': history.status === 4
                  }">
                      {{ getStatusText(history.status) }}
                  </span>
                </td>
            </tr>
        </tbody>
    </table>

  </div>
</template>

<script setup>
import useCart from '@/composables/useCart';
import { onMounted, ref } from 'vue'
import { formatCurrency } from '@/utils/formatCurrency'

const data = ref({
  historyData: [],
  perPage: 12,
  page: 1
})

const getPaymentHistoryList = async () => {
  const response = await useCart().getPaymentHistoryList()
  console.log(response);
  
  if(response) {
    data.value.historyData = response.orders
  }
}

onMounted(() => {
  getPaymentHistoryList()
})

const getStatusText = (status) => {
  const statusMap = {
    1: 'Placed',
    2: 'Processing',
    3: 'Completed',
    4: 'Cancelled',
  }
  return statusMap[status] || 'Unknown'
}
</script>

<style scoped>
.history-wrapper {
  padding: 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.table {
    width: 100%;
    border-collapse: collapse;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.table thead {
    background-color: #f7f7f7;
}

.table th, .table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.table th {
    font-weight: bold;
    color: #333;
}

.table tbody tr:hover {
    background-color: #f1f1f1; /* Hiệu ứng hover */
}

.table tbody tr:nth-child(even) {
    background-color: #f9f9f9; /* Màu nền cho hàng chẵn */
}

.is-status-blue {
  background-color: #007BFF;
  color: white;
  padding: 5px 8px;
  border-radius: 8px;
}

.is-status-green {
  background-color: #28A745;
  color: white;
  padding: 5px 8px;
  border-radius: 8px;
}

.is-status-red {
  background-color: #DC3545;
  color: white;
  padding: 5px 8px;
  border-radius: 8px;
}
@media screen and (max-width:767px) {
  .history-wrapper {
    padding: 20px 10px;
  }
  th, td {
    font-size: 10px;
  }
}
</style>