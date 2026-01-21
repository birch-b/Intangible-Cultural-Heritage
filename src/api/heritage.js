import http from '@/utils/request'

/**
 * 获取非遗类别列表
 */
export const getCategoryListAPI = () => {
  return http({
    url: '/admin/v1/category/list',
    method: 'GET'
  })
}

/**
 * 分页获取非遗项目列表
 * @param {Object} params - 查询参数 { page, size, title, categoryId, status, isFeatured, region }
 */
export const getHeritagePageAPI = (params) => {
  return http({
    url: '/admin/v1/heritage-item/page',
    method: 'GET',
    params
  })
}

/**
 * 获取非遗项目详情
 * @param {Long} id - 项目ID
 */
export const getHeritageDetailAPI = (id) => {
  return http({
    url: `/admin/v1/heritage-item/${id}`,
    method: 'GET'
  })
}

// ================= 后台管理相关接口 =================

/**
 * 分页查询 (兼容后台命名)
 */
export const pageHeritageItem = getHeritagePageAPI

/**
 * 新增非遗项目
 */
export const createHeritageItem = (data) => {
  return http({
    url: '/admin/v1/heritage-item',
    method: 'POST',
    data
  })
}

/**
 * 修改非遗项目
 */
export const updateHeritageItem = (data) => {
  return http({
    url: '/admin/v1/heritage-item',
    method: 'PUT',
    data
  })
}

/**
 * 删除非遗项目
 */
export const deleteHeritageItem = (id) => {
  return http({
    url: `/admin/v1/heritage-item/${id}`,
    method: 'DELETE'
  })
}
