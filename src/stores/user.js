import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  loginAPI,
  getUserInfoAPI,
  logoutAPI,
  registerAPI,
  getCodeAPI
} from '@/api/user'

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

    // 获取邮箱验证码
    const getCode = async (email) => {
      const res = await getCodeAPI(email)
      return res
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

    const tryRestoreSession = () => {
      try {
        const savedToken = localStorage.getItem('user-token')
        const savedUserInfo = localStorage.getItem('user-userInfo')
        if (savedToken) {
          token.value = JSON.parse(savedToken)
        }
        if (savedUserInfo) {
          userInfo.value = JSON.parse(savedUserInfo)
        }
      } catch (e) {
        console.warn('Failed to restore session from localStorage', e)
      }
    }

    const saveSession = () => {
      try {
        localStorage.setItem('user-token', JSON.stringify(token.value))
        localStorage.setItem('user-userInfo', JSON.stringify(userInfo.value))
      } catch (e) {
        console.warn('Failed to save session to localStorage', e)
      }
    }

    // 尝试恢复会话
    tryRestoreSession()

    return {
      token,
      userInfo,
      userLogin,
      getUserInfo,
      userRegister,
      getCode,
      logout,
      tryRestoreSession,
      saveSession
    }
  },
  {
    persist: {
      storage: localStorage,
      key: 'user',
      paths: ['token', 'userInfo']
    }
  }
)
