<script setup></script>

<template>
  <div class="edu_content">
    <div class="edu_item" v-for="item of 3" :key="item">
      <img src="@/assets/image/layout.jpg" />
      <div class="text">
        <h3>非遗文化进校园</h3>
        <p>邀请非遗传承人走进校园，韦玄生带来生动有趣的非遗文化课程</p>
        <a src="" style="font-size: 1.2vh">
          <el-icon>
            <Grid />
          </el-icon>
          查看安排
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.edu_content {
  width: 95%;
  height: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .edu_item {
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
      // background-color: #852326;
      border-radius: 5px 5px 0 0;
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
