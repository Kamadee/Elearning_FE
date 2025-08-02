<template>
  <div class="banner-container">
    <img src="/images/Banner-blog.png" class="banner-blog" alt="Banner Blog">
  </div>
  <ListBlog />
</template>

<script setup>
import ListBlog from '@/components/serviceType/blog/ListBlog.vue'
</script>

<style scoped>
.banner-blog {
  width: 100%;
  height: 309px;
  object-fit: cover;
}
/* Tablet */
@media (max-width: 1024px) {
  .banner-blog {
    height: 220px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .banner-blog {
    height: 180px;
  }
}
</style>
