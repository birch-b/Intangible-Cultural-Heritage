import axios from 'axios'
// import { ElMessage } from 'element-ui'

const baseURL = '/api'
// 创建axios实例
const http = axios.create({
  baseURL,
  timeout: 5000
})

// 封装消息提示框
// const open = (msg, tp) => {
//   ElMessage({
//     message: msg,
//     grouping: true,
//     type: tp
//   })
// }

// 请求拦截器
http.interceptors.request.use(
  // 请求成功的回调----------------------------------------------
  (config) => {
    // 在这里定义一些请求前的操作，比如添加请求头、请求参数等

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
      return res.data
    }
  },
  // 响应失败的回调-----------------------------------------------
  (err) => {
    return Promise.reject(err)
  }
)

export default http
