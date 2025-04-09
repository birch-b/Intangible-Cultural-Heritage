<script setup>
import HerItem from './HerItem.vue'
import VirItem from './VirItem.vue'
import ActItem from './ActItem.vue'
import EduItem from './EduItem.vue'
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
    <!-- 非遗展示 -->
    <div class="heritage">
      <h2>非遗展示</h2>
      <HerItem />
    </div>

    <!-- 3D虚拟展厅 -->
    <div class="virtual">
      <h2>3D虚拟展厅</h2>
      <VirItem />
    </div>

    <!-- 活动资讯 -->
    <div class="activity">
      <h2>活动资讯</h2>
      <ActItem />
    </div>

    <!-- 教育培训 -->
    <div class="education">
      <h2>教育培训</h2>
      <EduItem />
    </div>
  </div>
</template>

<style scoped lang="scss">
.carousel {
  width: 100vw;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  border-radius: 5px;

  .el-carousel {
    width: 100%;
    height: 55vh;
    background-repeat: no-repeat;
    background-size: cover;

    :deep(.el-carousel__item) {
      height: 55vh;
    }

    img {
      // display: block;
      width: 100%;
      height: 55vh;
    }
  }

  .curtain {
    width: 100%;
    height: 15%;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
}

.container {
  width: 70vw;
  max-width: 1400px;
  margin: 0 auto;

  h2 {
    text-align: center;
  }

  .heritage {
    height: 52vh;
    border-radius: 5px;
    margin-top: 2%;
    padding-top: 1vh;
    background-color: #e7eef7;
  }

  .virtual {
    height: 65vh;
    border-radius: 5px;
    padding-top: 1vh;
    box-shadow: 0px 0px 1px 1px rgb(50, 67, 78);
    background-color: #7c2c2e;
  }

  .activity {
    height: 52vh;
    border-radius: 5px;
    padding-top: 1vh;
    background-color: #e7eef7;
  }

  .education {
    height: 52vh;
    border-radius: 5px;
    padding-top: 1vh;
    background-color: #852326;
  }
}
</style>
