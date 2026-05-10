<script setup>
import { ref, onMounted } from 'vue'
import ExpItem from './components/expItem.vue'
import ChoItem from './components/choItem.vue'
import { getHeritagePageAPI, getCategoryListAPI } from '@/api/heritage'
import { getBannerListAPI } from '@/api/banner'

const exploreItems = ref([])
const featuredItems = ref([])
const banners = ref([])

// 获取轮播图
const getBanners = async () => {
  try {
    const res = await getBannerListAPI('HERITAGE')
    banners.value = res.filter(item => item.status === '启用').sort((a, b) => a.sort - b.sort)
  } catch (error) {
    console.error('获取轮播图失败', error)
  }
}

// 获取探索非遗（获取前4个分类）
const getExploreItems = async () => {
  try {
    const res = await getCategoryListAPI()
    if (res.code === '0' || res.code === 200 || !res.code) {
      const data = res.data || res
      // 截取前4个分类
      exploreItems.value = (data || []).slice(0, 4)
    }
  } catch (error) {
    console.error('获取探索非遗分类失败', error)
  }
}

// 获取精选非遗
const getFeaturedItems = async () => {
  try {
    const res = await getHeritagePageAPI({ 
      current: 1, 
      size: 4, 
      isFeatured: 1, 
      status: 2 
    })
    if (res.code === '0' || res.code === 200 || !res.code) {
      const data = res.data || res
      // 前端二次过滤，确保只显示精选项目（兼容数字1和字符串'1'）
      const records = data.records || []
      featuredItems.value = records.filter(item => item.isFeatured == 1)
    }
  } catch (error) {
    console.error('获取精选非遗失败', error)
  }
}

onMounted(() => {
  getExploreItems()
  getFeaturedItems()
  getBanners()
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
    <div class="explore">
      <h2>探索广东非遗</h2>
      <p @click="$router.push('/heri_category')">查看全部></p>
      <ExpItem :items="exploreItems" />
    </div>
    <div class="choiceness">
      <h2>精选非遗项目</h2>
      <ChoItem :items="featuredItems" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.carousel {
  width: 100vw;
  // height: 120vh;
  margin: 5vh auto;
  overflow: hidden;
  position: relative;

  .el-carousel {
    width: 80%;
    height: 50vh;
    border-radius: 10px;
    margin: 0 auto;
    background-repeat: no-repeat;
    background-size: cover;

    :deep(.el-carousel__item) {
      height: 50vh;
    }

    img {
      // display: block;
      width: 100%;
      height: 50vh;
    }
  }

  .curtain {
    width: 80%;
    height: 15%;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.4);
  }
}

.container {
  width: 100vw;
  height: auto;
  min-height: 100vh;
  margin: 0 auto;
  padding-bottom: 50px;
  background-color: #e7eef7;

  h2 {
    color: #2b3543;
    font-weight: normal;
    margin-bottom: 20px;
  }

  .explore {
    width: 80%;
    height: auto;
    padding: 20px 0 40px 0;
    border-bottom: 2px solid #cccccc;
    margin: 0 auto 30px auto;
    position: relative;

    p {
      position: absolute;
      // 鼠标
      cursor: pointer;
      right: 0;
      top: 25px;
    }
  }

  .choiceness {
    width: 80%;
    height: auto;
    margin: 0 auto;
  }
}
</style>
