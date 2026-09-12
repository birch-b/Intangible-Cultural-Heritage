<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Calendar, Reading } from '@element-plus/icons-vue'

// Element Plus 图标映射（iconfont 中没有的图标走这里）
const elIcons = {
  Calendar,
  Reading
}

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

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
    icon: '',
    elIcon: 'Calendar',
    text: '我的活动',
    name: 'user/MyActivities',
    istrue: false
  },
  {
    icon: '',
    elIcon: 'Reading',
    text: '我的学习',
    name: 'user/MyLearning',
    istrue: false
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

const navigater = async (name, index) => {
  // 处理退出登录逻辑
  if (name === 'login') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      // 确认退出
      await userStore.logout()
      ElMessage.success('已退出登录')
      router.push('/login')
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      // 取消退出，不做任何操作
    }
    return
  }

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

// 检查权限
const checkPermission = (item) => {
  if (item.name === 'backmanage') {
    const role = userStore.userInfo?.role
    // 角色为1或2时显示
    return role == 1 || role == 2
  }
  return true
}
</script>
<template>
  <template v-for="(item, index) in lists" :key="index">
    <div
      v-if="checkPermission(item)"
      class="card"
      @click="navigater(item.name, index)"
      :class="{ active: item.istrue }"
    >
      <p>
        <el-icon v-if="item.elIcon" class="menu-el-icon">
          <component :is="elIcons[item.elIcon]" />
        </el-icon>
        <i v-else :class="`iconfont ${item.icon}`"></i>
        {{ item.text }}
      </p>
    </div>
  </template>
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
    .menu-el-icon {
      margin-right: 20px;
      vertical-align: middle;
    }
  }
}
.card:hover {
  background-color: rgb(186, 50, 50);
  cursor: pointer;
}
</style>
