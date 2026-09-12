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
 * 分页查询报名记录（后台管理）
 * @param {Object} params - { current, size }
 */
export function pageRegistration(params) {
  return request({
    url: '/admin/v1/activity-registration/page',
    method: 'get',
    params
  })
}
