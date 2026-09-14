import request from '@/utils/request'

/**
 * 活动报名接口封装（对接活动报名控制层）
 * 报名状态 status：1-已报名 2-已取消 3-已签到
 * 报名记录 ActivityRegistrationRespDTO {
 *   id, activityId, activityTitle, activityCoverImage,
 *   activityTime, location, status, remark, createTime
 * }
 */

/**
 * 报名活动
 * @param {Object} data - { activityId, remark }
 */
export function registerActivity(data) {
  return request({
    url: '/admin/v1/activity-registration/register',
    method: 'post',
    data
  })
}

/**
 * 取消报名
 * @param {number|string} activityId - 活动ID
 */
export function cancelActivityRegistration(activityId) {
  return request({
    url: '/admin/v1/activity-registration/cancel',
    method: 'post',
    data: { activityId }
  })
}

/**
 * 分页查询我的报名
 * @param {Object} params - { current, size }
 */
export function getMyRegistrationPage(params) {
  return request({
    url: '/admin/v1/activity-registration/page',
    method: 'get',
    params
  })
}

/**
 * 查询某活动的报名人数
 * @param {number|string} activityId
 * @returns data 为人数
 */
export function getActivityRegistrationCount(activityId) {
  return request({
    url: '/admin/v1/activity-registration/count',
    method: 'get',
    params: { activityId }
  })
}

/**
 * 检查当前用户是否已报名某活动
 * @param {number|string} activityId
 * @returns data 为 boolean
 */
export function checkActivityRegistration(activityId) {
  return request({
    url: '/admin/v1/activity-registration/check',
    method: 'get',
    params: { activityId }
  })
}

/**
 * 管理端分页查询全部报名记录（可按活动/状态/用户筛选）
 * @param {Object} params - { current, size, activityId?, status?, userId? }
 */
export function pageRegistration(params) {
  return request({
    url: '/admin/v1/activity-registration/admin/page',
    method: 'get',
    params
  })
}

/**
 * 管理端修改报名状态（标记签到 / 取消 / 恢复）
 * @param {number|string} id - 报名记录ID
 * @param {number} status - 目标状态 1-已报名 2-已取消 3-已签到
 */
export function updateRegistrationStatus(id, status) {
  return request({
    url: `/admin/v1/activity-registration/${id}/status`,
    method: 'put',
    data: { status }
  })
}

/**
 * 管理端删除报名记录（逻辑删除）
 * @param {number|string} id - 报名记录ID
 */
export function deleteRegistration(id) {
  return request({
    url: `/admin/v1/activity-registration/${id}`,
    method: 'delete'
  })
}
