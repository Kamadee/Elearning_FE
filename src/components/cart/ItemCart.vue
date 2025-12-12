<template>
  <div class="card-course">
    <div class="right-card">
      <div class="thumbnail-wrapper">
        <img :src="replaceUrlImage(cartData.course.thumbnail)" :alt="cartData.course.title" class="thumbnail-course">
      </div>
      <div class="course-info">
        <h3 class="title-course">{{ cartData.course.title }}</h3>
      </div>
    </div>
    <div class="left-card">
      <div class="price-course">
        <div class="price-sale">{{ formatCurrency(cartData.price) }}</div>
        <div class="price-original" v-if="cartData.course.original_price > cartData.price">
          <del>{{ formatCurrency(cartData.course.original_price) }}</del>
        </div>
      </div>
      <button class="remove-item" @click="removeItem">Xóa</button>
    </div>
  </div>
</template>

<script setup>
import { replaceUrlImage } from '@/utils/replaceUrlImage'
import { formatCurrency } from '@/utils/formatCurrency'
import { useCounterStore } from '@/stores/authStore'

const stores = useCounterStore()
const props = defineProps({
  cartData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['removeItem'])
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
