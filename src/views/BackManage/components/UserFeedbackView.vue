<template>
  <div class="user-feedback-view">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户反馈管理</span>
        </div>
      </template>

      <!-- 筛选区域 -->
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="反馈类型">
          <el-select
            v-model="queryParams.type"
            placeholder="全部类型"
            clearable
            style="width: 150px"
          >
            <el-option label="内容纠错" :value="1" />
            <el-option label="系统建议" :value="2" />
            <el-option label="其他" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select
            v-model="queryParams.status"
            placeholder="全部状态"
            clearable
            style="width: 150px"
          >
            <el-option label="待处理" :value="0" />
            <el-option label="处理中" :value="1" />
            <el-option label="已解决" :value="2" />
            <el-option label="已关闭" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <el-table
        v-loading="loading"
        :data="feedbackList"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" align="center" />

        <el-table-column label="反馈类型" width="120" align="center">
          <template #default="scope">
            <el-tag :type="getTypeTag(scope.row.type)">{{
              formatType(scope.row.type)
            }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="title" label="标题" show-overflow-tooltip />

        <el-table-column
          prop="content"
          label="反馈内容"
          show-overflow-tooltip
        />

        <el-table-column label="图片" width="120" align="center">
          <template #default="scope">
            <div v-if="scope.row.images && scope.row.images.length > 0">
              <el-image
                style="width: 50px; height: 50px"
                :src="scope.row.images[0]"
                :preview-src-list="scope.row.images"
                fit="cover"
                preview-teleported
                :z-index="9999"
              />
              <div
                v-if="scope.row.images.length > 1"
                style="font-size: 12px; color: #909399"
              >
                共{{ scope.row.images.length }}张
              </div>
            </div>
            <span v-else>无图片</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="contact"
          label="联系方式"
          width="150"
          show-overflow-tooltip
        />

        <el-table-column label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag :type="getStatusTag(scope.row.status)">{{
              formatStatus(scope.row.status)
            }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="提交时间"
          width="180"
          align="center"
        >
          <template #default="scope">
            {{ formatTime(scope.row.createTime) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleReply(scope.row)"
              :disabled="scope.row.status === 2 || scope.row.status === 3"
            >
              回复处理
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 回复弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="回复反馈"
      width="500px"
      @close="resetDialog"
    >
      <el-form
        ref="replyFormRef"
        :model="replyForm"
        :rules="replyRules"
        label-width="80px"
      >
        <el-form-item label="回复内容" prop="replyContent">
          <el-input
            v-model="replyForm.replyContent"
            type="textarea"
            :rows="4"
            placeholder="请输入回复内容"
          />
        </el-form-item>
        <el-form-item label="更新状态" prop="status">
          <el-radio-group v-model="replyForm.status">
            <el-radio :label="2">已解决</el-radio>
            <el-radio :label="3">已关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="submitReply"
            :loading="submitLoading"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getFeedbackPageAPI, replyFeedbackAPI } from '@/api/feedback'
import { formatTime } from '@/utils/format'
import { ElMessage } from 'element-plus'

// --- 数据定义 ---
const loading = ref(false)
const feedbackList = ref([])
const total = ref(0)
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  type: undefined,
  status: undefined
})

// --- 弹窗相关 ---
const dialogVisible = ref(false)
const submitLoading = ref(false)
const replyFormRef = ref(null)
const replyForm = reactive({
  id: null,
  replyContent: '',
  status: 2
})
const replyRules = {
  replyContent: [
    { required: true, message: '请输入回复内容', trigger: 'blur' }
  ],
  status: [{ required: true, message: '请选择更新后的状态', trigger: 'change' }]
}

// --- 格式化助手 ---
const formatType = (type) => {
  const map = { 1: '内容纠错', 2: '系统建议', 3: '其他' }
  return map[type] || '未知'
}

const getTypeTag = (type) => {
  const map = { 1: 'warning', 2: 'primary', 3: 'info' }
  return map[type] || ''
}

const formatStatus = (status) => {
  const map = { 0: '待处理', 1: '处理中', 2: '已解决', 3: '已关闭' }
  return map[status] || '未知'
}

const getStatusTag = (status) => {
  const map = { 0: 'info', 1: 'warning', 2: 'success', 3: 'danger' }
  return map[status] || ''
}

// --- 数据获取 ---
const getList = async () => {
  loading.value = true
  try {
    const res = await getFeedbackPageAPI(queryParams)
    if (res.code === '0') {
      feedbackList.value = res.data.records.map((item) => {
        // 处理图片字段，如果是字符串则分割，如果是数组则直接使用
        let images = []
        if (Array.isArray(item.images)) {
          images = item.images
        } else if (typeof item.images === 'string' && item.images) {
          images = item.images.split(',')
        }
        return {
          ...item,
          images
        }
      })
      total.value = parseInt(res.data.total)
    } else {
      ElMessage.error(res.message || '获取列表失败')
    }
  } catch (error) {
    console.error('获取反馈列表错误', error)
    ElMessage.error('获取列表失败')
  } finally {
    loading.value = false
  }
}

// --- 事件处理 ---
const handleSearch = () => {
  queryParams.page = 1
  getList()
}

const handleReset = () => {
  queryParams.type = undefined
  queryParams.status = undefined
  handleSearch()
}

const handleSizeChange = (val) => {
  queryParams.pageSize = val
  getList()
}

const handleCurrentChange = (val) => {
  queryParams.page = val
  getList()
}

// --- 回复处理 ---
const handleReply = (row) => {
  replyForm.id = row.id
  replyForm.replyContent = ''
  replyForm.status = 2 // 默认选中已解决
  dialogVisible.value = true
}

const resetDialog = () => {
  if (replyFormRef.value) {
    replyFormRef.value.resetFields()
  }
}

const submitReply = async () => {
  if (!replyFormRef.value) return

  await replyFormRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        const res = await replyFeedbackAPI(replyForm)
        if (res.code === '0') {
          ElMessage.success('回复成功')
          dialogVisible.value = false
          getList() // 刷新列表
        } else {
          ElMessage.error(res.message || '操作失败')
        }
      } catch (error) {
        console.error('回复失败', error)
        ElMessage.error('操作异常')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 初始化
onMounted(() => {
  getList()
})
</script>

<style scoped>
.user-feedback-view {
  padding: 20px;
}
.card-header {
  font-weight: bold;
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
