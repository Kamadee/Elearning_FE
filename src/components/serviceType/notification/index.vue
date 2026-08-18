<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div ref="containerRef" class="notification-container">
    <button
      class="notification-trigger"
      type="button"
      aria-label="Mở thông báo"
      @click.stop="toggleNotification"
    >
      <BellOutlined />
    </button>

    <transition name="dropdown-fade">
      <div v-if="dropdown" class="dropdown" @click.stop>
        <div class="dropdown-header">
          <h3 class="dropdown-title">Thông báo</h3>
          <span v-if="unreadCount" class="dropdown-unread">{{ unreadCount }} chưa đọc</span>
        </div>

        <div class="dropdown-content">
          <div v-if="isLoading" class="notification-state">Đang tải thông báo...</div>
          <div v-else-if="hasError" class="notification-state notification-error">
            <p>Không thể tải thông báo.</p>
            <button type="button" class="retry-button" @click="$emit('retry')">Thử lại</button>
          </div>
          <div v-else-if="!notifications.length" class="notification-state">Chưa có thông báo</div>
          <div v-else class="notification-list">
            <button
              v-for="notification in notifications"
              :key="notification.id"
              type="button"
              class="notification-item"
              :class="{ unread: !notification.read_at }"
              :disabled="isMarkingRead === notification.id"
              @click="$emit('mark-read', notification)"
            >
              <span class="notification-icon"><ShoppingCartOutlined /></span>
              <span class="notification-info">
                <strong class="notification-title">{{ notification.title }}</strong>
                <span class="notification-message">{{ notification.message }}</span>
                <span class="notification-meta">
                  <span v-if="notification.order?.code">Đơn {{ notification.order.code }}</span>
                  <span
                    v-if="
                      notification.order?.amount !== undefined &&
                      notification.order?.amount !== null
                    "
                  >
                    {{ formatNotificationAmount(notification.order.amount) }}
                  </span>
                  <span>{{ formatNotificationDate(notification.createdAt) }}</span>
                </span>
              </span>
              <span v-if="!notification.read_at" class="unread-dot" aria-label="Chưa đọc"></span>
            </button>
          </div>
        </div>

        <p v-if="actionError" class="action-error">{{ actionError }}</p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { BellOutlined, ShoppingCartOutlined } from '@ant-design/icons-vue'
import { useCounterStore } from '@/stores/authStore'
import { formatNotificationAmount, formatNotificationDate } from './notificationViewModel'

defineProps({
  notifications: { type: Array, default: () => [] },
  unreadCount: { type: [Number, String], default: 0 },
  isLoading: { type: Boolean, default: false },
  hasError: { type: Boolean, default: false },
  isMarkingRead: { type: [String, null], default: null },
  actionError: { type: String, default: '' },
})

defineEmits(['retry', 'mark-read'])

const stores = useCounterStore()
const dropdown = ref(false)
const containerRef = ref(null)

const toggleNotification = () => {
  dropdown.value = !dropdown.value
  stores.setIsDropDown(dropdown.value)
}

const closeDropdown = () => {
  dropdown.value = false
  stores.setIsDropDown(false)
}

const handleClickOutside = (event) => {
  if (containerRef.value && !containerRef.value.contains(event.target)) closeDropdown()
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

defineExpose({ closeDropdown })
</script>

<style scoped>
.notification-container {
  position: relative;
  display: flex;
  align-items: center;
  line-height: 1;
}
.notification-trigger {
  display: flex;
  align-items: center;
  padding: 0;
  border: 0;
  color: #1c1d1f;
  background: transparent;
  cursor: pointer;
}
.notification-trigger:hover {
  color: #6d28d2;
}
.notification-trigger :deep(.anticon) {
  font-size: 20px;
}
.dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  z-index: 1000;
  display: flex;
  width: 390px;
  max-height: 480px;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 12px 30px rgba(28, 29, 31, 0.16);
}
.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}
.dropdown-title {
  margin: 0;
  color: #1c1d1f;
  font-size: 18px;
  font-weight: 700;
}
.dropdown-unread {
  color: #6d28d2;
  font-size: 12px;
  font-weight: 600;
}
.dropdown-content {
  max-height: 400px;
  overflow-y: auto;
}
.notification-list {
  display: flex;
  flex-direction: column;
}
.notification-item {
  position: relative;
  display: flex;
  width: 100%;
  gap: 12px;
  padding: 15px 20px;
  border: 0;
  border-bottom: 1px solid #f0f1f3;
  color: inherit;
  text-align: left;
  background: #fff;
  cursor: pointer;
}
.notification-item:hover {
  background: #f7f3ff;
}
.notification-item.unread {
  background: #faf7ff;
}
.notification-item:disabled {
  cursor: wait;
  opacity: 0.65;
}
.notification-icon {
  display: flex;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #6d28d2;
  background: #f0e9ff;
}
.notification-info {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 4px;
}
.notification-title {
  overflow: hidden;
  color: #1c1d1f;
  font-size: 14px;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.notification-message {
  color: #4b5563;
  font-size: 13px;
  line-height: 1.35;
}
.notification-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: #6b7280;
  font-size: 11px;
}
.unread-dot {
  width: 8px;
  height: 8px;
  flex: 0 0 8px;
  margin-top: 5px;
  border-radius: 50%;
  background: #6d28d2;
}
.notification-state {
  padding: 48px 20px;
  color: #6b7280;
  font-size: 14px;
  text-align: center;
}
.notification-error p {
  margin: 0 0 10px;
}
.retry-button {
  padding: 7px 12px;
  border: 1px solid #6d28d2;
  border-radius: 6px;
  color: #6d28d2;
  background: #fff;
  cursor: pointer;
}
.retry-button:hover {
  color: #fff;
  background: #6d28d2;
}
.action-error {
  margin: 0;
  padding: 8px 20px;
  color: #b42318;
  font-size: 12px;
  background: #fff4f2;
}
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
@media screen and (max-width: 767px) {
  .dropdown {
    right: -12px;
    width: min(390px, calc(100vw - 24px));
  }
}
</style>
