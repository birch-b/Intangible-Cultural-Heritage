<script setup>
import CardItem from './components/CardItem.vue'
</script>

<template>
  <div class="container">
    <div class="son_module">
      <div class="title">
        <h2>文物视频</h2>
      </div>
      <CardItem />
    </div>
    <div class="son_module">
      <div class="title">
        <h2>媒体关注</h2>
      </div>
      <CardItem />
    </div>
    <div class="son_module">
      <div class="title">
        <h2>文化讲堂</h2>
      </div>
      <CardItem />
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
