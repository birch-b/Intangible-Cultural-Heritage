import request from '@/utils/request'

// 提交反馈
export const submitFeedbackAPI = (data) => {
  return request({
    url: '/admin/v1/feedback/submit',
    method: 'post',
    data
  })
}

// 分页查询反馈列表
export const getFeedbackPageAPI = (params) => {
  return request({
    url: '/admin/v1/feedback/page',
    method: 'get',
    params
  })
}

// 回复反馈 (仅管理员)
export const replyFeedbackAPI = (data) => {
  return request({
    url: '/admin/v1/feedback/reply',
    method: 'post',
    data
  })
}
