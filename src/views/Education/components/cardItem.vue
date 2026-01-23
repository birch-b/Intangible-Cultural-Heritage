<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  type: {
    type: String,
    default: 'project' // project | news | lecture
  }
})

const emit = defineEmits(['click'])

const handleClick = (item) => {
  emit('click', item, props.type)
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
  <div class="exp_content">
    <div 
      class="exp_item" 
      v-for="item in list" 
      :key="item.id || item"
      @click="handleClick(item)"
    >
      <div class="img-wrapper">
        <img :src="getImageUrl(item)" :alt="item.title" loading="lazy" />
      </div>
      <div class="info-wrapper">
        <h3>{{ item.title }}</h3>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.exp_content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
}

.exp_item {
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
  }

  .img-wrapper {
    width: 100%;
    height: 220px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
  }

  &:hover .img-wrapper img {
    transform: scale(1.05);
  }

  .info-wrapper {
    padding: 16px;
    background: #fff;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
      text-align: center;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .exp_content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .exp_content {
    grid-template-columns: 1fr;
  }
}
</style>


