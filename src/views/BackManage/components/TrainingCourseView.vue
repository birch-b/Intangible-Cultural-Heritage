<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>课程管理</span>
        <div class="header-actions">
          <el-button type="primary" @click="handleAddCourse">
            <el-icon><Plus /></el-icon>新增课程
          </el-button>
        </div>
      </div>
    </template>

    <!-- 课程筛选区域 -->
    <div class="filter-area">
      <el-input
        v-model="courseSearchQuery"
        placeholder="课程名称/教师姓名"
        class="search-input"
      />
      <el-select v-model="statusFilter" placeholder="课程状态" clearable>
        <el-option label="已发布" value="已发布" />
        <el-option label="草稿" value="草稿" />
        <el-option label="下线" value="下线" />
      </el-select>
      <div class="date-range">
        <span>开始日期</span>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
      <el-button :icon="Search" @click="searchCourses">查询</el-button>
      <el-button @click="resetFilters">重置</el-button>
    </div>

    <!-- 课程列表 -->
    <el-table :data="courseList" stripe style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" width="70" type="index" />
      <el-table-column label="课程图片" width="100">
        <template #default="scope">
          <el-image
            style="width: 60px; height: 60px"
            :src="scope.row.image"
            :preview-src-list="[scope.row.image]"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="课程名称" />
      <el-table-column prop="teacher" label="教师" width="80" />
      <el-table-column prop="price" label="价格" width="80">
        <template #default="scope"> ¥{{ scope.row.price }} </template>
      </el-table-column>
      <el-table-column prop="enrollment" label="报名人数" width="100" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)" effect="light">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="150" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleEditCourse(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="info"
            @click="handleViewCourse(scope.row)"
          >
            查看
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDeleteCourse(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页控件 -->
    <div class="pagination-container">
      <div class="pagination-info">
        记录总数 {{ total }} | {{ pageSize }}/page
      </div>
      <el-pagination
        v-model="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="total"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
      />
      <div class="go-to-page">
        <span>Go to</span>
        <el-input v-model="goToPage" class="page-input" />
        <el-button size="small" @click="handleGoToPage">确定</el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'

// 课程筛选相关
const courseSearchQuery = ref('')
const statusFilter = ref('')
const dateRange = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)
const goToPage = ref('1')

// 模拟课程数据
const courseList = ref([
  {
    id: 1,
    title: '传统制茶工作坊课程',
    image: 'https://example.com/tea.jpg',
    teacher: '张艺芳',
    price: 299,
    enrollment: 45,
    status: '已发布',
    startTime: '2024-01-15 14:30:00'
  },
  {
    id: 2,
    title: '蜀绣精作花卉系列班',
    image: 'https://example.com/embroidery.jpg',
    teacher: '李明珠',
    price: 159,
    enrollment: 28,
    status: '已发布',
    startTime: '2024-01-16 09:15:00'
  },
  {
    id: 3,
    title: '木雕艺术大讲堂',
    image: 'https://example.com/woodcarving.jpg',
    teacher: '王巧匠',
    price: 799,
    enrollment: 15,
    status: '下线',
    startTime: '2024-01-17 16:45:00'
  }
])

// 获取状态标签类型
const getStatusType = (status) => {
  switch (status) {
    case '已发布':
      return 'success'
    case '草稿':
      return 'info'
    case '下线':
      return 'danger'
    default:
      return 'info'
  }
}

// 获取课程列表
const fetchCourseList = () => {
  // 实际项目中，这里应该调用后端API获取数据
  console.log('获取课程列表', {
    page: currentPage.value,
    pageSize: pageSize.value,
    query: courseSearchQuery.value,
    status: statusFilter.value,
    dateRange: dateRange.value
  })
}

// 搜索课程
const searchCourses = () => {
  currentPage.value = 1
  fetchCourseList()
}

// 重置筛选条件
const resetFilters = () => {
  courseSearchQuery.value = ''
  statusFilter.value = ''
  dateRange.value = []
  currentPage.value = 1
  fetchCourseList()
}

// 添加课程
const handleAddCourse = () => {
  console.log('新增课程')
}

// 编辑课程
const handleEditCourse = (row) => {
  console.log('编辑课程', row)
}

// 查看课程
const handleViewCourse = (row) => {
  console.log('查看课程', row)
}

// 删除课程
const handleDeleteCourse = (row) => {
  console.log('删除课程', row)
}

// 处理分页变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchCourseList()
}

// 跳转到指定页面
const handleGoToPage = () => {
  const page = parseInt(goToPage.value)
  if (page && page > 0 && page <= Math.ceil(total.value / pageSize.value)) {
    currentPage.value = page
    fetchCourseList()
  }
}

// 初始加载
onMounted(() => {
  fetchCourseList()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.filter-area {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}

.search-input {
  width: 200px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-info {
  font-size: 14px;
  color: #606266;
}

.go-to-page {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-input {
  width: 60px;
}
</style>
