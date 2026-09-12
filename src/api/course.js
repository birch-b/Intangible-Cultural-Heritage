import request from '@/utils/request'

/**
 * 教育培训内容（在线课程/研培项目/讲座/资讯）接口封装
 * contentType：1-在线课程 2-研培项目 3-讲座 4-资讯
 * status：0-草稿 1-已发布
 * TrainingCourseSaveReqDTO {
 *   id, categoryId, title, contentType, coverImage, summary, content,
 *   teacher, duration, isFree, fee, status, enrollmentDeadline,
 *   maxEnrollment, communityEnabled, sectionList
 * }
 */

/**
 * 分页查询内容
 * @param {Object} params - { current, size, title, categoryId, contentType, status }
 */
export function pageCourse(params) {
  return request({
    url: '/admin/v1/training-course/page',
    method: 'get',
    params
  })
}

/**
 * 获取内容详情（含章节 sectionList）
 * @param {number|string} id
 */
export function getCourseDetail(id) {
  return request({
    url: `/admin/v1/training-course/${id}`,
    method: 'get'
  })
}

/**
 * 新增内容
 * @param {Object} data - TrainingCourseSaveReqDTO
 */
export function createCourse(data) {
  return request({
    url: '/admin/v1/training-course',
    method: 'post',
    data
  })
}

/**
 * 修改内容
 * @param {Object} data - TrainingCourseSaveReqDTO（id 必传）
 */
export function updateCourse(data) {
  return request({
    url: '/admin/v1/training-course',
    method: 'put',
    data
  })
}

/**
 * 删除内容
 * @param {number|string} id
 */
export function deleteCourse(id) {
  return request({
    url: `/admin/v1/training-course/${id}`,
    method: 'delete'
  })
}
