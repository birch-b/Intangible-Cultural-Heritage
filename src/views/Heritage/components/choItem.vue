<script setup></script>

<template>
  <div class="exp_content">
    <div class="exp_item" v-for="item of 4" :key="item">
      <img src="@/assets/image/layout.jpg" />
      <div class="text">
        <h3>粤剧</h3>
        <p>
          按实际开发和凯撒客户尽快按返回键回复可见瓦活佛金飞达我离开家离回复可见瓦活佛金飞达我离开家离开
        </p>
        <span>
          <span @click="$router.push('/heri_detail')">查看详情</span>
          <el-icon>
            <Star />
          </el-icon>
        </span>
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
    height: 40vh;
    margin: 1vh 0;
    background-color: #fff;
    overflow: hidden;
    border-radius: 8px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    img {
      width: 100%;
      height: 23vh;
    }

    .text {
      width: 100%;
      height: 14vh;
      padding: 0 1vw;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      background-color: #fff;

      h3 {
        width: 100%;
        height: 2vh;
        font-weight: 600;
      }

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

      span {
        font-weight: 500;
        width: 100%;
        position: relative;
        // 鼠标
        cursor: pointer;

        .el-icon {
          position: absolute;
          right: 0;
        }
      }
    }
  }
}
</style>
