<template>
  <div class="checkout-container">
    <div class="total-section">
      <span class="total-label">Tổng:</span>
      <span class="total-amount">{{ formatCurrency(totalAmount) }}</span>
    </div>
    <button class="button-checkout" @click="createPayment">Thanh toán</button>
  </div>
</template>

<script setup>
import { formatCurrency } from '@/utils/formatCurrency'
import { computed } from "vue"
import useCart from '@/composables/useCart'
import { useCounterStore } from '@/stores/authStore'
import emitter from '@/utils/eventBus'
const stores = useCounterStore()
const props = defineProps({
  priceArray: {
    type: Array,
    required: true
  }
})

const totalAmount = computed(() => props.priceArray.length > 0 ?
 props.priceArray.reduce((acc, current) => acc + current, 0) : 0)

const createPayment = async () => {
  try {
    const response = await useCart().createPayment()
    if (stores && typeof stores.deleteAllInCart === 'function') {
      stores.deleteAllInCart()
    } else {
      localStorage.setItem('inCart', JSON.stringify([]))
    }
    emitter.emit('updateCountCart')

    if (response) {
      window.location.href = response.payment_url
    }
  } catch (err) {
    console.error('Payment creation failed:', err)
  }
}
</script>

<style scoped>
.checkout-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.total-label {
  font-size: 18px;
  font-weight: 600;
  color: #1c1d1f;
}

.total-amount {
  font-size: 24px;
  font-weight: 700;
  color: #1c1d1f;
}

.button-checkout {
  width: 100%;
  padding: 14px 24px;
  border: none;
  border-radius: 4px;
  background-color: #6d28d2;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  text-transform: none;
  letter-spacing: normal;
}

.button-checkout:hover {
  background-color: #5b21b6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(109, 40, 210, 0.4);
}

.button-checkout:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(109, 40, 210, 0.3);
}

@media screen and (max-width: 767px) {
  .total-label {
    font-size: 16px;
  }
  
  .total-amount {
    font-size: 20px;
  }
  
  .button-checkout {
    padding: 12px 20px;
    font-size: 14px;
  }
}
</style>
