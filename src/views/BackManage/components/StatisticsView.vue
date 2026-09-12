<template>
  <div class="statistics-view">
    <!-- 总览卡片 -->
    <el-row :gutter="16" v-loading="overviewLoading">
      <el-col
        v-for="card in cards"
        :key="card.key"
        :xs="12"
        :sm="8"
        :md="6"
        :lg="6"
      >
        <el-card shadow="hover" class="stat-card">
          <div class="stat-inner">
            <div class="stat-icon" :style="{ backgroundColor: card.bgColor }">
              <el-icon :size="26" :color="card.color">
                <component :is="card.icon" />
              </el-icon>
            </div>
            <div class="stat-meta">
              <div class="stat-value">{{ overview[card.key] ?? 0 }}</div>
              <div class="stat-label">{{ card.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 趋势图 -->
    <el-card class="trend-card" shadow="never">
      <template #header>
        <div class="trend-header">
          <span>近 {{ trendDays }} 天数据趋势</span>
          <el-radio-group v-model="trendDays" size="small" @change="fetchTrend">
            <el-radio-button :value="7">7天</el-radio-button>
            <el-radio-button :value="15">15天</el-radio-button>
            <el-radio-button :value="30">30天</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div ref="chartRef" class="trend-chart" v-loading="trendLoading"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue'
import {
  User,
  Collection,
  Calendar,
  Tickets,
  ChatDotRound,
  Star,
  Reading
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { getStatisticsOverview, getStatisticsTrend } from '@/api/statistics'

const cards = [
  {
    key: 'userCount',
    label: '用户总数',
    icon: User,
    color: '#409eff',
    bgColor: '#ecf5ff'
  },
  {
    key: 'itemCount',
    label: '非遗项目',
    icon: Collection,
    color: '#67c23a',
    bgColor: '#f0f9eb'
  },
  {
    key: 'activityCount',
    label: '活动总数',
    icon: Calendar,
    color: '#e6a23c',
    bgColor: '#fdf6ec'
  },
  {
    key: 'registrationCount',
    label: '活动报名',
    icon: Tickets,
    color: '#f56c6c',
    bgColor: '#fef0f0'
  },
  {
    key: 'feedbackCount',
    label: '用户反馈',
    icon: ChatDotRound,
    color: '#909399',
    bgColor: '#f4f4f5'
  },
  {
    key: 'collectionCount',
    label: '收藏总数',
    icon: Star,
    color: '#ffb400',
    bgColor: '#fff8e6'
  },
  {
    key: 'trainingCourseCount',
    label: '培训内容',
    icon: Reading,
    color: '#8e44ad',
    bgColor: '#f5eef8'
  }
]

const overviewLoading = ref(false)
const overview = reactive({
  userCount: 0,
  itemCount: 0,
  activityCount: 0,
  registrationCount: 0,
  feedbackCount: 0,
  collectionCount: 0,
  trainingCourseCount: 0
})

const fetchOverview = async () => {
  overviewLoading.value = true
  try {
    const res = await getStatisticsOverview()
    const data = res.code === '0' ? res.data : res
    Object.assign(overview, data || {})
  } catch (error) {
    console.error('获取总览统计失败', error)
  } finally {
    overviewLoading.value = false
  }
}

// 趋势图
const trendLoading = ref(false)
const trendDays = ref(7)
const chartRef = ref(null)
let chartInstance = null

const renderChart = (data) => {
  if (!chartRef.value) return
  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }
  chartInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['新增用户', '新增项目', '新增活动', '新增报名'],
      bottom: 0
    },
    grid: { left: 40, right: 24, top: 24, bottom: 48 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.dates || []
    },
    yAxis: { type: 'value', minInterval: 1 },
    series: [
      {
        name: '新增用户',
        type: 'line',
        smooth: true,
        areaStyle: { opacity: 0.1 },
        data: data.newUserCounts || []
      },
      {
        name: '新增项目',
        type: 'line',
        smooth: true,
        data: data.newItemCounts || []
      },
      {
        name: '新增活动',
        type: 'line',
        smooth: true,
        data: data.newActivityCounts || []
      },
      {
        name: '新增报名',
        type: 'line',
        smooth: true,
        data: data.newRegistrationCounts || []
      }
    ]
  })
}

const fetchTrend = async () => {
  trendLoading.value = true
  try {
    const res = await getStatisticsTrend(trendDays.value)
    const data = res.code === '0' ? res.data : res
    await nextTick()
    renderChart(data || {})
  } catch (error) {
    console.error('获取趋势统计失败', error)
  } finally {
    trendLoading.value = false
  }
}

const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  fetchOverview()
  fetchTrend()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
  chartInstance = null
})
</script>

<style scoped>
.statistics-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-card {
  margin-bottom: 16px;
}

.stat-inner {
  display: flex;
  align-items: center;
  gap: 14px;
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
}

.trend-card {
  width: 100%;
}

.trend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trend-chart {
  width: 100%;
  height: 380px;
}
</style>
