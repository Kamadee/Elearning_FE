<template>
  <section class="register_section" v-loading="loadingStates.register">
    <div class="register_wrapper">
      <a-row class="register-container" justify="center" align="middle">
        <a-col xs={24} sm={12} md={8}>
          <h3>Register</h3>
          <a-form :model="data" :rules="rules" ref="formRef" @submit.prevent="register()">
            <a-form-item name="first_name">
              <label for="first_name">First Name</label>
              <a-input v-model:value="data.first_name"/>
            </a-form-item>

            <a-form-item name="last_name">
              <label for="last_name">Last Name</label>
              <a-input v-model:value="data.last_name"/>
            </a-form-item>

            <a-form-item name="email">
              <label for="email">Email</label>
              <a-input v-model:value="data.email" placeholder="example@email.com" />
            </a-form-item>

            <a-form-item name="password">
              <label for="password">Password</label>
              <a-input type="password" v-model:value="data.password" placeholder="Mật khẩu" />
            </a-form-item>

            <a-form-item name="re_password">
              <label for="re_password">Re-Password</label>
              <a-input type="password" v-model:value="data.re_password" placeholder="Xác nhận Mật khẩu" />
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" :disabled="loadingStates.register">Đăng ký</a-button>
            </a-form-item>

            <a-form-item>
              <router-link to="/login">Đăng nhập</router-link>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </div>
  </section>
</template>

<script setup>
// import { AForm, AFormItem, AInput } from 'ant-design-vue';
import  useAuth from '@/composables/useAuth';
import { useNotify } from '@/composables/useNotify';
import { useGoRouter } from '@/utils/goRouter';
import { ref } from 'vue'

const data = ref({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  re_password: "",
  verifyCode: ""
})

const { goRouter } = useGoRouter();
const emits = defineEmits(['sign-up']);

let loadingStates = ref({
  register: false,
})

const validate2 = () => {
  if(data.value.re_password !== data.value.password) {
    return Promise.reject('Mật khẩu chưa khớp')
  } else {
    return Promise.resolve()
  }
}

const rules = {
  first_name: [
    { required: true, message: "Vui lòng nhập first name", trigger: 'blur' },
  ],
  last_name: [
    { required: true, message: "Vui lòng nhập last name", trigger: 'blur' },
  ],
  email: [
    { required: true, message: "Vui lòng nhập email", trigger: 'blur' },
  ],
  password: [
    { required: true, message: "Vui lòng nhập mật khẩu", trigger: 'blur' },
  ],
  re_password: [
    { validator: validate2, trigger: 'change' },
  ],
}

const register = async () => {
  loadingStates.value.register = true
  try {
    const response = await useAuth().register(
      data.value.first_name,
      data.value.last_name,
      data.value.email,
      data.value.password)
      
    if(response) {
      const { notify } = useNotify()
      notify('Kiểm tra mã xác minh trong email của bạn', 'success')
      goRouter('/verifi-register')
    }
  } catch (err) {
    console.log('❌ Validate thất bại', err);
  } finally {
    setTimeout(() => {
      loadingStates.value.register = false
    }, 1000)
  }

}
</script>

<style scoped>
body {
  background-color: #f7f9fa;
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