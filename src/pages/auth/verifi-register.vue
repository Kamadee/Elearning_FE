<template>
  <section class="register_section" v-loading="loadingStates.confirm">
    <div class="register_wrapper">
      <a-row class="register-container" justify="center" align="middle">
        <a-col xs={24} sm={12} md={8}>
          <h3>Nhập mã xác nhận từ email</h3>
          <a-form :model="data" :rules="rules" ref="formRef" @submit.prevent="verifyEmail()">
            <a-form-item name="verifyCode">
              <a-input v-model:value="data.verifyCode"/>
            </a-form-item>

            <a-form-item style="text-align: center;">
              <a-button type="primary" html-type="submit" :disabled="loadingStates.confirm">Xác nhận</a-button>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </div>
  </section>
</template>

<script setup>
import  useAuth from '@/composables/useAuth';
import { useNotify } from '@/composables/useNotify';
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const data = ref({
  verifyCode: ""
})

const router = useRouter()

let loadingStates = ref({
  confirm: false,
})

const rules = {
  verifyCode: [
    { required: true, message: "Vui lòng nhập mã xác nhận", trigger: 'blur' },
  ],
}

const verifyEmail = async () => {
  loadingStates.value.confirm = true
  try {
    const response = await useAuth().verifyEmail(data.value.verifyCode)
      
    if(response) {
      const { notify } = useNotify();
      notify('Đăng ký thành công', 'success')
      router.push('/login');
    }
  } catch (err) {
    console.log('❌ Validate thất bại', err);
  } finally {
    setTimeout(() => {
      loadingStates.value.confirm = false
    }, 1000)
  }

}
</script>

<style scoped>
body {
  background-color: #f7f9fa;
}

.register_section {
  width: 100%;
  height: 100vh;
  background: url('/images/Login-Image.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.register_wrapper {
  width: 100%;
  max-width: 400px;
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 25px;
  text-align: center;
}

.btn-google {
  background-color: #fff;
  border: 1px solid #ccc;
  color: #555;
}

.btn-google:hover {
  background-color: #f8f9fa;
}

.form-check-input:checked {
  background-color: #5624d0;
  border-color: #5624d0;
}

.btn-primary {
  background-color: #a435f0;
  border-color: #a435f0;
}

.btn-primary:hover {
  background-color: #8710d8;
  border-color: #8710d8;
}

a {
  color: #5624d0;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>