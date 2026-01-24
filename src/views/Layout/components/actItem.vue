<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

const router = useRouter()

const goToDetail = (id) => {
  router.push(`/act_detail?id=${id}`)
}
</script>

<template>
  <div class="act_content">
    <div class="act_item" v-for="item in items" :key="item.id">
      <img :src="item.coverImage || '@/assets/image/layout.jpg'" />
      <div class="text">
        <h3>{{ item.title }}</h3>
        <p>
          {{ item.description }}
        </p>
        <span style="font-size: 1.2vh; display: flex; align-items: center; gap: 4px;">
          <el-icon>
            <Calendar />
          </el-icon>
          {{ item.activityTime }}
          <span style="margin-left: auto; color: #0062ff; cursor: pointer;" @click="goToDetail(item.id)">详情</span>
        </span>
      </div>
    </div>
    <div v-if="items.length === 0" class="empty-text">暂无相关活动</div>
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
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    img {
      width: 100%;
      height: 58%;
      border-radius: 8px 8px 0 0;
      object-fit: cover;
    }

    .text {
      width: 92%;
      height: 35%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      // align-items: center;
      // flex-wrap: wrap;

      h3 {
        margin: 0;
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      p {
        color: #7e858f;
        margin: 0;
        font-size: 14px;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
}

.empty-text {
  width: 100%;
  text-align: center;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
