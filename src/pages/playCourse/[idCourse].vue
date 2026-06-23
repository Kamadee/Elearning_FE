<template>
  <div class="wrapper">
    <div class="play-header">
      <LeftOutlined /><div class="btn-route" @click="backCourse(data.dataCourse.id)">Quay lại |</div>
      <div class="btn-route" @click="backHome">Trang chủ |</div>
      <div class="title-course" v-if="data.dataCourse.title">{{ data.dataCourse.title }}</div>
    </div>
    <div class="play-content">
      <div class="screen-video">
        <!-- 1. Lock / Blocked state message -->
        <div v-if="currentPlayItem && isItemBlocked(currentPlayItem)" class="blocked-overlay">
          <div class="blocked-card">
            <LockOutlined class="lock-icon" />
            <h3>Nội dung này đang bị khóa</h3>
            <p class="lock-text">
              Bạn cần hoàn thành bài trắc nghiệm 
              <span class="block-quiz-title">"{{ getBlockingQuizName(currentPlayItem) }}"</span> 
              phía trước để mở khóa bài học này.
            </p>
            <button class="btn-jump-quiz" @click="jumpToQuiz(getBlockingQuizName(currentPlayItem))">
              Đến bài trắc nghiệm ngay
            </button>
          </div>
        </div>

        <!-- 2. Playable video view -->
        <div v-else-if="currentPlayItem && currentPlayItem.type === 'video'" class="video" v-html="data.urlIframCurrent" v-loading="loadingScreen" ref="myIframe"></div>

        <!-- 3. Quiz viewport -->
        <div v-else-if="currentPlayItem && currentPlayItem.type === 'quiz'" class="quiz-container">
          <div class="quiz-header">
            <h2>Bài trắc nghiệm: {{ currentPlayItem.title }}</h2>
            <p v-if="currentPlayItem.description" class="quiz-desc">{{ currentPlayItem.description }}</p>
            <div class="quiz-status-tag" :class="completedQuizzes.includes(currentPlayItem.id) ? 'status-completed' : 'status-pending'">
              {{ completedQuizzes.includes(currentPlayItem.id) ? 'Đã hoàn thành' : 'Chưa hoàn thành' }}
            </div>
          </div>

          <div class="quiz-body" v-if="currentPlayItem.questions && currentPlayItem.questions.length">
            <div v-for="(question, qIndex) in currentPlayItem.questions" :key="question.id" class="question-card">
              <div class="question-title">
                <span class="q-number">Câu {{ qIndex + 1 }}:</span> {{ question.question_text }}
              </div>
              <div class="options-list">
                <label v-for="option in question.options" :key="option.id" class="option-label" :class="{
                  'correct-highlight': quizSubmitted && option.is_correct,
                  'incorrect-highlight': quizSubmitted && isOptionSelected(question, option) && !option.is_correct
                }">
                  <input 
                    v-if="question.type === 'multiple'"
                    type="checkbox" 
                    :name="'q_' + question.id" 
                    :value="option.id" 
                    v-model="selectedAnswers[question.id]"
                    :disabled="quizSubmitted"
                  />
                  <input 
                    v-else
                    type="radio" 
                    :name="'q_' + question.id" 
                    :value="option.id" 
                    v-model="selectedAnswers[question.id]"
                    :disabled="quizSubmitted"
                  />
                  <span class="option-text">{{ option.option_text }}</span>
                  
                  <span v-if="quizSubmitted && option.is_correct" class="result-badge correct">
                    <CheckOutlined /> Đáp án đúng
                  </span>
                  <span v-if="quizSubmitted && isOptionSelected(question, option) && !option.is_correct" class="result-badge incorrect">
                    <CloseOutlined /> Chưa chính xác
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div class="quiz-body-empty" v-else>
            <p>Bài trắc nghiệm này hiện chưa có câu hỏi nào.</p>
          </div>

          <div class="quiz-footer" v-if="currentPlayItem.questions && currentPlayItem.questions.length">
            <div v-if="quizSubmitted" class="quiz-result-summary" :class="quizPassed ? 'result-passed' : 'result-failed'">
              <template v-if="quizPassed">
                <CheckCircleOutlined class="result-icon" />
                <div>
                  <h4>Chúc mừng! Bạn đã trả lời đúng tất cả các câu hỏi</h4>
                  <p>Kết quả đạt: {{ quizScore }}/{{ currentPlayItem.questions.length }}</p>
                </div>
              </template>
              <template v-else>
                <CloseCircleOutlined class="result-icon" />
                <div>
                  <h4>Kết quả chưa đạt. Hãy xem lại kiến thức và thử lại nhé!</h4>
                  <p>Kết quả: {{ quizScore }}/{{ currentPlayItem.questions.length }} (Yêu cầu đúng 100% câu hỏi để vượt qua)</p>
                  <button class="btn-retry" @click="resetQuizState(currentPlayItem)">Làm lại</button>
                </div>
              </template>
            </div>
            
            <button 
              v-if="!quizSubmitted" 
              class="btn-submit-quiz" 
              @click="submitQuiz"
              :disabled="!canSubmit"
            >
              Nộp bài
            </button>
          </div>
        </div>

        <!-- 4. Default fallback when no items -->
        <div v-else class="no-item-selected">
          <p>Không có nội dung bài học nào được tìm thấy.</p>
        </div>
      </div>

      <!-- Curriculum list in Sidebar -->
      <div class="list-video">
        <div class="nd">Nội dung khóa học</div>
        <div 
          v-for="(item, index) in data.dataCourse.curriculum" 
          :key="index"
          class="item-video"
          :class="{ 
            'is-active': currentPlayItem && currentPlayItem.id === item.id && currentPlayItem.type === item.type,
            'is-blocked': isItemBlocked(item)
          }"
          @click="selectItem(item)"
        >
          <!-- Video Thumbnail or Quiz Icon -->
          <div v-if="item.type === 'video'" class="thumbnail-wrapper">
            <img class="thumbnail-video" :src="replaceUrlImage(item.video_thumbnail) || '/default_video_thumbnail.png'">
            <div v-if="isItemBlocked(item)" class="thumbnail-lock-overlay">
              <LockOutlined />
            </div>
          </div>
          
          <div v-else class="quiz-icon-wrapper" :class="{ 'completed': completedQuizzes.includes(item.id) }">
            <CheckCircleOutlined v-if="completedQuizzes.includes(item.id)" />
            <QuestionCircleOutlined v-else />
            <div v-if="isItemBlocked(item)" class="quiz-lock-overlay">
              <LockOutlined />
            </div>
          </div>

          <div class="item-info">
            <div class="title-video truncate">{{ item.type === 'video' ? item.video_title : item.title }}</div>
            
            <div class="item-meta">
              <span class="type-badge" :class="item.type">
                {{ item.type === 'video' ? 'Video' : 'Trắc nghiệm' }}
              </span>
              
              <span v-if="item.type === 'quiz'" class="quiz-status-label" :class="{ 'completed': completedQuizzes.includes(item.id) }">
                {{ completedQuizzes.includes(item.id) ? 'Đã đạt' : 'Chưa đạt' }}
              </span>

              <span v-if="isItemBlocked(item)" class="lock-label">
                <LockOutlined /> Khóa
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useCourse from '@/composables/useCourse';
import { useRoute, useRouter } from 'vue-router';
import { ref, onUpdated, onMounted, computed } from "vue";
import { replaceUrlImage } from '@/utils/replaceUrlImage'
import { 
  LockOutlined, 
  CheckCircleOutlined, 
  QuestionCircleOutlined, 
  CheckOutlined,
  CloseOutlined,
  CloseCircleOutlined
} from '@ant-design/icons-vue';

const data = ref({
  dataCourse: {},
  currentVideo: "",
  urlIframCurrent: "",
});

const currentPlayItem = ref(null);
const completedQuizzes = ref([]);
const selectedAnswers = ref({});
const quizSubmitted = ref(false);
const quizPassed = ref(false);
const quizScore = ref(0);
const quizFeedback = ref({});

const theme = ref({
  heightVideo: '100%',
});

const router = useRouter();
const route = useRoute();

const loadCompletedQuizzes = () => {
  const apiCompleted = [];
  if (data.value.dataCourse && data.value.dataCourse.curriculum) {
    data.value.dataCourse.curriculum.forEach(item => {
      if (item.type === 'quiz' && (item.is_completed === 1 || item.is_completed === true)) {
        apiCompleted.push(item.id);
      }
    });
  }

  const stored = localStorage.getItem(`completed_quizzes_course_${route.params.idCourse}`);
  let localCompleted = [];
  if (stored) {
    try {
      localCompleted = JSON.parse(stored);
    } catch {
      localCompleted = [];
    }
  }
  
  completedQuizzes.value = Array.from(new Set([...apiCompleted, ...localCompleted]));
};

const saveCompletedQuiz = (quizId) => {
  if (!completedQuizzes.value.includes(quizId)) {
    completedQuizzes.value.push(quizId);
    localStorage.setItem(
      `completed_quizzes_course_${route.params.idCourse}`,
      JSON.stringify(completedQuizzes.value)
    );
  }
};

const isItemBlocked = (item) => {
  if (!data.value.dataCourse || !data.value.dataCourse.curriculum) return false;
  
  const curriculum = data.value.dataCourse.curriculum;
  const index = curriculum.findIndex(i => i.type === item.type && i.id === item.id);
  if (index === -1) return false;
  
  for (let k = 0; k < index; k++) {
    const prevItem = curriculum[k];
    if (prevItem.type === 'quiz') {
      if (!completedQuizzes.value.includes(prevItem.id)) {
        return true;
      }
    }
  }
  return false;
};

const getBlockingQuizName = (item) => {
  if (!data.value.dataCourse || !data.value.dataCourse.curriculum) return '';
  
  const curriculum = data.value.dataCourse.curriculum;
  const index = curriculum.findIndex(i => i.type === item.type && i.id === item.id);
  if (index === -1) return '';
  
  for (let k = 0; k < index; k++) {
    const prevItem = curriculum[k];
    if (prevItem.type === 'quiz' && !completedQuizzes.value.includes(prevItem.id)) {
      return prevItem.title || 'bài trắc nghiệm trước đó';
    }
  }
  return '';
};

const jumpToQuiz = (quizName) => {
  if (!data.value.dataCourse || !data.value.dataCourse.curriculum) return;
  const quizItem = data.value.dataCourse.curriculum.find(
    i => i.type === 'quiz' && (i.title === quizName || quizName.includes(i.title))
  );
  if (quizItem) {
    selectItem(quizItem);
  }
};

const selectItem = async (item) => {
  if (isItemBlocked(item)) {
    currentPlayItem.value = item;
    data.value.urlIframCurrent = "";
    return;
  }
  
  currentPlayItem.value = item;
  if (item.type === 'video') {
    loadingScreen.value = true;
    try {
      data.value.currentVideo = item.id;
      const response = await useCourse().getVimeo(item.id);
      if (response) {
        data.value.urlIframCurrent = response.vimeo;
      }
    } catch (error) {
      console.error('Lỗi khi lấy video:', error);
      setTimeout(() => {
        loadingScreen.value = false;
      }, 200);
    }
  } else if (item.type === 'quiz') {
    data.value.urlIframCurrent = "";
    resetQuizState(item);
  }
};

const isOptionSelected = (question, option) => {
  const ans = selectedAnswers.value[question.id];
  if (question.type === 'multiple') {
    return Array.isArray(ans) && ans.includes(option.id);
  }
  return ans == option.id;
};

const canSubmit = computed(() => {
  if (!currentPlayItem.value || !currentPlayItem.value.questions) return false;
  return currentPlayItem.value.questions.every(q => {
    const ans = selectedAnswers.value[q.id];
    if (q.type === 'multiple') {
      return Array.isArray(ans) && ans.length > 0;
    }
    return ans !== null && ans !== undefined;
  });
});

const resetQuizState = (quiz) => {
  const selected = {};
  if (quiz && quiz.questions) {
    quiz.questions.forEach(q => {
      if (q.type === 'multiple') {
        selected[q.id] = [];
      } else {
        selected[q.id] = null;
      }
    });
  }
  selectedAnswers.value = selected;
  quizSubmitted.value = false;
  quizPassed.value = false;
  quizScore.value = 0;
  quizFeedback.value = {};
};

const submitQuiz = async () => {
  if (!currentPlayItem.value || currentPlayItem.value.type !== 'quiz') return;
  
  const questions = currentPlayItem.value.questions || [];
  let correctCount = 0;
  const feedback = {};
  
  questions.forEach(q => {
    const correctOptions = q.options.filter(o => o.is_correct === 1 || o.is_correct === true);
    const correctOptIds = correctOptions.map(o => o.id);
    
    let isCorrect = false;
    if (q.type === 'multiple') {
      const selectedIds = (selectedAnswers.value[q.id] || []).map(Number);
      const correctIds = correctOptIds.map(Number);
      if (selectedIds.length === correctIds.length) {
        isCorrect = selectedIds.every(id => correctIds.includes(id));
      } else {
        isCorrect = false;
      }
    } else {
      const selectedOptId = selectedAnswers.value[q.id];
      isCorrect = correctOptIds.includes(Number(selectedOptId));
    }

    if (isCorrect) {
      correctCount++;
    }
    feedback[q.id] = {
      correct: isCorrect,
      correctAnswers: correctOptions.map(o => o.option_text).join(', ')
    };
  });
  
  quizScore.value = correctCount;
  quizFeedback.value = feedback;
  quizSubmitted.value = true;
  
  const isPassed = correctCount === questions.length;
  quizPassed.value = isPassed;

  try {
    const response = await useCourse().submitQuiz(currentPlayItem.value.id, isPassed);
    console.log("Submit quiz response:", response);
  } catch (error) {
    console.error("Lỗi khi call API submit quiz:", error);
  }

  if (isPassed) {
    saveCompletedQuiz(currentPlayItem.value.id);
    
    // Update local curriculum is_completed value to unlock subsequent content
    if (data.value.dataCourse && data.value.dataCourse.curriculum) {
      const quizIndex = data.value.dataCourse.curriculum.findIndex(
        item => item.type === 'quiz' && item.id === currentPlayItem.value.id
      );
      if (quizIndex !== -1) {
        data.value.dataCourse.curriculum[quizIndex].is_completed = true;
      }
    }
  }
};

const getDetailCourse = async () => {
  const response = await useCourse().getDetailCourse(route.params.idCourse);
  if(response) {
    data.value.dataCourse = response;
    console.log("check",data.value)
    loadCompletedQuizzes();
    
    if (data.value.dataCourse.curriculum && data.value.dataCourse.curriculum.length > 0) {
      selectItem(data.value.dataCourse.curriculum[0]);
    }
  }
};

onMounted(() => {
  getDetailCourse();
});

const backCourse = (idCourse) => {
  router.push(`/search/${idCourse}`);
};
const backHome = () => {
  router.push('/');
};

const loadingScreen = ref(false);
const loadingVideo = ref({});

const myIframe = ref('myIframe');
onUpdated(() => {
  try {
    if (currentPlayItem.value && currentPlayItem.value.type === 'video') {
      const id = currentPlayItem.value.id;
      loadingVideo.value[id] = true;
      let elIframe = myIframe.value?.children[0];
      if (elIframe) {
        elIframe.setAttribute('width', '100%');
        elIframe.setAttribute('height', '100%');
        elIframe.addEventListener("load", () => {
          loadingScreen.value = false;
        });
      }
      theme.value.heightVideo = `${window.innerWidth / 16 * 9}px`;
    }
  } catch (e) {
    console.error(e);
  }
});
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

/* Video Player / Main Viewport */
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

.video :deep(iframe) {
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

/* Sidebar Item */
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

.thumbnail-wrapper {
  position: relative;
  width: 120px;
  min-width: 120px;
  height: 68px;
  flex-shrink: 0;
}

.thumbnail-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  background-color: #f7f9fa;
}

.thumbnail-lock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 18px;
  border-radius: 4px;
}

.quiz-icon-wrapper {
  width: 120px;
  min-width: 120px;
  height: 68px;
  background-color: #f7f9fa;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  font-size: 24px;
  color: #6c757d;
  flex-shrink: 0;
  border: 1px dashed #ced4da;
  position: relative;
}

.quiz-icon-wrapper.completed {
  background-color: #e6f4ea;
  border-color: #34a853;
  color: #34a853;
}

.quiz-lock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 18px;
  border-radius: 4px;
}

.item-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2px 0;
  flex: 1;
  min-width: 0;
}

.title-video {
  font-size: 14px;
  font-weight: 400;
  color: #1c1d1f;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-video.is-active .title-video {
  font-weight: 600;
}

.item-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 4px;
}

.type-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 4px;
  border-radius: 3px;
}

.type-badge.video {
  background-color: #e8f0f5;
  color: #1890ff;
}

.type-badge.quiz {
  background-color: #f9f0ff;
  color: #722ed1;
}

.quiz-status-label {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 4px;
  border-radius: 3px;
  background-color: #fff3cd;
  color: #856404;
}

.quiz-status-label.completed {
  background-color: #d4edda;
  color: #155724;
}

.lock-label {
  font-size: 10px;
  font-weight: 600;
  color: #ff4d4f;
  display: flex;
  align-items: center;
  gap: 2px;
}

.item-video.is-blocked {
  opacity: 0.8;
}

/* Blocked state overlay */
.blocked-overlay {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #141414;
  color: #fff;
  padding: 24px;
}

.blocked-card {
  max-width: 440px;
  text-align: center;
  padding: 32px 24px;
  background: #202020;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  border: 1px solid #333;
}

.lock-icon {
  font-size: 54px;
  color: #ff4d4f;
  margin-bottom: 20px;
}

.lock-text {
  font-size: 14px;
  color: #bbb;
  margin-top: 8px;
  line-height: 1.6;
}

.block-quiz-title {
  color: #ffd666;
  font-weight: 600;
}

.btn-jump-quiz {
  margin-top: 24px;
  background-color: #6d28d2;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-jump-quiz:hover {
  background-color: #5b21b6;
}

/* Quiz Interface Styles */
.quiz-container {
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 32px 40px;
}

.quiz-header {
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 16px;
  margin-bottom: 24px;
}

.quiz-header h2 {
  font-size: 22px;
  color: #212529;
  font-weight: 700;
  margin-bottom: 8px;
}

.quiz-desc {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 12px;
}

.quiz-status-tag {
  display: inline-block;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 12px;
}

.status-completed {
  background-color: #d4edda;
  color: #155724;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.quiz-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.quiz-body-empty {
  padding: 40px;
  text-align: center;
  color: #6c757d;
  font-style: italic;
  background: white;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.question-card {
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.question-title {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin-bottom: 16px;
}

.q-number {
  color: #6d28d2;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-label {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.option-label:hover {
  background-color: #f8f9fa;
  border-color: #6d28d2;
}

.option-label input[type="radio"],
.option-label input[type="checkbox"] {
  accent-color: #6d28d2;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.option-text {
  font-size: 14px;
  color: #495057;
  flex-grow: 1;
}

/* Feedback/Results classes */
.correct-highlight {
  background-color: #e6f4ea !important;
  border-color: #34a853 !important;
}

.incorrect-highlight {
  background-color: #fce8e6 !important;
  border-color: #ea4335 !important;
}

.result-badge {
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.result-badge.correct {
  color: #137333;
}

.result-badge.incorrect {
  color: #c5221f;
}

.quiz-footer {
  margin-top: 30px;
  border-top: 1px solid #dee2e6;
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.btn-submit-quiz {
  background-color: #6d28d2;
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-submit-quiz:disabled {
  background-color: #ced4da;
  cursor: not-allowed;
}

.btn-submit-quiz:not(:disabled):hover {
  background-color: #5b21b6;
}

.quiz-result-summary {
  display: flex;
  gap: 16px;
  align-items: center;
  width: 100%;
  padding: 20px;
  border-radius: 8px;
}

.quiz-result-summary.result-passed {
  background-color: #e6f4ea;
  border: 1px solid #34a853;
  color: #137333;
}

.quiz-result-summary.result-failed {
  background-color: #fce8e6;
  border: 1px solid #ea4335;
  color: #c5221f;
}

.result-icon {
  font-size: 36px;
}

.btn-retry {
  margin-top: 10px;
  background-color: #ea4335;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-retry:hover {
  background-color: #c5221f;
}

.no-item-selected {
  text-align: center;
  color: #888;
  padding: 48px;
}

/* Responsive Custom Rules */
@media screen and (max-width: 1024px) {
  .list-video {
    width: 320px;
    min-width: 280px;
  }
  
  .thumbnail-wrapper, .quiz-icon-wrapper {
    width: 100px;
    min-width: 100px;
    height: 56px;
  }
}

@media screen and (max-width: 768px) {
  .play-content {
    flex-direction: column;
  }
  
  .screen-video {
    height: 45vh;
    min-height: 260px;
  }
  
  .list-video {
    width: 100%;
    height: 55vh;
    border-left: none;
    border-top: 1px solid #d1d7dc;
  }
  
  .quiz-container {
    padding: 16px 20px;
  }
  
  .thumbnail-wrapper, .quiz-icon-wrapper {
    width: 80px;
    min-width: 80px;
    height: 45px;
  }
}
</style>