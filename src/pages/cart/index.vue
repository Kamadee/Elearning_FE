<template>
  <div class="cart-wrapper">
    <div class="list-course" v-if="data.cartData.length > 0">
      <h1 style="font-weight: bold; text-align: center;">Giỏ hàng</h1>
      <div class="card-course" v-for="(cart, index) in data.cartData" :key="index">
        <ItemCart :cartData="cart" v-loading="loadingStates[cart.id]" @removeItem="removeItem"/>
      </div>
    </div>
    <div v-else class="no-data">
      <NoData />
    </div>

    <div class="payment-info">
      <CheckoutCart :priceArray="data.prices"/>
    </div>
  </div>
</template>

<script setup>
import ItemCart from '@/components/cart/ItemCart.vue'
import NoData from '@/components/NoData.vue'
import CheckoutCart from '@/components/cart/CheckoutCart.vue'
import useCart from '@/composables/useCart'
import { useNotify } from '@/composables/useNotify'
import { onMounted, ref } from "vue"

const data = ref({
  cartData: [],
  prices: []
})

const getDataCarts = async () => {
  const response = await useCart().getDataCarts()
  if(response) {
    data.value.cartData = response.contents
    data.value.prices = response.contents.map((item) => item.price)
  }
}
onMounted(() => {
  getDataCarts()
})

const loadingStates = ref({})
const removeItem = async (id) => {
  loadingStates.value[id] = true
  try {
    const response = await useCart().removeItem(id)
    if(response) {
      const { notify } = useNotify()
      notify(`${response.message}: Xóa khỏi giỏ thành công`, 'success')
      data.value.cartData = data.value.cartData.filter((item) => item.id !== id)
      data.value.prices = data.value.cartData.map((content) => content.price)
      await getDataCarts()
    }
  } finally {
    setTimeout(() => {
      loadingStates.value[id] = false
    }, 2000);
  }
}
</script>

<style scoped>
.cart-wrapper {
  padding: 35px 60px;
  display: flex;
  gap: 40px;
}

.list-course {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 3;
}

.no-data {
  flex: 3;
}

.payment-info {
  flex: 1;
}

.payment-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 90px;
  border: solid 1px rgb(194, 193, 193);
  padding: 20px;
  border-radius: 8px;
  height: 130px;
}

@media screen and (max-width:767px) {
  .cart-wrapper {
    display: flex;
    flex-direction: column;
    padding: 10px;
  }
}
</style>