<script setup lang="ts">
import Header from '@/templates/header/Header.vue'
import Footer from '@/templates/footer/Footer.vue'
</script>

<template>
  <div class="app-content">
    <Header class="header" />
    <div class="views">
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <Footer class="footer" />
  </div>
</template>

<style scoped lang="scss">
.app-content {
  display: grid;
  grid-template-areas: 'header' 'views' 'footer';
  grid-template-rows: 80px 1fr auto;
  min-height: 100dvh;
}

.header {
  grid-area: header;
}

.views {
  grid-area: views;
}

.footer {
  grid-area: footer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
