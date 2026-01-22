<template>
  <div class="cards" @click="goDetail">
    <el-card style="width: 100%; height: 40vh" shadow="hover">
      <template #header>
        <div style="font-weight: 700; height: 3vh; font-size: 17px" class="truncate">
          {{ item.title }}
        </div></template
      >
      <img
        :src="item.coverImage || 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'"
        style="width: 100%; height: 20vh; object-fit: cover;"
      />
      <template #footer>
        <div class="footer">{{ item.categoryName || '非遗项目' }}</div>
      </template>
    </el-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
})

const router = useRouter()

const goDetail = () => {
  if (props.item.id) {
    router.push(`/heri_detail?id=${props.item.id}`)
  }
}
</script>

<style lang="scss" scoped>
.footer {
  color: grey;
  height: 1vh;
}
.cards:hover {
  cursor: pointer;
}
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
