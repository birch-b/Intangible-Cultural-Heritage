import request from '@/utils/request'

/**
 * 教育培训分类接口封装
 * TrainingCategory { id, name, coverImage, description, sortOrder, createTime }
 */

/**
 * 分页查询分类
 * @param {Object} params - { current, size }
 */
export function pageTrainingCategory(params) {
  return request({
    url: '/admin/v1/training-category/page',
    method: 'get',
    params
  })
}

/**
 * 查询所有分类（前台展示/下拉）
 */
export function listTrainingCategory() {
  return request({
    url: '/admin/v1/training-category/list',
    method: 'get'
  })
}

/**
 * 新增分类
 * @param {Object} data - { name, coverImage, description, sortOrder }
 */
export function createTrainingCategory(data) {
  return request({
    url: '/admin/v1/training-category',
    method: 'post',
    data
  })
}

/**
 * 修改分类
 * @param {Object} data - { id, name, coverImage, description, sortOrder }
 */
export function updateTrainingCategory(data) {
  return request({
    url: '/admin/v1/training-category',
    method: 'put',
    data
  })
}

/**
 * 删除分类
 * @param {number|string} id
 */
export function deleteTrainingCategory(id) {
  return request({
    url: `/admin/v1/training-category/${id}`,
    method: 'delete'
  })
}
