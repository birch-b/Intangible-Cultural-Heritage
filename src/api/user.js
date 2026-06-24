import request from '@/utils/request'

// 获取邮箱验证码
export const getCodeAPI = (email) => {
  return request({
    url: '/admin/v1/user/email-code',
    method: 'post',
    data: { email }
  })
}

// 校验邮箱验证码
export const verifyCodeAPI = (email, code) => {
  return request({
    url: '/admin/v1/user/email-code/verify',
    method: 'post',
    data: { email, code }
  })
}

// 修改密码
export const resetPasswordAPI = (data) => {
  return request({
    url: '/admin/v1/user/reset-password',
    method: 'post',
    data
  })
}

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

// 分页获取用户列表（管理员管理）
export const pageUserAPI = (params) => {
  return request({
    url: '/admin/v1/user/page',
    method: 'get',
    params
  })
}

// 管理员新增用户
export const createAdminAPI = (data) => {
  return request({
    url: '/admin/v1/user/admin',
    method: 'post',
    data
  })
}

// 管理员修改用户
export const updateAdminAPI = (data) => {
  return request({
    url: '/admin/v1/user/admin',
    method: 'put',
    data
  })
}

// 删除用户
export const deleteUserAPI = (username) => {
  return request({
    url: `/admin/v1/user/${username}`,
    method: 'delete'
  })
}
