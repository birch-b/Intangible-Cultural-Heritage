import request from '@/utils/request'

/**
 * 教育培训学习/报名接口封装
 * 学习记录状态 status：0-已加入 1-已完成/已结业
 * TrainingEnrollmentRespDTO {
 *   id, courseId, status, progress, createTime,
 *   courseTitle, courseCoverImage, contentTypeName
 * }
 */

/**
 * 报名/加入学习
 * @param {number|string} courseId
 */
export function enrollCourse(courseId) {
  return request({
    url: '/admin/v1/training-enrollment/enroll',
    method: 'post',
    data: { courseId }
  })
}

/**
 * 取消报名/退出学习
 * @param {number|string} courseId
 */
export function cancelEnrollment(courseId) {
  return request({
    url: '/admin/v1/training-enrollment/cancel',
    method: 'post',
    data: { courseId }
  })
}

/**
 * 分页查询我的学习记录
 * @param {Object} params - { current, size }
 */
export function pageMyEnrollment(params) {
  return request({
    url: '/admin/v1/training-enrollment/page',
    method: 'get',
    params
  })
}

/**
 * 查询某内容的报名人数
 * @param {number|string} courseId
 * @returns data 为人数
 */
export function getEnrollmentCount(courseId) {
  return request({
    url: '/admin/v1/training-enrollment/count',
    method: 'get',
    params: { courseId }
  })
}

/**
 * 检查当前用户是否已加入某内容
 * @param {number|string} courseId
 * @returns data 为 boolean
 */
export function checkEnrollment(courseId) {
  return request({
    url: '/admin/v1/training-enrollment/check',
    method: 'get',
    params: { courseId }
  })
}
