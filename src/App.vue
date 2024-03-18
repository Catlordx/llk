<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { onMounted } from 'vue'
import router from './router'
import { appWindow } from '@tauri-apps/api/window'
onMounted(() => {
  appWindow.show()
  router.push({ name: 'welcome' })
})
</script>
<template>
  <!-- BUG不知道为什么这个地方只有单纯的放一个router-vue才不会出现空白的情况。 -->
  <router-view />
</template>

<style scoped></style>
