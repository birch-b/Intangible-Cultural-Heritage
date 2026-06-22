<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref(null)
const registerFormRef = ref(null)

// 登录校验
const form = reactive({
  name: '',
  password: '',
  isforget: 1
})
const rules = reactive({
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      min: 3,
      max: 5,
      message: '用户名长度应在 3 到 5 个字符之间',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      min: 6,
      max: 12,
      message: '密码长度应在 6 到 12 个字符之间',
      trigger: 'blur'
    }
  ],
  isforget: []
})
// 注册校验
const form1 = reactive({
  name: '',
  password: '',
  password1: '',
  email: '',
  emailCode: ''
})
const rules1 = reactive({
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      min: 3,
      max: 5,
      message: '用户名长度应在 3 到 5 个字符之间',
      trigger: 'blur'
    }
  ],
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
    },
    {
      validator: (rule, value, callback) => {
        if (value !== form1.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  emailCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
})

// 判断登录注册页面显示隐藏
let sign = ref(1)
const login = (event) => {
  event.target.closest('.left').style.left = -300 + 'px'
  document.querySelector('.right').style.right = 20 + 'vw'
  document.querySelector('.radius').style.left = 50 + 'vw'
  document.querySelector('.lg').style.left = 22 + 'vw'
  document.querySelector('.topic').style.color = 'rgb(170, 62, 62)'
  setTimeout(() => {
    sign.value = !sign.value
  }, 800)
}
const register = (event) => {
  event.target.closest('.right').style.right = -300 + 'px'
  document.querySelector('.left').style.left = 20 + 'vw'
  document.querySelector('.radius').style.left = -60 + 'vw'
  document.querySelector('.lg').style.left = 58 + 'vw'
  document.querySelector('.topic').style.color = 'rgb(255,255,255)'
  setTimeout(() => {
    sign.value = !sign.value
  }, 1000)
}

const min = ref(0)
const istrue = ref(false)
const isSendingCode = ref(false)

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

const count = async () => {
  if (!form1.email) {
    ElMessage.warning('请先输入邮箱')
    return
  }
  if (!validateEmail(form1.email)) {
    ElMessage.warning('请输入有效的邮箱地址')
    return
  }
  if (isSendingCode.value) {
    return
  }
  isSendingCode.value = true
  try {
    await userStore.getCode(form1.email)
    ElMessage.success('验证码已发送至您的邮箱')
    istrue.value = true
    min.value = 60
    let timer = setInterval(() => {
      min.value--
      if (min.value === 0) {
        clearInterval(timer)
        istrue.value = false
      }
    }, 1000)
  } catch (error) {
    console.error('获取验证码失败', error)
    ElMessage.error('获取验证码失败，请稍后重试')
  } finally {
    isSendingCode.value = false
  }
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await userStore.userLogin({
          username: form.name,
          password: form.password
        })
        ElMessage.success('登录成功')
        router.push('/')
      } catch (error) {
        console.error(error)
      }
    }
  })
}

const isRegistering = ref(false)

const handleRegister = async () => {
  if (!registerFormRef.value) return
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      if (isRegistering.value) return
      isRegistering.value = true
      try {
        await userStore.userRegister({
          username: form1.name,
          password: form1.password,
          mail: form1.email,
          emailCode: form1.emailCode
        })
        ElMessage.success('注册成功，请登录')
        form1.name = ''
        form1.password = ''
        form1.password1 = ''
        form1.email = ''
        form1.emailCode = ''
        registerFormRef.value.resetFields()
      } catch (error) {
        console.error('注册失败', error)
        ElMessage.error('注册失败，请检查信息后重试')
      } finally {
        isRegistering.value = false
      }
    }
  })
}
</script>

<template>
  <div class="login">
    <div class="radius"></div>
    <div class="topic">粤韵非遗文化传承平台</div>
    <div class="lg">
      <div class="login" v-show="!sign">
        <h1>欢迎登录</h1>
        <el-form
          ref="loginFormRef"
          :model="form"
          class="form"
          style="max-width: 400px"
          label-position="right"
          label-width="auto"
          :rules="rules"
        >
          <el-form-item label="用户名" prop="name">
            <el-input
              v-model="form.name"
              class="input"
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item label="密码" label-position="right" prop="password">
            <el-input
              v-model="form.password"
              class="input"
              placeholder="请输入密码"
            />
          </el-form-item>
          <el-form-item class="bewetween">
            <div>
              <el-checkbox
                v-model="form.isforget"
                value="Online activities"
                name="type"
              >
                记住密码
              </el-checkbox>
            </div>
            <p class="clickable" @click="router.push('/forgetPwd')">
              忘记密码?
            </p>
          </el-form-item>
          <el-form-item class="center">
            <el-button type="primary" @click="handleLogin">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="register" v-show="sign">
        <h1>欢迎注册</h1>
        <el-form
          ref="registerFormRef"
          :model="form1"
          class="form"
          style="max-width: 400px"
          label-position="right"
          label-width="auto"
          :rules="rules1"
        >
          <el-form-item label="用户名" prop="name">
            <el-input
              v-model="form1.name"
              class="input"
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item label="密码" label-position="right" prop="password">
            <el-input
              v-model="form1.password"
              class="input"
              placeholder="请输入密码"
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
            />
          </el-form-item>
          <el-form-item
            label="邮箱"
            label-position="right"
            prop="email"
          >
            <el-input
              v-model="form1.email"
              class="input"
              placeholder="请输入邮箱"
            />
          </el-form-item>
          <el-form-item class="center">
            <el-button
              class="code-btn"
              @click="count"
              :disabled="istrue || isSendingCode"
              >{{ min === 0 ? '获取验证码' : min + 's' }}</el-button
            >
          </el-form-item>
          <el-form-item
            label="验证码"
            label-position="right"
            prop="emailCode"
          >
            <el-input
              v-model="form1.emailCode"
              class="input"
              placeholder="请输入验证码"
            />
          </el-form-item>
          <el-form-item class="center">
            <el-button type="primary" @click="handleRegister" :loading="isRegistering">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="left">
      <div class="content">
        <h1>已有账户?</h1>
        <h1>点此立即登录</h1>
      </div>
      <el-button
        @click="login"
        :dark="isDark"
        color="rgb(239, 236, 211)"
        plain
        style="color: rgb(170, 62, 62); transition: all 2s"
        round
        size="large"
        >立即登录</el-button
      >
    </div>
    <div class="right">
      <div class="content">
        <h1>还没有账户?</h1>
        <h1>点此立即注册</h1>
      </div>
      <el-button
        @click="register"
        :dark="isDark"
        color="rgb(239, 236, 211)"
        plain
        style="color: rgb(170, 62, 62); transition: all 2s"
        round
        size="large"
        >立即注册</el-button
      >
    </div>
    <!-- <div class="register"></div> -->
    <div class="bottom">
      <p>版权所有 @ 2024广东非遗文化传承平台</p>
      <p>联系电话: 18948521111 | 邮箱：1660275788@qq.com</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/var.scss' as *;
div {
  background-color: transparent;
}

:deep(.el-form-item__label),
:deep(.el-checkbox__label),
:deep(.el-checkbox__input.is-checked + .el-checkbox__label),
p {
  color: $logintextColor;
}

:deep(.el-checkbox__inner) {
  border: 0;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: $logintextColor;
  border-radius: 0;
}

.clickable {
  cursor: pointer;
  color: $logintextColor;
  transition: color 0.3s;
}

.login {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: $loginbgColor;
  overflow: hidden;
  .radius {
    position: absolute;
    width: 110vw;
    height: 200vh;
    top: -90vh;
    left: -60vw;
    border-radius: 100vh;
    background-color: $logintextColor;
    transition: all 2s;
    z-index: 2;
  }
  .topic {
    transition: all 2s;
    position: absolute;
    top: 3vh;
    left: 5vw;
    font-size: 35px;
    color: white;
    z-index: 999;
    font-weight: 700;
  }
  .bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 85vh;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    color: $logintextColor;
    p {
      margin-bottom: 15px;
    }
  }
  .lg {
    position: absolute;
    top: 50%;
    left: 58vw; //22
    transform: translateY(-50%);
    height: 0;
    width: 20vw;
    height: 500px;
    transition: all 2s;
    .login,
    .register {
      transition: all 2s;
      width: 100%;
      height: 100%;
      padding: 0 25px;
      text-align: center;
      background-color: transparent;
      h1 {
        color: $logintextColor;
        margin-bottom: 50px;
      }
      .el-form-item {
        margin-bottom: 30px;
      }
      .el-button {
        background-color: $logintextColor;
        border: 0;
        width: 150px;
        color: white;
      }
      .code-btn {
        width: auto !important;
        min-width: 120px;
      }
      .bewetween {
        :deep(.el-form-item__content) {
          display: flex !important;
          justify-content: space-between;
        }
      }
      .bewetween1 {
        :deep(.el-form-item__content) {
          display: flex !important;
          justify-content: flex-end;
        }
      }
      .center {
        :deep(.el-form-item__content) {
          display: flex;
          justify-content: center;
        }
      }
      .yzm-item {
        :deep(.el-form-item__content) {
          display: flex !important;
          justify-content: flex-end;
        }
      }
      .yzm-wrapper {
        display: flex;
        align-items: center;
        width: 100%;
        max-width: 250px;
      }
      
    }
  }
  .left,
  .right {
    transition: all 2s;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    top: 25%;
    width: 300px;
    height: 200px;
    z-index: 999;
    // background-color: blue;
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 30px;
      color: white;
      h1 {
        margin-bottom: 20px;
      }
    }
  }
  .left {
    left: 20vw;
  }
  .right {
    right: -300px;
  }
}
</style>
