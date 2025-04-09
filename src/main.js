import '@/styles/common.scss'
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate' // 导入持久化插件
const pinia = createPinia().use(persist) // 创建 Pinia 实例并添加持久化功能
app.use(pinia)

import router from './router' // 导入路由配置实例
app.use(router)

import ElementPlus from 'element-plus' // 全局导入ElementPlus
import 'element-plus/dist/index.css' // 导入全局样式
import zhCn from 'element-plus/es/locale/lang/zh-cn' // 中文语言包
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // 图标全局注册
// 遍历所有 Element Plus 图标组件并全局注册
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 全局注册ElementPlus
app.use(ElementPlus, {
  locale: zhCn, // 国际化配置
  size: 'default' // 全局组件尺寸
})

// 挂载实例到html上
app.mount('#app')
