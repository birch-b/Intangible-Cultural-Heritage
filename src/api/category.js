import request from '@/utils/request'

/**
 * 分页查询类别
 * @param {Object} params { current, size, name }
 */
export const pageCategory = (params) => {
  return request({
    url: '/admin/v1/category/page',
    method: 'get',
    params
  })
}

/**
 * 新增类别
 * @param {Object} data { name, icon, description, sortOrder }
 */
export const addCategory = (data) => {
  return request({
    url: '/admin/v1/category',
    method: 'post',
    data
  })
}

/**
 * 修改类别
 * @param {Object} data { id, name, icon, description, sortOrder }
 */
export const updateCategory = (data) => {
  return request({
    url: '/admin/v1/category',
    method: 'put',
    data
  })
}

/**
 * 删除类别
 * @param {Long} id
 */
export const deleteCategory = (id) => {
  return request({
    url: `/admin/v1/category/${id}`,
    method: 'delete'
  })
}

/**
 * 查询所有类别（列表）
 */
export const listAllCategory = () => {
  return request({
    url: '/admin/v1/category/list',
    method: 'get'
  })
}
