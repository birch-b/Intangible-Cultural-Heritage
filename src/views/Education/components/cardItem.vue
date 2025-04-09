<script setup></script>

<template>
  <div class="exp_content">
    <div class="exp_item" v-for="item of 6" :key="item">
      <img src="@/assets/image/layout.jpg" />
      <h3>木雕艺术--潮州木雕大师访谈</h3>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.exp_content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  .exp_item {
    width: 29%;
    height: 30vh;
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

    h3 {
      width: 100%;
      height: 6vh;
      text-indent: 1em;
      line-height: 6vh;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #000;
    }
  }
}
</style>
