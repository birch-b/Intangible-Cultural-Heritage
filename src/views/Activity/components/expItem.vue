<script setup></script>

<template>
  <div class="exp">
    <div class="expItem" v-for="item of 6" :key="item">
      <p class="title">2025广东非遗文化演讲大赛昨日开赛！！！</p>
      <p class="time">2025-03-09</p>
    </div>
  </div>
</template>

<style scope lang="scss">
.exp {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 85%;
  border-bottom: 1px solid #b38765;
  // background-color: #fff;

  .expItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 15%;
    // background-color: #fff;

    .title {
      width: 60%;
      height: 1.5vh;
      text-indent: 1em;
      font-size: 1.5vh;
      line-height: 1.6vh;
      display: block;
    }

    .time {
      width: 8%;
      height: 1.2vh;
      font-size: 1.2vh;
      line-height: 1.2vh;
      display: block;
    }
  }
}
</style>
