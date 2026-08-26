<template>
  <section class="course-banner">
    <div class="banner-content">
      <nav class="course-breadcrumb" aria-label="Course breadcrumb">
        <span>{{ bannerMetadata.category }}</span>
        <span class="breadcrumb-separator" aria-hidden="true">›</span>
        <span>Khóa học trực tuyến</span>
      </nav>

      <h1 class="title-course">{{ bannerMetadata.title }}</h1>
      <p class="course-description">{{ bannerMetadata.description }}</p>

      <div class="course-stats">
        <div class="rating-stat" aria-label="Average course rating">
          <strong>{{ bannerMetadata.rating.toFixed(1) }}</strong>
          <span class="rating-stars" aria-hidden="true">★★★★★</span>
          <span class="stat-label">average rating</span>
        </div>
        <div class="learners-stat">
          <strong>{{ bannerMetadata.learners }}</strong>
          <span class="stat-label">learners</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { getCourseBannerMetadata } from '@/utils/courseBanner'

const props = defineProps({
  courseData: {
    type: Object,
    default: () => ({}),
  },
})

const bannerMetadata = computed(() => getCourseBannerMetadata(props.courseData))
</script>

<style scoped>
.course-banner {
  background: #171821;
  color: #fff;
  min-height: 390px;
}

.banner-content {
  width: min(100% - 48px, 1020px);
  min-height: 390px;
  margin: 0 auto;
  padding: 42px 0 34px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
}

.course-breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
  color: #b7a4ff;
  font-size: 14px;
  font-weight: 600;
}

.breadcrumb-separator {
  color: #8e83b7;
  font-size: 20px;
  line-height: 1;
}

.title-course {
  max-width: 800px;
  margin: 0;
  color: #fff;
  font-size: clamp(30px, 4vw, 48px);
  font-weight: 700;
  line-height: 1.12;
}

.course-description {
  max-width: 780px;
  margin: 22px 0 34px;
  color: #e8e5f2;
  font-size: 18px;
  line-height: 1.55;
}

.course-stats {
  display: flex;
  align-items: stretch;
  gap: 32px;
}

.rating-stat,
.learners-stat {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.rating-stat strong,
.learners-stat strong {
  color: #fff;
  font-size: 22px;
  line-height: 1.2;
}

.rating-stars {
  color: #f59e0b;
  font-size: 17px;
  letter-spacing: 2px;
}

.stat-label {
  color: #b8b3c8;
  font-size: 13px;
}

@media screen and (max-width: 767px) {
  .course-banner,
  .banner-content {
    min-height: 0;
  }

  .banner-content {
    width: min(100% - 32px, 680px);
    padding: 30px 0 28px;
  }

  .course-breadcrumb {
    margin-bottom: 20px;
    font-size: 12px;
  }

  .title-course {
    font-size: 30px;
  }

  .course-description {
    margin: 16px 0 24px;
    font-size: 15px;
  }

  .course-stats {
    gap: 24px;
  }
}
</style>
