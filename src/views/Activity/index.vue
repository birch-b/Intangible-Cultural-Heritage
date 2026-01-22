<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ExpItem from './components/ExpItem.vue'
import ActItem from './components/ActItem.vue'
import { pageActivity } from '@/api/heritageActivity'

const router = useRouter()
const newsList = ref([])
const activityList = ref([])

// 获取活动数据
const getActivities = async () => {
  try {
    // 获取最新6条，不区分类型，状态为已发布
    const res = await pageActivity({ current: 1, size: 6, status: 1 })
    if (res.code === '0' || res.code === 200 || !res.code) {
      const list = res.data?.records || []
      newsList.value = list // 非遗要闻用完整列表
      activityList.value = list.slice(0, 4) // 相关活动取前4条
    }
  } catch (error) {
    console.error('获取活动失败', error)
  }
}

// 跳转到全部分类
const goToCategory = () => {
  router.push('/act_category')
}

onMounted(() => {
  getActivities()
})
</script>

<template>
  <!-- 轮播图 -->
  <div class="carousel">
    <el-carousel>
      <el-carousel-item v-for="item in 3" :key="item">
        <img src="@/assets/image/layout.jpg" />
      </el-carousel-item>
    </el-carousel>
    <div class="curtain"></div>
  </div>
  <div class="container">
    <div class="explore">
      <h2>非遗要闻</h2>
      <p @click="goToCategory" style="cursor: pointer;">查看全部></p>
      <!-- 传递数据给子组件 -->
      <ExpItem :items="newsList" />
    </div>
    <div class="choiceness">
      <h2>相关活动</h2>
      <ActItem :items="activityList" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.carousel {
  overflow: hidden;
  position: relative;

  .el-carousel {
    width: 100%;
    height: 50vh;
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
    width: 100%;
    height: 20%;
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
  height: 95vh;
  margin: 0 auto;
  background-color: #e7eef7;

  h2 {
    color: #2b3543;
    // font-weight: normal;
  }

  .explore {
    width: 80%;
    height: 47%;
    padding: 0.5vh 0;
    // border-bottom: 2px solid #cccccc;
    margin: 0 auto;
    position: relative;

    p {
      position: absolute;
      right: 0;
      top: 3vh;
    }
  }

  .choiceness {
    width: 80%;
    height: 50%;
    margin: 0 auto;
  }
}
</style>
