<script setup>
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { markAsRead } from '@/api/notice.js'

const route = useRoute()
// 直接解构路由参数供模板使用
const { id, title, content, createTime } = route.query

onMounted(() => {
  if (id) {
    // 调用接口标记为已读
    markAsRead(id).catch(e => {
      console.error('Mark as read failed:', e)
    })
  }
})
</script>

<!-- 消息通知 -->
<template>
  <div class="CollectionItems">
    <el-container>
      <el-header height="10vh">
        <div class="topic">
          <h2><i class="iconfont icon-xiaoxitongzhi"></i>消息详情</h2>
        </div>
      </el-header>
      <el-main>
        <div class="main">
          <div class="topic">
            <el-avatar> 管 </el-avatar>
            <div class="name">
              <h4>{{ title || '系统通知' }}</h4>
              <p>{{ formatTime(createTime) }}</p>
            </div>
          </div>
          <div class="content">
            <el-scrollbar max-height="65vh" style="padding-top: 2vh"
              >{{ content }}</el-scrollbar
            >
          </div>
          <div class="footer">
            <div class="delete">
              <i class="iconfont icon-shanchu" style="margin-right: 0.5vw"></i
              >删除
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/var.scss' as *;
.el-header {
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.topic {
  width: 80vw;
  // background-color: blue;
  h2 {
    border-bottom: 5px solid $logintextColor;
    i {
      padding-left: 1vw;
      font-size: 25px;
      margin-right: 1vw;
    }
    color: $logintextColor;
    font-size: 25px;
    padding-bottom: 1vh;
  }
}

.el-main {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  .main {
    width: 70vw;
    height: 80vh;
    box-sizing: border-box;
    padding: 2vh 2vw;
    box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.2);
    .topic {
      display: flex;
      .name {
        margin-left: 1vw;
      }
    }
    .content {
      width: 100%;
      height: 65vh;
    }
    .footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 1.5vh;
      .delete {
        font-size: 16px;
        margin-right: 4vw;
        color: grey;
      }
      .delete:hover {
        cursor: pointer;
        color: red;
      }
    }
  }
}
</style>
