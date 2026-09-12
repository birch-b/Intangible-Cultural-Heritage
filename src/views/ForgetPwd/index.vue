<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getCodeAPI, resetPasswordAPI } from '@/api/user'
const router = useRouter()

const form = reactive({
  email: '',
  yzm: ''
})
const rules = reactive({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '请输入有效的邮箱',
      trigger: 'blur'
    }
  ],
  yzm: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
})

const min = ref(0)
const istrue = ref(false)

const count = async () => {
  if (!form.email) {
    ElMessage.warning('请先输入邮箱')
    return
  }
  try {
    await getCodeAPI(form.email)
    ElMessage.success('验证码已发送')
    istrue.value = true
    min.value = 60
    let timer = setInterval(() => {
      min.value--
      if (min.value === 0) {
        clearInterval(timer)
        istrue.value = false
      }
    }, 1000)
  } catch {
    ElMessage.error('发送验证码失败，请重试')
  }
}

const form1 = reactive({
  password: '',
  password1: ''
})
const rules1 = reactive({
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      min: 6,
      max: 12,
      message: '密码长度应在 6 到 12 个字符之间',
      trigger: 'blur'
    }
  ],
  password1: [
    { required: true, message: '请再次确认密码', trigger: 'blur' },
    {
      min: 6,
      max: 12,
      message: '密码长度应在 6 到 12 个字符之间',
      trigger: 'blur'
    }
  ]
})

const sign = ref(0)

const change = async () => {
  if (sign.value === 0) {
    sign.value++
  } else if (sign.value === 1) {
    if (form1.password !== form1.password1) {
      ElMessage.error('两次输入的密码不一致')
      return
    }
    try {
      await resetPasswordAPI({
        email: form.email,
        code: form.yzm,
        newPassword: form1.password
      })
      ElMessage.success('密码修改成功')
      sign.value++
    } catch {
      ElMessage.error('修改密码失败，请检查验证码是否正确')
    }
  } else {
    router.push('/login')
  }
}

const goBack = () => {
  router.push('/login')
}

const prevStep = () => {
  if (sign.value > 0) {
    sign.value--
  }
}
</script>

<template>
  <div class="forgetPwd">
    <div class="topic">
      <span>粤韵非遗文化传承平台</span>
      <el-button text @click="goBack" class="back-btn">返回登录注册</el-button>
    </div>
    <div class="center">
      <div class="step">
        <el-steps
          style="max-width: 600px"
          :active="sign"
          finish-status="success"
        >
          <el-step title="身份验证" />
          <el-step title="重置密码" />
          <el-step title="找回成功" />
        </el-steps>
      </div>
      <div class="content">
        <div class="form1" v-show="sign === 0">
          <el-form
            :model="form"
            class="form"
            style="max-width: 400px"
            label-position="right"
            label-width="auto"
            :rules="rules"
          >
            <el-form-item
              label="请输入邮箱"
              label-position="right"
              prop="email"
            >
              <el-input
                v-model="form.email"
                class="input"
                placeholder="请输入邮箱"
                style="width: 12vw"
              />
            </el-form-item>
            <el-form-item class="bewetween1" prop="yzm">
              <el-input
                style="width: 130px"
                v-model="form.yzm"
                class="input"
                placeholder="请输入验证码"
              />
              <el-button
                color="rgb(170, 62, 62)"
                plain
                style="width: 100px; margin-left: 20px"
                @click="count"
                :disabled="istrue"
                >{{ min === 0 ? '获取验证码' : min }}</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <div class="form2" v-show="sign === 1">
          <el-form
            :model="form1"
            class="form"
            style="max-width: 20vw"
            label-position="right"
            label-width="auto"
            :rules="rules1"
          >
            <el-form-item label="密码" label-position="right" prop="password">
              <el-input
                v-model="form1.password"
                class="input"
                placeholder="请输入密码"
                style="width: 12vw"
              />
            </el-form-item>
            <el-form-item
              label="确认密码"
              label-position="right"
              prop="password1"
            >
              <el-input
                v-model="form1.password1"
                class="input"
                placeholder="请再次确认密码"
                style="width: 12vw"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="complete" v-show="sign === 2">
          <h1>修改密码成功!</h1>
        </div>
        <div class="btn-group">
          <el-button v-if="sign === 1" plain @click="prevStep"
            >上一步</el-button
          >
          <el-button color="rgb(170, 62, 62)" plain @click="change">{{
            sign !== 2 ? '下一步' : '返回登录页面'
          }}</el-button>
        </div>
      </div>
    </div>
    <div class="bottom"></div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/var.scss' as *;

* {
  background-color: transparent;
}

:deep(.el-step__title.is-process),
:deep(.el-step__title.is-wait),
:deep(.el-step__head.is-wait),
:deep(.el-step__head.is-process),
:deep(.el-step__line-inner),
:deep(.el-step__line) {
  color: $logintextColor;
  border-color: $logintextColor;
}

:deep(.el-step__line) {
  background-color: $logintextColor;
}

.forgetPwd {
  .topic {
    height: 8vh;
    line-height: 8vh;
    font-size: 25px;
    color: white;
    padding: 0vh 7vw;
    background-color: $logintextColor;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .back-btn {
      color: white;
      font-size: 16px;
    }
  }

  .center {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(247, 233, 206);
    height: 82vh;

    .step {
      margin-top: 15vh;
      width: 30vw;
    }

    .content {
      width: 30vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 8vh;

      .form {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;

        .el-form-item {
          margin-bottom: 4vh;
          width: 100%;
        }
      }

      .btn-group {
        display: flex;
        gap: 20px;
        justify-content: center;

        .el-button {
          width: auto;
          min-width: 120px;
        }
      }

      .complete {
        h1 {
          color: $logintextColor;
          margin-bottom: 5vh;
        }
      }
    }
  }

  .bottom {
    height: 10vh;
    background-color: $logintextColor;
  }
}
</style>
