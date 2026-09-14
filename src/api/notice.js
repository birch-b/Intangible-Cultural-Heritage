import request from '@/utils/request'

// 分页查询通知
export const pageNotice = (params) => {
  return request({
    url: '/admin/v1/notice/page',
    method: 'get',
    params
  })
}

// 标记已读
export const markAsRead = (id) => {
  return request({
    url: `/admin/v1/notice/${id}/read`,
    method: 'put'
  })
}

/**
 * 删除通知（逻辑删除，仅本人可删）
 * @param {number|string} id - 通知ID
 * @returns {Promise} data 为 true 表示删除成功
 */
export const deleteNotice = (id) => {
  return request({
    url: `/admin/v1/notice/${id}`,
    method: 'delete'
  })
}
