<template>
<section class="login_section" v-loading="loadingStates.login">
  <div class="login_wrapper">
    <a-row class="login-container" justify="center" align="middle">
      <a-col xs={24} sm={12} md={8}>
        <div class="login_box">
          <a-form :model="data" ref="formRef" :rules="rules" @submit.prevent="login()">
            <h3>Login</h3>
            <div class="test">
              <span>*email: tahieuthang@gmail.com</span>
              <span>*pass: 123456</span>
            </div>

            <a-form-item name="email">
              <label for="email">Email</label>
              <a-input v-model:value="data.email" id="email" placeholder="tahieuthang@gmail.com" />
            </a-form-item>

            <a-form-item name="password">
              <label for="password">Mật khẩu</label>
              <a-input v-model:value="data.password" id="password" :type="passwordVisible ? 'text' : 'password'" placeholder="123456">
                <template #suffix>
                  <EyeOutlined v-if="!passwordVisible" @click="passwordVisible = true" style="cursor: pointer;" />
                  <EyeInvisibleOutlined v-else @click="passwordVisible = false" style="cursor: pointer;" />
                </template>
              </a-input>
            </a-form-item>

            <div class="remember-wrapper">
              <label class="fui-checkbox-toggle">
                <input type="checkbox" id="toggle-input" class="toggle-input" />
                <div class="toggle-bar">
                  <div class="toggle-spin"></div>
                </div>
              </label>
              <span class="remember-label">Remember me</span>
            </div>

            <a-form-item class="forgot-link">
              <router-link to="/forgot-password"><strong>Quên mật khẩu?</strong></router-link>
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" :disabled="loadingStates.login" class="btn-login">Đăng nhập</a-button>
            </a-form-item>

            <a-form-item>
              Bạn chưa có tài khoản?
              <router-link to="/register"><strong>Đăng ký</strong></router-link>
            </a-form-item>

          </a-form>
        </div>
      </a-col>
    </a-row>
  </div>
</section>
</template>

<script setup>
import  useAuth from '@/composables/useAuth';
import { useNotify } from '@/composables/useNotify';
import { useGoRouter } from '@/utils/goRouter';
import { ref } from 'vue'

const data = ref({
  email: "",
  password: ""
})
const passwordVisible = ref(false)
const { goRouter } = useGoRouter();

let loadingStates = ref({
  login: false,
})

const rules = {
  email: [
    { required: true, message: "Vui lòng nhập email", trigger: 'blur' },
    { type: 'email', message: "Email không hợp lệ", trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: "Vui lòng nhập mật khẩu", trigger: 'blur' },
  ]
}

const { notify } = useNotify();
const login = async () => {
  loadingStates.value.login = true
  try {
    console.log(data.value.email, data.value.password);
    
    const response = await useAuth().login(data.value.email, data.value.password)
    if(response) {
      notify('Đăng nhập thành công', 'success')
      goRouter('/');
    }
  } catch (err) {
    console.log(err);
  } finally {
    setTimeout(() => {
      loadingStates.value.login = false
    }, 2000)
  }
}

</script>

<style scoped>
/* .login_section {
  width: 100%;
  height: 100vh;
  background: url('/images/Login-Image.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
} */

.login_wrapper {
  width: 100%;
  max-width: 400px;
  background: #fff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.login_box {
  width: 100%;
}

h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 25px;
  text-align: center;
}
.fui-checkbox-toggle {
  cursor: pointer;
}
.fui-checkbox-toggle .toggle-input {
  display: none;
}
.fui-checkbox-toggle .toggle-input:checked + .toggle-bar {
  background-color: #1dc071;
}
.fui-checkbox-toggle .toggle-input:checked + .toggle-bar .toggle-spin {
  transform: translateX(25px);
}
.fui-checkbox-toggle .toggle-bar {
  width: 40px;
  height: 20px;
  background-color: #cbd5e1;
  border-radius: 5rem;
  padding: 3px;
  transition: background-color 0.2s linear;
}
.fui-checkbox-toggle .toggle-spin {
  width: 14px;
  height: 14px;
  border-radius: 100rem;
  background-color: #fff;
  transition: transform 0.2s linear;
}
.remember-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}
.btn-login {
  width: 100%;
}
#email {
  height: 40px;
  width: 100%;
}
#password {
  height: 40px;
}
.login-form {
  border-radius: black solid 1px;
}
.forgot-link {
  margin-top: 20px;
}
.test {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>