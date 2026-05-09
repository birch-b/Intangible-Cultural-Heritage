<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getActivityDetail } from '@/api/heritageActivity'
import dayjs from 'dayjs'

const route = useRoute()
// const router = useRouter()
const detail = ref({})
const loading = ref(false)

const getDetail = async () => {
  const id = route.query.id
  if (!id) return
  loading.value = true
  try {
    const res = await getActivityDetail(id)
    if (res.code === '0' || res.code === 200 || !res.code) {
      detail.value = res.data || res
      // 解析图集JSON字符串 (如果后端返回的是字符串)
      if (typeof detail.value.imageList === 'string') {
        try {
          detail.value.imageList = JSON.parse(detail.value.imageList)
        } catch {
          detail.value.imageList = []
        }
      }
    }
  } catch (error) {
    console.error('获取详情失败', error)
  } finally {
    loading.value = false
  }
}

// 格式化时间
const formatTime = (time) => {
  return time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : ''
}

const getTypeName = (val) => {
  const map = {
    1: '展示推广',
    2: '表演活动',
    3: '交流融合',
    4: '教育体验',
    5: '市集消费',
    6: '学术交流'
  }
  return map[val] || '其他活动'
}

onMounted(() => {
  getDetail()
})
</script>

<template>
  <div class="detail-container" v-loading="loading">
    <!-- 顶部面包屑 -->
    <div class="breadcrumb-bar">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/activity' }"
          >活动资讯</el-breadcrumb-item
        >
        <el-breadcrumb-item :to="{ path: '/act_category' }"
          >全部活动</el-breadcrumb-item
        >
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="content-wrapper">
      <h1 class="title">{{ detail.title }}</h1>
      <div class="meta-info">
        <span class="tag">{{ getTypeName(detail.type) }}</span>
        <span class="time">发布时间：{{ formatTime(detail.createTime) }}</span>
        <span class="publisher">发布者：{{ detail.publisher }}</span>
      </div>

      <div class="activity-info-card">
        <div class="info-item">
          <span class="label">活动时间：</span>
          <span class="value">{{ detail.activityTime || '暂无时间信息' }}</span>
        </div>
        <div class="info-item">
          <span class="label">活动地点：</span>
          <span class="value">{{ detail.location || '暂无地点信息' }}</span>
        </div>
      </div>

      <!-- 封面图 -->
      <div class="cover-image" v-if="detail.coverImage">
        <img :src="detail.coverImage" alt="活动封面" />
      </div>

      <!-- 内容摘要 -->
      <div class="description" v-if="detail.description">
        <h3>活动摘要</h3>
        <p>{{ detail.description }}</p>
      </div>

      <!-- 详情内容 (HTML) -->
      <div class="html-content" v-html="detail.content"></div>

      <!-- 图集 -->
      <div
        class="gallery"
        v-if="detail.imageList && detail.imageList.length > 0"
      >
        <h3>精彩瞬间</h3>
        <div class="gallery-grid">
          <div
            class="gallery-item"
            v-for="(img, index) in detail.imageList"
            :key="index"
          >
            <el-image
              :src="img.imageUrl"
              fit="cover"
              :preview-src-list="detail.imageList.map((i) => i.imageUrl)"
              :initial-index="index"
              preview-teleported
            />
            <p class="caption">{{ img.caption }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-container {
  min-height: 100vh;
  background-color: #88393c;
  padding-bottom: 50px;

  .breadcrumb-bar {
    background-color: #88393c;
    padding: 20px 10%;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .content-wrapper {
    width: 80%;
    margin: 0 auto;
    background-color: #fff;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    .title {
      font-size: 28px;
      color: #303133;
      margin-bottom: 20px;
      text-align: center;
    }

    .meta-info {
      display: flex;
      justify-content: center;
      gap: 20px;
      color: #909399;
      font-size: 14px;
      margin-bottom: 30px;
      border-bottom: 1px solid #ebeef5;
      padding-bottom: 20px;

      .tag {
        color: #409eff;
        background: #ecf5ff;
        padding: 2px 8px;
        border-radius: 4px;
      }
    }

    .activity-info-card {
      background-color: #fdf6ec;
      padding: 20px;
      border-radius: 4px;
      margin-bottom: 30px;

      .info-item {
        margin-bottom: 10px;
        font-size: 16px;
        &:last-child {
          margin-bottom: 0;
        }

        .label {
          font-weight: bold;
          color: #e6a23c;
        }
        .value {
          color: #606266;
        }
      }
    }

    .cover-image {
      text-align: center;
      margin-bottom: 30px;
      img {
        max-width: 100%;
        max-height: 500px;
        border-radius: 4px;
      }
    }

    .description {
      background-color: #f4f4f5;
      padding: 20px;
      border-radius: 4px;
      margin-bottom: 30px;
      border-left: 5px solid #909399;

      h3 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 18px;
      }
      p {
        margin: 0;
        line-height: 1.6;
        color: #606266;
        white-space: pre-wrap;
      }
    }

    .html-content {
      line-height: 1.8;
      color: #303133;
      font-size: 16px;
      margin-bottom: 40px;
      white-space: pre-wrap;

      :deep(img) {
        max-width: 100%;
        height: auto;
      }
    }

    .gallery {
      h3 {
        border-left: 4px solid #409eff;
        padding-left: 10px;
        margin-bottom: 20px;
      }

      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;

        .gallery-item {
          text-align: center;

          .el-image {
            width: 100%;
            height: 150px;
            border-radius: 4px;
          }

          .caption {
            margin-top: 8px;
            font-size: 14px;
            color: #909399;
          }
        }
      }
    }
  }
}
</style>
