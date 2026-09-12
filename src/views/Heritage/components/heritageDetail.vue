<script setup>
import {
  ArrowRight,
  Star,
  StarFilled,
  ZoomIn,
  ZoomOut,
  RefreshLeft,
  RefreshRight,
  Aim
} from '@element-plus/icons-vue'
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getHeritageDetailAPI,
  getHeritagePageAPI,
  addHeritageCollectionAPI,
  cancelHeritageCollectionAPI,
  checkHeritageCollectionAPI
} from '@/api/heritage'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const detail = ref({})
const loading = ref(false)
const isCollected = ref(false)
const collectLoading = ref(false)

// 图片缩放/旋转
const scale = ref(1)
const rotate = ref(0)
const zoomIn = () => {
  scale.value = Math.min(scale.value + 0.2, 4)
}
const zoomOut = () => {
  scale.value = Math.max(scale.value - 0.2, 0.4)
}
const rotateLeft = () => {
  rotate.value -= 90
}
const rotateRight = () => {
  rotate.value += 90
}
const resetImage = () => {
  scale.value = 1
  rotate.value = 0
}

// 相关推荐
const relatedList = ref([])
const fetchRelated = async (categoryId, currentId) => {
  if (!categoryId) return
  try {
    const res = await getHeritagePageAPI({
      current: 1,
      size: 6,
      categoryId,
      status: 2
    })
    const data = res.data || res
    const records = data.records || []
    relatedList.value = records
      .filter((item) => String(item.id) !== String(currentId))
      .slice(0, 4)
  } catch (e) {
    console.error(e)
  }
}

const goRelated = (item) => {
  router.push(`/heri_detail?id=${item.id}`)
}

const getDetail = async () => {
  const id = route.query.id
  if (!id) return
  loading.value = true
  try {
    const res = await getHeritageDetailAPI(id)
    if (res.code === '0' || res.code === 200 || !res.code) {
      detail.value = res.data || res
      checkCollection(id)
      fetchRelated(detail.value.categoryId, id)
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const checkCollection = async (id) => {
  try {
    const res = await checkHeritageCollectionAPI(id)
    if (res.code === '0') {
      isCollected.value = res.data
    }
  } catch (e) {
    console.error(e)
  }
}

const toggleCollect = async () => {
  if (!detail.value.id) return
  collectLoading.value = true
  try {
    const data = { heritageItemId: detail.value.id }
    if (isCollected.value) {
      const res = await cancelHeritageCollectionAPI(data)
      if (res.code === '0') {
        isCollected.value = false
        ElMessage.success('已取消收藏')
      }
    } else {
      const res = await addHeritageCollectionAPI(data)
      if (res.code === '0') {
        isCollected.value = true
        ElMessage.success('收藏成功')
      }
    }
  } catch (e) {
    console.error(e)
    ElMessage.error('操作失败')
  } finally {
    collectLoading.value = false
  }
}

watch(
  () => route.query.id,
  (newId) => {
    if (newId) {
      resetImage()
      relatedList.value = []
      getDetail()
    }
  }
)

onMounted(() => {
  getDetail()
})
</script>

<template>
  <div class="container">
    <div class="tab">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/heritage' }">
          非遗展示
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/heri_category' }">
          {{ detail.categoryName || '全部分类' }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          {{ detail.title || '项目详情' }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="de_content" v-loading="loading">
      <div class="left_image">
        <template v-if="detail.coverImage">
          <div class="image-viewer">
            <img
              :src="detail.coverImage"
              :alt="detail.title"
              class="viewer-img"
              :style="{
                transform: `scale(${scale}) rotate(${rotate}deg)`
              }"
              draggable="false"
            />
            <div class="viewer-toolbar">
              <el-button circle :icon="ZoomOut" title="缩小" @click="zoomOut" />
              <span class="zoom-text">{{ Math.round(scale * 100) }}%</span>
              <el-button circle :icon="ZoomIn" title="放大" @click="zoomIn" />
              <el-button
                circle
                :icon="RefreshLeft"
                title="向左旋转"
                @click="rotateLeft"
              />
              <el-button
                circle
                :icon="RefreshRight"
                title="向右旋转"
                @click="rotateRight"
              />
              <el-button circle :icon="Aim" title="重置" @click="resetImage" />
            </div>
          </div>
        </template>
        <div v-else class="no-image">暂无图片</div>
      </div>
      <div class="right_text">
        <div class="title-row">
          <h1 class="item-title">{{ detail.title }}</h1>
          <el-button
            type="warning"
            :icon="isCollected ? StarFilled : Star"
            circle
            size="large"
            @click="toggleCollect"
            :loading="collectLoading"
            title="收藏"
          />
        </div>
        <div class="item-meta">
          <span v-if="detail.region">地区：{{ detail.region }}</span>
          <span v-if="detail.createTime"
            >发布时间：{{
              new Date(detail.createTime).toLocaleDateString()
            }}</span
          >
        </div>
        <div class="item-summary" v-if="detail.summary">
          <strong>简介：</strong>{{ detail.summary }}
        </div>
        <div class="item-content" v-html="detail.content"></div>
      </div>
    </div>
    <!-- 相关推荐 -->
    <div class="related-wrap" v-if="relatedList.length > 0">
      <h2 class="related-title">相关非遗推荐</h2>
      <div class="related-list">
        <div
          v-for="item in relatedList"
          :key="item.id"
          class="related-card"
          @click="goRelated(item)"
        >
          <div class="related-cover">
            <img
              v-if="item.coverImage"
              :src="item.coverImage"
              :alt="item.title"
            />
            <div v-else class="related-noimg">暂无图片</div>
          </div>
          <div class="related-name" :title="item.title">{{ item.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scope lang="scss">
.container {
  width: 100vw;
  min-height: 100vh;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  background-color: #88393c;
  padding-bottom: 40px;

  .tab {
    width: 100%;
    height: 8vh;
    position: relative;
    background-color: rgba(0, 0, 0, 0.15);

    .el-breadcrumb {
      margin: 3vh 5vw;
      font-size: larger;
      z-index: 10;

      .el-breadcrumb__inner.is-link {
        color: #ddcbcb;
      }
      .el-breadcrumb__inner {
        color: #fff;
      }
    }
  }

  .de_content {
    width: 75%;
    height: 72vh;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background-color: #d8cfd0;
    padding: 20px;
    border-radius: 8px;
    overflow: hidden;

    .left_image {
      width: 50%;
      height: 100%;
      background-color: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;

      .image-viewer {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .viewer-img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        transition: transform 0.2s ease;
        transform-origin: center center;
        user-select: none;
      }

      .viewer-toolbar {
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 6px;
        background: rgba(0, 0, 0, 0.6);
        padding: 6px 10px;
        border-radius: 20px;
        z-index: 10;

        .el-button {
          color: #fff;
          border-color: rgba(255, 255, 255, 0.4);
          background: transparent;
        }

        .zoom-text {
          color: #fff;
          font-size: 13px;
          min-width: 44px;
          text-align: center;
        }
      }

      .no-image {
        color: #fff;
      }
    }

    .right_text {
      width: 48%;
      height: 100%;
      background-color: #fff; /* 改为白色背景方便阅读 */
      padding: 20px;
      overflow-y: auto;
      color: #333;

      .title-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        .item-title {
          font-size: 24px;
          margin: 0;
          color: #88393c;
        }
      }

      .item-meta {
        color: #666;
        font-size: 14px;
        margin-bottom: 15px;
        span {
          margin-right: 15px;
        }
      }

      .item-summary {
        background-color: #f5f5f5;
        padding: 10px;
        border-radius: 4px;
        margin-bottom: 20px;
        line-height: 1.6;
      }

      .item-content {
        line-height: 1.8;
        white-space: pre-wrap;
        img {
          max-width: 100%;
        }
      }
    }
  }

  .related-wrap {
    width: 75%;
    margin: 30px auto 0;
    background-color: rgba(216, 207, 208, 0.95);
    border-radius: 8px;
    padding: 20px;

    .related-title {
      margin: 0 0 16px;
      font-size: 20px;
      color: #88393c;
    }

    .related-list {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .related-card {
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);

        .related-cover img {
          transform: scale(1.06);
        }
      }
    }

    .related-cover {
      width: 100%;
      height: 130px;
      overflow: hidden;
      background: #f0f2f5;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .related-noimg {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #909399;
        font-size: 13px;
      }
    }

    .related-name {
      padding: 10px;
      font-size: 14px;
      color: #333;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

@media (max-width: 1024px) {
  .container .related-wrap .related-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
