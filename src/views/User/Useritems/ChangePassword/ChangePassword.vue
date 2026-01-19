<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { loginAPI, updateUserInfoAPI } from '@/api/user'

const userStore = useUserStore()
const router = useRouter()

const formLabelAlign = reactive({
  password: '',
  password1: '',
  changepassword: ''
})

const rules = reactive({
  password: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    {
      min: 6,
      max: 20,
      message: '密码长度应在 6 到 20 个字符之间',
      trigger: 'blur'
    }
  ],
  password1: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      min: 6,
      max: 20,
      message: '密码长度应在 6 到 20 个字符之间',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value === formLabelAlign.password) {
          callback(new Error('新密码不能与原密码相同'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  changepassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      min: 6,
      max: 20,
      message: '密码长度应在 6 到 20 个字符之间',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formLabelAlign.password1) {
          callback(new Error('两次输入的新密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 1. 验证原密码 (通过尝试登录)
        await loginAPI({
          username: userStore.userInfo.username,
          password: formLabelAlign.password
        })

        // 2. 原密码验证通过，提交新密码
        await updateUserInfoAPI({
          username: userStore.userInfo.username,
          password: formLabelAlign.password1
        })

        ElMessage.success('密码修改成功，请重新登录')

        // 3. 退出登录并跳转
        await userStore.logout()
        router.push('/login')
      } catch (error) {
        // 登录失败通常意味着原密码错误
        console.error(error)
        if (error.response && error.response.status === 401) {
          ElMessage.error('原密码错误，请重试')
        } else {
          // 其他错误由拦截器或默认处理，或者这里补充提示
          // 注意：如果 loginAPI 抛出的错误结构不同，需要适配
          // 假设 loginAPI 失败会抛出 error
        }
      }
    } else {
      ElMessage.error('请检查输入内容')
      return false
    }
  })
}

const formRef = ref(null)
</script>

<!-- 修改密码 -->
<template>
  <div class="CollectionItems">
    <el-container>
      <el-header height="10vh">
        <div class="topic">
          <h2><i class="iconfont icon-xiugaimima"></i>修改密码</h2>
        </div>
      </el-header>
      <el-main>
        <div class="main">
          <el-form
            ref="formRef"
            :label-position="labelPosition"
            label-width="auto"
            :model="formLabelAlign"
            :rules="rules"
            style="max-width: 600px"
          >
            <el-form-item
              class="line"
              label="原密码"
              prop="password"
              :label-position="itemLabelPosition"
            >
              <el-input
                v-model="formLabelAlign.password"
                type="password"
                show-password
                size="large"
              />
            </el-form-item>
            <el-form-item
              class="line"
              label="新密码"
              prop="password1"
              :label-position="itemLabelPosition"
            >
              <el-input
                v-model="formLabelAlign.password1"
                size="large"
                type="password"
                show-password
              />
            </el-form-item>
            <el-form-item
              class="line"
              label="确认新密码"
              prop="changepassword"
              :label-position="itemLabelPosition"
            >
              <el-input
                v-model="formLabelAlign.changepassword"
                size="large"
                type="password"
                show-password
              />
            </el-form-item>
          </el-form>
          <el-button color="rgb(170, 62, 62)" plain @click="handleSubmit"
            >提交</el-button
          >
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

:deep(.el-input) {
  width: 40vw;
}

.el-button {
  width: 5vw;
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

.main {
  margin-top: 10vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  .line {
    margin-bottom: 5vh;
    :deep(.el-form-item__label) {
      font-weight: 700;
      color: $logintextColor;
    }
  }
}
</style>
