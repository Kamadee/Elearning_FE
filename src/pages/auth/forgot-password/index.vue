<template>
<!-- <a-row class="form-forgot" justify="center" align="middle" style="min-height: 100vh;">
  <a-col :xs="24" :sm="16" :md="10" :lg="8">
    <div class="form-container">
      <a-form class="form-child" :model="data" :rules="rules" @submit.prevent="forgotPass()"> 
        <h3>Bạn quên mật khẩu?</h3>
        <a-form-item name="email" class="email-input">
          <label for="">Địa chỉ email</label>
          <a-input placeholder="example@gmail.com" v-model:value="data.email"></a-input>
        </a-form-item>
        <a-form-item >
          <a-button class="btn-forgot" type="primary" html-type="submit">Gửi yêu cầu reset</a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-col>
</a-row> -->

 <section class="register_section" v-loading="loadingStates.forgotPass">
    <div class="register_wrapper">
      <a-row class="register-container" justify="center" align="middle">
        <a-col xs={24} sm={12} md={8}>
          <h3>Nhập email</h3>
          <a-form :model="data" :rules="rules" ref="formRef" @submit.prevent="sendLinkReset()">
            <a-form-item name="email">
              <a-input class="input-forgot" v-model:value="data.email"/>
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" :disabled="loadingStates.forgotPass">Xác nhận</a-button>
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
  email: ""
})

const router = useRouter()
const loadingStates = ref({
  forgotPass: false
})

const rules = {
  email: [
    { required: true, message: "Vui lòng nhập email", trigger: 'blur' },
  ],
}

const sendLinkReset = async () => {
  loadingStates.value.forgotPass = true
  try {
    const response = await useAuth().forgotPass(data.value.email)
    if(response) {
    const { notify } = useNotify();
    notify(response.message, 'sucess')
    router.push('/password-reset');
    }
  } catch (err) {
    console.log('❌ Validate thất bại', err);
  } finally {
    setTimeout(() => {
      loadingStates.value.forgotPass = false
    }, 200)
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
  max-width: 500px;
  background: #fff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.register-container {
  width: 100%;
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

.input-forgot {
  width: 300px;
  height: 40px;
}

.btn-confirm {
  display: flex;
  justify-content: center;
}
</style>