<script setup></script>

<template>
  <div class="exp_content">
    <div class="exp_item" v-for="item of 4" :key="item">
      <img src="@/assets/image/layout.jpg" />
      <div class="text">
        <h3>传统技艺</h3>
        <p>包括广绣、广式家具制作等</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.exp_content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .exp_item {
    width: 23%;
    height: 35vh;
    margin: 1vh 0;
    background-color: #fff;
    overflow: hidden;
    border-radius: 8px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    img {
      width: 100%;
      height: 24vh;
    }

    .text {
      width: 100%;
      height: 11vh;
      padding: 0 1vw;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      background-color: #fff;

      p {
        width: 100%;
        display: block;
        height: 3em;
        display: -webkit-box;
        /* 使用弹性盒子布局 */
        -webkit-line-clamp: 2;
        /* 限制为两行 */
        -webkit-box-orient: vertical;
        /* 设置盒子内的元素排列方向 */
        // 省略号
        overflow: hidden;
        text-overflow: ellipsis;
        color: #9799a0;
        font-weight: 500;
      }
    }
  }
}
</style>
