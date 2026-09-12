<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getMyRegistrationPage,
  cancelActivityRegistration
} from '@/api/activityRegistration'
import { formatTime } from '@/utils/format'

const router = useRouter()

const loading = ref(false)
const registrationList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 报名状态：1-已报名 2-已取消 3-已签到
const STATUS_MAP = {
  1: { label: '已报名', type: 'success' },
  2: { label: '已取消', type: 'info' },
  3: { label: '已签到', type: 'warning' }
}
const getStatusTag = (status) =>
  STATUS_MAP[status] || { label: '未知', type: 'info' }

const getList = async () => {
  loading.value = true
  try {
    const res = await getMyRegistrationPage({
      current: currentPage.value,
      size: pageSize.value
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
    console.error('获取我的活动报名失败', error)
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  getList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  getList()
}

// 跳转活动详情
const goDetail = (row) => {
  if (row.activityId) {
    router.push(`/act_detail?id=${row.activityId}`)
  }
}

// 取消报名（按活动ID）
const handleCancel = (row) => {
  ElMessageBox.confirm(
    `确定要取消「${row.activityTitle || '该活动'}」的报名吗？`,
    '取消报名',
    {
      confirmButtonText: '确定取消',
      cancelButtonText: '再想想',
      type: 'warning'
    }
  )
    .then(async () => {
      try {
        await cancelActivityRegistration(row.activityId)
        ElMessage.success('已取消报名')
        getList()
      } catch (error) {
        console.error('取消报名失败', error)
      }
    })
    .catch(() => {})
}

onMounted(() => {
  getList()
})
</script>

<!-- 我的活动报名 -->
<template>
  <div class="MyActivities">
    <el-container>
      <el-header height="10vh">
        <div class="topic">
          <h2><i class="iconfont icon-xiaoxitongzhi"></i>我的活动</h2>
        </div>
      </el-header>
      <el-main>
        <el-table
          v-loading="loading"
          :data="registrationList"
          stripe
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="70"
            :index="(i) => (currentPage - 1) * pageSize + i + 1"
          />
          <el-table-column
            prop="activityTitle"
            label="活动名称"
            min-width="200"
            show-overflow-tooltip
          >
            <template #default="scope">
              <el-link
                type="primary"
                :underline="false"
                @click="goDetail(scope.row)"
              >
                {{ scope.row.activityTitle || '查看活动' }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="活动时间" width="180">
            <template #default="scope">
              {{ scope.row.activityTime || '—' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="location"
            label="活动地点"
            width="150"
            show-overflow-tooltip
          >
            <template #default="scope">{{
              scope.row.location || '—'
            }}</template>
          </el-table-column>
          <el-table-column label="报名时间" width="170">
            <template #default="scope">
              {{ formatTime(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="90">
            <template #default="scope">
              <el-tag
                :type="getStatusTag(scope.row.status).type"
                effect="light"
              >
                {{ getStatusTag(scope.row.status).label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            min-width="120"
            show-overflow-tooltip
          >
            <template #default="scope">{{ scope.row.remark || '—' }}</template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="scope">
              <el-button
                v-if="scope.row.status === 1"
                size="small"
                type="danger"
                plain
                @click="handleCancel(scope.row)"
              >
                取消报名
              </el-button>
              <span v-else>—</span>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty description="暂未报名任何活动" />
          </template>
        </el-table>
      </el-main>
      <el-footer>
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50]"
            size="large"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/var.scss' as *;
.el-header {
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.el-main {
  padding: 0 3vw;
}

.el-footer {
  padding-top: 1vh;
  display: flex;
  justify-content: center;
}

.topic {
  width: 80vw;
  h2 {
    border-bottom: 5px solid $logintextColor;
    i {
      padding-left: 1vw;
      font-size: 25px;
      margin-right: 1vw;
    }
    color: $logintextColor;
    font-size: 25px;
    padding-bottom: 1vh;
  }
}
</style>
