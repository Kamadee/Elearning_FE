<template>
  <div class="notification-container" ref="containerRef">
    <BellOutlined @click.stop="toggleNotification" />
    <transition name="dropdown-fade">
      <div class="dropdown" v-if="dropdown" @click.stop>
        <div class="dropdown-header">
          <h3 class="dropdown-title">Thông báo</h3>
        </div>
        <div class="dropdown-content">
          <div v-if="isAuthenticated && coursesNew.length > 0" class="notification-list">
            <div 
              class="notification-item" 
              v-for="(course, index) of props.coursesNew" 
              :key="index"
              :class="{ 'unseen': !course.isSeen }"
              @click="markAsSeen(course)"
            >
              <div class="notification-thumbnail">
                <img :src="replaceUrlImage(course.thumbnail)" :alt="course.title" />
              </div>
              <div class="notification-info">
                <div class="notification-title">{{ course.title }}</div>
                <div class="notification-meta">
                  <span class="notification-label">Vừa thêm mới</span>
                  <span class="notification-date">{{ formatDate(course.created_at) }}</span>
                </div>
              </div>
              <span class="unseen-dot" v-if="!course.isSeen"></span>
            </div>
          </div>
          <div class="no-notification" v-else>
            <p>Chưa có thông báo</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
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
const containerRef = ref(null)

const toggleNotification = () => {
  const isDropDown = !stores.getIsDropDown
  stores.setIsDropDown(isDropDown)
  if(stores.getIsDropDown === true) {
    dropdown.value = true
  } else {
    dropdown.value = false
  }
}

const closeDropdown = () => {
  if (dropdown.value) {
    stores.setIsDropDown(false)
    dropdown.value = false
  }
}

const handleClickOutside = (event) => {
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];
  const month = months[date.getUTCMonth()];
  const day = date.getUTCDate()
  return `${day} ${month}`
}

const router = useRouter()
const markAsSeen = (course) => {
  course.isSeen = true
  closeDropdown()
  router.push(`/search/${course.id}`)
}
</script>

<style scoped>
.notification-container {
  position: relative;
  display: flex;
  align-items: center;
  line-height: 1;
}

.notification-container :deep(.anticon) {
  font-size: 20px;
  display: flex;
  align-items: center;
  line-height: 1;
  cursor: pointer;
  transition: color 0.2s ease;
}

.notification-container :deep(.anticon:hover) {
  color: #6d28d2;
}

/* Dropdown Animation */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.3s ease;
}

.dropdown-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown {
  position: absolute;
  width: 380px;
  max-height: 480px;
  right: 0;
  top: calc(100% + 12px);
  z-index: 1000;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dropdown-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fff;
}

.dropdown-title {
  font-size: 18px;
  font-weight: 700;
  color: #1c1d1f;
  margin: 0;
  line-height: 1.2;
}

.dropdown-content {
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
}

.dropdown-content::-webkit-scrollbar {
  width: 6px;
}

.dropdown-content::-webkit-scrollbar-track {
  background: #f7f9fa;
}

.dropdown-content::-webkit-scrollbar-thumb {
  background: #d1d1d1;
  border-radius: 3px;
}

.dropdown-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.notification-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #f7f9fa;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background-color: #f7f9fa;
}

.notification-item.unseen {
  background-color: #f0f4ff;
}

.notification-item.unseen:hover {
  background-color: #e8f0f5;
}

.notification-thumbnail {
  flex-shrink: 0;
  width: 80px;
  height: 45px;
  border-radius: 4px;
  overflow: hidden;
  background: #f7f9fa;
}

.notification-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.notification-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notification-title {
  font-size: 14px;
  font-weight: 600;
  color: #1c1d1f;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.notification-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6a6f73;
}

.notification-label {
  font-weight: 500;
  color: #6d28d2;
}

.notification-date {
  color: #6a6f73;
}

.unseen-dot {
  position: absolute;
  top: 16px;
  right: 20px;
  width: 8px;
  height: 8px;
  background-color: #6d28d2;
  border-radius: 50%;
  flex-shrink: 0;
}

.no-notification {
  padding: 60px 20px;
  text-align: center;
}

.no-notification p {
  font-size: 14px;
  color: #6a6f73;
  margin: 0;
}

/* Responsive */
@media screen and (max-width: 767px) {
  .dropdown {
    width: calc(100vw - 32px);
    max-width: 380px;
    right: -16px;
  }
}

@media screen and (max-width: 480px) {
  .dropdown {
    width: calc(100vw - 24px);
    right: -12px;
  }
  
  .notification-item {
    padding: 12px 16px;
  }
  
  .notification-thumbnail {
    width: 70px;
    height: 40px;
  }
  
  .notification-title {
    font-size: 13px;
  }
}
</style>
