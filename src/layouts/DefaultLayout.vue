  <template>
    <div class="wrapper">
      <div class="navbar"><TopNavbar @send-data="handleDataFromNav"/></div>
      <div
        v-if="isOpenSidebar"
        class="overlay"
        @click="handleDataFromNav(false)"
      ></div>
      <div class="sidebar"><SideBar v-if="isOpenSidebar"/></div>
      <div class="main"><router-view :key="$route.fullPath"/></div>
      <div class="footer"><Footer /></div>
      <SearchMobile v-if="isOpenSearch" class="search-container-mobile"/>
    </div>
  </template>

<script setup>
import { computed, ref, watch } from 'vue'
import  { useCounterStore } from '@/stores/authStore'
import TopNavbar from '../components/dashboard/TopNavbar.vue'
import Footer from '../components/dashboard/Footer.vue'
import SideBar from '../components/dashboard/SideBar.vue'
import SearchMobile from '@/components/search/SearchMobile.vue'

const isOpenSidebar = computed(() => stores.getIsOpenSidebar)
const stores = useCounterStore()
const isOpenSearch = computed(() => stores.getIsOpenSearch)

const handleDataFromNav = (value) => {
  stores.setIsOpenSidebar(value)
}

watch(() => stores.getIsOpenSidebar, (newVal) => {
  document.body.style.overflow = newVal ? 'hidden' : ''
})
</script>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}

.navbar {
  flex-shrink: 0;
}

.sidebar {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  transition: 2.5s;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
}

.main {
  flex: 1;
  overflow-y: auto;
}

.footer {
  flex-shrink: 0;
}
.search-container-mobile {
  background-color: white;
  min-height: 100vh;
  width: 100%;
  position: fixed;
  z-index: 10000;
}
</style>