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
            <el-menu-item index="5-1">活动列表</el-menu-item>
            <el-menu-item index="5-2">活动分类管理</el-menu-item>
          </el-sub-menu>
          <!-- 教育培训管理 -->
          <el-sub-menu index="6">
            <template #title>
              <el-icon>
                <House />
              </el-icon>
              <span class="ml-2">教育培训管理</span>
            </template>
            <el-menu-item index="6-1">培训课程管理</el-menu-item>
            <el-menu-item index="6-2">培训报名管理</el-menu-item>
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
              <el-menu>
                <el-sub-menu index="7">
                  <template #title>
                    <div class="identity">
                      <el-icon v-if="userInfo.role === '超级管理员'">
                        <User />
                      </el-icon>
                      <el-icon v-else-if="userInfo.role === '普通管理员'">
                        <Setting />
                      </el-icon>
                      <el-icon v-else>
                        <Box />
                      </el-icon>
                      <el-tag effect="light">{{ userInfo.role }}</el-tag>
                    </div>
                  </template>
                  <el-menu-item index="7-1">退出登录</el-menu-item>
                  <el-menu-item index="7-2">修改密码</el-menu-item>
                  <el-menu-item index="7-3">回到首页</el-menu-item>
                </el-sub-menu>
              </el-menu>
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
import { ref, computed } from 'vue'
import { House, Setting, User, Box, Goods } from '@element-plus/icons-vue'

// 导入所有视图组件
import HomeView from './components/HomeView.vue'
import AdminView from './components/AdminView.vue'
import BannerHomeView from './components/BannerHomeView.vue'
import BannerHeritageView from './components/BannerHeritageView.vue'
import CategoryView from './components/CategoryView.vue'
import DetailView from './components/DetailView.vue'
import ActivityListView from './components/ActivityListView.vue'
import ActivityCategoryView from './components/ActivityCategoryView.vue'
import TrainingCourseView from './components/TrainingCourseView.vue'
import TrainingRegistrationView from './components/TrainingRegistrationView.vue'

// 定义 activeMenu
const activeMenu = ref('1')

// 当前视图名称
const currentView = ref('HomeView')

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
    case 'TrainingCourseView':
      return TrainingCourseView
    case 'TrainingRegistrationView':
      return TrainingRegistrationView
    default:
      return HomeView
  }
})

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
      currentView.value = 'TrainingCourseView'
      break
    case '6-2':
      currentView.value = 'TrainingRegistrationView'
      break
    default:
      currentView.value = 'HomeView'
  }
}

// 用户信息
const userInfo = ref({
  account: 'zhangwei',
  name: '张伟',
  role: '超级管理员',
  phone: '13812345678',
  createTime: '2024-01-01',
  lastLogin: '2024-01-20 14:30:00'
})
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
