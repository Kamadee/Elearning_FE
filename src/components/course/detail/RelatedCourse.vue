<template>
  <div class="related-course-container">
    <p>Khóa học liên quan</p>
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :md="6" v-for="(course, index) in data.relatedCourses" :key="index" style="display:flex;">
        <div class="card-wrapper" v-loading="loadingStates[course.id]" @click="handleClickCard(course.id)">
          <div class="card-course">
            <div class="thumbnail-course"><img :src="replaceUrlImage(course?.thumbnail || '')"></div>
            <div class="title-course">{{ course.title }}</div>
            <div class="author-course">{{ course.author }}</div>
            <div class="price">
              <div class="sale-price">{{ formatCurrency(course.sale_off_price) }}</div>
              <div class="original-price"><del>{{ formatCurrency(course.original_price) }}</del></div>
            </div>
            <div class="category-list">
              <div class="category-course" v-for="(category, index) in course.course_categories" :key="index">{{ category.category_name }}</div>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { replaceUrlImage } from '@/utils/replaceUrlImage'
import { formatCurrency } from '@/utils/formatCurrency'
import useCourse from '@/composables/useCourse';
// import { useRouter } from 'vue-router';
import { ref, watch } from 'vue';

const props = defineProps({
  categoryList: {
    type: Array,
    required: true
  }
})

const data = ref({
  page: 1,
  per_page: 12,
  total: 0,
  relatedCourses: [],
})

const getCoursesRelated = async (page = data.value.page) => {
  data.value.page = page
  const filterData = { 
    category_name: props.categoryList,
    page: data.value.page,
    per_page: data.value.per_page
  }
  const response = await useCourse().getDataCourses(filterData)
  if(response) {
    data.value.relatedCourses = response.data
    data.value.page = response.current_page
    data.value.per_page = response.per_page
    data.value.total = response.total
  }
}
// Theo dõi khi props.categoryList có giá trị
watch(
  () => props.categoryList,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      data.value.page = 1
      getCoursesRelated(1)
    }
  },
  { deep: true } // cũng gọi khi vừa mounted nếu có sẵn data
)

// const route = useRoute()
// const categoryName = route.params.category

const loadingStates = ref({})
const handleClickCard = async (id) => {
  loadingStates.value[id] = true
  try {
    window.location.href = `/search/${id}`
  } finally {
    setTimeout(() => {
      loadingStates.value[id] = false
    }, 2000);
  }
}
</script>
 <style scoped>
 .card-wrapper {
  width: 100%;
  height: 380px;
}
.card-course {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s;
  padding: 12px;
}

.card-course:hover {
  box-shadow: 0 8px 10px rgba(62, 62, 62, 0.1);
}

.thumbnail-course {
  flex: 0 0 66.6666%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-course img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
  transition: transform 0.3s ease;
}

.thumbnail-course img:hover {
  transform: scale(1.15);
}

.title-course {
  font-weight: bold;
  font-size: 16px;
  margin-top: 8px;
  line-height: 1.4;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.author-course {
  color: gray;
  font-size: 12px;
}

.price {
  display: flex;
  gap: 10px;
}

.sale-price {
  font-weight: bold;
}

.original-price {
  color: gray;
}

.category-list {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.category-course {
  background-color: rgba(8, 239, 46, 0.2);
  color: rgb(71, 16, 147);
  padding: 4px 4px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 10px;
}

.category-course:hover {
  transform: scale(1.05);
}
 </style>