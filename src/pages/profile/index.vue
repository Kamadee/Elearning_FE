<template>
  <div class="profile-container" v-loading="isLoading">
    <div class="profile-wrapper">
      <div class="profile-layout" v-loading="gettingData">
        <!-- Sidebar Navigation -->
        <div class="profile-sidebar">
          <div class="sidebar-user">
            <div class="avatar-circle">
              <span class="avatar-initial">{{ getInitials() }}</span>
            </div>
            <div class="user-name">{{ data.fullName || 'Người dùng' }}</div>
          </div>
          
          <nav class="sidebar-nav">
            <a class="nav-item" :class="{ active: true }">
              <SettingOutlined class="nav-icon" />
              <span>Profile</span>
            </a>
            <a class="nav-item logout" @click="logOut()">
              <LogoutOutlined class="nav-icon" />
              <span>Đăng xuất</span>
            </a>
          </nav>
        </div>

        <!-- Main Content -->
        <div class="profile-main">
          <div class="content-header">
            <h1 class="page-title">Profile</h1>
            <p class="page-subtitle">Quản lý thông tin cá nhân của bạn</p>
          </div>

          <div class="profile-form">
            <div class="form-section">
              <div class="form-group">
                <label class="form-label">Họ</label>
                <a-input 
                  v-if="data.modeEdit"
                  v-model:value="data.firstName"
                  placeholder="Nhập họ của bạn"
                  class="form-input"
                />
                <div v-else class="form-value">{{ data.firstName || '—' }}</div>
              </div>

              <div class="form-group">
                <label class="form-label">Tên</label>
                <a-input 
                  v-if="data.modeEdit"
                  v-model:value="data.lastName"
                  placeholder="Nhập tên của bạn"
                  class="form-input"
                />
                <div v-else class="form-value">{{ data.lastName || '—' }}</div>
              </div>

              <div class="form-group">
                <label class="form-label">Email</label>
                <div class="form-value">{{ data.email || '—' }}</div>
                <p class="form-hint">Email không thể thay đổi</p>
              </div>

              <div class="form-group">
                <label class="form-label">Số điện thoại</label>
                <a-input 
                  v-if="data.modeEdit"
                  v-model:value="data.phone"
                  placeholder="Nhập số điện thoại"
                  class="form-input"
                />
                <div v-else class="form-value">{{ data.phone || '—' }}</div>
              </div>

              <div class="form-actions" v-if="data.modeEdit">
                <a-button 
                  type="primary" 
                  size="large" 
                  @click="onConfirmEditProfile()"
                  :loading="gettingData"
                  class="save-btn"
                >
                  Lưu thay đổi
                </a-button>
                <a-button 
                  size="large" 
                  @click="data.modeEdit = false"
                  class="cancel-btn"
                >
                  Hủy
                </a-button>
              </div>
              <div class="form-actions" v-else>
                <a-button 
                  type="default" 
                  size="large" 
                  @click="onEditProfile()"
                  class="edit-btn"
                >
                  Chỉnh sửa
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <OwnCourses :courseData="data.ownCourseData"/>
    </div>
  </div>
</template>
<script setup>
import OwnCourses from '@/components/course/OwnCourses.vue'
import  useAuth from '@/composables/useAuth'
import  { useCounterStore } from '@/stores/authStore'
import { onMounted, ref } from 'vue'
import { useNotify } from '@/composables/useNotify'
import useCart from '@/composables/useCart'

const isLoading = ref(false)
const data = ref({
  isAuthenticated: useCounterStore().isLogged,
  firstName: "",
  lastName: "",
  fullName: "",
  phone: null,
  email: "",
  modeEdit: false,
  orderList: [],
  ownCourseData: []
})

const getDataProfile = async () => {
  const response = await useAuth().getDataProfile()
  if(response) {
    data.value.firstName = response.first_name
    data.value.lastName = response.last_name
    data.value.fullName = response.first_name + response.last_name
    data.value.phone = response.phone
    data.value.email = response.email
  }
}

const getPaymentHistoryList = async () => {
  const response = await useCart().getPaymentHistoryList()
  if(response) {
    data.value.orderList = response.orders.filter((order) => order.status === 3).map((order) => order.id)
    getCourseDataForOrders(data.value.orderList)
  }
}

const getCourseDataForOrders = async (orderList) => {
  const promises = orderList.map((orderId) => useCart().getHistoryDetail(orderId))

  try {
    const res = await Promise.all(promises)
    const courseData = res.flatMap(r => r.courses)
    data.value.ownCourseData = courseData
  } catch(e) {
    console.log(e);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  isLoading.value = true;
  setTimeout(() => {
    getDataProfile()
    getPaymentHistoryList()
  }, 200)
})

function onEditProfile() {
  data.value.modeEdit = true
}

const gettingData = ref(false)

const onConfirmEditProfile = async () => {
  gettingData.value = true
  const response = await useAuth().editProfile(
    data.value.firstName,
    data.value.lastName,
    data.value.phone
  )
  if (response) {
    try {
      await getDataProfile()
      const { notify } = useNotify();
      notify('Cập nhật profile thành công', 'success')
      data.value.modeEdit = false;
    } finally {
      setTimeout(() => {
        gettingData.value = false;
      }, 200)
    }
  } else {
    gettingData.value = false
  }
}

const getInitials = () => {
  if (data.value.firstName && data.value.lastName) {
    return (data.value.firstName.charAt(0) + data.value.lastName.charAt(0)).toUpperCase()
  }
  if (data.value.fullName) {
    const names = data.value.fullName.split(' ')
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
    }
    return data.value.fullName.charAt(0).toUpperCase()
  }
  return 'U'
}

const logOut = () => {
  useAuth().logOut()
  const store = useCounterStore();
  store.removeToken();
  location.reload()
}
</script>

<style scoped>
.profile-container {
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  padding: 0;
}

.profile-wrapper {
  max-width: 1340px;
  margin: 0 auto;
  padding: 32px 24px;
  width: 100%;
  box-sizing: border-box;
}

.profile-layout {
  border: 1px solid rgb(209, 208, 208);
  padding: 40px;
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 48px;
  margin-bottom: 18px;
}

/* Sidebar Navigation */
.profile-sidebar {
  position: sticky;
  top: 24px;
  height: fit-content;
}

.sidebar-user {
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #3e4143;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.avatar-initial {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
}

.user-name {
  font-size: 16px;
  font-weight: 700;
  color: #1c1d1f;
  margin: 0;
  line-height: 1.4;
  text-align: center;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  font-size: 14px;
  color: #ffffff;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  background: #a435f0;
  width: 100%;
  font-weight: 500;
  transition: none;
}

.nav-item:hover {
  background-color: #a435f0;
  color: #ffffff;
}

.nav-item.active {
  background-color: #a435f0;
  color: #ffffff;
  font-weight: 600;
}

.nav-item.logout {
  background: transparent;
  color: #1c1d1f;
  margin-top: 8px;
}

.nav-item.logout:hover {
  background: transparent;
  color: #1c1d1f;
}

.nav-icon {
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Main Content */
.profile-main {
  min-width: 0;
  max-width: 800px;
}

.content-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1c1d1f;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 14px;
  color: #6a6f73;
  margin: 0;
  line-height: 1.4;
}

.profile-form {
  width: 100%;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #1c1d1f;
  margin: 0;
}

.form-input {
  width: 100%;
  height: 44px;
  border-radius: 4px;
  border: 1px solid #d1d1d1;
  font-size: 14px;
  padding: 0 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus,
.form-input-focused {
  border-color: #6d28d2 !important;
  box-shadow: 0 0 0 3px rgba(109, 40, 210, 0.1) !important;
  outline: none;
}

.form-value {
  font-size: 14px;
  color: #1c1d1f;
  padding: 12px 0;
  min-height: 44px;
  display: flex;
  align-items: center;
}

.form-hint {
  font-size: 12px;
  color: #6a6f73;
  margin: 0;
  line-height: 1.4;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
}

.edit-btn,
.save-btn {
  height: 44px;
  font-weight: 600;
  min-width: 140px;
}

.save-btn {
  background-color: #6d28d2;
  border-color: #6d28d2;
  color: #fff;
}

.save-btn:hover {
  background-color: #5b21b6;
  border-color: #5b21b6;
}

.cancel-btn {
  height: 44px;
  font-weight: 600;
  min-width: 100px;
}

/* Responsive */
@media screen and (max-width: 1440px) {
  .profile-wrapper {
    padding: 32px 60px;
  }
}

@media screen and (max-width: 1200px) {
  .profile-wrapper {
    padding: 32px 40px;
  }
  
  .profile-layout {
    padding: 32px;
  }
}

@media screen and (max-width: 1024px) {
  .profile-wrapper {
    padding: 32px 24px;
  }
  
  .profile-layout {
    grid-template-columns: 200px 1fr;
    gap: 32px;
    padding: 32px 24px;
  }
  
  .avatar-circle {
    width: 70px;
    height: 70px;
  }
  
  .avatar-initial {
    font-size: 28px;
  }
}

@media screen and (max-width: 768px) {
  .profile-wrapper {
    padding: 24px 20px;
  }
  
  .profile-layout {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 24px 20px;
  }

  .profile-sidebar {
    position: static;
  }

  .sidebar-user {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
    margin-bottom: 24px;
    text-align: left;
  }

  .avatar-circle {
    width: 60px;
    height: 60px;
    margin-bottom: 0;
    flex-shrink: 0;
  }

  .avatar-initial {
    font-size: 24px;
  }
  
  .user-name {
    text-align: left;
  }

  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
    gap: 8px;
    padding-bottom: 8px;
    -webkit-overflow-scrolling: touch;
  }

  .nav-item {
    white-space: nowrap;
    min-width: fit-content;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .nav-item.logout {
    margin-top: 0;
  }

  .content-header {
    margin-bottom: 24px;
  }

  .page-title {
    font-size: 20px;
  }
  
  .page-subtitle {
    font-size: 13px;
  }

  .form-section {
    gap: 20px;
  }

  .form-actions {
    flex-direction: column;
    gap: 12px;
    margin-top: 8px;
    padding-top: 20px;
  }

  .edit-btn,
  .save-btn,
  .cancel-btn {
    width: 100%;
    min-width: unset;
  }
}

@media screen and (max-width: 480px) {
  .profile-wrapper {
    padding: 16px;
  }
  
  .profile-layout {
    padding: 20px 16px;
    border: 1px solid rgb(209, 208, 208);
  }
  
  .avatar-circle {
    width: 56px;
    height: 56px;
  }
  
  .avatar-initial {
    font-size: 22px;
  }
  
  .user-name {
    font-size: 14px;
  }
  
  .page-title {
    font-size: 18px;
  }
  
  .form-label {
    font-size: 13px;
  }
  
  .form-input {
    height: 40px;
    font-size: 14px;
  }
  
  .form-value {
    font-size: 13px;
    padding: 10px 0;
    min-height: 40px;
  }
  
  .form-hint {
    font-size: 11px;
  }
  
  .edit-btn,
  .save-btn,
  .cancel-btn {
    height: 40px;
    font-size: 14px;
  }
}
</style>