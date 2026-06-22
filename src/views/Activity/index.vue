<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ExpItem from './components/expItem.vue'
import ActItem from './components/actItem.vue'
import { pageActivity } from '@/api/heritageActivity'

const router = useRouter()
const newsList = ref([])
const activityList = ref([])
const loading = ref(false)
const errorMessage = ref('')

const getActivities = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const res = await pageActivity({ current: 1, size: 6, status: 1 })

    if (res.code === '0' || res.code === 200 || !res.code) {
      const list = res?.data?.records || []
      newsList.value = list
      activityList.value = list.slice(0, 4)
      return
    }

    newsList.value = []
    activityList.value = []
    errorMessage.value = res.message || '活动数据加载失败，请稍后重试'
  } catch (error) {
    console.error('获取活动数据失败', error)
    newsList.value = []
    activityList.value = []
    errorMessage.value = '活动数据加载失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const goToCategory = () => {
  router.push('/act_category')
}

onMounted(() => {
  getActivities()
})
</script>

<template>
  <div class="carousel">
    <el-carousel>
      <el-carousel-item v-for="item in 3" :key="item">
        <img src="@/assets/image/layout.jpg" />
      </el-carousel-item>
    </el-carousel>
    <div class="curtain"></div>
  </div>
  <div class="container">
    <div v-if="loading" class="status-wrap">
      <el-skeleton :rows="6" animated />
    </div>
    <div v-else-if="errorMessage" class="status-wrap">
      <el-alert
        :title="errorMessage"
        type="error"
        show-icon
        :closable="false"
      />
    </div>
    <template v-else>
      <div class="explore">
        <h2>非遗要闻</h2>
        <p @click="goToCategory" style="cursor: pointer">查看全部></p>
        <ExpItem :items="newsList" />
      </div>
      <div class="choiceness">
        <h2>相关活动</h2>
        <ActItem :items="activityList" />
      </div>
    </template>
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
  }

  .explore {
    width: 80%;
    height: 47%;
    padding: 0.5vh 0;
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

  .status-wrap {
    width: 80%;
    margin: 30px auto 0;
  }
}
</style>
