<template>
  <div>
    <div class="total-payment">Total: {{ formatCurrency(totalAmount) }}</div>
    <button class="button-cart" @click="createPayment">Thanh toán</button>
  </div>
</template>

<script setup>
import { formatCurrency } from '@/utils/formatCurrency'
import { computed } from "vue"
import useCart from '@/composables/useCart'

const props = defineProps({
  priceArray: {
    type: Array,
    required: true
  }
})

const totalAmount = computed(() => props.priceArray.length > 0 ?
 props.priceArray.reduce((acc, current) => acc + current, 0) : 0)

const createPayment = async () => {
  const response = await useCart().createPayment()
  if(response) {
    window.location.href = response.payment_url
  } else {
    console.log('Không có khóa học nào trong giỏ!');
    return
  }
}
</script>

<style scoped>
.total-payment {
  font-weight: bold;
  font-size: 20px;
}

.button-cart {
  position: relative;
  align-items: center;
  display: inline-flex;
  background-color: #892de1;
  border-radius: 4px;
  cursor: pointer;
  padding: 11px 40px;
  border: none;
  color: #fff;
  width: 100%;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.button-cart:hover {
  background-color: rgba(137, 45, 225, 0.8);
  /* transform: scale(1.05); */
  box-shadow: 0 4px 20px rgba(137, 45, 225, 0.5);
}
</style>
