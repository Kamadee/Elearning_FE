<template>
  <div class="cart-wrapper">
    <div class="list-course" v-if="cartData.length > 0">
      <h1 class="cart-title">Giỏ hàng</h1>
      <div class="cart-items-container">
        <div class="card-course-wrapper" v-for="cart in cartData" :key="cart.id">
          <ItemCart 
            :cartData="cart" 
            :appliedCoupon="appliedCoupon"
            v-loading="loadingStates[cart.id]" 
            @removeItem="removeItem" 
            @selectCoupon="handleSelectCoupon"
            @click="handleClickCourse(cart.course.id)"
          />
        </div>
      </div>
    </div>
    <div v-else-if="!isCartLoading" class="no-data">
      <NoData />
    </div>

    <div v-else class="no-data" v-loading="true"></div>

    <div class="payment-info" v-if="cartData.length > 0">
      <CheckoutCart :priceArray="prices" :appliedCoupon="appliedCoupon"/>
    </div>
  </div>
</template>

<script setup>
import ItemCart from '@/components/cart/ItemCart.vue'
import NoData from '@/components/NoData.vue'
import CheckoutCart from '@/components/cart/CheckoutCart.vue'
import useCart from '@/composables/useCart'
import { useNotify } from '@/composables/useNotify'
import { computed, ref } from "vue"
import { useRouter } from 'vue-router'

const router = useRouter()

const cartApi = useCart()
const { data: cartResponse, isPending: isCartLoading } = cartApi.useCartQuery()
const removeCartItem = cartApi.useRemoveCartItemMutation()
const cartData = computed(() => cartResponse.value?.contents ?? [])
const prices = computed(() => cartData.value.map((item) => item.price))

const appliedCoupon = ref(null)

const loadingStates = ref({})
const selectedCouponsByCourse = ref({})

const removeItem = async (id) => {
  loadingStates.value[id] = true
  try {
    const removedItem = cartData.value.find(item => item.id === id)
    const response = await removeCartItem.mutateAsync(id)
    if(response) {
      if (removedItem && removedItem.course) {
        delete selectedCouponsByCourse.value[removedItem.course.id]
      }
      
      const allCodes = []
      for (const cid in selectedCouponsByCourse.value) {
        allCodes.push(...selectedCouponsByCourse.value[cid])
      }
      const uniqueCodes = [...new Set(allCodes)]
      if (uniqueCodes.length > 0) {
        try {
          const res = await useCart().applyCoupon(uniqueCodes.join(','))
          appliedCoupon.value = res
        } catch (err) {
          appliedCoupon.value = null
        }
      } else {
        appliedCoupon.value = null
      }
    }
  } finally {
    setTimeout(() => {
      loadingStates.value[id] = false
    }, 2000);
  }
}

const handleSelectCoupon = async (codes, courseId) => {
  if (!codes || codes.length === 0) {
    delete selectedCouponsByCourse.value[courseId]
  } else {
    selectedCouponsByCourse.value[courseId] = codes
  }

  const allCodes = []
  for (const cid in selectedCouponsByCourse.value) {
    allCodes.push(...selectedCouponsByCourse.value[cid])
  }
  const uniqueCodes = [...new Set(allCodes)]

  if (uniqueCodes.length === 0) {
    appliedCoupon.value = null
    return
  }

  try {
    const joinedCodes = uniqueCodes.join(',')
    const response = await useCart().applyCoupon(joinedCodes)
    if (response) {
      appliedCoupon.value = response
      useNotify().notify('Áp dụng mã giảm giá thành công!', 'success')
    } else {
      appliedCoupon.value = null
      useNotify().notify('Mã giảm giá không hợp lệ hoặc không áp dụng được!', 'error')
    }
  } catch (err) {
    appliedCoupon.value = null
    useNotify().notify('Có lỗi xảy ra khi áp dụng mã giảm giá!', 'error')
  }
}

const handleClickCourse = (id) => {
  router.push(`/search/${id}`)
}
</script>

<style scoped>
.cart-wrapper {
  max-width: 1340px;
  margin: 0 auto;
  padding: 40px 80px;
  display: flex;
  gap: 32px;
}

.cart-title {
  font-size: 32px;
  font-weight: 700;
  color: #1c1d1f;
  margin: 0 0 32px 0;
  line-height: 1.2;
}

.list-course {
  display: flex;
  flex-direction: column;
  flex: 3;
}

.cart-items-container {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-course-wrapper {
  border-bottom: 1px solid #e0e0e0;
}

.card-course-wrapper:last-child {
  border-bottom: none;
}

.no-data {
  flex: 3;
}

.payment-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 0;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 24px;
}

@media screen and (max-width: 1024px) {
  .cart-wrapper {
    padding: 32px 40px;
    gap: 24px;
  }
}

@media screen and (max-width: 767px) {
  .cart-wrapper {
    flex-direction: column;
    padding: 20px 16px;
    gap: 24px;
  }
  
  .cart-title {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .payment-info {
    position: static;
    margin-top: 0;
  }
}
</style>
