<script setup></script>

<template>
  <div class="act_content">
    <div class="act_item" v-for="item of 3" :key="item">
      <img src="@/assets/image/layout.jpg" />
      <div class="text">
        <h3>2024广东非遗文化节</h3>
        <p>
          一年一度的广东非遗文化盛会，汇聚全省各地非遗传承人，为观众呈现了丰富多样的非遗文化
        </p>
        <span style="font-size: 1.2vh">
          <el-icon>
            <Calendar />
          </el-icon>
          2024年9月15日-9月21日
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.act_content {
  width: 95%;
  height: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .act_item {
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
