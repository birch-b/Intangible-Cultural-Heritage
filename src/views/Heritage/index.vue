<script setup>
import ExpItem from './components/ExpItem.vue'
import ChoItem from './components/ChoItem.vue'
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
      <h2>探索广东非遗</h2>
      <p @click="$router.push('/heri_category')">查看全部></p>
      <ExpItem />
    </div>
    <div class="choiceness">
      <h2>精选非遗项目</h2>
      <ChoItem />
    </div>
  </div>
</template>

<style scoped lang="scss">
.carousel {
  width: 100vw;
  // height: 120vh;
  margin: 5vh auto;
  overflow: hidden;
  position: relative;

  .el-carousel {
    width: 80%;
    height: 50vh;
    border-radius: 10px;
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
    width: 80%;
    height: 15%;
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
  height: 105vh;
  margin: 0 auto;
  background-color: #e7eef7;

  h2 {
    color: #2b3543;
    font-weight: normal;
  }

  .explore {
    width: 80%;
    height: 44%;
    padding: 0.5vh 0;
    border-bottom: 2px solid #cccccc;
    margin: 0 auto;
    position: relative;

    p {
      position: absolute;
      // 鼠标
      cursor: pointer;
      right: 0;
      top: 3vh;
    }
  }

  .choiceness {
    width: 80%;
    height: 54%;
    margin: 0 auto;
  }
}
</style>
