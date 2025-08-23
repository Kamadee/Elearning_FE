<template>
  <div class="search-container" v-loading="loadingSearch">
    <div v-if="data.dataSearch.length > 0" class="result-wrapper">
      <div class="result-count-search">{{ countDataSearch }} kết quả cho "{{ data.keySearch }}"</div>
      <div class="result-list" v-for="(data, index) in data.dataSearch" :key="index">
        <ItemSearch :dataSearch="data" v-loading="loadingStates[data.id]" @ClickCard="handleClickCard"/>
      </div>
    </div>
    <div v-else class="no-data">
      <div class="result-count-search">{{ countDataSearch }} kết quả cho "{{ data.keySearch }}"</div>
      <NoData />
    </div>
  </div>
</template>

<script setup>
import ItemSearch from '@/components/search/ItemSearch.vue'
import router from '@/router'
import  { useCounterStore } from '@/stores/authStore'
import { computed, onMounted, ref, watch } from "vue"
import NoData from '@/components/NoData.vue'

const store = useCounterStore()
const data = ref({
  dataSearch: [],
  keySearch: "",
})
const loadingStates = ref({})
const loadingSearch = ref(false)

onMounted(async () => {
  loadingSearch.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))
  data.value.dataSearch = [...store.getDataSearch]
  const keyCopy = store.getKeySearch
  data.value.keySearch = keyCopy
  loadingSearch.value = false
})

watch(
  [() => store.getDataSearch, () => store.getKeySearch],
  async ([newData, newKey]) => {
    loadingSearch.value = true
    await new Promise(resolve => setTimeout(resolve, 300)) 
    data.value.dataSearch = [...newData]
    data.value.keySearch = newKey
    loadingSearch.value = false
  },
  { immediate: true }
)
const countDataSearch = computed(() => data.value.dataSearch.length)

const handleClickCard = async (categoryName, id) => {
  loadingStates.value[id] = true
  try {
    window.location.href = `/courses/${categoryName}/${id}`
  } finally {
    setTimeout(() => {
      loadingStates.value[id] = false
    }, 2000);
  }
}
</script>

<style scoped>
.search-container {
  padding: 40px 100px;
  width: 100%;
}

.filter-search {
  display: flex;
  flex-wrap: wrap;  
  gap: 7px;
}

.btn-category {
  border: solid 1px black;
  border-radius: 20px;
  padding: 8px 14px;
  min-width: 92px;
}

.btn-category:hover {
  background-color: black;
  color: white;
}

.no-data {
  flex: 3;
}

.result-wrapper {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
@media screen and (max-width:767px) {
  .search-container {
    padding: 10px 25px;
  }
}
</style>
