<template>
  <div class="cards">
    <el-card style="width: 100%; height: 40vh" shadow="hover">
      <template #header>
        <div style="font-weight: 700; height: 1vh; font-size: 17px">
          广州刺绣
        </div></template
      >
      <img
        src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
        style="width: auto"
      />
      <template #footer>
        <div class="footer">2024-1-1收藏</div>
      </template>
    </el-card>
  </div>
</template>

<script></script>

<style lang="scss" scoped>
.footer {
  color: grey;
  height: 1vh;
}
.cards:hover {
  cursor: pointer;
}
</style>
