<template>
  <div class="content-wrapper">
    <div class="content-left">
      <div class="course-tile"></div>
      <a-tabs style="width: 100%;" v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="Tổng quan">
          <p v-html="courseData.content"></p>
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
  width: 100%;
  box-sizing: border-box;
}

.content-left {
  flex: 4 1 0%;
  min-width: 0;
}

.content-right {
  flex: 2 1 0%;
  min-width: 0;
}

:deep(.ant-tabs) {
  width: 100%;
}

:deep(.ant-tabs-tab) {
  color: #6a6f73 !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  padding: 12px 16px !important;
  transition: color 0.2s ease !important;
}

:deep(.ant-tabs-tab:hover) {
  color: #1c1d1f !important;
}

:deep(.ant-tabs-tab-active) {
  color: #1c1d1f !important;
}

:deep(.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #1c1d1f !important;
  font-weight: 600 !important;
}

:deep(.ant-tabs-ink-bar) {
  background: #1c1d1f !important;
}

:deep(.ant-tabs-content-holder) {
  padding-top: 24px;
}

/* Tab Content Styling */
:deep(.ant-tabs-tabpane) {
  color: #1c1d1f;
}

:deep(.ant-tabs-tabpane p) {
  color: #1c1d1f !important;
  font-size: 14px;
  line-height: 1.6;
}

:deep(.ant-tabs-tabpane h3) {
  color: #1c1d1f;
  font-size: 18px;
  font-weight: 700;
  margin: 16px 0 12px 0;
}

:deep(.ant-tabs-tabpane h3:first-child) {
  margin-top: 0;
}

/* Content HTML Styling */
:deep(.ant-tabs-tabpane p :deep(*)) {
  color: #1c1d1f !important;
}

:deep(.ant-tabs-tabpane p :deep(a)) {
  color: #6d28d2 !important;
  text-decoration: underline;
}

:deep(.ant-tabs-tabpane p :deep(a:hover)) {
  color: #5b21b6 !important;
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

  :deep(.ant-tabs-tab) {
    padding: 10px 12px !important;
    font-size: 13px !important;
  }

  :deep(.ant-tabs-content-holder) {
    padding-top: 20px;
  }

  :deep(.ant-tabs-tabpane h3) {
    font-size: 16px;
  }
}
</style>

