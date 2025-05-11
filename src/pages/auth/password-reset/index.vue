<template>
<a-row class="form-forgot" justify="center" align="middle" style="min-height: 100vh;">
  <a-col :xs="24" :sm="16" :md="10" :lg="8">
    <div class="form-container">
      <a-form class="form-child" :model="data" :rules="rules" @submit.prevent="resetPass()"> 
        <h3>Thay đổi mật khẩu</h3>
        <a-form-item name="password" class="email-input">
          <label for="">Mật khẩu</label>
          <a-input type="password" placeholder="Tối thiểu 6 ký tự"></a-input>
        </a-form-item>
        <a-form-item name="re_password" class="email-input">
          <label for="">Xác nhận mật khẩu</label>
          <a-input type="password"></a-input>
        </a-form-item>
        <a-form-item >
          <a-button class="btn-forgot" type="primary" html-type="submit">Xác nhận</a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-col>
</a-row>
  
</template>

<script setup>
import  useAuth from '@/composables/useAuth';
import { useNotify } from '@/composables/useNotify';
import { useGoRouter } from '@/utils/goRouter';
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()
const data = ref({
  password: "",
  re_password: "",
  email: router.query.email,
  token: router.query.token
})

const { goRouter } = useGoRouter()
const gettingData = ref(false)
const errorMsg = ref('')


const validate2 = () => {
  if(data.value.re_password !== data.value.password) {
    return Promise.reject('Mật khẩu chưa khớp')
  } else {
    return Promise.resolve()
  }
}

const rules = {
  password: [
    { required: true, message: "Vui lòng nhập mật khẩu", trigger: 'blur' },
  ],
  re_password: [
    { validator: validate2, trigger: 'change' },
  ],
}

const resetPass = async () => {
  try {
    const response = await useAuth().resetPass(data.value.email, data.value.password, data.value.token)
    if(response) {
    const { notify } = useNotify();
    notify(response.message, 'sucess')
    goRouter('/login');
    }
  } catch (err) {
    if (err.errorFields) {
      console.log('❌ Validate thất bại', err);
      return;
    }
    errorMsg.value = "Có lỗi xảy ra: " + err.message;
    console.log(err);
    
    useNotify('error', errorMsg.value);
  } finally {
    setTimeout(() => {
      gettingData.value = false
    }, 200)
  }
}
</script>

<style scoped>
.form-forgot {
  display: flex;
  justify-content: center;
  align-items: center;
  /* box-sizing: border-box; */
}

.form-container {
  border: 1px solid black;
  border-radius: 5px;
  box-shadow: -3px 3px 10px rgba(0, 0, 0, 0.1);
  padding: 40px 80px;
}

.form-child {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ant-form-item {
  /* width: 100%; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ant-form-item label {
  align-self: flex-start;
  margin-bottom: 8px;
}

.ant-input {
  width: 230px;
}

.email-input {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.btn-forgot {
  width: 230px;
}

.ant-input {
  width: 230px;
}

.btn-forgot {
  width: 230px;
}
</style>