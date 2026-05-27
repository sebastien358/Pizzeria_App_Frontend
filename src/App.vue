<script setup lang="ts">
import Header from '@/templates/header/Header.vue'
import Footer from '@/templates/footer/Footer.vue'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

const route = useRoute()
const router = useRouter()
const isReady = ref<boolean>(false)

onMounted(async () => {
  await router.isReady()
  isReady.value = true
})
</script>

<template>
  <section class="app-content" :class="{ 'hide-footer': route.meta.hideFooter }">
    <Header class="header" />
    <main class="views">
      <router-view v-slot="{ Component, route }">
        <component :is="Component" :key="route.fullPath" />
      </router-view>
    </main>
    <Footer v-if="isReady && !route.meta.hideFooter" class="footer" />
  </section>
</template>

<style scoped lang="scss">
.app-content {
  display: grid;
  grid-template-areas: 'header' 'views' 'footer';
  grid-template-rows: 80px 1fr auto;
  min-height: 100dvh;
}

.app-content {
  &.hide-footer {
    display: grid;
    grid-template-areas: 'header' 'views';
    grid-template-rows: 80px 1fr;
    min-height: 100dvh;
  }
}

.header {
  grid-area: header;
}

.views {
  grid-area: views;
}

.footer {
  display: block;
  grid-area: footer;
  &.none {
    display: none;
  }
}
</style>
