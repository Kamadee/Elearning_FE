<template>
    <div class="container user-profile" v-loading="isLoading">
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
      <OwnCourses :courseData="data.ownCourseData"/>
   </div>
</template>
<script setup>
import OwnCourses from '@/components/course/OwnCourses.vue'
import  useAuth from '@/composables/useAuth';
import  { useCounterStore } from '@/stores/authStore'
import { onMounted, ref } from 'vue'
import { useNotify } from '@/composables/useNotify';
import useCart from '@/composables/useCart';

const isLoading = ref(false);
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

const logOut = () => {
  useAuth().logOut()
  const store = useCounterStore();
  store.removeToken();
  location.reload()
}
</script>

<style scoped>
.main-body {
  margin-bottom: 40px;
}
</style>