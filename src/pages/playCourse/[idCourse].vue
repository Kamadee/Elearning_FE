<template>
  <div class="wrapper">
    <div class="play-header">
      <LeftOutlined /><div class="btn-route" @click="backCourse(data.dataCourse.id)">Quay lại</div>
      <div> | </div>
      <div class="btn-route" @click="backHome">Trang chủ</div>
      <div> | </div>
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
          <div class="title-video">{{ video.video_title }}</div>
        </div>
      </div>
    </div>
    <!-- <div class="information-video">
      <div v-if="data.dataCourse.title">{{ data.dataCourse.title }}</div>
      <div class="description-video"></div>
    </div> -->
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
    console.log(response);
    data.value.urlIframCurrent = response.vimeo
    console.log(data.value.urlIframCurrent);
    
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
    }, 2000);
  }
})
</script>

<style scoped>
.wrapper {
  height: 100vh;
}

.btn-route {
  cursor: pointer;
  padding: 8px 8px;
  transition: background-color 0.2s ease;
}

.btn-route:hover {
  background-color: #d1d7dc;
}

.play-header {
  z-index: 10;
  position: relative;
  height: 90px;
  width: 100%;
  background-color: black;
  display: flex;
  gap: 15px;
  align-items: center;
  padding-left: 25px;
}

.play-content {
  border: 1px solid gray;
  width: 100%;
  height: 473px;
  display: flex;
}

.screen-video {
  flex: 3;
  background-color: rgb(56, 56, 56);
}

.list-video {
  flex: 1;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 100%;
  scroll-behavior: smooth;
  /* Ẩn scrollbar nhưng vẫn scroll được */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.list-video::-webkit-scrollbar {
  display: none;
}

.nd {
  display: flex;
  justify-content: center;
  margin: 25px auto;
}

.item-video {
  display: flex;
  gap: 20px;
  min-height: 90px;
  width: 100%;
  padding: 15px 15px;
  border-bottom: 1px solid #d1d7dc;
}

.item-video:hover {
  background-color: #d1d7dc;
}

.thumbnail-video {
  width: 50px;
  height: 34px;
  object-fit: cover;
}

.is-active {
  background: #d1d7dc;
}

.video {
  width: 100%;
  height: 100%;
}

.video iframe {
  position: relative;
  z-index: 1;
}
</style>