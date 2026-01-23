<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CardItem from './components/CardItem.vue'
import { getProjectList, getNewsList, getLectureList } from '@/api/education'

const router = useRouter()

const projectList = ref([])
const newsList = ref([])
const lectureList = ref([])

const fetchData = async () => {
  try {
    // 获取非遗视听（项目）列表
    const projectRes = await getProjectList()
    if (projectRes.data && projectRes.data.records) {
      projectList.value = projectRes.data.records
    }

    // 获取媒体关注列表
    const newsRes = await getNewsList()
    if (newsRes.data && newsRes.data.records) {
      newsList.value = newsRes.data.records
    }

    // 获取文化讲堂列表
    const lectureRes = await getLectureList()
    if (lectureRes.data && lectureRes.data.records) {
      lectureList.value = lectureRes.data.records
    }
  } catch (error) {
    console.error('获取教育模块数据失败', error)
  }
}

const handleCardClick = (item, type) => {
  if (type === 'project') {
    // 跳转到资源详情页
    router.push(`/education/resource/${item.id}`)
  } else {
    // 其他类型暂时处理，例如打开链接或弹窗
    console.log('Clicked:', type, item)
    if (item.url) {
      window.open(item.url, '_blank')
    }
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="container">
    <div class="son_module">
      <div class="title">
        <h2>非遗视听</h2>
      </div>
      <CardItem :list="projectList" type="project" @click="handleCardClick" />
    </div>
    <div class="son_module">
      <div class="title">
        <h2>媒体关注</h2>
      </div>
      <CardItem :list="newsList" type="news" @click="handleCardClick" />
    </div>
    <div class="son_module">
      <div class="title">
        <h2>文化讲堂</h2>
      </div>
      <CardItem :list="lectureList" type="lecture" @click="handleCardClick" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 220vh;
  background-color: #e7eef7;

  .son_module {
    width: 85vw;
    height: 70vh;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    align-content: space-around;
    justify-content: space-around;
    // background-color: pink;

    .title {
      width: 80vw;
      text-align: center;
    }

    .img_container {
      width: 25vw;
      height: 26vh;
      border-radius: 10px;
      background-color: #fff;
    }
  }
}
</style>
