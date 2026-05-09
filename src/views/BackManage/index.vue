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
          <el-menu-item index="home" @click="goHome">
            <el-icon>
              <House />
            </el-icon>
            <span class="ml-2">返回首页</span>
          </el-menu-item>
          <el-menu-item index="1">
            <el-icon>
              <Odometer />
            </el-icon>
            <span class="ml-2">管理首页</span>
          </el-menu-item>
          <!-- 内容管理 -->
          <el-sub-menu index="content">
            <template #title>
              <el-icon>
                <Grid />
              </el-icon>
              <span class="ml-2">内容管理</span>
            </template>
            <el-menu-item index="3-1">首页轮播图</el-menu-item>
            <el-menu-item index="3-2">非遗展示轮播图</el-menu-item>
            <el-menu-item index="4-1">项目类别管理</el-menu-item>
            <el-menu-item index="4-2">项目详情管理</el-menu-item>
            <el-menu-item index="5-1">活动管理</el-menu-item>
            <el-menu-item index="5-2">活动分类列表</el-menu-item>
          </el-sub-menu>
          <!-- 教育培训 -->
          <el-sub-menu index="6">
            <template #title>
              <el-icon>
                <Reading />
              </el-icon>
              <span class="ml-2">教育培训</span>
            </template>
            <el-menu-item index="6-1">非遗资源管理</el-menu-item>
          </el-sub-menu>
          <!-- 用户与系统 -->
          <el-sub-menu index="system">
            <template #title>
              <el-icon>
                <User />
              </el-icon>
              <span class="ml-2">用户与系统</span>
            </template>
            <el-menu-item index="2">管理员管理</el-menu-item>
            <el-menu-item index="8-1">用户反馈管理</el-menu-item>
          </el-sub-menu>
          <!-- 退出登录 -->
          <el-menu-item
            index="logout"
            @click="handleLogout"
            class="logout-item"
          >
            <el-icon>
              <SwitchButton />
            </el-icon>
            <span class="ml-2">退出登录</span>
          </el-menu-item>
        </el-menu>
      </div>
    </div>

    <!-- 右侧内容区域 -->
    <div class="content">
      <div class="content-padding">
        <!-- 右上角标题和用户信息 -->
        <div class="header">
          <h1 class="header-title">欢迎来到非遗平台管理系统</h1>
          <div class="user-info">
            <el-avatar :size="32" :src="userInfo.avatar">
              <img
                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
              />
            </el-avatar>
            <span class="username">{{ userInfo.username }}</span>
            <el-tag effect="light" size="small">{{ userInfo.role }}</el-tag>
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
  Odometer,
  User,
  Grid,
  Reading,
  SwitchButton
} from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
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

// 返回首页
const goHome = () => {
  router.push('/')
}

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  } catch {
    // 取消退出
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
    case '8-1':
      currentView.value = 'UserFeedbackView'
      break
    default:
      currentView.value = 'HomeView'
  }
}
</script>

<style scoped>
.flex {
  display: flex;
}

.min-h-screen {
  min-height: 100vh;
}

.sidebar {
  width: 256px;
  background-color: #374151;
  color: #ffffff;
  display: flex;
  flex-direction: column;
}

.sidebar-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
}

.custom-menu {
  border: none;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.custom-menu .el-menu-item:last-child {
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-item {
  color: #f87171 !important;
}

.logout-item:hover {
  background-color: rgba(248, 113, 113, 0.1) !important;
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
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.header-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.username {
  font-size: 0.875rem;
  color: #374151;
}
</style>
