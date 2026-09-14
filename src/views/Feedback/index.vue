<script setup>
import UserFeed from './components/userFeed.vue'
</script>

<template>
  <div class="container">
    <UserFeed />
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  /* 用 min-height 而非固定高度，避免内容变长时被裁切 */
  min-height: 90vh;
  background-color: #e7eef7;
}
</style>
