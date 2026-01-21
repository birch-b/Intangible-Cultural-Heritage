<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getHeritageDetailAPI } from '@/api/heritage'

const route = useRoute()
const detail = ref({})
const loading = ref(false)

const getDetail = async () => {
  const id = route.query.id
  if (!id) return
  loading.value = true
  try {
    const res = await getHeritageDetailAPI(id)
    if (res.code === '0' || res.code === 200 || !res.code) {
      detail.value = res.data || res
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

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
        <el-image 
          v-if="detail.coverImage"
          :src="detail.coverImage" 
          fit="contain" 
          style="width: 100%; height: 100%"
          preview-teleported
          :preview-src-list="[detail.coverImage]"
        />
        <div v-else class="no-image">暂无图片</div>
      </div>
      <div class="right_text">
        <h1 class="item-title">{{ detail.title }}</h1>
        <div class="item-meta">
          <span v-if="detail.region">地区：{{ detail.region }}</span>
          <span v-if="detail.createTime">发布时间：{{ new Date(detail.createTime).toLocaleDateString() }}</span>
        </div>
        <div class="item-summary" v-if="detail.summary">
          <strong>简介：</strong>{{ detail.summary }}
        </div>
        <div class="item-content" v-html="detail.content"></div>
      </div>
    </div>
  </div>
</template>

<style scope lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  background-color: #88393c;

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
    height: 80%;
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

      .item-title {
        font-size: 24px;
        margin-bottom: 10px;
        color: #88393c;
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
}
</style>
