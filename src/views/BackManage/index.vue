<template>
  <div class="flex min-h-screen">
    <!-- 左侧菜单栏 -->
    <div class="sidebar">
      <div class="sidebar-content">
        <div class="title">管理系统</div>
        <el-menu
          class="custom-menu"
          :default-active="activeMenu"
          background-color="#1F2937"
          text-color="#ffffff"
          active-text-color="#409EFF"
          @select="handleMenuSelect"
        >
          <el-menu-item index="1">
            <el-icon>
              <House />
            </el-icon>
            <span class="ml-2">首页</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon>
              <Setting />
            </el-icon>
            <span class="ml-2">管理员管理</span>
          </el-menu-item>
          <!-- 其他菜单项保持不变 -->
          <!-- 轮播图管理 -->
          <el-sub-menu index="3">
            <template #title>
              <el-icon>
                <User />
              </el-icon>
              <span class="ml-2">轮播图管理</span>
            </template>
            <el-menu-item index="3-1">首页轮播图</el-menu-item>
            <el-menu-item index="3-2">非遗展示轮播图</el-menu-item>
          </el-sub-menu>
          <!-- 非遗展示管理 -->
          <el-sub-menu index="4">
            <template #title>
              <el-icon>
                <Box />
              </el-icon>
              <span class="ml-2">非遗展示管理</span>
            </template>
            <el-menu-item index="4-1">项目类别管理</el-menu-item>
            <el-menu-item index="4-2">项目详情管理</el-menu-item>
          </el-sub-menu>
          <!-- 活动资讯管理 -->
          <el-sub-menu index="5">
            <template #title>
              <el-icon>
                <Goods />
              </el-icon>
              <span class="ml-2">活动资讯管理</span>
            </template>
            <el-menu-item index="5-1">活动管理</el-menu-item>
            <el-menu-item index="5-2">活动分类列表</el-menu-item>
          </el-sub-menu>
          <!-- 教育培训管理 -->
          <el-sub-menu index="6">
            <template #title>
              <el-icon>
                <House />
              </el-icon>
              <span class="ml-2">教育培训管理</span>
            </template>
            <el-menu-item index="6-1">非遗资源管理</el-menu-item>
            <!-- <el-menu-item index="6-2">培训报名管理</el-menu-item> -->
          </el-sub-menu>
          <!-- 审核与反馈管理 -->
          <el-sub-menu index="8">
            <template #title>
              <el-icon>
                <ChatDotSquare />
              </el-icon>
              <span class="ml-2">审核与反馈管理</span>
            </template>
            <el-menu-item index="8-1">用户反馈管理</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
    </div>

    <!-- 右侧内容区域 -->
    <div class="content">
      <div class="content-padding">
        <!-- 右上角标题和用户菜单 -->
        <div class="header">
          <h1 class="header-title">欢迎来到非遗平台管理系统</h1>
          <div class="header-actions">
            <div class="identity">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link identity" style="cursor: pointer; display: flex; align-items: center;">
                  <el-avatar :size="32" :src="userInfo.avatar" style="margin-right: 8px">
                    <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
                  </el-avatar>
                  <span style="margin-right: 8px; font-size: 14px">{{ userInfo.username }}</span>
                  <el-tag effect="light">{{ userInfo.role }}</el-tag>
                  <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    <el-dropdown-item command="home">回到首页</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>

        <!-- 动态组件区域 -->
        <component :is="currentComponent" :user-info="userInfo"></component>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  House,
  Setting,
  User,
  Box,
  Goods,
  ChatDotSquare,
  ArrowDown
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()

// 导入所有视图组件
import HomeView from './components/HomeView.vue'
import AdminView from './components/AdminView.vue'
import BannerHomeView from './components/BannerHomeView.vue'
import BannerHeritageView from './components/BannerHeritageView.vue'
import CategoryView from './components/CategoryView.vue'
import DetailView from './components/DetailView.vue'
import ActivityListView from './components/ActivityListView.vue'
import ActivityCategoryView from './components/ActivityCategoryView.vue'
import HeritageMediaView from './components/HeritageMediaView.vue'
import TrainingRegistrationView from './components/TrainingRegistrationView.vue'
import UserFeedbackView from './components/UserFeedbackView.vue'

// 定义 activeMenu
const activeMenu = ref('1')

// 当前视图名称
const currentView = ref('HomeView')

// 用户信息 - 从 store 获取并处理角色显示
const userInfo = computed(() => {
  const info = userStore.userInfo || {}
  let roleName = '普通用户'
  if (info.role === 2) {
    roleName = '超级管理员'
  } else if (info.role === 1) {
    roleName = '普通管理员'
  }
  
  return {
    ...info,
    role: roleName,
    // 确保有 createTime 和 lastLoginTime
    createTime: info.createTime || '',
    lastLoginTime: info.lastLoginTime || ''
  }
})

// 初始化获取用户信息
onMounted(async () => {
  if (!userStore.userInfo || !userStore.userInfo.username) {
    await userStore.getUserInfo()
  }
})

// 基于当前视图名称计算当前组件
const currentComponent = computed(() => {
  switch (currentView.value) {
    case 'HomeView':
      return HomeView
    case 'AdminView':
      return AdminView
    case 'BannerHomeView':
      return BannerHomeView
    case 'BannerHeritageView':
      return BannerHeritageView
    case 'CategoryView':
      return CategoryView
    case 'DetailView':
      return DetailView
    case 'ActivityListView':
      return ActivityListView
    case 'ActivityCategoryView':
      return ActivityCategoryView
    case 'HeritageMediaView':
      return HeritageMediaView
    case 'TrainingRegistrationView':
      return TrainingRegistrationView
    case 'UserFeedbackView':
      return UserFeedbackView
    default:
      return HomeView
  }
})

// 处理下拉菜单命令
const handleCommand = (command) => {
  if (command === 'logout') {
    userStore.logout()
    router.push('/login')
  } else if (command === 'home') {
    router.push('/')
  }
}

// 菜单点击事件
const handleMenuSelect = (index) => {
  switch (index) {
    case '1':
      currentView.value = 'HomeView'
      break
    case '2':
      currentView.value = 'AdminView'
      break
    case '3-1':
      currentView.value = 'BannerHomeView'
      break
    case '3-2':
      currentView.value = 'BannerHeritageView'
      break
    case '4-1':
      currentView.value = 'CategoryView'
      break
    case '4-2':
      currentView.value = 'DetailView'
      break
    case '5-1':
      currentView.value = 'ActivityListView'
      break
    case '5-2':
      currentView.value = 'ActivityCategoryView'
      break
    case '6-1':
      currentView.value = 'HeritageMediaView'
      break
    case '6-2':
      currentView.value = 'TrainingRegistrationView'
      break
    case '8-1':
      currentView.value = 'UserFeedbackView'
      break
    default:
      currentView.value = 'HomeView'
  }
}


</script>

<style scoped>
/* 保持原来的样式不变 */
.flex {
  display: flex;
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 70px;
}

.min-h-screen {
  min-height: 100vh;
}

.sidebar {
  width: 256px;
  background-color: #374151;
  color: #ffffff;
}

.sidebar-content {
  padding: 16px;
}

.title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.custom-menu {
  border: none;
}

.content {
  flex: 1;
  background-color: #f3f4f6;
}

.content-padding {
  padding: 32px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.identity {
  display: flex;
  align-items: center;
}
</style>
