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
                        <td v-if="item == 'vnp_Amount'">{{ formatCurrency($route.query[item]?.slice(0, -2)) }}</td>
                        <td v-else-if="item == 'vnp_PayDate'">{{ formatVnpPayDate($route.query[item]) }}</td>
                        <td v-else>{{ $route.query[item] }}</td>
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

watch(() => route.query, (newQuery) => {
    updateOrderStatus(newQuery)
})

const updateOrderStatus = async (query) => {
    stores.setGettingData(true)
    try {
        const response = await useCart().updateOrderStatus(query)
        if(response) {
            const { notify } = useNotify()
            notify('Thông báo về thanh toán của bạn', 'info')
        }
        getOrderByCode()
    } finally {
        setTimeout(() => {
            stores.setGettingData(false);
        }, 200);
    }
}

onMounted(() => { 
    updateOrderStatus(route.query)
})

const getOrderByCode = async () => {
    stores.setGettingData(true)
    try {
        const response = await useCart().getOrderByCode(route.query.vnp_TxnRef)
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
