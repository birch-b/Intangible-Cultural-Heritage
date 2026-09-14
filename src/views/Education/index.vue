<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Reading } from '@element-plus/icons-vue'
import { pageCourse } from '@/api/course'
import CourseCard from './components/CourseCard.vue'

const router = useRouter()

const TABS = [
  { value: 1, label: '在线课程' },
  { value: 2, label: '研培项目' },
  { value: 3, label: '讲座' },
  { value: 4, label: '资讯' }
]
const TYPE_LABEL = Object.fromEntries(TABS.map((t) => [t.value, t.label]))

const activeType = ref(1)
const loading = ref(false)
const courseList = ref([])
const total = ref(0)
const queryParams = reactive({ current: 1, size: 9 })

// 各分类的内容数量：用于 Tab 徽标 + 空分类时的引导
const tabCounts = ref({})
// 当前分类为空时，展示的其他分类内容，避免整页空荡荡
const fallbackList = ref([])

const activeTabLabel = computed(() => TYPE_LABEL[activeType.value] || '')

// 除当前分类外，第一个有内容的分类（用于空状态引导）
const firstNonEmptyTab = computed(
  () =>
    TABS.find(
      (t) => t.value !== activeType.value && (tabCounts.value[t.value] || 0) > 0
    ) || null
)

const typeLabelOf = (item) => TYPE_LABEL[item.contentType] || ''

// 兼容 { code:'0', data:{records,total} } 与直接返回 Page 对象两种格式
const extractPage = (res) => {
  if (res && res.code === '0' && res.data) return res.data
  if (res && res.records) return res
  return { records: [], total: 0 }
}

// 拉取各分类数量（仅首次加载时执行，用于 Tab 徽标）
const loadTabCounts = async () => {
  const entries = await Promise.all(
    TABS.map(async (t) => {
      try {
        const res = await pageCourse({
          current: 1,
          size: 1,
          contentType: t.value,
          status: 1
        })
        return [t.value, Number(extractPage(res).total) || 0]
      } catch (error) {
        console.error(`获取「${t.label}」数量失败`, error)
        return [t.value, 0]
      }
    })
  )
  tabCounts.value = Object.fromEntries(entries)
}

// 当前分类无内容时，取其他分类的内容作为推荐
const fetchFallback = async () => {
  try {
    const res = await pageCourse({ current: 1, size: 6, status: 1 })
    fallbackList.value = extractPage(res)
      .records.filter((i) => i.contentType !== activeType.value)
      .slice(0, 3)
  } catch (error) {
    console.error('获取推荐内容失败', error)
    fallbackList.value = []
  }
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await pageCourse({
      current: queryParams.current,
      size: queryParams.size,
      contentType: activeType.value,
      status: 1
    })
    const page = extractPage(res)
    courseList.value = page.records
    total.value = Number(page.total) || 0
    fallbackList.value = []

    if (courseList.value.length === 0) {
      await fetchFallback()
    }
  } catch (error) {
    console.error('获取培训内容失败', error)
    courseList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

const handleTabChange = () => {
  queryParams.current = 1
  fetchList()
}

// 跳到第一个有内容的分类
const goFirstNonEmptyTab = () => {
  if (!firstNonEmptyTab.value) return
  activeType.value = firstNonEmptyTab.value.value
  handleTabChange()
}

const goDetail = (item) => {
  router.push(`/education/course/${item.id}`)
}

onMounted(() => {
  fetchList()
  loadTabCounts()
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
        <el-tab-pane v-for="tab in TABS" :key="tab.value" :name="tab.value">
          <template #label>
            <span class="tab-label">
              {{ tab.label }}
              <span v-if="tabCounts[tab.value]" class="tab-count">
                {{ tabCounts[tab.value] }}
              </span>
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>

      <div v-loading="loading" class="course-area">
        <!-- 有内容：正常卡片网格 -->
        <template v-if="courseList.length">
          <div class="course-grid">
            <CourseCard
              v-for="item in courseList"
              :key="item.id"
              :item="item"
              :type-label="typeLabelOf(item)"
              @click="goDetail"
            />
          </div>

          <div class="pagination-wrap" v-if="total > queryParams.size">
            <el-pagination
              v-model:current-page="queryParams.current"
              v-model:page-size="queryParams.size"
              layout="prev, pager, next"
              :total="total"
              :page-sizes="[9]"
              @current-change="fetchList"
            />
          </div>
        </template>

        <!-- 当前分类为空：友好提示 + 其他分类推荐 -->
        <template v-else-if="!loading">
          <div class="empty-block">
            <el-empty :image-size="110">
              <template #description>
                <p class="empty-title">「{{ activeTabLabel }}」下暂无内容</p>
                <p class="empty-tip">可以切换上方分类看看，内容会持续更新</p>
              </template>
              <el-button
                v-if="firstNonEmptyTab"
                type="primary"
                plain
                @click="goFirstNonEmptyTab"
              >
                去看看「{{ firstNonEmptyTab.label }}」（{{
                  tabCounts[firstNonEmptyTab.value]
                }}）
              </el-button>
            </el-empty>
          </div>

          <div v-if="fallbackList.length" class="fallback">
            <div class="fallback-head">
              <h3>其他分类推荐</h3>
              <span class="fallback-sub">
                以下内容来自其他分类，或许你也会感兴趣
              </span>
            </div>
            <div class="course-grid">
              <CourseCard
                v-for="item in fallbackList"
                :key="item.id"
                :item="item"
                :type-label="typeLabelOf(item)"
                @click="goDetail"
              />
            </div>
          </div>
        </template>
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

.tab-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  .tab-count {
    display: inline-block;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 9px;
    background: rgba(139, 0, 0, 0.1);
    color: #8b0000;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
  }
}

.course-area {
  min-height: 240px;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.empty-block {
  padding: 20px 0 30px;

  .empty-title {
    margin: 0 0 6px;
    font-size: 16px;
    color: #555;
  }

  .empty-tip {
    margin: 0;
    font-size: 13px;
    color: #999;
  }
}

.fallback {
  margin-top: 10px;
  padding-top: 24px;
  border-top: 1px dashed #d5ddea;
}

.fallback-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 18px;

  h3 {
    margin: 0;
    font-size: 18px;
    color: #8b0000;
  }

  .fallback-sub {
    font-size: 13px;
    color: #999;
  }
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
