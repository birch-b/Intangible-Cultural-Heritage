<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

const router = useRouter()

const goToCategory = (id) => {
  router.push({
    path: '/heri_category',
    query: { categoryId: id }
  })
}
</script>

<template>
  <div class="exp_content">
    <div class="exp_item" v-for="item in items" :key="item.id">
      <img :src="item.icon || '@/assets/image/layout.jpg'" />
      <div class="text">
        <h3>{{ item.name }}</h3>
        <p>
          {{ item.description || '暂无简介' }}
        </p>
        <span>
          <span @click="goToCategory(item.id)">查看该类</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.exp_content {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 20px;
  width: 100%;
  padding: 10px 0;

  .exp_item {
    width: calc((100% - 60px) / 4);
    height: auto;
    margin-bottom: 20px;
    background-color: #fff;
    overflow: hidden;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .text {
      width: 100%;
      height: auto;
      padding: 15px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background-color: #fff;

      h3 {
        width: 100%;
        font-size: 16px;
        font-weight: 600;
        margin: 0;
        line-height: 1.4;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      p {
        width: 100%;
        font-size: 14px;
        color: #666;
        line-height: 1.5;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 42px;
      }

      span {
        font-size: 14px;
        font-weight: 500;
        color: #b38765;
        cursor: pointer;
        text-align: right;
        margin-top: 5px;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
