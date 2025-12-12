<template>
  <div class="wrapper">
    <div class="play-header">
      <LeftOutlined /><div class="btn-route" @click="backCourse(data.dataCourse.id)">Quay lại |</div>
      <div class="btn-route" @click="backHome">Trang chủ |</div>
      <div class="title-course" v-if="data.dataCourse.title">{{ data.dataCourse.title }}</div>
    </div>
    <div class="play-content">
      <div class="screen-video">
        <div class="video" v-html="data.urlIframCurrent" v-loading="loadingScreen" ref="myIframe"></div>
      </div>
      <div class="list-video">
        <div class="nd">Nội dung khóa học</div>
        <div class="item-video" v-for="(video, index) in data.dataCourse.videos" :key="index"
         @click="getVimeo(video.id)" v-loading="loadingVideo[video.id]" :class="{ 'is-active': data.currentVideo == video.id }">
          <img class="thumbnail-video" :src="video.video_thumbnail">
          <div class="title-video truncate">{{ video.video_title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useCourse from '@/composables/useCourse';
import { useRoute, useRouter } from 'vue-router';
import { ref, onUpdated, onMounted } from "vue"

const data = ref({
  dataCourse: {},
  currentVideo: "",
  urlIframCurrent: "",
})

const theme = ref({
  heightVideo: '100%',
})

const router = useRouter()
const route = useRoute()

const getDetailCourse = async () => {
  const response = await useCourse().getDetailCourse(route.params.idCourse)
  if(response) {
    data.value.dataCourse = response
    if(data.value.dataCourse.videos[0]) {
      data.value.currentVideo = data.value.dataCourse.videos[0].id
      getVimeo(data.value.currentVideo)
    }
  }
}
onMounted(() => {
  getDetailCourse()
})

const backCourse = (idCourse) => {
  router.push(`/search/${idCourse}`)
}
const backHome = () => {
  router.push('/')
}

const loadingScreen = ref(false)
const loadingVideo = ref({})

const getVimeo = async (id) => {
  loadingScreen.value = true
  try {
    data.value.currentVideo = id;
    const response = await useCourse().getVimeo(id)
    data.value.urlIframCurrent = response.vimeo
  } catch (error) {
    console.error('Lỗi khi lấy video:', error);
    setTimeout(() => {
      loadingScreen.value = false;
    }, 200);
  }
}

const myIframe = ref('myIframe')
onUpdated((id) => {
  try {
    loadingVideo.value[id] = true
    let elIframe = myIframe.value.children[0]
    if (elIframe) {
      elIframe.setAttribute('width', '100%');
      elIframe.setAttribute('height', '100%');

      elIframe.addEventListener("load", () => {
        loadingScreen.value = false
      });
    }
    theme.value.heightVideo = `${window.innerWidth / 16 * 9}px`
  } finally {
    setTimeout(() => {
      loadingVideo.value[id] = false
    }, 2000)
  }
})
</script>

<style scoped>
.wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #000;
}

/* Header Styles */
.play-header {
  color: #fff;
  position: relative;
  height: 56px;
  width: 100%;
  background-color: #1c1d1f;
  display: flex;
  gap: 0;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #3e4143;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.play-header :deep(.anticon) {
  font-size: 18px;
  color: #fff;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.play-header :deep(.anticon):hover {
  background-color: #3e4143;
}

.btn-route {
  cursor: pointer;
  padding: 8px 12px;
  font-size: 14px;
  color: #fff;
  transition: background-color 0.2s ease;
  border-radius: 4px;
  font-weight: 400;
  user-select: none;
}

.btn-route:hover {
  background-color: #3e4143;
}

.title-course {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-left: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}

/* Content Area */
.play-content {
  flex: 1;
  width: 100%;
  display: flex;
  overflow: hidden;
  background-color: #000;
}

/* Video Player */
.screen-video {
  flex: 1;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-width: 0;
}

.video {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video iframe {
  width: 100%;
  height: 100%;
  border: none;
  position: relative;
  z-index: 1;
}

/* Sidebar - Course Content */
.list-video {
  width: 400px;
  min-width: 320px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  border-left: 1px solid #d1d7dc;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: #d1d7dc #fff;
}

.list-video::-webkit-scrollbar {
  width: 8px;
}

.list-video::-webkit-scrollbar-track {
  background: #fff;
}

.list-video::-webkit-scrollbar-thumb {
  background-color: #d1d7dc;
  border-radius: 4px;
}

.list-video::-webkit-scrollbar-thumb:hover {
  background-color: #a8a8a8;
}

.nd {
  font-size: 16px;
  font-weight: 700;
  color: #1c1d1f;
  padding: 16px 16px 12px;
  border-bottom: 1px solid #d1d7dc;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Video Item */
.item-video {
  display: flex;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border-bottom: 1px solid #d1d7dc;
  cursor: pointer;
  transition: background-color 0.15s ease;
  position: relative;
}

.item-video:hover {
  background-color: #f7f9fa;
}

.item-video.is-active {
  background-color: #e8f0f5;
  border-left: 3px solid #6d28d2;
  padding-left: 13px;
}

.item-video.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: #6d28d2;
}

.thumbnail-video {
  width: 160px;
  min-width: 160px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
  background-color: #f7f9fa;
  flex-shrink: 0;
}

.title-video {
  flex: 1;
  font-size: 14px;
  font-weight: 400;
  color: #1c1d1f;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  align-self: center;
}

.item-video.is-active .title-video {
  font-weight: 600;
  color: #1c1d1f;
}

/* Responsive */
@media screen and (max-width: 1024px) {
  .list-video {
    width: 320px;
    min-width: 280px;
  }
  
  .thumbnail-video {
    width: 120px;
    min-width: 120px;
    height: 68px;
  }
}

@media screen and (max-width: 768px) {
  .play-content {
    flex-direction: column;
  }
  
  .screen-video {
    height: 50vh;
    min-height: 300px;
  }
  
  .list-video {
    width: 100%;
    height: 50vh;
    border-left: none;
    border-top: 1px solid #d1d7dc;
  }
  
  .thumbnail-video {
    width: 100px;
    min-width: 100px;
    height: 56px;
  }
  
  .title-course {
    font-size: 12px;
    margin-left: 8px;
  }
}
</style>