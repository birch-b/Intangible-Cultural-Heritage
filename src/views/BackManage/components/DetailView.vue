<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>非遗项目管理</span>
        <div class="header-actions">
          <el-input
            v-model="projectSearchQuery"
            placeholder="请输入项目名称"
            class="search-input"
          >
            <template #append>
              <el-button :icon="Search" @click="searchProjects" />
            </template>
          </el-input>
          <el-button type="primary" @click="handleAddProject">
            <el-icon><Plus /></el-icon>新增项目
          </el-button>
        </div>
      </div>
    </template>

    <!-- 项目列表 -->
    <el-table :data="projectList" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="50" />
      <el-table-column prop="name" label="名称" width="140" />
      <el-table-column prop="category" label="分类" width="120" />
      <el-table-column prop="time" label="时代" width="80" />
      <el-table-column label="图片" width="100">
        <template #default="scope">
          <el-image
            style="width: 60px; height: 60px"
            :src="scope.row.image"
            :preview-src-list="[scope.row.image]"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column prop="description" label="简介" />
      <el-table-column prop="views" label="浏览量" width="80" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="scope">
          <el-tag
            :type="scope.row.status === '已发布' ? 'success' : 'info'"
            effect="light"
          >
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleEditProject(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDeleteProject(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页控件 -->
    <div class="pagination-container">
      <el-pagination
        v-model="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="totalProjects"
        :current-page="currentPage"
        :page-sizes="[10]"
        :total-page="100"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'

// 项目列表相关
const projectSearchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalProjects = ref(100)

// 模拟项目数据
const projectList = ref([
  {
    id: 1,
    name: '景德镇陶瓷传统技艺',
    category: '传统手工艺',
    time: '宋代',
    image: 'https://example.com/jingdezhen.jpg',
    description: '景德镇陶瓷传统技艺是中国传统手工艺的瑰宝，有着千年工艺传承',
    views: 2565,
    status: '已发布'
  },
  {
    id: 2,
    name: '苏州刺绣',
    category: '传统手工艺',
    time: '明代',
    image: 'https://example.com/suzhou.jpg',
    description:
      '苏州刺绣以其精细的针法和独特的绣制技艺而著称，是中国传统绣艺上乘代表',
    views: 1876,
    status: '草稿'
  },
  {
    id: 3,
    name: '京剧',
    category: '传统戏剧',
    time: '清代',
    image: 'https://example.com/jingju.jpg',
    description:
      '京剧是中国的戏曲，集唱、念、做、打一身，是最具代表性的中国传统戏曲',
    views: 3421,
    status: '已发布'
  }
])

// 获取项目列表
const fetchProjectList = () => {
  // 实际项目中，这里应该调用后端API获取数据
  console.log('获取项目列表', {
    page: currentPage.value,
    pageSize: pageSize.value,
    query: projectSearchQuery.value
  })
}

// 搜索项目
const searchProjects = () => {
  currentPage.value = 1
  fetchProjectList()
}

// 添加项目
const handleAddProject = () => {
  // 这里应该显示添加项目的对话框
  console.log('添加项目')
}

// 编辑项目
const handleEditProject = (row) => {
  // 这里应该显示编辑项目的对话框
  console.log('编辑项目', row)
}

// 删除项目
const handleDeleteProject = (row) => {
  // 这里应该显示删除确认对话框
  console.log('删除项目', row)
}

// 处理分页变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchProjectList()
}

// 初始加载
onMounted(() => {
  fetchProjectList()
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

.search-input {
  width: 200px;
  margin-right: 16px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
