<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Picture, User, Reading } from '@element-plus/icons-vue'
import { pageCourse } from '@/api/course'

const router = useRouter()

const TABS = [
  { value: 1, label: '在线课程' },
  { value: 2, label: '研培项目' },
  { value: 3, label: '讲座' },
  { value: 4, label: '资讯' }
]

const activeType = ref(1)
const loading = ref(false)
const courseList = ref([])
const total = ref(0)
const queryParams = reactive({ current: 1, size: 9 })

const fetchList = async () => {
  loading.value = true
  try {
    const res = await pageCourse({
      current: queryParams.current,
      size: queryParams.size,
      contentType: activeType.value,
      status: 1
    })
    if (res.code === '0' && res.data) {
      courseList.value = res.data.records || []
      total.value = Number(res.data.total) || 0
    } else if (res.records) {
      courseList.value = res.records
      total.value = Number(res.total) || 0
    } else {
      courseList.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取培训内容失败', error)
  } finally {
    loading.value = false
  }
}

const handleTabChange = () => {
  queryParams.current = 1
  fetchList()
}

const goDetail = (item) => {
  router.push(`/education/course/${item.id}`)
}

onMounted(() => {
  fetchList()
})
</script>

<template>
  <div class="education-page">
    <div class="page-inner">
      <div class="page-header">
        <h2>
          <el-icon><Reading /></el-icon> 教育培训
        </h2>
        <p>在线课程 · 研培项目 · 文化讲座 · 非遗资讯</p>
      </div>

      <el-tabs
        v-model="activeType"
        class="edu-tabs"
        @tab-change="handleTabChange"
      >
        <el-tab-pane
          v-for="tab in TABS"
          :key="tab.value"
          :label="tab.label"
          :name="tab.value"
        />
      </el-tabs>

      <div v-loading="loading" class="course-grid">
        <div
          v-for="item in courseList"
          :key="item.id"
          class="course-card"
          @click="goDetail(item)"
        >
          <div class="cover-wrapper">
            <img
              v-if="item.coverImage"
              :src="item.coverImage"
              :alt="item.title"
            />
            <div v-else class="cover-empty">
              <el-icon :size="36"><Picture /></el-icon>
            </div>
            <el-tag class="type-tag" effect="dark" size="small">
              {{
                item.contentTypeName ||
                TABS.find((t) => t.value === activeType)?.label
              }}
            </el-tag>
          </div>
          <div class="card-body">
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-summary">{{ item.summary || '暂无简介' }}</p>
            <div class="card-meta">
              <span class="meta-item">
                <el-icon><User /></el-icon>
                {{ item.teacher || '佚名' }}
              </span>
              <span class="meta-price">
                <el-tag v-if="item.isFree === 1" type="success" size="small"
                  >免费</el-tag
                >
                <el-tag v-else type="danger" size="small"
                  >¥{{ item.fee ?? 0 }}</el-tag
                >
              </span>
            </div>
            <div class="card-footer">
              <span>{{ item.enrolledCount || 0 }} 人已学习</span>
              <span v-if="item.duration">{{ item.duration }}</span>
            </div>
          </div>
        </div>
        <el-empty
          v-if="!loading && courseList.length === 0"
          description="暂无内容"
        />
      </div>

      <div class="pagination-wrap" v-if="total > 0">
        <el-pagination
          v-model:current-page="queryParams.current"
          v-model:page-size="queryParams.size"
          layout="prev, pager, next"
          :total="total"
          :page-sizes="[9]"
          @current-change="fetchList"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.education-page {
  min-height: 100vh;
  background-color: #e7eef7;
  padding: 30px 0 50px;
}

.page-inner {
  width: 85vw;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 10px;

  h2 {
    font-size: 28px;
    color: #8b0000;
    margin: 0 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  p {
    color: #666;
    font-size: 14px;
    margin: 0;
  }
}

.edu-tabs {
  justify-content: center;

  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }

  :deep(.el-tabs__item) {
    font-size: 16px;
  }
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  min-height: 200px;
}

.course-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);

    .cover-wrapper img {
      transform: scale(1.05);
    }
  }
}

.cover-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .cover-empty {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f2f5;
    color: #909399;
  }

  .type-tag {
    position: absolute;
    top: 10px;
    left: 10px;
  }
}

.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.card-title {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-summary {
  margin: 0;
  font-size: 13px;
  color: #888;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 39px;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: #666;

  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.card-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  border-top: 1px solid #f0f0f0;
  padding-top: 8px;
  margin-top: auto;
}

.pagination-wrap {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

@media (max-width: 1024px) {
  .course-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .course-grid {
    grid-template-columns: 1fr;
  }
}
</style>
