<script setup>
import { createApp } from 'vue'
import App from './App.vue'
import { RouterView } from 'vue-router'

// 导入 Element Plus 组件库及其样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn' //中文语言包

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn // 设置组件库的国际化语言为中文
})
</script>

<template>
  <el-config-provider :locale="zhCn">
    <RouterView />
  </el-config-provider>
</template>

<style scoped lang="scss">
#app {
  width: auto;
  height: 100vh;
}
</style>
