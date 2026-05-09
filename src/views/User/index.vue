<script setup>
import { useRouter } from 'vue-router'
import SelectCard from '@/components/User/SelectCard.vue'

const router = useRouter()

const goHome = () => {
  router.push('/home')
}
</script>

<template>
  <div class="user">
    <el-container>
      <el-aside width="15vw">
        <div class="home-btn">
          <el-button
            icon="House"
            plain
            @click="goHome"
            style="width: 12vw; color: white; border-color: white"
          >
            返回首页
          </el-button>
        </div>
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
      .home-btn {
        text-align: center;
        padding-top: 2vh;
        margin-bottom: 1vh;
        .el-button {
          &:hover {
            background-color: rgba(255, 255, 255, 0.2);
          }
        }
      }
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
