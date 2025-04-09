<script setup>
import { ref } from 'vue'
import CollectCard from '@/components/User/CollectCard.vue'
const onePage = ref(9)
const handleSizeChange = (val) => {
  onePage.value = val
}
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`)
}
</script>

<!-- 收藏项目 -->
<template>
  <div class="CollectionItems">
    <el-container>
      <el-header height="10vh">
        <div class="topic">
          <h2><i class="iconfont icon-icon_collect"></i>收藏项目</h2>
        </div>
      </el-header>
      <el-main>
        <div class="container">
          <div class="card" v-for="item in onePage" :key="item">
            <CollectCard></CollectCard>
          </div>
        </div>
      </el-main>
      <el-footer>
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage4"
            v-model:page-size="pageSize4"
            :page-sizes="[4, 6, 8, 10, 12]"
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

.el-main {
  padding: 0 3vw;
  .container {
    width: 100%;
    height: 75vh;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(2, 1fr);
    align-items: center;
    grid-gap: 2%;
  }
}

.el-footer {
  padding-top: 1vh;
  display: flex;
  justify-content: center;
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
</style>
