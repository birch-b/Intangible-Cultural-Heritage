<script setup>
import { ref, onMounted } from 'vue'
import MessageCard from '@/components/User/MessageCard.vue'
import { pageNotice } from '@/api/notice.js'

const msgList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(5)

const getNoticeList = async () => {
  try {
    const res = await pageNotice({
      page: currentPage.value,
      pageSize: pageSize.value
    })
    console.log('Notice List Response:', res)

    // 优先尝试从 res.data 获取，如果不行则尝试直接从 res 获取
    if (res.data && res.data.records) {
      msgList.value = res.data.records
      total.value = parseInt(res.data.total) || 0
    } else if (res.records) {
      msgList.value = res.records
      total.value = parseInt(res.total) || 0
    } else {
      msgList.value = []
      total.value = 0
    }
  } catch (e) {
    console.error('Get notice list failed', e)
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  getNoticeList()
}
const handleCurrentChange = (val) => {
  currentPage.value = val
  getNoticeList()
}

onMounted(() => {
  getNoticeList()
})
</script>

<!-- 消息通知 -->
<template>
  <div class="CollectionItems">
    <el-container>
      <el-header height="10vh">
        <div class="topic">
          <h2><i class="iconfont icon-xiaoxitongzhi"></i>消息通知</h2>
        </div>
      </el-header>
      <el-main
        ><div class="main">
          <MessageCard
            v-for="item in msgList"
            :key="item.id"
            :info="item"
          ></MessageCard></div
      ></el-main>
      <el-footer>
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[5, 10, 20]"
            size="large"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/var.scss' as *;
.el-header {
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.topic {
  width: 80vw;
  // background-color: blue;
  h2 {
    border-bottom: 5px solid $logintextColor;
    i {
      padding-left: 1vw;
      font-size: 25px;
      margin-right: 1vw;
    }
    color: $logintextColor;
    font-size: 25px;
    padding-bottom: 1vh;
  }
}

.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 75vh;
}

.el-footer {
  display: flex;
  justify-content: center;
}
</style>
