<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="profile-page">
    <div class="page-shell">
      <div class="profile-grid">
        <aside class="profile-sidebar card-surface">
          <div class="profile-identity">
            <div class="profile-avatar">{{ getInitials() }}</div>
            <strong>{{ data.fullName || 'Người dùng' }}</strong>
            <span>{{ data.email || 'Tài khoản học tập' }}</span>
          </div>
          <nav class="profile-nav">
            <router-link to="/profile" class="profile-nav-item is-active"><SettingOutlined /> Profile</router-link>
            <router-link to="/my-learn" class="profile-nav-item"><BookOutlined /> My learning</router-link>
            <router-link to="/history" class="profile-nav-item"><HistoryOutlined /> Lịch sử mua hàng</router-link>
            <button class="profile-nav-item profile-logout" @click="logOut"><LogoutOutlined /> Đăng xuất</button>
          </nav>
        </aside>

        <main class="profile-content card-surface" v-loading="gettingData">
          <div class="content-heading">
            <div>
              <span class="eyebrow">ACCOUNT SETTINGS</span>
              <h1>Thông tin cá nhân</h1>
              <p>Cập nhật thông tin để trải nghiệm học tập tốt hơn.</p>
            </div>
            <div class="heading-avatar">{{ getInitials() }}</div>
          </div>
          <div class="profile-form">
            <label class="form-field"><span>Họ</span><a-input v-if="data.modeEdit" v-model:value="data.firstName" /><b v-else>{{ data.firstName || '—' }}</b></label>
            <label class="form-field"><span>Tên</span><a-input v-if="data.modeEdit" v-model:value="data.lastName" /><b v-else>{{ data.lastName || '—' }}</b></label>
            <label class="form-field"><span>Email</span><b>{{ data.email || '—' }}</b><small>Email không thể thay đổi</small></label>
            <label class="form-field"><span>Số điện thoại</span><a-input v-if="data.modeEdit" v-model:value="data.phone" /><b v-else>{{ data.phone || '—' }}</b></label>
          </div>
          <div class="form-actions">
            <template v-if="data.modeEdit">
              <a-button type="primary" :loading="gettingData" @click="onConfirmEditProfile">Lưu thay đổi</a-button>
              <a-button @click="data.modeEdit = false">Hủy</a-button>
            </template>
            <a-button v-else type="primary" @click="data.modeEdit = true">Chỉnh sửa thông tin</a-button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import useAuth from '@/composables/useAuth'
import { useCounterStore } from '@/stores/authStore'
import { useNotify } from '@/composables/useNotify'

const data = ref({ firstName: '', lastName: '', fullName: '', phone: '', email: '', modeEdit: false })
const gettingData = ref(false)

const getDataProfile = async () => {
  const response = await useAuth().getDataProfile()
  if (!response) return
  data.value.firstName = response.first_name || ''
  data.value.lastName = response.last_name || ''
  data.value.fullName = `${data.value.firstName} ${data.value.lastName}`.trim()
  data.value.phone = response.phone || ''
  data.value.email = response.email || ''
}

onMounted(getDataProfile)

const onConfirmEditProfile = async () => {
  gettingData.value = true
  const response = await useAuth().editProfile(data.value.firstName, data.value.lastName, data.value.phone)
  if (response) {
    await getDataProfile()
    data.value.modeEdit = false
    useNotify().notify('Cập nhật profile thành công', 'success')
  }
  gettingData.value = false
}

const getInitials = () => {
  const names = data.value.fullName.split(/\s+/).filter(Boolean)
  return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase() : (names[0]?.[0] || 'U').toUpperCase()
}

const logOut = async () => {
  await useAuth().logOut()
  useCounterStore().removeToken()
  window.location.href = '/login'
}
</script>

<style>
.profile-page { min-height: 100vh; background: #f7f7fb; padding: 42px 24px 72px; }
.page-shell { max-width: 1180px; margin: 0 auto; }
.profile-grid { display: grid; grid-template-columns: 260px minmax(0, 1fr); gap: 24px; align-items: start; }
.card-surface { background: #fff; border: 1px solid #e7e7ee; border-radius: 16px; box-shadow: 0 10px 28px rgba(28, 29, 31, .05); }
.profile-sidebar { padding: 24px 16px; position: sticky; top: 24px; }
.profile-identity { display: flex; flex-direction: column; align-items: center; gap: 7px; padding: 4px 8px 24px; text-align: center; border-bottom: 1px solid #ececf2; }
.profile-avatar, .heading-avatar { display: flex; align-items: center; justify-content: center; border-radius: 50%; background: #171820; color: #fff; font-weight: 700; }
.profile-avatar { width: 72px; height: 72px; margin-bottom: 6px; font-size: 24px; }
.profile-identity strong { color: #262735; font-size: 15px; }
.profile-identity span { color: #858899; font-size: 12px; }
.profile-nav { display: flex; flex-direction: column; gap: 5px; padding-top: 20px; }
.profile-nav-item { display: flex; align-items: center; gap: 11px; width: 100%; padding: 12px 13px; border: 0; border-radius: 9px; background: transparent; color: #5c5f70; font-size: 14px; text-decoration: none; text-align: left; cursor: pointer; }
.profile-nav-item:hover, .profile-nav-item.is-active { background: #f2edff; color: #6d28d2; }
.profile-nav-item :deep(.anticon) { font-size: 17px; }
.profile-logout { margin-top: 14px; color: #9b5362; }
.profile-content { padding: 36px 42px; }
.content-heading { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 28px; border-bottom: 1px solid #ececf2; }
.eyebrow { color: #8064c9; font-size: 11px; font-weight: 700; letter-spacing: .12em; }
.content-heading h1 { margin: 8px 0 7px; color: #222330; font-size: 28px; }
.content-heading p { margin: 0; color: #858899; font-size: 14px; }
.heading-avatar { width: 52px; height: 52px; font-size: 18px; }
.profile-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px 28px; padding-top: 30px; }
.form-field { display: flex; flex-direction: column; gap: 9px; color: #5f6272; font-size: 13px; }
.form-field b { min-height: 40px; display: flex; align-items: center; color: #252633; font-size: 14px; font-weight: 500; border-bottom: 1px solid #e4e4eb; }
.form-field small { color: #9294a1; font-size: 11px; }
.form-field :deep(.ant-input) { height: 40px; border-radius: 8px; }
.form-actions { display: flex; gap: 10px; padding-top: 30px; }
.form-actions :deep(.ant-btn) { height: 42px; border-radius: 8px; padding-inline: 20px; }
.form-actions :deep(.ant-btn-primary) { background: #6d28d2; border-color: #6d28d2; }
@media (max-width: 760px) { .profile-page { padding: 24px 16px 48px; } .profile-grid { grid-template-columns: 1fr; } .profile-sidebar { position: static; } .profile-nav { display: grid; grid-template-columns: repeat(2, 1fr); } .profile-logout { margin-top: 0; } .profile-content { padding: 26px 20px; } .profile-form { grid-template-columns: 1fr; gap: 18px; } }
</style>
