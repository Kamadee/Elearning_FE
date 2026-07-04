<template>
  <div class="checkout-container">
    <div class="total-section">
      <div v-if="appliedCoupon" class="price-details">
        <div class="price-row">
          <span class="price-label">Tổng gốc:</span>
          <span class="original-amount">{{ formatCurrency(originalTotal) }}</span>
        </div>
        <div class="price-row coupon-discount">
          <span class="price-label">Giảm giá ({{ appliedCoupon.coupon_code }}):</span>
          <span class="discount-amount">-{{ formatCurrency(appliedCoupon.discount_amount) }}</span>
        </div>
        <div class="price-row final-row">
          <span class="total-label">Tổng cộng:</span>
          <span class="total-amount">{{ formatCurrency(appliedCoupon.final_total) }}</span>
        </div>
      </div>
      <div v-else class="price-row simple-total">
        <span class="total-label">Tổng:</span>
        <span class="total-amount">{{ formatCurrency(originalTotal) }}</span>
      </div>
    </div>
    <button class="button-checkout" @click="handleCheckout">Thanh toán</button>
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
  },
  appliedCoupon: {
    type: Object,
    default: null
  }
})

const originalTotal = computed(() => props.priceArray.length > 0 ?
 props.priceArray.reduce((acc, current) => acc + current, 0) : 0)

const handleCheckout = async () => {
  try {
    const couponCode = props.appliedCoupon ? props.appliedCoupon.coupon_code : null
    const response = await useCart().createPayment(couponCode)
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
  width: 100%;
}

.total-section {
  display: flex;
  flex-direction: column;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
  width: 100%;
}

.price-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.simple-total {
  padding: 8px 0;
}

.price-label {
  font-size: 14px;
  color: #6a6f73;
}

.original-amount {
  font-size: 15px;
  text-decoration: line-through;
  color: #6a6f73;
}

.coupon-discount .price-label {
  color: #10b981;
}

.coupon-discount .discount-amount {
  font-size: 15px;
  color: #10b981;
  font-weight: 600;
}

.final-row {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px dashed #e0e0e0;
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
