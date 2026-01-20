import request from '@/utils/request'

/**
 * 获取反馈分页列表
 * @param {Object} params - { page, pageSize, type, status }
 */
export const getFeedbackPageAPI = (params) => {
  return request.get('/admin/v1/feedback/page', { params })
}

/**
 * 回复反馈
 * @param {Object} data - { id, replyContent, status }
 */
export const replyFeedbackAPI = (data) => {
  return request.post('/admin/v1/feedback/reply', data)
}

/**
 * 提交反馈
 * @param {FormData} data
 */
export const submitFeedbackAPI = (data) => {
  return request.post('/admin/v1/feedback/submit', data)
}
