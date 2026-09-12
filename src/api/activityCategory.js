import request from '@/utils/request'

/**
 * 活动分类管理接口封装
 * ActivityCategory {
 *   id, name, icon, description, sortOrder, status(0禁用 1启用), createTime
 * }
 */

/**
 * 分页查询活动分类
 * @param {Object} params - { current, size, name, status }
 */
export function pageActivityCategory(params) {
  return request({
    url: '/admin/v1/activity-category/page',
    method: 'get',
    params
  })
}

/**
 * 查询所有启用的活动分类（下拉/前台展示）
 */
export function listActivityCategory() {
  return request({
    url: '/admin/v1/activity-category/list',
    method: 'get'
  })
}

/**
 * 新增活动分类
 * @param {Object} data - { name, icon, description, sortOrder, status }
 */
export function createActivityCategory(data) {
  return request({
    url: '/admin/v1/activity-category',
    method: 'post',
    data
  })
}

/**
 * 修改活动分类
 * @param {Object} data - { id, name, icon, description, sortOrder, status }
 */
export function updateActivityCategory(data) {
  return request({
    url: '/admin/v1/activity-category',
    method: 'put',
    data
  })
}

/**
 * 删除活动分类
 * @param {number|string} id
 */
export function deleteActivityCategory(id) {
  return request({
    url: `/admin/v1/activity-category/${id}`,
    method: 'delete'
  })
}
