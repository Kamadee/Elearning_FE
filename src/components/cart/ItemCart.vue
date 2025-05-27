<template>
  <div class="card-course">
    <div class="right-card">
      <img :src="replaceUrlImage(cartData.course.thumbnail) " class="thumbnail-course">
      <span class="title-course">{{ cartData.course.title }}</span>
    </div>
    <div class="left-card">
      <DeleteOutlined @click="removeItem" style="cursor:pointer"/>
      <div class="price-course">
        <div class="price-sale">{{ formatCurrency(cartData.price) }}</div>
        <div class="price-original"><del>{{ formatCurrency(cartData.course.original_price) }}</del></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { replaceUrlImage } from '@/utils/replaceUrlImage'
import { formatCurrency } from '@/utils/formatCurrency'

const props = defineProps({
  cartData: {
    type: Object,
    required: true
  }
})


const emit = defineEmits(['removeItem'])
const removeItem = () => {
  emit('removeItem', props.cartData.id)
}
</script>

<style scoped>
.card-course {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  border-top: 1px solid #d3d3d3;
  padding: 15px 0;
}

.right-card {
  display: flex;
  gap: 10px;
}

.thumbnail-course {
  object-fit: cover;
  width: 120px;
  height: 70px;
}

.left-card {
  display: inline-flex;
  justify-content: space-between;
  gap: 20px;
}

.price-course {
  display: flex;
  flex-direction: column;
}

.price-sale {
  font-weight: bold;
}

.price-original {
  color: gray;
}
</style>
