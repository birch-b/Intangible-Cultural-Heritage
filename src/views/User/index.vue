<script setup>
import SelectCard from '@/components/User/SelectCard.vue'
</script>

<template>
  <div class="user">
    <el-container>
      <el-aside width="15vw">
        <div class="top"><h2>个人中心</h2></div>
        <div class="cards">
          <SelectCard></SelectCard>
        </div>
      </el-aside>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/var.scss' as *;
* {
  background-color: transparent;
  .user {
    width: 100vw;
    height: 100vh;
    .el-main,
    .el-aside {
      height: 100vh;
    }
    .el-aside {
      background-color: $logintextColor;
      .top {
        text-align: center;
        color: white;
      }
      .cards {
        margin-top: 3vh;
      }
    }
    .el-main {
      background-color: $loginbgColor;
    }
  }
}
</style>
