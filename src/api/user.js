import request from '@/utils/request'

// 用户登录
export const loginAPI = (data) => {
  return request({
    url: '/admin/v1/user/login',
    method: 'post',
    data
  })
}

// 用户注册
export const registerAPI = (data) => {
  return request({
    url: '/admin/v1/user',
    method: 'post',
    data
  })
}

// 获取用户信息
export const getUserInfoAPI = () => {
  return request({
    url: '/admin/v1/user/info',
    method: 'get'
  })
}

// 退出登录
export const logoutAPI = (username, token) => {
  return request({
    url: '/admin/v1/user/logout',
    method: 'delete',
    params: {
      username,
      token
    }
  })
}

// 修改用户信息
export const updateUserInfoAPI = (data) => {
  return request({
    url: '/admin/v1/user',
    method: 'put',
    data
  })
}
