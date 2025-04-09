<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
</script>

<template>
  <div class="container">
    <div class="tab">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/heritage' }">
          非遗展示
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/heritage' }">
          精选非遗项目
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/heri_detail' }">
          项目详情
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="de_content">
      <div class="left_image"></div>
      <div class="right_text"></div>
    </div>
  </div>
</template>

<style scope lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  background-color: #88393c;

  .tab {
    width: 100%;
    height: 8vh;
    position: relative;
    background-color: rgba(0, 0, 0, 0.15);

    .el-breadcrumb {
      margin: 3vh 5vw;
      font-size: larger;
      z-index: 10;

      .el-breadcrumb__inner.is-link {
        color: #ddcbcb;
      }
    }
  }

  .de_content {
    width: 75%;
    height: 80%;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background-color: #d8cfd0;

    .left_image {
      width: 60%;
      height: 100%;
      background-color: #8b6364;
    }

    .right_text {
      width: 39%;
      height: 100%;
      background-color: #5f4d4f;
    }
  }
}
</style>
