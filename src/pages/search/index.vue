<template>
  <div class="search-container" v-loading="loadingSearch">
    <div class="result-count-search">
      {{ totalCourses }} kết quả cho "{{ data.keySearch }}"
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <div class="filter-left">
        <!-- All Filters (Reset) -->
        <button class="filter-pill" @click="resetFilters">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line>
            <line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
          </svg>
          <span>All filters</span>
        </button>

        <!-- Tags Dropdown (Multiple Selection) -->
        <a-select 
          v-model:value="selectedTags" 
          mode="multiple"
          class="filter-select-ant filter-select-tags" 
          popup-class-name="custom-dropdown" 
          :bordered="false" 
          placeholder="Tags"
          :max-tag-count="1"
          :show-arrow="true"
        >
          <a-select-option v-for="tag in availableTags" :key="tag" :value="tag">
            {{ tag }}
          </a-select-option>
        </a-select>

        <!-- Ratings Dropdown -->
        <a-select 
          v-model:value="selectedRating" 
          class="filter-select-ant" 
          popup-class-name="custom-dropdown" 
          :bordered="false" 
          placeholder="Ratings"
        >
          <a-select-option :value="null">Ratings</a-select-option>
          <a-select-option value="4.5">4.5 & up</a-select-option>
          <a-select-option value="4.0">4.0 & up</a-select-option>
          <a-select-option value="3.5">3.5 & up</a-select-option>
        </a-select>

        <!-- Level Dropdown -->
        <a-select 
          v-model:value="selectedLevel" 
          class="filter-select-ant" 
          popup-class-name="custom-dropdown" 
          :bordered="false" 
          placeholder="Level"
        >
          <a-select-option :value="null">Level</a-select-option>
          <a-select-option value="All Levels">All Levels</a-select-option>
          <a-select-option value="Beginner">Beginner</a-select-option>
          <a-select-option value="Intermediate">Intermediate</a-select-option>
          <a-select-option value="Expert">Expert</a-select-option>
        </a-select>
      </div>

      <!-- Sorting -->
      <div class="filter-right">
        <div class="sort-wrapper">
          <span style="font-size: 13px; color: #6a6f73; font-weight: 500;">Sắp xếp theo:</span>
          <a-select 
            v-model:value="sortBy" 
            class="sort-select-ant" 
            popup-class-name="custom-dropdown" 
            :bordered="false"
          >
            <a-select-option value="relevant">Most Relevant</a-select-option>
            <a-select-option value="price-low">Giá: Thấp đến Cao</a-select-option>
            <a-select-option value="price-high">Giá: Cao đến Thấp</a-select-option>
            <a-select-option value="rating">Đánh giá cao nhất</a-select-option>
          </a-select>
        </div>
      </div>
    </div>

    <!-- Course Results Grid -->
    <div v-if="filteredCourses.length > 0" class="result-wrapper">
      <div class="course-grid">
        <ItemCourse 
          v-for="course in filteredCourses" 
          :key="course.id" 
          :course="course" 
          @ClickCard="handleCourseClick"
        />
      </div>

      <!-- Pagination (API-driven) -->
      <div class="pagination-wrapper">
        <a-pagination
          v-model:current="currentPage"
          :total="totalCourses"
          :page-size="pageSize"
          show-less-items
        />
      </div>
    </div>

    <!-- No Data -->
    <div v-else class="no-data">
      <NoData />
    </div>
  </div>
</template>

<script setup>
import ItemCourse from '@/components/course/ItemCourse.vue'
import { useCounterStore } from '@/stores/authStore'
import { computed, onMounted, ref, watch } from "vue"
import NoData from '@/components/NoData.vue'
import useCourse from '@/composables/useCourse'

const store = useCounterStore()
const data = ref({
  dataSearch: [],
  keySearch: "",
})
const loadingSearch = ref(false)

// API Filter and Sort State
const selectedTags = ref([])
const selectedRating = ref(null)
const sortBy = ref('relevant')
const availableTags = ref([])

// Client-side Refinements
const selectedLanguage = ref(null)
const selectedLevel = ref(null)

// Pagination State
const currentPage = ref(1)
const pageSize = ref(6)
const totalCourses = ref(0)

// Reset all filters
const resetFilters = () => {
  selectedTags.value = []
  selectedRating.value = null
  selectedLanguage.value = null
  selectedLevel.value = null
  sortBy.value = 'relevant'
  currentPage.value = 1
}

// Compute language dynamically based on Vietnamese characters presence
const getCourseLanguage = (course) => {
  const text = (course.title + ' ' + (course.description || '')).toLowerCase()
  const viRegex = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i
  return viRegex.test(text) ? 'vi' : 'en'
}

// Compute level dynamically based on title keywords
const getCourseLevel = (course) => {
  const text = (course.title + ' ' + (course.description || '')).toLowerCase()
  if (text.includes('cơ bản') || text.includes('beginner') || text.includes('nhập môn') || text.includes('căn bản')) {
    return 'Beginner'
  }
  if (text.includes('nâng cao') || text.includes('expert') || text.includes('chuyên sâu') || text.includes('advanced')) {
    return 'Expert'
  }
  return 'Intermediate'
}

// Fetch courses from Backend API with filters
const fetchCourses = async () => {
  loadingSearch.value = true
  try {
    const params = {
      keyword: store.getKeySearch,
      page: currentPage.value,
      per_page: pageSize.value,
    }

    if (selectedRating.value) {
      params.rating_average = parseFloat(selectedRating.value)
    }

    if (sortBy.value && sortBy.value !== 'relevant') {
      params.sort_by = sortBy.value
    }

    if (selectedTags.value && selectedTags.value.length > 0) {
      params.tag_name = selectedTags.value
    }

    const response = await useCourse().getDataCourses(params)
    if (response) {
      data.value.dataSearch = response.data || []
      totalCourses.value = response.total || 0
    } else {
      data.value.dataSearch = []
      totalCourses.value = 0
    }
  } catch (err) {
    console.error('Error fetching courses:', err)
  } finally {
    loadingSearch.value = false
  }
}

// Watchers to trigger API call when filters change
watch(
  [selectedRating, sortBy, () => [...selectedTags.value]],
  () => {
    currentPage.value = 1
    fetchCourses()
  }
)

watch(
  currentPage,
  () => {
    fetchCourses()
  }
)

watch(
  [selectedLanguage, selectedLevel],
  () => {
    currentPage.value = 1
  }
)

const fetchTags = async () => {
  try {
    const response = await useCourse().getTags()
    if (response) {
      availableTags.value = response.map(t => t.tag_name)
    }
  } catch (err) {
    console.error('Error fetching tags:', err)
  }
}

watch(
  () => store.getKeySearch,
  (newKey) => {
    data.value.keySearch = newKey
    currentPage.value = 1
    fetchCourses()
  }
)

onMounted(async () => {
  data.value.keySearch = store.getKeySearch
  await fetchTags()
  await fetchCourses()
})

// Local Filter (Language, Level)
const filteredCourses = computed(() => {
  let list = [...data.value.dataSearch]

  if (selectedLanguage.value) {
    list = list.filter(c => getCourseLanguage(c) === selectedLanguage.value)
  }

  if (selectedLevel.value) {
    list = list.filter(c => getCourseLevel(c) === selectedLevel.value)
  }

  return list
})

const handleCourseClick = (id) => {
  const courseObj = data.value.dataSearch.find(c => c.id === id)
  let categoryName = 'default'
  if (courseObj && courseObj.course_categories && courseObj.course_categories.length > 0) {
    categoryName = courseObj.course_categories[0].category_name
  }
  window.location.href = `/courses/${categoryName}/${id}`
}
</script>

<style scoped>
.search-container {
  padding: 40px 100px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.result-count-search {
  font-size: 24px;
  font-weight: 700;
  color: #1c1d1f;
  margin-bottom: 24px;
}

/* Filter Bar styles */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 32px;
  width: 100%;
}

.filter-left {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.filter-right {
  display: flex;
  align-items: center;
}

.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #d1d7dc;
  border-radius: 9999px;
  background-color: #fff;
  font-size: 13px;
  font-weight: 700;
  color: #1c1d1f;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  height: 38px;
}

.filter-pill:hover {
  background-color: #f7f9fa;
  border-color: #1c1d1f;
}

.filter-pill.active {
  background-color: #1c1d1f;
  color: #fff;
  border-color: #1c1d1f;
}

/* Ant Design Select Pill Styles */
.filter-select-ant {
  border: 1px solid #d1d7dc;
  border-radius: 9999px;
  background-color: #fff;
  height: 38px;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
  width: 135px;
}

.filter-select-tags {
  width: 160px !important;
}

.filter-select-tags :deep(.ant-select-selector) {
  flex-wrap: nowrap !important;
  overflow: hidden !important;
  position: relative !important;
}

.filter-select-tags :deep(.ant-select-selection-placeholder) {
  position: absolute !important;
  left: 16px !important;
  right: auto !important;
  width: auto !important;
  max-width: none !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  color: #6a6f73 !important;
  font-weight: 700 !important;
  font-size: 13px !important;
  margin: 0 !important;
  pointer-events: none !important;
}

.filter-select-tags :deep(.ant-select-selection-overflow) {
  flex-wrap: nowrap !important;
}

.filter-select-tags :deep(.ant-select-selection-item) {
  background: #f3f4f5 !important;
  border: 1px solid #d1d7dc !important;
  border-radius: 4px !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  height: 24px !important;
  line-height: 22px !important;
  margin: 0 4px 0 0 !important;
  color: #1c1d1f !important;
}

.filter-select-tags :deep(.ant-select-selection-item-remove) {
  color: #1c1d1f !important;
}

.filter-select-ant :deep(.ant-select-selector) {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  padding: 0 16px !important;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
  font-weight: 700 !important;
  font-size: 13px !important;
  color: #1c1d1f !important;
}

.filter-select-ant :deep(.ant-select-arrow) {
  right: 14px !important;
  color: #1c1d1f !important;
}

.filter-select-ant:hover {
  background-color: #f7f9fa;
  border-color: #1c1d1f;
}

.sort-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-select-ant {
  width: 160px;
}

.sort-select-ant :deep(.ant-select-selector) {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  font-weight: 700 !important;
  font-size: 13px !important;
  color: #1c1d1f !important;
}

/* Course Grid */
.course-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
}

.result-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 48px;
  width: 100%;
}

.no-data {
  text-align: center;
  padding: 80px 0;
  width: 100%;
}

/* Deep overwrite for ant design pagination */
:deep(.ant-pagination-item-active) {
  border-color: #1c1d1f !important;
  background-color: #1c1d1f !important;
}
:deep(.ant-pagination-item-active a) {
  color: #fff !important;
}
:deep(.ant-pagination-item:hover) {
  border-color: #1c1d1f !important;
}
:deep(.ant-pagination-item:hover a) {
  color: #1c1d1f !important;
}

/* Polished global styles for custom popup dropdowns */
:global(.custom-dropdown) {
  border-radius: 8px !important;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08) !important;
  padding: 4px 0 !important;
}

:global(.custom-dropdown .ant-select-item-option) {
  font-size: 13px !important;
  font-weight: 500 !important;
  padding: 8px 16px !important;
}

:global(.custom-dropdown .ant-select-item-option-selected) {
  background-color: #f7f9fa !important;
  font-weight: 700 !important;
  color: #1c1d1f !important;
}

:global(.custom-dropdown .ant-select-item-option-active) {
  background-color: #f3f4f5 !important;
}

@media screen and (max-width: 1024px) {
  .course-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .search-container {
    padding: 30px 40px;
  }
}

@media screen and (max-width: 767px) {
  .course-grid {
    grid-template-columns: 1fr;
  }
  .search-container {
    padding: 20px 20px;
  }
  .filter-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  .filter-right {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
