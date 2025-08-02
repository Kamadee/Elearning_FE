<template>
  <div class="notification-container" @click="toggleNotification">
    <BellOutlined />
    <div class="dropdown" v-if="dropdown">
      <p style="border-bottom: 1px solid white; margin-bottom: 15px;">Thông báo</p>
      <div v-if="isAuthenticated && coursesNew.length > 0">
        <div class="list-notification" v-for="(course, index) of props.coursesNew" :key="index">
          <div class="item-notification" @click="markAsSeen(course)">
            <div class="item-right">
              <img :src="replaceUrlImage(course.thumbnail)" class="thumbnail-course">
              <div class="title-course">Vừa thêm mới: {{ course.title }} <p>({{ formatDate(course.created_at) }})</p></div>
            </div>
            <span class="unseen-dot" v-if="!course.isSeen"></span>
          </div>
        </div>
      </div>
      <div class="non-notification" v-else>Chưa có thông báo</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import  { useCounterStore } from '@/stores/authStore'
import { defineProps } from 'vue'
import { replaceUrlImage } from '@/utils/replaceUrlImage'
import { useRouter } from "vue-router";

const props = defineProps({
  coursesNew: {
    type: Array,
    required: true
  }
})

const stores = useCounterStore()
const isAuthenticated = computed(() => stores.isLogged)

const dropdown = ref(false)
const toggleNotification = () => {
  const isDropDown = !stores.getIsDropDown
  stores.setIsDropDown(isDropDown)
  if(stores.getIsDropDown === true) {
    dropdown.value = true
  } else {
    dropdown.value = false
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
  ];
  const month = months[date.getUTCMonth()];
  const day = date.getUTCDate()
  return `${month} ${day}`
}

const router = useRouter()
const markAsSeen = (course) => {
  course.isSeen = true
  router.push(`/search/${course.id}`)
}
</script>

<style scoped>
.notification-container {
  position: relative;
}

.dropdown {
  position: absolute;
  width: 400px;
  height: 300px;
  right: 0;
  top: 30px;
  padding: 20px 15px;
  z-index: 100;
  color: black;
  font-weight: bold !important;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid rgb(183, 183, 183);
  border-radius: 15px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.dropdown::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

.item-notification {
  height: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.item-right {
  display: flex;
  gap: 12px;
  width: 342px;
}

.unseen-dot {
  width: 10px;
  height: 10px;
  background-color: #1890ff;
  border-radius: 50%;
}

.thumbnail-course {
  object-fit: cover;
  width: 80px;
  height: 40px;
  flex: 1;
}

.title-course {
  font-weight: bold;
  font-size: 15px;
  flex: 4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.non-notification {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
