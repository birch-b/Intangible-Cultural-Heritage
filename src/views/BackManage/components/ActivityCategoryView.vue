<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>活动分类管理</span>
        <div class="header-actions">
          <el-input
            v-model="categorySearchQuery"
            placeholder="请输入分类名称"
            class="search-input"
          >
            <template #append>
              <el-button :icon="Search" @click="searchCategory" />
            </template>
          </el-input>
          <el-button type="primary" @click="handleAddCategory">
            <el-icon> <Plus /> </el-icon>添加分类
          </el-button>
        </div>
      </div>
    </template>

    <!-- 分类列表 -->
    <el-table :data="categoryList" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="50" />
      <el-table-column prop="name" label="分类名称" width="180" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="createdAt" label="创建时间" width="150" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleEditCategory(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDeleteCategory(scope.row)"
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
        :total="totalCategories"
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

// 分类列表相关
const categorySearchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalCategories = ref(100)

// 模拟分类数据
const categoryList = ref([
  {
    id: 1,
    name: '文化活动',
    description: '与文化相关的活动',
    createdAt: '2023-12-01 14:30'
  },
  {
    id: 2,
    name: '体育活动',
    description: '与体育相关的活动',
    createdAt: '2023-12-05 09:15'
  }
])

// 获取分类列表
const fetchCategoryList = () => {
  // 实际项目中，这里应该调用后端API获取数据
  console.log('获取分类列表', {
    page: currentPage.value,
    pageSize: pageSize.value,
    query: categorySearchQuery.value
  })
}

// 搜索分类
const searchCategory = () => {
  currentPage.value = 1
  fetchCategoryList()
}

// 添加分类
const handleAddCategory = () => {
  // 这里应该显示添加分类的对话框
  console.log('添加分类')
}

// 编辑分类
const handleEditCategory = (row) => {
  // 这里应该显示编辑分类的对话框
  console.log('编辑分类', row)
}

// 删除分类
const handleDeleteCategory = (row) => {
  // 这里应该显示删除确认对话框
  console.log('删除分类', row)
}

// 处理分页变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchCategoryList()
}

// 初始加载
onMounted(() => {
  fetchCategoryList()
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
