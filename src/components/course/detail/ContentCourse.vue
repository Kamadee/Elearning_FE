<template>
  <div class="content-wrapper">
    <div class="content-left">
      <div class="course-tile"></div>
      <a-tabs style="width: 100%;" v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="Tổng quan">
          <p>{{ courseData.description }}</p>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Nội dung khóa học">
          <h3>Thời gian: {{ courseData.course_duration }}</h3>
          <h3>Khóa học này bao gồm:</h3>

          <a-table :columns="columns" :data-source="lectures" :pagination="false" rowKey="id">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'name'">
                {{ record.name }}
              </template>
              <template v-else-if="column.key === 'description'">
                {{ record.description }}
              </template>
            </template>
          </a-table>

        </a-tab-pane>
        <a-tab-pane key="3" tab="Tác giả">
          <h3>{{ courseData.author }}</h3>
          <p v-html="courseData.authorDescription"></p>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="content-right">
      <PriceInfor :courseData="props.courseData"/>
    </div>
  </div>
</template>

<script setup>
import PriceInfor from '@/components/course/detail/PriceInfor.vue'
import { computed, ref } from 'vue'

const props = defineProps({
  courseData: {
    type: Object,
    required: true
  }
})

const activeKey = ref('1')

const columns = [
  {
    title: 'Tên bài giảng',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
    key: 'description',
  },
]

const lectures = computed(() => 
  props.courseData.videos.map((video, index) => ({
    id: index,
    name: video.video_title,
    description: video.video_description,
  })) 
)
</script>

<style scoped>
.content-wrapper {
  display: flex;
  gap: 35px;
}

.content-left {
  flex: 4;
}

.content-right {
  flex: 2;
}
@media screen and (max-width:767px) {
  .main-courses {
    padding: 10px;
  }
  .content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* align-items: center; */
    gap: 35px;
  }
  .content-left {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

