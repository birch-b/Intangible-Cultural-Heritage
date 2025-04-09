<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>活动资讯管理</span>
        <div class="header-actions">
          <el-input
            v-model="newsSearchQuery"
            placeholder="请输入活动标题"
            class="search-input"
          >
            <template #append>
              <el-button :icon="Search" @click="searchNews" />
            </template>
          </el-input>
          <el-button type="primary" @click="handleAddNews">
            <el-icon> <Plus /> </el-icon>发布资讯
          </el-button>
        </div>
      </div>
    </template>

    <!-- 资讯列表 -->
    <el-table :data="newsList" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="50" />
      <el-table-column prop="title" label="标题" width="180" />
      <el-table-column label="封面图" width="100">
        <template #default="scope">
          <el-image
            style="width: 60px; height: 60px"
            :src="scope.row.image"
            :preview-src-list="[scope.row.image]"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容" />
      <el-table-column prop="author" label="作者" width="100" />
      <el-table-column prop="publishTime" label="发布时间" width="150" />
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
            @click="handleEditNews(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDeleteNews(scope.row)"
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
        :total="totalNews"
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

// 资讯列表相关
const newsSearchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalNews = ref(100)

// 模拟资讯数据
const newsList = ref([
  {
    id: 1,
    title: '2023非物质文化遗产进明德活动',
    image: 'https://example.com/event1.jpg',
    content: '为增一位保护非遗',
    author: '文化宣传部',
    publishTime: '2023-12-01 14:30',
    status: '已发布'
  },
  {
    id: 2,
    title: '非遗传承人活跃社区2024年进行系列活动',
    image: 'https://example.com/event2.jpg',
    content: '2024年度计划',
    author: '项目管理处',
    publishTime: '2023-12-05 09:15',
    status: '草稿'
  }
])

// 获取资讯列表
const fetchNewsList = () => {
  // 实际项目中，这里应该调用后端API获取数据
  console.log('获取资讯列表', {
    page: currentPage.value,
    pageSize: pageSize.value,
    query: newsSearchQuery.value
  })
}

// 搜索资讯
const searchNews = () => {
  currentPage.value = 1
  fetchNewsList()
}

// 添加资讯
const handleAddNews = () => {
  // 这里应该显示添加资讯的对话框
  console.log('发布资讯')
}

// 编辑资讯
const handleEditNews = (row) => {
  // 这里应该显示编辑资讯的对话框
  console.log('编辑资讯', row)
}

// 删除资讯
const handleDeleteNews = (row) => {
  // 这里应该显示删除确认对话框
  console.log('删除资讯', row)
}

// 处理分页变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchNewsList()
}

// 初始加载
onMounted(() => {
  fetchNewsList()
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
