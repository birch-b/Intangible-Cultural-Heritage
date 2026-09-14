<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>学习记录</span>
        <el-button :icon="Refresh" @click="fetchList">刷新</el-button>
      </div>
    </template>

    <!-- 筛选区域 -->
    <div class="filter-area">
      <el-input
        v-model="courseIdFilter"
        placeholder="内容ID"
        class="filter-input"
        clearable
        @keyup.enter="searchList"
      />
      <el-input
        v-model="userIdFilter"
        placeholder="用户ID"
        class="filter-input"
        clearable
        @keyup.enter="searchList"
      />
      <el-select
        v-model="statusFilter"
        placeholder="学习状态"
        clearable
        class="status-select"
        @change="searchList"
      >
        <el-option label="学习中" :value="0" />
        <el-option label="已结业" :value="1" />
      </el-select>
      <el-button :icon="Search" type="primary" @click="searchList">
        查询
      </el-button>
      <el-button @click="resetFilters">重置</el-button>
    </div>

    <!-- 列表 -->
    <el-table
      v-loading="loading"
      :data="enrollmentList"
      stripe
      style="width: 100%"
    >
      <el-table-column
        type="index"
        :index="indexMethod"
        label="序号"
        width="70"
      />
      <el-table-column label="封面" width="100">
        <template #default="scope">
          <el-image
            style="width: 60px; height: 60px"
            :src="scope.row.courseCoverImage"
            fit="cover"
            :z-index="9999"
          >
            <template #error>
              <div class="image-slot">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="courseTitle"
        label="课程/内容名称"
        min-width="180"
        show-overflow-tooltip
      />
      <el-table-column label="学习用户" width="140" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ scope.row.username || '—' }}</span>
          <span v-if="scope.row.userId" class="user-id">
            (ID:{{ scope.row.userId }})
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="contentTypeName" label="类型" width="100">
        <template #default="scope">
          <el-tag effect="plain">{{ scope.row.contentTypeName || '—' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="学习状态" width="100">
        <template #default="scope">
          <el-tag
            :type="scope.row.status === 1 ? 'success' : 'primary'"
            effect="light"
          >
            {{ scope.row.status === 1 ? '已结业' : '学习中' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="学习进度" width="200">
        <template #default="scope">
          <el-progress
            :percentage="Number(scope.row.progress) || 0"
            :status="scope.row.status === 1 ? 'success' : ''"
          />
        </template>
      </el-table-column>
      <el-table-column label="加入时间" width="170">
        <template #default="scope">
          {{ formatTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无学习记录" />
      </template>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.current"
        v-model:page-size="queryParams.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="[10, 20, 50]"
        @size-change="fetchList"
        @current-change="fetchList"
      />
    </div>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Refresh, Picture, Search } from '@element-plus/icons-vue'
import { pageAdminEnrollment } from '@/api/trainingEnrollment'
import { formatTime } from '@/utils/format'

const loading = ref(false)
const enrollmentList = ref([])
const total = ref(0)
const queryParams = reactive({ current: 1, size: 10 })

// 筛选条件
const courseIdFilter = ref('')
const userIdFilter = ref('')
const statusFilter = ref('')

const indexMethod = (index) =>
  (queryParams.current - 1) * queryParams.size + index + 1

// 获取全站学习记录（管理端分页，可按内容/用户/状态筛选）
const fetchList = async () => {
  loading.value = true
  try {
    const res = await pageAdminEnrollment({
      current: queryParams.current,
      size: queryParams.size,
      courseId: courseIdFilter.value || undefined,
      userId: userIdFilter.value || undefined,
      status: statusFilter.value === '' ? undefined : statusFilter.value
    })
    if (res.code === '0' && res.data) {
      enrollmentList.value = res.data.records || []
      total.value = Number(res.data.total) || 0
    } else if (res.records) {
      enrollmentList.value = res.records
      total.value = Number(res.total) || 0
    } else {
      enrollmentList.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取学习记录失败', error)
  } finally {
    loading.value = false
  }
}

// 条件变化后查询需重置到第一页
const searchList = () => {
  queryParams.current = 1
  fetchList()
}

const resetFilters = () => {
  courseIdFilter.value = ''
  userIdFilter.value = ''
  statusFilter.value = ''
  queryParams.current = 1
  fetchList()
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-area {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-input {
  width: 140px;
}

.status-select {
  width: 140px;
}

.user-id {
  margin-left: 4px;
  color: #909399;
  font-size: 12px;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
