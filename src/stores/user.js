import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginAPI, getUserInfoAPI, logoutAPI, registerAPI } from '@/api/user'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const userInfo = ref({})

    // 获取用户信息
    const getUserInfo = async () => {
      const res = await getUserInfoAPI()
      userInfo.value = res.data
    }

    // 登录
    const userLogin = async (data) => {
      // 1. 调用登录接口
      const res = await loginAPI(data)
      token.value = res.data.token

      // 2. 获取用户信息
      await getUserInfo()
    }

    // 注册
    const userRegister = async (data) => {
      await registerAPI(data)
    }

    // 退出登录
    const logout = async () => {
      // 1. 调用后端退出接口
      if (token.value && userInfo.value.username) {
        try {
          await logoutAPI(userInfo.value.username, token.value)
        } catch (e) {
          console.warn('Logout API failed', e)
        }
      }
      // 2. 清除本地状态
      token.value = ''
      userInfo.value = {}
    }

    return { token, userInfo, userLogin, getUserInfo, userRegister, logout }
  },
  {
    persist: true // 持久化存储
  }
)
