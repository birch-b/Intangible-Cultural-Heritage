<script setup></script>

<template>
  <div class="vir_content">
    <img src="@/assets/image/layout.jpg" />
    <div class="vir_text">
      <h2>沉浸式体验广东非遗文化</h2>
      <p>
        通过先进的3D技术，足不出户即可360度全方位欣赏广东非物质文化遗产的精髓
      </p>
      <el-button type="primary">进入虚拟展厅</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vir_content {
  width: 95%;
  height: 86%;
  margin: 0 auto;
  border-radius: 5px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: #ffffff;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  img {
    width: 100%;
    height: 66%;
    border-radius: 5px;
  }

  .vir_text {
    width: 50%;
    height: 34%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    p {
      color: #7e858f;
    }

    .el-button {
      width: 25%;
      height: 25%;
      border-radius: 5px;
      background-color: #4f46e5;
    }
  }
}
</style>
