<script setup>
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

const router = useRouter()

const goToDetail = (id) => {
  router.push(`/act_detail?id=${id}`)
}

const formatDate = (time) => {
  return time ? dayjs(time).format('YYYY-MM-DD') : ''
}
</script>

<template>
  <div class="exp">
    <div
      class="expItem"
      v-for="item in items"
      :key="item.id"
      @click="goToDetail(item.id)"
      style="cursor: pointer"
    >
      <p class="title">{{ item.title }}</p>
      <p class="time">{{ formatDate(item.createTime) }}</p>
    </div>
    <!-- 占位符：如果没有数据显示空状态或骨架屏，这里简单处理 -->
    <div
      v-if="!items || items.length === 0"
      style="width: 100%; text-align: center; color: #999"
    >
      暂无非遗要闻
    </div>
  </div>
</template>

<style scope lang="scss">
.exp {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  height: auto;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #b38765;

  .expItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: auto;
    padding: 8px 0;
    transition: background-color 0.3s;

    &:hover {
      background-color: #f9f9f9;
    }

    .title {
      flex: 1;
      text-indent: 1em;
      font-size: 16px;
      line-height: 1.5;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .time {
      width: 100px;
      text-align: right;
      font-size: 14px;
      color: #999;
      flex-shrink: 0;
    }
  }
}
</style>
