<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProjectResources } from '@/api/education'
import { getHeritageDetailAPI } from '@/api/heritage'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const projectId = route.params.id

const projectInfo = ref({})
const activeTab = ref('image')
const resourceList = ref([])
const loading = ref(false)

const fetchProjectInfo = async () => {
  try {
    const res = await getHeritageDetailAPI(projectId)
    if (res.data) {
      projectInfo.value = res.data
    }
  } catch (error) {
    console.error('获取项目详情失败', error)
  }
}

const fetchResources = async () => {
  loading.value = true
  try {
    const res = await getProjectResources(projectId)
    if (res.data && res.data.records) {
      resourceList.value = res.data.records
    }
  } catch (error) {
    console.error('获取资源列表失败', error)
  } finally {
    loading.value = false
  }
}

const imageList = computed(() => resourceList.value.filter(i => i.mediaType === 1))
const videoList = computed(() => resourceList.value.filter(i => i.mediaType === 2))
const audioList = computed(() => resourceList.value.filter(i => i.mediaType === 3))

// 获取所有图片的URL列表，用于预览
const previewSrcList = computed(() => imageList.value.map(item => item.url))

onMounted(() => {
  if (!projectId) {
    ElMessage.error('参数错误')
    return
  }
  fetchProjectInfo()
  fetchResources()
})
</script>

<template>
  <div class="resource-detail-container" v-loading="loading">
    <!-- 顶部导航与标题 -->
    <div class="header-section">
      <div class="back-btn" @click="router.back()">
        <el-icon><ArrowLeft /></el-icon> 返回
      </div>
      <div class="project-info">
        <h1 class="project-title">{{ projectInfo.title || '加载中...' }}</h1>
        <p class="project-desc" v-if="projectInfo.description">
          {{ projectInfo.description }}
        </p>
      </div>
    </div>

    <!-- 资源内容区 -->
    <div class="content-section">
      <el-tabs v-model="activeTab" class="custom-tabs">
        <!-- 图片资源 -->
        <el-tab-pane label="精选图集" name="image">
          <div v-if="imageList.length === 0" class="empty-state">
            <el-empty description="暂无图片资源" />
          </div>
          <div v-else class="resource-grid image-grid">
            <div v-for="(item, index) in imageList" :key="item.id" class="grid-item">
              <el-image 
                :src="item.url" 
                :preview-src-list="previewSrcList"
                :initial-index="index"
                fit="cover"
                loading="lazy"
                class="resource-img"
              />
              <div class="item-title" v-if="item.title">{{ item.title }}</div>
            </div>
          </div>
        </el-tab-pane>
        
        <!-- 视频资源 -->
        <el-tab-pane label="视频影像" name="video">
          <div v-if="videoList.length === 0" class="empty-state">
            <el-empty description="暂无视频资源" />
          </div>
          <div v-else class="resource-grid video-grid">
            <div v-for="item in videoList" :key="item.id" class="grid-item video-item">
              <div class="video-wrapper">
                <video :src="item.url" :poster="item.coverUrl" controls preload="metadata"></video>
              </div>
              <div class="item-info">
                <h3>{{ item.title || '未命名视频' }}</h3>
                <p v-if="item.description">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <!-- 音频资源 -->
        <el-tab-pane label="音频资料" name="audio">
          <div v-if="audioList.length === 0" class="empty-state">
            <el-empty description="暂无音频资源" />
          </div>
          <div v-else class="audio-list">
            <div v-for="item in audioList" :key="item.id" class="audio-item">
              <div class="audio-cover">
                <el-image 
                  :src="item.coverUrl || projectInfo.coverImage" 
                  fit="cover" 
                  class="cover-img"
                >
                  <template #error>
                    <el-icon><Headset /></el-icon>
                  </template>
                </el-image>
              </div>
              <div class="audio-info">
                <h3>{{ item.title || '未命名音频' }}</h3>
                <audio :src="item.url" controls class="audio-player"></audio>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped lang="scss">
.resource-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 80vh;
}

.header-section {
  margin-bottom: 40px;
  
  .back-btn {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
    color: #606266;
    margin-bottom: 20px;
    transition: color 0.3s;
    
    &:hover {
      color: #409EFF;
    }
    
    .el-icon {
      margin-right: 5px;
    }
  }

  .project-title {
    font-size: 32px;
    color: #303133;
    margin-bottom: 16px;
  }

  .project-desc {
    font-size: 16px;
    color: #606266;
    line-height: 1.6;
    max-width: 800px;
  }
}

/* 网格布局通用样式 */
.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  
  .grid-item {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }
  }
}

/* 图片特定样式 */
.image-grid {
  .resource-img {
    width: 100%;
    height: 200px;
    display: block;
  }
  
  .item-title {
    padding: 12px;
    font-size: 14px;
    color: #333;
    text-align: center;
  }
}

/* 视频特定样式 */
.video-grid {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));

  .video-wrapper {
    width: 100%;
    background: #000;
    
    video {
      width: 100%;
      height: 200px;
      display: block;
    }
  }
  
  .item-info {
    padding: 16px;
    
    h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
      color: #303133;
    }
    
    p {
      margin: 0;
      font-size: 13px;
      color: #909399;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}

/* 音频列表样式 */
.audio-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  .audio-item {
    display: flex;
    align-items: center;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    .audio-cover {
      width: 60px;
      height: 60px;
      border-radius: 4px;
      overflow: hidden;
      margin-right: 20px;
      flex-shrink: 0;
      background: #f5f7fa;
      display: flex;
      align-items: center;
      justify-content: center;

      .cover-img {
        width: 100%;
        height: 100%;
      }

      .el-icon {
        font-size: 24px;
        color: #909399;
      }
    }
    
    .audio-info {
      flex: 1;
      
      h3 {
        margin: 0 0 10px 0;
        font-size: 16px;
        color: #303133;
      }
      
      .audio-player {
        width: 100%;
        height: 32px;
      }
    }
  }
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}
</style>