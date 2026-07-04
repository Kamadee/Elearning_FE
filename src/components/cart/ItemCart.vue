<template>
  <div class="card-course">
    <div class="right-card">
      <div class="thumbnail-wrapper">
        <img :src="replaceUrlImage(cartData.course.thumbnail)" :alt="cartData.course.title" class="thumbnail-course">
      </div>
      <div class="course-info">
        <h3 class="title-course">{{ cartData.course.title }}</h3>
        <!-- Coupon Selector -->
        <div class="coupon-selector" v-if="coupons.length > 0" @click.stop>
          <span class="coupon-label">Mã giảm giá:</span>
          <a-select
            v-model:value="selectedCouponCodes"
            mode="multiple"
            placeholder="Chọn mã giảm giá"
            style="width: 250px;"
            size="small"
            allow-clear
            @change="handleCouponChange"
          >
            <a-select-option v-for="coupon in coupons" :key="coupon.code" :value="coupon.code">
              {{ coupon.code }} (-{{ coupon.discount_type === 'percent' ? coupon.discount_value + '%' : formatCurrency(coupon.discount_value) }}) [{{ coupon.type === 'system' ? 'Hệ thống' : 'Khóa học' }}]
            </a-select-option>
          </a-select>
        </div>
      </div>
    </div>
    <div class="left-card">
      <div class="price-course">
        <div class="price-sale">{{ formatCurrency(displayPrice) }}</div>
        <div class="price-original" v-if="originalPrice > displayPrice">
          <del>{{ formatCurrency(originalPrice) }}</del>
        </div>
      </div>
      <button class="remove-item" @click.stop="removeItem">Xóa</button>
    </div>
  </div>
</template>

<script setup>
import { replaceUrlImage } from '@/utils/replaceUrlImage'
import { formatCurrency } from '@/utils/formatCurrency'
import { useCounterStore } from '@/stores/authStore'
import useCart from '@/composables/useCart'
import { ref, onMounted, computed, watch } from 'vue'

const stores = useCounterStore()
const props = defineProps({
  cartData: {
    type: Object,
    required: true
  },
  appliedCoupon: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['removeItem', 'selectCoupon'])

const coupons = ref([])
const loadingCoupons = ref(false)
const selectedCouponCodes = ref([])
const previousSelectedCodes = ref([])

const fetchCoupons = async () => {
  loadingCoupons.value = true
  try {
    const res = await useCart().getCourseCoupons(props.cartData.course.id)
    if (res) {
      coupons.value = res
    }
  } catch (err) {
    console.error('Failed to fetch coupons:', err)
  } finally {
    loadingCoupons.value = false
  }
}

onMounted(() => {
  fetchCoupons()
})

const syncSelectedCoupons = () => {
  if (!props.appliedCoupon || !props.appliedCoupon.coupons_info) {
    selectedCouponCodes.value = []
    previousSelectedCodes.value = []
    return
  }

  const currentCodes = props.appliedCoupon.coupons_info
    .filter(info => {
      if (info.type === 'course') {
        return Number(info.course_id) === Number(props.cartData.course.id)
      }
      if (info.type === 'system') {
        return coupons.value.some(c => c.code === info.code)
      }
      return false
    })
    .map(info => info.code)

  selectedCouponCodes.value = currentCodes
  previousSelectedCodes.value = [...currentCodes]
}

watch(() => props.appliedCoupon, syncSelectedCoupons, { deep: true })
watch(coupons, syncSelectedCoupons)

const displayPrice = computed(() => {
  if (props.appliedCoupon && props.appliedCoupon.coupons_info) {
    const info = props.appliedCoupon.coupons_info.find(
      x => x.type === 'course' && Number(x.course_id) === Number(props.cartData.course.id)
    )
    if (info) {
      return Math.max(0, props.cartData.price - info.discount_amount)
    }
  }
  return props.cartData.price
})

const originalPrice = computed(() => {
  if (props.appliedCoupon && props.appliedCoupon.coupons_info) {
    const info = props.appliedCoupon.coupons_info.find(
      x => x.type === 'course' && Number(x.course_id) === Number(props.cartData.course.id)
    )
    if (info) {
      return props.cartData.price
    }
  }
  return props.cartData.course.original_price
})

const handleCouponChange = (selectedValues) => {
  const added = selectedValues.filter(x => !previousSelectedCodes.value.includes(x))

  if (added.length > 0) {
    const newCouponCode = added[0]
    const newCoupon = coupons.value.find(c => c.code === newCouponCode)
    if (newCoupon) {
      if (newCoupon.type === 'system') {
        const otherCoupons = selectedValues.filter(code => {
          const c = coupons.value.find(item => item.code === code)
          return c && c.type !== 'system'
        })
        selectedValues = [...otherCoupons, newCouponCode]
      } else if (newCoupon.type === 'course') {
        const otherCoupons = selectedValues.filter(code => {
          const c = coupons.value.find(item => item.code === code)
          return c && c.type !== 'course'
        })
        selectedValues = [...otherCoupons, newCouponCode]
      }
    }
  }

  let finalSelected = []
  let hasSystem = false
  let hasCourse = false
  for (let i = selectedValues.length - 1; i >= 0; i--) {
    const code = selectedValues[i]
    const c = coupons.value.find(item => item.code === code)
    if (c) {
      if (c.type === 'system' && !hasSystem) {
        finalSelected.unshift(code)
        hasSystem = true
      } else if (c.type === 'course' && !hasCourse) {
        finalSelected.unshift(code)
        hasCourse = true
      }
    }
  }

  selectedCouponCodes.value = finalSelected
  previousSelectedCodes.value = [...finalSelected]

  emit('selectCoupon', finalSelected, props.cartData.course.id)
}

const removeItem = () => {
  stores.deleteInCart(props.cartData.course.id)
  emit('removeItem', props.cartData.id)
}
</script>

<style scoped>
.card-course {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: #fff;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.card-course:hover {
  background-color: #f7f9fa;
}

.right-card {
  flex: 1;
  display: flex;
  gap: 16px;
  align-items: center;
  min-width: 0;
}

.thumbnail-wrapper {
  flex-shrink: 0;
  width: 120px;
  height: 68px;
  border-radius: 4px;
  overflow: hidden;
  background: #f7f9fa;
}

.thumbnail-course {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card-course:hover .thumbnail-course {
  transform: scale(1.05);
}

.course-info {
  flex: 1;
  min-width: 0;
}

.title-course {
  font-size: 16px;
  font-weight: 700;
  color: #1c1d1f;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.coupon-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

.coupon-label {
  font-size: 13px;
  color: #6a6f73;
  font-weight: 500;
}

.left-card {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  min-width: 140px;
}

.price-course {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.price-sale {
  font-size: 18px;
  font-weight: 700;
  color: #1c1d1f;
}

.price-original {
  font-size: 14px;
  color: #6a6f73;
}

.price-original del {
  text-decoration: line-through;
}

.remove-item {
  background: transparent;
  border: 1px solid #d1d1d1;
  color: #1c1d1f;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.remove-item:hover {
  background-color: #f7f9fa;
  border-color: #6d28d2;
  color: #6d28d2;
}

.remove-item:active {
  transform: scale(0.98);
}

@media screen and (max-width: 767px) {
  .card-course {
    padding: 12px 16px;
    gap: 12px;
  }
  
  .right-card {
    gap: 12px;
  }
  
  .thumbnail-wrapper {
    width: 100px;
    height: 56px;
  }
  
  .title-course {
    font-size: 14px;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  .coupon-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    margin-top: 8px;
  }
  
  .left-card {
    min-width: 100px;
    gap: 8px;
  }
  
  .price-sale {
    font-size: 16px;
  }
  
  .price-original {
    font-size: 12px;
  }
  
  .remove-item {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>
