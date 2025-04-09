<script setup></script>

<template>
  <div class="act">
    <div class="actItem" v-for="item of 4" :key="item">
      <img src="@/assets/image/layout.jpg" />
      <h4>2025广东非遗文化交流展演活动</h4>
    </div>
  </div>
</template>

<style scoped lang="scss">
.act {
  width: 100%;
  height: 85%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  // padding: 20px;

  .actItem {
    width: 22%;
    height: 85%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    img {
      width: 100%;
      height: 78%;
      border-radius: 5px;
    }

    h4 {
      width: 100%;
      height: 18%;
      font-size: 14px;
    }
  }
}
</style>
