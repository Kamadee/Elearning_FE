<template>
    <div v-loading="gettingData" class="container bg-white mt-5 shadow p-3 mb-5 bg-body-tertiary rounded">
        <h3 class="display-3">{{ orderStatus }}</h3>
        <div class="border border-success rounded p-2 mb-2">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Danh mục</th>
                        <th scope="col">Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(value, item) in objectMapKey" :key="item">
                        <th scope="row">{{ value }}</th>
                        <td v-if="item == 'vnp_Amount'">{{ formatCurrency(getQueryValue(item)?.slice(0, -2)) }}</td>
                        <td v-else-if="item == 'vnp_PayDate'">{{ formatVnpPayDate(getQueryValue(item)) }}</td>
                        <td v-else>{{ getQueryValue(item) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="container">
        <a href="/" class="btn btn-primary">Go Home</a>
        <a href="/profile" class="btn btn-primary ms-5">Go to Profile</a>
    </div>
</template>

<script setup>
import { formatCurrency } from '@/utils/formatCurrency'
import { onMounted, ref, computed, watch } from "vue"
import useCart from '@/composables/useCart'
import { useRoute } from 'vue-router'
import  { useCounterStore } from '@/stores/authStore'
import { useNotify } from '@/composables/useNotify';

const stores = useCounterStore()
const gettingData = computed(() => stores.getGettingData);
const objectMapKey = {
    "vnp_Amount": "Giá tiền",
    "vnp_BankCode": "Ngân hàng",
    "vnp_CardType": "Phương thức thanh toán",
    "vnp_OrderInfo": "Thông tin thanh toán",
    "vnp_PayDate": "Ngày thanh toán",
    "vnp_TmnCode": "Code",
}
const orderStatus = ref('')
const route = useRoute()

// Lấy query params từ URL thực tế (hỗ trợ cả localhost và ngrok)
const getQueryParams = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const params = {}
    for (const [key, value] of urlParams.entries()) {
        params[key] = value
    }
    return params
}

watch(() => route.query, (newQuery) => {
    // Kiểm tra nếu có params trong URL thì dùng, không thì dùng route.query
    const urlParams = getQueryParams()
    const queryToUse = Object.keys(urlParams).length > 0 ? urlParams : newQuery
    if (Object.keys(queryToUse).length > 0) {
        updateOrderStatus(queryToUse)
    }
})

const updateOrderStatus = async (query) => {
    // Kiểm tra nếu không có query params thì không làm gì
    if (!query || Object.keys(query).length === 0) {
        return
    }
    
    stores.setGettingData(true)
    try {
        const response = await useCart().updateOrderStatus(query)
        if(response) {
            const { notify } = useNotify()
            notify('Thông báo về thanh toán của bạn', 'info')
        }
        // Lấy vnp_TxnRef từ query để get order
        const txnRef = query.vnp_TxnRef || route.query.vnp_TxnRef
        if (txnRef) {
            getOrderByCode(txnRef)
        }
    } finally {
        setTimeout(() => {
            stores.setGettingData(false);
        }, 200);
    }
}

onMounted(() => { 
    // Ưu tiên lấy từ URL thực tế, sau đó mới dùng route.query
    const urlParams = getQueryParams()
    const queryToUse = Object.keys(urlParams).length > 0 ? urlParams : route.query
    if (Object.keys(queryToUse).length > 0) {
        updateOrderStatus(queryToUse)
    }
})

const getOrderByCode = async (txnRef) => {
    if (!txnRef) {
        // Thử lấy từ URL hoặc route.query
        const urlParams = getQueryParams()
        txnRef = urlParams.vnp_TxnRef || route.query.vnp_TxnRef
    }
    
    if (!txnRef) {
        return
    }
    
    stores.setGettingData(true)
    try {
        const response = await useCart().getOrderByCode(txnRef)
        if(response) {
            switch (response.status) {
                case 1:
                    orderStatus.value = "Đơn hàng đã đặt"
                    break;
                case 2:
                    orderStatus.value = "Đơn hàng đang xử lý"
                    break;
                case 3:
                    orderStatus.value = "Đơn hàng đã hoàn thành"
                    break;
                case 4:
                    orderStatus.value = "Đơn hàng đã được hủy"
                    break;
                default:
                    orderStatus.value = "Trạng thái không xác định";
            }
        }
    } finally {
        setTimeout(() => {
            stores.setGettingData(false);
        }, 200);
    }
}

// Helper function để lấy giá trị từ query params (ưu tiên URL thực tế)
const getQueryValue = (key) => {
    const urlParams = getQueryParams()
    return urlParams[key] || route.query[key] || ''
}

const formatVnpPayDate = (vnpPayDate) => {
  if (!vnpPayDate || vnpPayDate.length !== 14) return '';

  const year = vnpPayDate.slice(0, 4);
  const month = vnpPayDate.slice(4, 6);
  const day = vnpPayDate.slice(6, 8);
  const hour = vnpPayDate.slice(8, 10);
  const minute = vnpPayDate.slice(10, 12);
  const second = vnpPayDate.slice(12, 14);

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
</script>
