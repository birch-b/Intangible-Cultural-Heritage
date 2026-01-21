import request from '@/utils/request'

// 分页查询非遗项目
export const pageHeritageItem = (params) => {
  return request({
    url: '/admin/v1/heritage-item/page',
    method: 'get',
    params
  })
}

// 获取非遗项目详情
export const getHeritageItem = (id) => {
  return request({
    url: `/admin/v1/heritage-item/${id}`,
    method: 'get'
  })
}

// 创建非遗项目
export const createHeritageItem = (data) => {
  return request({
    url: '/admin/v1/heritage-item',
    method: 'post',
    data
  })
}

// 更新非遗项目
export const updateHeritageItem = (data) => {
  return request({
    url: '/admin/v1/heritage-item',
    method: 'put',
    data
  })
}

// 删除非遗项目
export const deleteHeritageItem = (id) => {
  return request({
    url: `/admin/v1/heritage-item/${id}`,
    method: 'delete'
  })
}

// 更新非遗项目状态
// data: { id: number, status: number }
export const updateHeritageItemStatus = (data) => {
  return request({
    url: '/admin/v1/heritage-item/status',
    method: 'put',
    data
  })
}
