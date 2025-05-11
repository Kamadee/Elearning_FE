<template>
    <div class="container user-profile">
      <div class="main-body" v-loading="gettingData">
        <!-- Breadcrumb -->
        <nav aria-label="breadcrumb" class="main-breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Home</a></li>
            <li class="breadcrumb-item"><a href="javascript:void(0)">User</a></li>
            <li class="breadcrumb-item active" aria-current="page">Profile cá nhân</li>
          </ol>
        </nav>
        <!-- /Breadcrumb -->

        <div class="row gutters-sm">
          <div class="col-md-4 mb-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex flex-column align-items-center text-center">
                  <!-- <img src="@/assets/images/profile/avatar-profile.jpg" alt="Admin" class="rounded-circle"
                    width="150"> -->
                  <div class="mt-3">
                    <h4>{{ data.fullName }}</h4>
                    <button class="btn btn-danger" @click="logOut()">Logout</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-8">
            <div class="card mb-3">
              <div class="card-body">
                <div class="row">
                  <div class="col-sm-3">
                    <h6 class="mb-0">First Name</h6>
                  </div>
                  <div class="col-sm-9 text-secondary" v-if="data.modeEdit">
                    <input type="text" class="w-100" v-model="data.firstName">
                  </div>
                  <div class="col-sm-9 text-secondary" v-else>
                    {{ data.firstName }}
                  </div>
                </div>
                <hr>
                <div class="row">
                  <div class="col-sm-3">
                    <h6 class="mb-0">Last Name</h6>
                  </div>
                  <div class="col-sm-9 text-secondary" v-if="data.modeEdit">
                    <input type="text" class="w-100" v-model="data.lastName">
                  </div>
                  <div class="col-sm-9 text-secondary" v-else>
                    {{ data.lastName }}
                  </div>
                </div>
                <hr>
                <div class="row">
                  <div class="col-sm-3">
                    <h6 class="mb-0">Email</h6>
                  </div>
                  <div class="col-sm-9 text-secondary">
                    {{ data.email }}
                  </div>
                </div>
                <hr>
                <div class="row">
                  <div class="col-sm-3">
                    <h6 class="mb-0">Phone</h6>
                  </div>
                  <div class="col-sm-9 text-secondary" v-if="data.modeEdit">
                    <input type="text" class="w-100" v-model="data.phone">
                  </div>
                  <div class="col-sm-9 text-secondary" v-else>
                    {{ data.phone }}
                  </div>
                </div>
                <hr>
                <div class="row">
                  <div class="col-sm-12" v-if="data.modeEdit">
                    <a class="btn btn-info " target="__blank" @click="onConfirmEditProfile()">Confirm</a>
                  </div>
                  <div class="col-sm-12" v-else>
                    <a class="btn btn-info " target="__blank" @click="onEditProfile()">Edit</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
   </div>
</template>
<script setup>
import  useAuth from '@/composables/useAuth';
import  { useCounterStore } from '@/stores/authStore'
import { ref } from 'vue'
import { useNotify } from '@/composables/useNotify';

const data = ref({
  isAuthenticated: useCounterStore().isLogged,
  firstName: "",
  lastName: "",
  fullName: "",
  phone: null,
  email: "",
  modeEdit: false
})
console.log(data);


const getDataProfile = async () => {
  console.log(11);
  
  const response = await useAuth().getDataProfile()
  console.log(response);
  
  if(response) {
    data.value.firstName = response.first_name;
    data.value.lastName = response.last_name;
    data.value.fullName = response.first_name + response.last_name;
    data.value.phone = response.phone;
    data.value.email = response.email;
  }
}

getDataProfile();

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
    notify('Cập nhật thành công', 'success')
    data.value.modeEdit = false;
  } catch (err) {
    console.log(err);
    const { notify } = useNotify()
    notify('Cập nhật thất bại', 'error')
  } finally {
    setTimeout(() => {
      gettingData.value = false;
    }, 200)
  }
} else {
  gettingData.value = false
}
}

const logOut = () => {
  useAuth().logOut()
  const store = useCounterStore();
  store.removeToken();
  location.reload()
}
</script>
