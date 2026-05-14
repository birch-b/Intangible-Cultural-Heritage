<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const mapUrl = `${import.meta.env.BASE_URL}3d.html`

const handleMessage = (event) => {
  if (event.data && event.data.action === 'navigateTo') {
    router.push(event.data.path)
  }
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<template>
  <div class="fullscreen-container">
    <iframe :src="mapUrl" class="fullscreen-iframe"> </iframe>
  </div>
</template>

<style scoped lang="scss">
/* 设置容器充满整个页面 */
.fullscreen-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; /* 隐藏滚动条 */
}

/* 设置 iframe 充满容器 */
.fullscreen-iframe {
  width: 100%;
  height: 100%;
  border: none; /* 去掉 iframe 的边框 */
  margin: 0;
  padding: 0;
}
</style>
