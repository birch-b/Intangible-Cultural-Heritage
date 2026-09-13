<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>活动报名管理</span>
        <el-button :icon="Refresh" @click="fetchList">刷新</el-button>
      </div>
    </template>

    <!-- 筛选区域 -->
    <div class="filter-area">
      <el-input
        v-model="activityIdFilter"
        placeholder="活动ID"
        class="filter-input"
        clearable
        @keyup.enter="searchList"
      />
      <el-select
        v-model="statusFilter"
        placeholder="报名状态"
        clearable
        class="status-select"
        @change="searchList"
      >
        <el-option label="已报名" :value="1" />
        <el-option label="已取消" :value="2" />
        <el-option label="已签到" :value="3" />
      </el-select>
      <el-input
        v-model="userIdFilter"
        placeholder="用户ID"
        class="filter-input"
        clearable
        @keyup.enter="searchList"
      />
      <el-button :icon="Search" type="primary" @click="searchList"
        >查询</el-button
      >
      <el-button @click="resetFilters">重置</el-button>
    </div>

    <!-- 报名列表 -->
    <el-table
      v-loading="loading"
      :data="registrationList"
      stripe
      style="width: 100%"
    >
      <el-table-column
        type="index"
        :index="indexMethod"
        label="序号"
        width="70"
      />
      <el-table-column
        prop="activityTitle"
        label="活动名称"
        min-width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="username"
        label="报名人"
        width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="phone"
        label="联系电话"
        width="130"
        show-overflow-tooltip
      >
        <template #default="scope">{{ scope.row.phone || '—' }}</template>
      </el-table-column>
      <el-table-column label="报名时间" width="170">
        <template #default="scope">
          {{ formatTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="报名备注"
        min-width="140"
        show-overflow-tooltip
      >
        <template #default="scope">{{ scope.row.remark || '—' }}</template>
      </el-table-column>
      <el-table-column label="状态" width="90">
        <template #default="scope">
          <el-tag :type="getStatusTag(scope.row.status).type" effect="light">
            {{ getStatusTag(scope.row.status).label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90" fixed="right">
        <template #default="scope">
          <el-button size="small" type="info" @click="handleView(scope.row)">
            查看
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无报名记录" />
      </template>
    </el-table>

    <!-- 分页控件 -->
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

    <!-- 报名详情对话框 -->
    <el-dialog v-model="detailVisible" title="报名详情" width="500px">
      <el-descriptions :column="1" border v-if="currentRecord">
        <el-descriptions-item label="活动名称">
          {{ currentRecord.activityTitle || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="报名人">
          {{ currentRecord.username || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="联系电话">
          {{ currentRecord.phone || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="报名时间">
          {{ formatTime(currentRecord.createTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="报名状态">
          <el-tag
            :type="getStatusTag(currentRecord.status).type"
            effect="light"
          >
            {{ getStatusTag(currentRecord.status).label }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="报名备注">
          {{ currentRecord.remark || '—' }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { pageRegistration } from '@/api/activityRegistration'
import { formatTime } from '@/utils/format'

const loading = ref(false)
const registrationList = ref([])
const total = ref(0)
const queryParams = reactive({
  current: 1,
  size: 10
})

// 筛选
const activityIdFilter = ref('')
const statusFilter = ref('')
const userIdFilter = ref('')

// 报名状态：1-已报名 2-已取消 3-已签到
const STATUS_MAP = {
  1: { label: '已报名', type: 'success' },
  2: { label: '已取消', type: 'info' },
  3: { label: '已签到', type: 'warning' }
}
const getStatusTag = (status) =>
  STATUS_MAP[status] || { label: '未知', type: 'info' }

// 详情对话框
const detailVisible = ref(false)
const currentRecord = ref(null)

// 表格序号
const indexMethod = (index) => {
  return (queryParams.current - 1) * queryParams.size + index + 1
}

// 获取报名列表
const fetchList = async () => {
  loading.value = true
  try {
    const res = await pageRegistration({
      current: queryParams.current,
      size: queryParams.size,
      activityId: activityIdFilter.value || undefined,
      status: statusFilter.value === '' ? undefined : statusFilter.value,
      userId: userIdFilter.value || undefined
    })
    if (res.code === '0' && res.data) {
      registrationList.value = res.data.records || []
      total.value = Number(res.data.total) || 0
    } else if (res.records) {
      registrationList.value = res.records
      total.value = Number(res.total) || 0
    } else {
      registrationList.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取报名列表失败', error)
  } finally {
    loading.value = false
  }
}

const searchList = () => {
  queryParams.current = 1
  fetchList()
}

const resetFilters = () => {
  activityIdFilter.value = ''
  statusFilter.value = ''
  userIdFilter.value = ''
  queryParams.current = 1
  fetchList()
}

const handleView = (row) => {
  currentRecord.value = row
  detailVisible.value = true
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

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
