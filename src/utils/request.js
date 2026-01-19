import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import router from '@/router'

const baseURL = '/api'
// 创建axios实例
const http = axios.create({
  baseURL,
  timeout: 5000
})

// 请求拦截器
http.interceptors.request.use(
  // 请求成功的回调----------------------------------------------
  (config) => {
    // 在这里定义一些请求前的操作，比如添加请求头、请求参数等
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.token = userStore.token
    }
    return config
  },
  // 请求失败的回调-----------------------------------------------
  (error) => Promise.reject(error)
)

// 响应拦截器
http.interceptors.response.use(
  // 响应成功的回调----------------------------------------------
  (res) => {
    if (res.status === 200) {
      // 假设后端返回格式为 { code: '0', message: 'success', data: ... }
      // 或者直接返回数据
      // 这里根据通常约定，如果 code 不是 '0' 或 200，视为业务错误
      const { code, message } = res.data
      if (code && code !== '0' && code !== 200) {
        ElMessage.error(message || '系统异常')
        return Promise.reject(new Error(message || 'Error'))
      }
      return res.data
    }
    return res.data
  },
  // 响应失败的回调-----------------------------------------------
  (err) => {
    // 如果是登录接口报 401，说明账号密码错误，不需要执行退出登录逻辑
    if (err.config && err.config.url && err.config.url.includes('/login')) {
      return Promise.reject(err)
    }

    if (err.response && err.response.status === 401) {
      ElMessage.error('登录过期，请重新登录')
      const userStore = useUserStore()
      userStore.logout()
      router.push('/login')
    } else {
      ElMessage.error(err.message || '网络异常')
    }
    return Promise.reject(err)
  }
)

export default http
