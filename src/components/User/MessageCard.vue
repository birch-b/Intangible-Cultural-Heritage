<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const navigater = () => {
  router.push('detail')
}
</script>
<template>
  <div class="MessageCard" @click="navigater">
    <div class="left">
      <h3>亲爱的用户,你好</h3>
      <p>2024/11/7 12:00</p>
    </div>
    <div class="right">未读</div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/var.scss' as *;
.MessageCard {
  transition: all 0.5s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 52vw;
  height: 13vh;
  margin-bottom: 1vh;
  padding: 2vw;
  border-radius: 1vw;
  background-color: $logintextColor;
  color: white;
  h3 {
    margin-bottom: 1vh;
  }
}
.MessageCard:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
</style>
