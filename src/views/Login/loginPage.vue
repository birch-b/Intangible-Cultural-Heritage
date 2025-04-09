<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
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
  phone: '',
  yzm: ''
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
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ],
  yzm: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
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
// 获取验证码
const count = () => {
  istrue.value = true
  console.log('获取验证码')
  min.value = 60
  let timer = setInterval(() => {
    min.value--
    console.log(min.value !== 0)
    if (min.value === 0) {
      clearInterval(timer)
      istrue.value = false
    }
  }, 1000)
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
            <el-button type="primary">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="register" v-show="sign">
        <h1>欢迎注册</h1>
        <el-form
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
            label="请输入手机号"
            label-position="right"
            prop="phone"
          >
            <el-input
              v-model="form1.phone"
              class="input"
              placeholder="请输入手机号"
            />
          </el-form-item>
          <el-form-item class="bewetween1" prop="yzm">
            <el-input
              style="width: 130px"
              v-model="form1.yzm"
              class="input"
              placeholder="请输入验证码"
            />
            <el-button
              style="width: 100px; margin-left: 20px"
              @click="count"
              :disabled="istrue"
              >{{ min === 0 ? '获取验证码' : min }}</el-button
            >
          </el-form-item>
          <el-form-item class="center">
            <el-button type="primary">注册</el-button>
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
