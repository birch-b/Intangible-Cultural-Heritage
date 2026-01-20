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
