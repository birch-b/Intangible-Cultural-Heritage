<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { markAsRead, deleteNotice } from '@/api/notice.js'
import { formatTime } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const { id = '', title = '', content = '', createTime = '' } = route.query || {}

// 删除请求进行中（防止重复点击）
const deleting = ref(false)

const goBackToNotice = () => {
  router.push('/user/MessageNotification')
}

// 删除消息（后端 DELETE /api/admin/v1/notice/{id}，逻辑删除，仅本人可删）
const handleDelete = async () => {
  if (!id) {
    ElMessage.warning('消息ID缺失，无法删除')
    return
  }
  try {
    await ElMessageBox.confirm(
      '确定要删除这条消息吗？删除后不可恢复。',
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
  } catch {
    // 用户取消
    return
  }

  deleting.value = true
  try {
    const res = await deleteNotice(id)
    // 兼容 { code: '0' | 200 } 与无 code 的返回格式
    if (res && res.code !== undefined && res.code !== '0' && res.code !== 200) {
      ElMessage.error(res.message || '删除失败')
      return
    }
    ElMessage.success('删除成功')
    // 用 replace 避免返回时回到已删除的详情页
    router.replace('/user/MessageNotification')
  } catch (error) {
    console.error('删除消息失败', error)
    ElMessage.error('删除失败，请稍后重试')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  if (id) {
    markAsRead(id).catch((e) => {
      console.error('Mark as read failed:', e)
    })
  }
})
</script>

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
            <el-avatar>系</el-avatar>
            <div class="name">
              <h4>{{ title || '系统通知' }}</h4>
              <p>{{ formatTime(createTime) }}</p>
            </div>
          </div>
          <div class="content">
            <el-scrollbar max-height="65vh" style="padding-top: 2vh">{{
              content
            }}</el-scrollbar>
          </div>
          <div class="footer">
            <el-button text type="primary" @click="goBackToNotice">
              返回消息通知
            </el-button>
            <div
              class="delete"
              :class="{ 'is-deleting': deleting }"
              @click="deleting ? null : handleDelete()"
            >
              <i class="iconfont icon-shanchu" style="margin-right: 0.5vw"></i
              >{{ deleting ? '删除中…' : '删除' }}
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

  h2 {
    border-bottom: 5px solid $logintextColor;
    color: $logintextColor;
    font-size: 25px;
    padding-bottom: 1vh;

    i {
      padding-left: 1vw;
      font-size: 25px;
      margin-right: 1vw;
    }
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

        &:hover {
          cursor: pointer;
          color: red;
        }

        &.is-deleting {
          cursor: not-allowed;
          color: #c0c4cc;

          &:hover {
            cursor: not-allowed;
            color: #c0c4cc;
          }
        }
      }
    }
  }
}
</style>
