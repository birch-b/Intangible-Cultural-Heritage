<script setup>
import { ref } from 'vue'
import MessageCard from '@/components/User/MessageCard.vue'
const onePage = ref(5)
const handleSizeChange = (val) => {
  onePage.value = val
}
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`)
}
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
          <MessageCard v-for="index in onePage" :key="index"></MessageCard></div
      ></el-main>
      <el-footer>
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage4"
            v-model:page-size="pageSize4"
            :page-sizes="[1, 2, 3, 4, 5]"
            size="large"
            :disabled="disabled"
            background="false"
            layout="total, sizes, prev, pager, next, jumper"
            :total="100"
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
