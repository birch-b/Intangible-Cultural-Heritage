<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const lists = ref([
  {
    icon: 'icon-gerenziliao',
    text: '个人资料',
    name: 'user',
    istrue: true
  },
  {
    icon: 'icon-icon_collect',
    text: '收藏项目',
    name: 'user/CollectionItems',
    isture: false
  },
  {
    icon: 'icon-xiugaimima',
    text: '修改密码',
    name: 'user/ChangePassword',
    istrue: false
  },
  {
    icon: 'icon-xiaoxitongzhi',
    text: '消息通知',
    name: 'user/MessageNotification',
    istrue: false
  },
  {
    icon: 'icon-guanliyuanxitong',
    text: '管理员系统',
    name: 'backmanage'
  },
  {
    icon: 'icon-tuichudenglu',
    text: '退出登录',
    name: 'login'
  }
])
const navigater = (name, index) => {
  router.push(`/${name}`)
  for (let i = 0; i < lists.value.length; i++) {
    lists.value[i].istrue = false
  }
  lists.value[index].istrue = true
}
onMounted(() => {
  const currentPath = route.path
  lists.value = lists.value.map((item) => ({
    ...item,
    istrue: `/${item.name}` === currentPath
  }))
})
</script>
<template>
  <div
    v-for="(item, index) in lists"
    :key="index"
    class="card"
    @click="navigater(item.name, index)"
    :class="{ active: item.istrue }"
  >
    <p><i :class="`iconfont ${item.icon}`"></i>{{ item.text }}</p>
  </div>
</template>
<style lang="scss" scoped>
.active {
  background-color: rgb(186, 50, 50);
}
.card {
  width: 100%;
  height: 6vh;
  line-height: 6vh;
  padding-left: 2vw;
  transition: all 0.5s;
  // background-color: rgb(186, 50, 50);
  p {
    font-size: 16px;
    color: white;
    i {
      margin-right: 20px;
    }
  }
}
.card:hover {
  background-color: rgb(186, 50, 50);
  cursor: pointer;
}
</style>
