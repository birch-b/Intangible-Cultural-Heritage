<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

const goToDetail = (item) => {
  if (item.url) {
    window.open(item.url, '_blank')
  }
}

// 获取图片地址的辅助函数
const getImageUrl = (item) => {
  // 1. 优先使用 coverUrl (主要用于 HeritageMediaRespDTO，如视频/音频/图片的封面)
  if (item.coverUrl) return item.coverUrl

  // 2. 其次使用 coverImage (主要用于 HeritageItemDO，非遗项目封面)
  if (item.coverImage) return item.coverImage

  // 3. 如果是图片类型的媒体资源 (mediaType === 1)，且没有封面，可以直接用 url
  if (item.mediaType === 1 && item.url) return item.url

  // 4. 如果以上都没有，但有 url 且看起来像图片 (简单判断)，也可以尝试
  // (但为了避免视频链接显示为裂图，这里最好谨慎)

  return ''
}
</script>

<template>
  <div class="edu_content">
    <div class="edu_item" v-for="item in list" :key="item.id">
      <img :src="getImageUrl(item) || '@/assets/image/layout.jpg'" />
      <div class="text">
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
        <a
          style="font-size: 1.2vh; cursor: pointer; color: #0062ff"
          @click="goToDetail(item)"
        >
          <el-icon>
            <Grid />
          </el-icon>
          查看详情
        </a>
      </div>
    </div>
    <div v-if="list.length === 0" class="empty-text">暂无教育资源</div>
  </div>
</template>

<style lang="scss" scoped>
.edu_content {
  width: 95%;
  height: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .edu_item {
    width: 32%;
    height: 95%;
    border-radius: 5px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 2vh;
    transition:
      transform 0.3s,
      box-shadow 0.3s;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    img {
      width: 100%;
      height: 58%;
      // background-color: #852326;
      border-radius: 5px 5px 0 0;
      object-fit: cover;
    }

    .text {
      width: 92%;
      height: 35%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      // align-items: center;
      // flex-wrap: wrap;

      h3 {
        margin: 0;
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      p {
        color: #7e858f;
        margin: 0;
        font-size: 14px;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
}

.empty-text {
  width: 100%;
  text-align: center;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
