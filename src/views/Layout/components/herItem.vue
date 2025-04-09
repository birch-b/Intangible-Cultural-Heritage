<script setup></script>

<template>
  <div class="her_content">
    <div class="her_item" v-for="item of 3" :key="item">
      <img src="@/assets/image/layout.jpg" />
      <div class="text">
        <h3>广彩瓷器</h3>
        <p>
          广彩瓷器以其绚丽多彩的釉上彩绘著称，展现了广东工匠的高超技艺和独特审美
        </p>
        <a href="" style="color: #0062ff">了解更多</a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.her_content {
  width: 95%;
  height: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .her_item {
    width: 32%;
    height: 95%;
    border-radius: 5px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 2vh;

    img {
      width: 100%;
      height: 58%;
      border-radius: 8px 8px 0 0;
    }

    .text {
      width: 92%;
      height: 35%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;

      p {
        color: #7e858f;
      }
    }
  }
}
</style>
