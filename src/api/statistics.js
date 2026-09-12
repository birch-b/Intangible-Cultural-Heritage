import request from '@/utils/request'

/**
 * 数据统计分析接口封装
 */

/**
 * 获取总览统计数据
 * @returns data {
 *   userCount, itemCount, activityCount, registrationCount,
 *   feedbackCount, collectionCount, trainingCourseCount
 * }
 */
export function getStatisticsOverview() {
  return request({
    url: '/admin/v1/statistics/overview',
    method: 'get'
  })
}

/**
 * 获取最近 N 天每日趋势统计数据
 * @param {number} days - 最近 N 天（默认 7）
 * @returns data {
 *   dates, newUserCounts, newItemCounts, newActivityCounts, newRegistrationCounts
 * }
 */
export function getStatisticsTrend(days = 7) {
  return request({
    url: '/admin/v1/statistics/trend',
    method: 'get',
    params: { days }
  })
}
