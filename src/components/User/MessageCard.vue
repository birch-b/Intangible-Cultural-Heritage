<script setup>
import { useRouter } from 'vue-router'
import { formatTime } from '@/utils/format'
const router = useRouter()
const props = defineProps({
  info: {
    type: Object,
    default: () => ({})
  }
})

const navigater = () => {
  router.push({
    path: 'detail',
    query: {
      id: props.info.id,
      title: props.info.title,
      content: props.info.content,
      createTime: props.info.createTime
    }
  })
}
</script>
<template>
  <div class="MessageCard" @click="navigater">
    <div class="left">
      <h3>{{ info.title || '系统通知' }}</h3>
      <p>{{ formatTime(info.createTime) }}</p>
    </div>
    <div class="right" v-if="info.readStatus === 0">未读</div>
    <div class="right" v-else style="color: #e0e0e0">已读</div>
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
