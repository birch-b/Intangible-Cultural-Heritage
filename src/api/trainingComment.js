import request from '@/utils/request'

/**
 * 教育培训互动学习社区评论接口封装
 * TrainingCommentRespDTO {
 *   id, courseId, userId, username, content, parentId, createTime
 * }
 */

/**
 * 发表评论
 * @param {Object} data - { courseId, content, parentId }
 */
export function createTrainingComment(data) {
  return request({
    url: '/admin/v1/training-comment',
    method: 'post',
    data
  })
}

/**
 * 分页查询某内容的评论
 * @param {number|string} courseId
 * @param {Object} params - { current, size }
 */
export function pageTrainingComment(courseId, params) {
  return request({
    url: `/admin/v1/training-comment/page/${courseId}`,
    method: 'get',
    params
  })
}

/**
 * 删除评论
 * @param {number|string} id
 */
export function deleteTrainingComment(id) {
  return request({
    url: `/admin/v1/training-comment/${id}`,
    method: 'delete'
  })
}
