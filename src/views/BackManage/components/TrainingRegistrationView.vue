<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>课程报名管理</span>
        <div class="header-actions">
          <el-button type="primary" @click="handleExportData">
            <el-icon><Download /></el-icon>导出数据
          </el-button>
        </div>
      </div>
    </template>

    <!-- 报名筛选区域 -->
    <div class="filter-area">
      <el-input
        v-model="searchQuery"
        placeholder="学员姓名/手机号"
        class="search-input"
      />
      <el-select v-model="courseFilter" placeholder="选择课程" clearable>
        <el-option
          v-for="item in courseOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="paymentStatusFilter" placeholder="支付状态" clearable>
        <el-option label="已支付" value="已支付" />
        <el-option label="未支付" value="未支付" />
        <el-option label="已退款" value="已退款" />
      </el-select>
      <div class="date-range">
        <span>报名时间</span>
        <el-date-picker
          v-model="enrollDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
      <el-button :icon="Search" @click="searchEnrollments">查询</el-button>
      <el-button @click="resetFilters">重置</el-button>
    </div>

    <!-- 报名列表 -->
    <el-table :data="enrollmentList" stripe style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" width="70" type="index" />
      <el-table-column prop="courseName" label="课程名称" width="180" />
      <el-table-column prop="studentName" label="学员姓名" width="100" />
      <el-table-column prop="phone" label="手机号" width="120" />
      <el-table-column prop="price" label="报名费用" width="90">
        <template #default="scope"> ¥{{ scope.row.price }} </template>
      </el-table-column>
      <el-table-column prop="paymentStatus" label="支付状态" width="90">
        <template #default="scope">
          <el-tag
            :type="getPaymentStatusType(scope.row.paymentStatus)"
            effect="light"
          >
            {{ scope.row.paymentStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="enrollTime" label="报名时间" width="150" />
      <el-table-column prop="attendanceStatus" label="出勤状态" width="90">
        <template #default="scope">
          <el-tag
            :type="getAttendanceStatusType(scope.row.attendanceStatus)"
            effect="light"
          >
            {{ scope.row.attendanceStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="120" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleEditEnrollment(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            :type="scope.row.paymentStatus === '已支付' ? 'danger' : 'success'"
            @click="handlePaymentAction(scope.row)"
          >
            {{ scope.row.paymentStatus === '已支付' ? '退款' : '确认支付' }}
          </el-button>
          <el-button
            size="small"
            type="info"
            @click="handleAttendance(scope.row)"
          >
            记录考勤
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
import { Search, Download } from '@element-plus/icons-vue'

// 报名筛选相关
const searchQuery = ref('')
const courseFilter = ref('')
const paymentStatusFilter = ref('')
const enrollDateRange = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(123)
const goToPage = ref('1')

// 课程选项
const courseOptions = ref([
  { value: '1', label: '传统制茶工作坊课程' },
  { value: '2', label: '蜀绣精作花卉系列班' },
  { value: '3', label: '木雕艺术大讲堂' },
  { value: '4', label: '香道与茶艺体验课' },
  { value: '5', label: '非遗传承人讲座系列' }
])

// 模拟报名数据
const enrollmentList = ref([
  {
    id: 1,
    courseName: '传统制茶工作坊课程',
    studentName: '李明',
    phone: '13812345678',
    price: 299,
    paymentStatus: '已支付',
    enrollTime: '2024-01-10 14:30:00',
    attendanceStatus: '已出勤',
    remark: '对茶文化非常感兴趣'
  },
  {
    id: 2,
    courseName: '蜀绣精作花卉系列班',
    studentName: '张华',
    phone: '13987654321',
    price: 159,
    paymentStatus: '未支付',
    enrollTime: '2024-01-12 09:15:00',
    attendanceStatus: '未开始',
    remark: ''
  },
  {
    id: 3,
    courseName: '传统制茶工作坊课程',
    studentName: '王芳',
    phone: '13756789012',
    price: 299,
    paymentStatus: '已支付',
    enrollTime: '2024-01-08 16:45:00',
    attendanceStatus: '缺勤',
    remark: '临时有事无法参加，已申请下次补课'
  },
  {
    id: 4,
    courseName: '木雕艺术大讲堂',
    studentName: '赵伟',
    phone: '13678901234',
    price: 799,
    paymentStatus: '已退款',
    enrollTime: '2024-01-05 10:20:00',
    attendanceStatus: '已取消',
    remark: '因个人原因申请退款'
  }
])

// 获取支付状态标签类型
const getPaymentStatusType = (status) => {
  switch (status) {
    case '已支付':
      return 'success'
    case '未支付':
      return 'warning'
    case '已退款':
      return 'info'
    default:
      return 'info'
  }
}

// 获取出勤状态标签类型
const getAttendanceStatusType = (status) => {
  switch (status) {
    case '已出勤':
      return 'success'
    case '缺勤':
      return 'danger'
    case '未开始':
      return 'info'
    case '已取消':
      return 'info'
    default:
      return 'info'
  }
}

// 获取报名列表
const fetchEnrollmentList = () => {
  // 实际项目中，这里应该调用后端API获取数据
  console.log('获取报名列表', {
    page: currentPage.value,
    pageSize: pageSize.value,
    query: searchQuery.value,
    course: courseFilter.value,
    paymentStatus: paymentStatusFilter.value,
    dateRange: enrollDateRange.value
  })
}

// 搜索报名记录
const searchEnrollments = () => {
  currentPage.value = 1
  fetchEnrollmentList()
}

// 重置筛选条件
const resetFilters = () => {
  searchQuery.value = ''
  courseFilter.value = ''
  paymentStatusFilter.value = ''
  enrollDateRange.value = []
  currentPage.value = 1
  fetchEnrollmentList()
}

// 编辑报名记录
const handleEditEnrollment = (row) => {
  console.log('编辑报名记录', row)
}

// 处理支付相关操作
const handlePaymentAction = (row) => {
  if (row.paymentStatus === '已支付') {
    console.log('处理退款', row)
  } else {
    console.log('确认支付', row)
  }
}

// 处理考勤记录
const handleAttendance = (row) => {
  console.log('记录考勤', row)
}

// 导出数据
const handleExportData = () => {
  console.log('导出报名数据')
}

// 处理分页变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchEnrollmentList()
}

// 跳转到指定页面
const handleGoToPage = () => {
  const page = parseInt(goToPage.value)
  if (page && page > 0 && page <= Math.ceil(total.value / pageSize.value)) {
    currentPage.value = page
    fetchEnrollmentList()
  }
}

// 初始加载
onMounted(() => {
  fetchEnrollmentList()
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
  flex-wrap: wrap;
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
