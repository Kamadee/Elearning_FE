<template>
<a-row class="form-forgot" justify="center" align="middle" style="min-height: 100vh;">
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
</a-row>
  
</template>

<script setup>
import  useAuth from '@/composables/useAuth';
import { useNotify } from '@/composables/useNotify';
import { useGoRouter } from '@/utils/goRouter';
import { ref } from 'vue'

const data = ref({
  email: ""
})

const { goRouter } = useGoRouter()
const gettingData = ref(false)
const errorMsg = ref('')

const rules = {
  email: [
    { required: true, message: "Vui lòng nhập email", trigger: 'blur' },
  ],
}

const forgotPass = async () => {
  try {
    const response = await useAuth().forgotPass(data.value.email)
    if(response) {
    const { notify } = useNotify();
    notify(response.message, 'sucess')
    goRouter('/password-reset');
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