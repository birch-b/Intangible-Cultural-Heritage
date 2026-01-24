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
  <div class="act">
    <div 
      class="actItem" 
      v-for="item in items" 
      :key="item.id"
      @click="goToDetail(item.id)"
      style="cursor: pointer;"
    >
      <img :src="item.coverImage || '@/assets/image/layout.jpg'" />
      <h4>{{ item.title }}</h4>
    </div>
    <div v-if="items.length === 0" style="width: 100%; text-align: center; color: #999;">
      暂无相关活动
    </div>
  </div>
</template>

<style scoped lang="scss">
.act {
  width: 100%;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 20px;
  // padding: 20px;

  .actItem {
    width: 22%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 20px;
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 5px;
    }

    h4 {
      width: 100%;
      height: auto;
      font-size: 14px;
      margin-top: 10px;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
}
</style>
