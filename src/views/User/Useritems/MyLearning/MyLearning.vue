<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import { pageMyEnrollment, cancelEnrollment } from '@/api/trainingEnrollment'
import { formatTime } from '@/utils/format'

const router = useRouter()

const loading = ref(false)
const learningList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 学习状态：0-已加入/学习中 1-已完成/已结业
const STATUS_MAP = {
  0: { label: '学习中', type: 'primary' },
  1: { label: '已结业', type: 'success' }
}
const getStatusTag = (status) =>
  STATUS_MAP[status] || { label: '学习中', type: 'primary' }

const getList = async () => {
  loading.value = true
  try {
    const res = await pageMyEnrollment({
      current: currentPage.value,
      size: pageSize.value
    })
    if (res.code === '0' && res.data) {
      learningList.value = res.data.records || []
      total.value = Number(res.data.total) || 0
    } else if (res.records) {
      learningList.value = res.records
      total.value = Number(res.total) || 0
    } else {
      learningList.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取我的学习记录失败', error)
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

// 继续学习
const goCourse = (row) => {
  if (row.courseId) {
    router.push(`/education/course/${row.courseId}`)
  }
}

// 退出学习
const handleCancel = (row) => {
  ElMessageBox.confirm(
    `确定要退出学习「${row.courseTitle || '该内容'}」吗？学习记录将被清除。`,
    '退出学习',
    {
      confirmButtonText: '确定退出',
      cancelButtonText: '再想想',
      type: 'warning'
    }
  )
    .then(async () => {
      try {
        await cancelEnrollment(row.courseId)
        ElMessage.success('已退出学习')
        getList()
      } catch (error) {
        console.error('退出学习失败', error)
      }
    })
    .catch(() => {})
}

onMounted(() => {
  getList()
})
</script>

<!-- 我的学习 -->
<template>
  <div class="MyLearning">
    <el-container>
      <el-header height="10vh">
        <div class="topic">
          <h2><i class="iconfont icon-xiaoxitongzhi"></i>我的学习</h2>
        </div>
      </el-header>
      <el-main>
        <el-table
          v-loading="loading"
          :data="learningList"
          stripe
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="70"
            :index="(i) => (currentPage - 1) * pageSize + i + 1"
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
            label="内容名称"
            min-width="180"
            show-overflow-tooltip
          >
            <template #default="scope">
              <el-link
                type="primary"
                :underline="false"
                @click="goCourse(scope.row)"
              >
                {{ scope.row.courseTitle || '查看内容' }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="类型" width="100">
            <template #default="scope">
              <el-tag effect="plain">{{
                scope.row.contentTypeName || '—'
              }}</el-tag>
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
          <el-table-column label="学习进度" width="180">
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
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button
                size="small"
                type="primary"
                plain
                @click="goCourse(scope.row)"
              >
                {{ scope.row.status === 1 ? '查看内容' : '继续学习' }}
              </el-button>
              <el-button
                size="small"
                type="danger"
                plain
                @click="handleCancel(scope.row)"
              >
                退出
              </el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty description="暂未加入任何学习内容" />
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
</style>
