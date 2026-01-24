<script setup>
import { ref, onMounted } from 'vue'
import HerItem from './HerItem.vue'
import VirItem from './VirItem.vue'
import ActItem from './ActItem.vue'
import EduItem from './EduItem.vue'
import { getBannerListAPI } from '@/api/banner'
import { getHeritagePageAPI } from '@/api/heritage'
import { pageActivity } from '@/api/heritageActivity'
import { getMediaPageAPI } from '@/api/heritageMedia'

const banners = ref([])
const heritageItems = ref([])
const activityItems = ref([])
const educationItems = ref([])

const getBanners = async () => {
  try {
    const res = await getBannerListAPI('HOME')
    // 过滤启用的轮播图并按sort排序
    banners.value = res.filter(item => item.status === '启用').sort((a, b) => a.sort - b.sort)
  } catch (error) {
    console.error('获取轮播图失败', error)
  }
}

// 获取非遗展示（精选项目）
const getHeritageItems = async () => {
  try {
    const res = await getHeritagePageAPI({ 
      current: 1, 
      size: 3, 
      isFeatured: 1, 
      status: 2 
    })
    if (res.code === '0' || res.code === 200 || !res.code) {
      const data = res.data || res
      heritageItems.value = data.records || []
    }
  } catch (error) {
    console.error('获取非遗展示失败', error)
  }
}

// 获取活动资讯
const getActivityItems = async () => {
  try {
    const res = await pageActivity({ current: 1, size: 3, status: 1 })
    if (res.code === '0' || res.code === 200 || !res.code) {
      const data = res.data || res
      activityItems.value = data.records || []
    }
  } catch (error) {
    console.error('获取活动资讯失败', error)
  }
}

// 获取教育培训（媒体关注和文化讲堂）
const getEducationItems = async () => {
  try {
    // 媒体关注 (sourceType=1)
    const mediaRes = await getMediaPageAPI({ current: 1, size: 2, sourceType: 1 })
    // 文化讲堂 (sourceType=2)
    const lectureRes = await getMediaPageAPI({ current: 1, size: 1, sourceType: 2 })
    
    let items = []
    if (mediaRes.code === '0' || mediaRes.code === 200) {
      items = [...items, ...(mediaRes.data.records || [])]
    }
    if (lectureRes.code === '0' || lectureRes.code === 200) {
      items = [...items, ...(lectureRes.data.records || [])]
    }
    
    // 取前3个
    educationItems.value = items.slice(0, 3)
  } catch (error) {
    console.error('获取教育培训失败', error)
  }
}

onMounted(() => {
  getBanners()
  getHeritageItems()
  getActivityItems()
  getEducationItems()
})
</script>

<template>
  <!-- 轮播图 -->
  <div class="carousel">
    <el-carousel v-if="banners.length > 0">
      <el-carousel-item v-for="item in banners" :key="item.id">
        <img :src="item.imageUrl" />
      </el-carousel-item>
    </el-carousel>
    <el-carousel v-else>
      <el-carousel-item v-for="item in 3" :key="item">
        <img src="@/assets/image/layout.jpg" />
      </el-carousel-item>
    </el-carousel>
    <div class="curtain"></div>
  </div>
  <div class="container">
    <!-- 非遗展示 -->
    <div class="heritage">
      <h2>非遗展示</h2>
      <HerItem :items="heritageItems" />
    </div>

    <!-- 3D虚拟展厅 -->
    <div class="virtual">
      <h2>3D虚拟展厅</h2>
      <VirItem />
    </div>

    <!-- 活动资讯 -->
    <div class="activity">
      <h2>活动资讯</h2>
      <ActItem :items="activityItems" />
    </div>

    <!-- 教育培训 -->
    <div class="education">
      <h2>教育培训</h2>
      <EduItem :list="educationItems" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.carousel {
  width: 100vw;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  border-radius: 5px;

  .el-carousel {
    width: 100%;
    height: 55vh;
    background-repeat: no-repeat;
    background-size: cover;

    :deep(.el-carousel__item) {
      height: 55vh;
    }

    img {
      // display: block;
      width: 100%;
      height: 55vh;
    }
  }

  .curtain {
    width: 100%;
    height: 15%;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
}

.container {
  width: 70vw;
  max-width: 1400px;
  margin: 0 auto;

  h2 {
    text-align: center;
  }

  .heritage {
    height: 52vh;
    border-radius: 5px;
    margin-top: 2%;
    padding-top: 1vh;
    background-color: #e7eef7;
  }

  .virtual {
    height: 65vh;
    border-radius: 5px;
    padding-top: 1vh;
    box-shadow: 0px 0px 1px 1px rgb(50, 67, 78);
    background-color: #7c2c2e;
  }

  .activity {
    height: 52vh;
    border-radius: 5px;
    padding-top: 1vh;
    background-color: #e7eef7;
  }

  .education {
    height: 52vh;
    border-radius: 5px;
    padding-top: 1vh;
    background-color: #852326;
  }
}
</style>
