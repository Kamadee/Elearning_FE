<template>
  <div class="card-course">
    <div class="right-card">
      <img :src="replaceUrlImage(cartData.course.thumbnail) " class="thumbnail-course">
      <p class="title-course">{{ cartData.course.title }}</p>
    </div>
    <div class="left-card">
      <div class="price-course">
        <div class="price-sale">{{ formatCurrency(cartData.price) }}</div>
        <div class="price-original"><del>{{ formatCurrency(cartData.course.original_price) }}</del></div>
      </div>
      <a class="remove-item" @click="removeItem" style="cursor:pointer">Xóa</a>
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
  gap: 10px;
  border-top: 1px solid #d3d3d3;
  padding: 15px 0;
}

.right-card {
  flex: 4;
  max-width: 700px;
  display: flex;
  gap: 10px;
}

.thumbnail-course {
  object-fit: cover;
  width: 70px;
  height: 70px;
}
.remove-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: white;
}
.left-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

.title-course {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
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
@media screen and (max-width:767px) {
  .right-card {
    max-width: 350px;
  }
}
</style>
