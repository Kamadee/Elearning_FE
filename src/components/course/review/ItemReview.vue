<template>
  <div class="card-review">
    <div class="right-card">
      <img src="/images/img-signin.cba9a972.jpg" class="thumbnail-course">
    </div>
    <div class="left-card">
      <div class="title-course">{{ props.reviewData.customer.first_name }}</div>

      <div class="rating-card">
        <!-- <div class="description-course">{{ props.reviewData.rate }}</div> -->
        <div class="description-course"><a-rate :value="props.reviewData.rate" class="star" disabled /></div>
        <div class="author-course">{{ new Date(props.reviewData.created_at).toLocaleDateString('vi-VN') }}</div>
      </div>

      <div class="time-course">
        {{ props.reviewData.comment }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  reviewData: {
    type: Object,
    required: true
  }
})
</script>



<style scoped>
.card-review {
  display: flex;
  gap: 30px;
  border-top: 1px solid #d3d3d3;
  padding: 15px 15px;
  border: 1px solid rgb(210, 210, 210);
  border-radius: 10px;
}

.card-course:hover {
  background-color: rgb(231, 226, 226);
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.right-card {
  display: flex;
  gap: 10px;
  flex: 1;
}

.description-course {
  font-size: 12px;
}

.thumbnail-course {
  border-radius: 50%;
  object-fit: cover;
  width: 70px;
  height: 70px;
}

.title-course {
  font-weight: bold;
  font-size: 18px;
}

.left-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 8;
}

.rating-card {
  display: flex;
  gap: 15px;
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

.btn-cart {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(230, 197, 9);
  padding: 18px 14px;
  height: 32px;
  width: 190px;
  border-radius: 8px;
  background-color: #fff;
}

.btn-watch {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 18px 14px;
  height: 32px;
  width: 190px;
  border-radius: 8px;
  color: #fff;
  background-color: #28a745;
}

.btn-exist-cart {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 18px 14px;
  height: 32px;
  width: 190px;
  border-radius: 8px;
  color: #fff;
  background-color: rgb(230, 197, 9);
}

.btn-cart:hover {
  background-color: rgb(230, 197, 9);
  color: black;
}

.star {
  font-size: 10px;
  display: flex;
}
</style>