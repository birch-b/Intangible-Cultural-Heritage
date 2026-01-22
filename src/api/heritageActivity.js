import request from '@/utils/request'

/**
 * 分页查询非遗活动
 * @param {Object} params - 查询参数 { current, size, title, status, type }
 * @returns {Promise}
 */
export function pageActivity(params) {
  return request({
    url: '/admin/v1/heritage-activity/page',
    method: 'get',
    params
  })
}

/**
 * 获取非遗活动详情
 * @param {string|number} id - 活动ID
 * @returns {Promise}
 */
export function getActivityDetail(id) {
  return request({
    url: `/admin/v1/heritage-activity/${id}`,
    method: 'get'
  })
}

/**
 * 创建非遗活动
 * @param {Object} data - 活动数据 { title, type, content, ... }
 * @returns {Promise}
 */
export function createActivity(data) {
  return request({
    url: '/admin/v1/heritage-activity',
    method: 'post',
    data
  })
}

/**
 * 更新非遗活动
 * @param {Object} data - 活动数据 { id, title, type, ... }
 * @returns {Promise}
 */
export function updateActivity(data) {
  return request({
    url: '/admin/v1/heritage-activity',
    method: 'put',
    data
  })
}

/**
 * 删除非遗活动
 * @param {string|number} id - 活动ID
 * @returns {Promise}
 */
export function deleteActivity(id) {
  return request({
    url: `/admin/v1/heritage-activity/${id}`,
    method: 'delete'
  })
}
