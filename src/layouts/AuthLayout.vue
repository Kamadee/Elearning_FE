<template>
  <div class="auth-layout">
    <router-view />
  </div>
</template>

<style scoped>
.auth-layout {
  width: 100%;
  height: 100vh;
  background: url('/images/Login-Image.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media screen and (max-width:767px) {
  .auth-layout { 
    background: url('/images/warrior.jpg') no-repeat center center !important;
    background-size: cover;
  }
}
</style>
